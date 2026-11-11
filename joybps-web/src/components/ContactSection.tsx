'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareText } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal, StaggerGroup } from './MotionPrimitives';
import { SITE } from '../lib/site';
import { Recaptcha } from './Recaptcha';
import { validateContact, type ContactErrors } from '../lib/contact-validation';

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-sky-200 bg-white text-[14px] text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500';
const fieldCls = (err?: string) => (err ? inputCls.replace('border-sky-200', 'border-rose-400').replace('focus:ring-sky-500', 'focus:ring-rose-400') : inputCls);
const errCls = 'mt-1 text-[12px] font-medium text-rose-600';
const labelCls = 'block text-[12px] font-semibold text-slate-700 mb-1.5';

const INTERESTS = ['A website', 'A web application', 'A mobile app', 'Custom software', 'Technical support', 'A demo of a Joybps product', 'Something else'];

interface ContactSectionProps {
  showHeading?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ showHeading = true }) => {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', interest: INTERESTS[0], message: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ContactErrors>({});
  const [token, setToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setFieldErrors((fe) => (key in fe ? { ...fe, [key]: undefined } : fe));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const errs = validateContact(form);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setError('');
      const first = (['name', 'email', 'phone', 'company', 'message'] as const).find((k) => errs[k]);
      const ids = { name: 'c-name', email: 'c-email', phone: 'c-phone', company: 'c-company', message: 'c-msg' } as const;
      if (first) document.getElementById(ids[first])?.focus();
      return;
    }
    setFieldErrors({});
    if (!token) {
      setError('Please tick the reCAPTCHA box to confirm you are not a robot.');
      return;
    }
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token, website: String(new FormData(e.currentTarget as HTMLFormElement).get('website') || '') }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: ContactErrors };
      if (data.fields) setFieldErrors(data.fields);
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('idle');
      setToken('');
      setCaptchaKey((k) => k + 1);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-tech-grid border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky -bottom-40 right-[-100px] w-[480px] h-[480px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <SectionHeading
            icon={<MessageSquareText />}
            pill="Contact"
            title="Talk to the Joybps team"
            text="Tell us what you want to build or improve. We will reply within one working day with ideas, a plan and the next step."
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Reveal x={-30} className="lg:col-span-4 rounded-3xl border border-sky-100 bg-slate-50/60 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5 text-slate-950">
                <Mail className="w-5 h-5 text-sky-600" />
                <h3 className="text-[15px] font-bold">Email</h3>
              </div>
              <div className="space-y-1 pl-[30px]">
                {[SITE.email].map((email) => (
                  <a key={email} href={`mailto:${email}`} className="block text-[14px] text-slate-600 hover:text-sky-700 transition-colors break-all">
                    {email}
                  </a>
                ))}
              </div>
            </div>
            {SITE.phone && (<div><div className="flex items-center gap-2.5 mb-2.5 text-slate-950"><Phone className="w-5 h-5 text-sky-600" /><h3 className="text-[15px] font-bold">Phone</h3></div><a href={`tel:${SITE.phone.replace(/s/g, '')}`} className="block pl-[30px] text-[14px] text-slate-600 hover:text-sky-700 transition-colors">{SITE.phone}</a></div>)}
            <div>
              <div className="flex items-center gap-2.5 mb-2.5 text-slate-950">
                <MapPin className="w-5 h-5 text-sky-600" />
                <h3 className="text-[15px] font-bold">Office</h3>
              </div>
              <p className="pl-[30px] text-[14px] text-slate-600">{SITE.legalName}, {SITE.office}</p>
            </div>
          </Reveal>

          <Reveal x={30} delay={0.08} className="lg:col-span-8">
            {status === 'sent' ? (

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 shadow-card p-8 sm:p-10 text-center">

              <p className="text-[20px] font-bold text-slate-950 mb-2">Thank you, we have your message.</p>

              <p className="text-[14px] text-slate-600">Our team will get back to you shortly at {form.email}.</p>

            </div>

            ) : (

            <form onSubmit={submit} noValidate className="beam-border rounded-3xl border border-sky-200 bg-white shadow-card p-6 sm:p-8">
              <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4" y={14} stagger={0.07}>
                <div>
                  <label htmlFor="c-name" className={labelCls}>Name</label>
                  <input id="c-name" className={fieldCls(fieldErrors.name)} aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'c-name-err' : undefined} value={form.name} onChange={set('name')} autoComplete="name" placeholder="Your full name" />{fieldErrors.name && <p id="c-name-err" role="alert" className={errCls}>{fieldErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="c-email" className={labelCls}>Email</label>
                  <input id="c-email" type="email" className={fieldCls(fieldErrors.email)} aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'c-email-err' : undefined} value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@company.com" />{fieldErrors.email && <p id="c-email-err" role="alert" className={errCls}>{fieldErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="c-company" className={labelCls}>Company</label>
                  <input id="c-company" className={fieldCls(fieldErrors.company)} aria-invalid={!!fieldErrors.company} aria-describedby={fieldErrors.company ? 'c-company-err' : undefined} value={form.company} onChange={set('company')} autoComplete="organization" placeholder="Company name" />{fieldErrors.company && <p id="c-company-err" role="alert" className={errCls}>{fieldErrors.company}</p>}
                </div>
                <div>
                  <label htmlFor="c-phone" className={labelCls}>Phone</label>
                  <input id="c-phone" type="tel" className={fieldCls(fieldErrors.phone)} aria-invalid={!!fieldErrors.phone} aria-describedby={fieldErrors.phone ? 'c-phone-err' : undefined} value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="Phone number" />{fieldErrors.phone && <p id="c-phone-err" role="alert" className={errCls}>{fieldErrors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-interest" className={labelCls}>I’m interested in</label>
                  <select id="c-interest" className={inputCls} value={form.interest} onChange={set('interest')}>
                    {INTERESTS.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-msg" className={labelCls}>How can we help?</label>
                  <textarea id="c-msg" rows={5} className={fieldCls(fieldErrors.message)} aria-invalid={!!fieldErrors.message} aria-describedby={fieldErrors.message ? 'c-msg-err' : undefined} value={form.message} onChange={set('message')} placeholder="Tell us about your business and how customers contact you today." />{fieldErrors.message && <p id="c-msg-err" role="alert" className={errCls}>{fieldErrors.message}</p>}
                </div>

                <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label></div>

                <div className="sm:col-span-2"><Recaptcha onToken={setToken} resetKey={captchaKey} /></div>

                {error && <p className="sm:col-span-2 text-[12.5px] font-medium text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="sm:col-span-2 py-3.5 px-4 rounded-xl bg-slate-950 text-white text-[14px] font-semibold hover:bg-slate-800 active:scale-[0.99] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </StaggerGroup>
            </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};
