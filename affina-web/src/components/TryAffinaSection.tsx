'use client';

import React, { useState } from 'react';
import { Rocket, Copy, Check, ExternalLink, Eye, EyeOff, LogIn } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';
import { DEMO_APP } from '../content';

const CopyButton: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: the value is still visible to copy by hand */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="w-8 h-8 shrink-0 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

export const TryAffinaSection: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section id="try-affina" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-indigo top-8 -right-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[400px] h-[400px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Rocket}
          pill="Try Affina"
          title="Try Affina Yourself"
          text="Explore the real application with our demo account. Sign in with the details below and look around."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Credentials */}
          <Reveal x={-40} className="lg:col-span-4 rounded-3xl border border-sky-200 bg-white shadow-card p-6 sm:p-8 flex flex-col">
            <h3 className="text-[20px] font-bold text-slate-950 mb-1">Demo login</h3>
            <p className="text-[13.5px] text-slate-500 mb-6">Use these details to sign in.</p>

            <div className="space-y-4 mb-7">
              <div>
                <p className="text-[12px] font-semibold text-slate-500 mb-1.5">Email</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 min-w-0 truncate px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[13.5px] font-mono text-slate-900">
                    {DEMO_APP.email}
                  </code>
                  <CopyButton value={DEMO_APP.email} label="email" />
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-slate-500 mb-1.5">Password</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 min-w-0 truncate px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[13.5px] font-mono text-slate-900">
                    {showPassword ? DEMO_APP.password : '•'.repeat(DEMO_APP.password.length)}
                  </code>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="w-8 h-8 shrink-0 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <CopyButton value={DEMO_APP.password} label="password" />
                </div>
              </div>
            </div>

            <a
              href={DEMO_APP.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto w-full py-3.5 px-4 rounded-xl bg-slate-950 text-white text-[14px] font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Open Affina</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-[12px] text-slate-400 mt-3 text-center">
              This is a shared demo account. Please don’t change its password.
            </p>
          </Reveal>

          {/* App frame */}
          <Reveal x={40} delay={0.1} className="lg:col-span-8 rounded-3xl border border-sky-200/90 bg-white shadow-float overflow-hidden flex flex-col min-h-[420px]">
            <div className="px-5 py-3.5 border-b border-sky-100 bg-slate-50/60 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="text-[13px] font-bold text-slate-900 ml-2">Affina workspace</span>
            </div>

            {DEMO_APP.embed ? (
              <iframe
                title="Affina live demo"
                src={DEMO_APP.url}
                className="flex-1 w-full min-h-[520px] bg-white"
                loading="lazy"
              />
            ) : (
              <div className="flex-1 relative bg-dot-grid-light p-6 sm:p-8 flex items-center justify-center">
                <div className="absolute inset-6 sm:inset-8 grid grid-cols-12 gap-3 opacity-60" aria-hidden="true">
                  <div className="col-span-3 rounded-2xl bg-slate-200/70" />
                  <div className="col-span-9 grid grid-rows-[auto_1fr] gap-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-16 rounded-2xl bg-slate-200/70" />
                      <div className="h-16 rounded-2xl bg-slate-200/70" />
                      <div className="h-16 rounded-2xl bg-slate-200/70" />
                    </div>
                    <div className="rounded-2xl bg-slate-200/50" />
                  </div>
                </div>

                <div className="relative text-center bg-white/95 backdrop-blur-md rounded-3xl border border-sky-200 shadow-float px-7 py-8 max-w-sm">
                  <span className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-6 h-6" />
                  </span>
                  <h3 className="text-[18px] font-bold text-slate-950 mb-1.5">See it live</h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-5">
                    Sign in with the demo login to explore pipelines, leads and the AI Copilot.
                  </p>
                  <a
                    href={DEMO_APP.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 text-white text-[13.5px] font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Launch demo <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};
