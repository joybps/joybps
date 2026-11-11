'use client';

import React, { useRef } from 'react';
import { Sun, Check, Send, Sparkles, Mail, Wallet, Megaphone, CalendarDays, ArrowRight, CircleDot } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../animation';
import { SectionHeading } from './SectionHeading';

const Avatar: React.FC<{ letter: string; tone?: string }> = ({ letter, tone = 'bg-sky-100 text-sky-700' }) => (
  <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold ${tone}`}>{letter}</span>
);

const STEPS: { time: string; title: string; text: string; mini: React.ReactNode }[] = [
  {
    time: '09:02',
    title: 'The day starts with a check-in',
    text: 'Arun opens Hestia and checks in against his assigned shift. Attendance is recorded with no spreadsheet.',
    mini: (
      <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-card">
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar letter="A" />
          <div>
            <p className="text-[13px] font-semibold text-slate-900 leading-tight">Arun · Morning shift</p>
            <p className="text-[11px] text-slate-500 leading-tight">09:00 – 18:00</p>
          </div>
        </div>
        <div className="relative h-11">
          <button type="button" data-s1-btn className="absolute inset-0 w-full rounded-xl bg-slate-950 text-white text-[13px] font-semibold flex items-center justify-center gap-2">
            <Sun className="w-4 h-4" /> Check in
          </button>
          <div data-s1-done className="absolute inset-0 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-semibold flex items-center justify-center gap-2 opacity-0 invisible">
            <Check className="w-4 h-4" strokeWidth={3} /> Checked in at 09:02
          </div>
        </div>
      </div>
    ),
  },
  {
    time: '11:30',
    title: 'A leave request finds the right people',
    text: 'Priya requests leave. It goes to her lead, then HR, and the status updates for everyone involved.',
    mini: (
      <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-slate-900 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-sky-600" /> Casual leave · 2 days</p>
          <span className="relative h-6 w-[88px]">
            <span data-s2-pending className="absolute inset-0 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center justify-center">Pending</span>
            <span data-s2-ok className="absolute inset-0 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center justify-center opacity-0 invisible">Approved</span>
          </span>
        </div>
        <div className="flex items-center">
          {[
            ['P', 'Employee', 'bg-violet-100 text-violet-700'],
            ['L', 'Lead', 'bg-sky-100 text-sky-700'],
            ['H', 'HR', 'bg-emerald-100 text-emerald-700'],
          ].map(([l, r, tone], i) => (
            <React.Fragment key={r}>
              {i > 0 && (
                <span className="flex-1 h-0.5 mx-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <span data-s2-line className="block h-full w-full bg-gradient-to-r from-sky-400 to-emerald-400 origin-left" />
                </span>
              )}
              <span data-s2-node className="flex flex-col items-center gap-1">
                <Avatar letter={l} tone={tone} />
                <span className="text-[10px] font-semibold text-slate-500">{r}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    ),
  },
  {
    time: '14:00',
    title: 'Work gets assigned and tracked',
    text: 'A manager creates a task and assigns it. It moves across the board as the work moves forward.',
    mini: (
      <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-card">
        <div data-s3-card className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-slate-900">Prepare Q4 onboarding plan</p>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10.5px] font-semibold">high</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[11.5px] text-slate-500"><Avatar letter="N" tone="bg-indigo-100 text-indigo-700" /> Nandini · HR</span>
            <span className="relative h-6 w-[96px]">
              <span data-s3-a className="absolute inset-0 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center justify-center">To Do</span>
              <span data-s3-b className="absolute inset-0 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-semibold flex items-center justify-center opacity-0 invisible">In Progress</span>
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <span data-s3-bar className="block h-full w-[62%] rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 origin-left" />
          </div>
        </div>
      </div>
    ),
  },
  {
    time: '16:15',
    title: 'Questions get quick answers',
    text: 'Instead of searching or waiting, an employee asks the AI assistant and gets an answer in seconds.',
    mini: (
      <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-card space-y-2.5">
        <div data-s4-q className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-slate-950 text-white text-[12.5px] px-3 py-2">How many leave days do I have left?</div>
        <div className="flex items-start gap-2 min-h-[56px]">
          <span className="w-7 h-7 shrink-0 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center"><Sparkles className="w-3.5 h-3.5" /></span>
          <div className="relative">
            <div data-s4-dots className="flex gap-1 rounded-2xl rounded-tl-sm bg-sky-50 border border-sky-100 px-3 py-3">
              {[0, 1, 2].map((d) => <span key={d} className="anim-blink w-1.5 h-1.5 rounded-full bg-sky-400" style={{ animationDelay: `${d * 0.2}s` }} />)}
            </div>
            <div data-s4-a className="absolute left-0 top-0 w-[230px] rounded-2xl rounded-tl-sm bg-sky-50 border border-sky-100 text-[12.5px] text-slate-800 px-3 py-2 opacity-0 invisible">
              You have <b>8 days</b> left this year: 5 casual and 3 earned.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    time: '18:00',
    title: 'The day closes with pay and news',
    text: 'Payslips are ready, an announcement goes out to the right people, and everyone is notified by email.',
    mini: (
      <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-card space-y-2.5">
        <div data-s5-item className="flex items-center gap-3 rounded-xl bg-slate-50/70 border border-slate-100 px-3 py-2.5">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center"><Wallet className="w-4 h-4" /></span>
          <div className="flex-1"><p className="text-[12.5px] font-semibold text-slate-900 leading-tight">Payslips are ready</p><p className="text-[11px] text-slate-500 leading-tight">November · all employees</p></div>
        </div>
        <div data-s5-item className="flex items-center gap-3 rounded-xl bg-slate-50/70 border border-slate-100 px-3 py-2.5">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><Megaphone className="w-4 h-4" /></span>
          <div className="flex-1"><p className="text-[12.5px] font-semibold text-slate-900 leading-tight">Holiday notice posted</p><p className="text-[11px] text-slate-500 leading-tight">Visible to all departments</p></div>
        </div>
        <div data-s5-item className="flex items-center gap-2 text-[11.5px] font-semibold text-sky-800">
          <span data-s5-mail className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center"><Mail className="w-3.5 h-3.5" /></span>
          Email notifications sent <Send className="w-3 h-3" />
        </div>
      </div>
    ),
  },
];

export const StorySection: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // progress line fills while you scroll through the day
        gsap.fromTo('[data-story-fill]', { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-story-track]', start: 'top 60%', end: 'bottom 70%', scrub: 0.4 },
        });

        const steps = gsap.utils.toArray<HTMLElement>('[data-step]');
        steps.forEach((step, i) => {
          const q = gsap.utils.selector(step);
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: step, start: 'top 72%', toggleActions: 'play none none none' } });
          tl.from(q('[data-step-body]'), { autoAlpha: 0, y: 36, duration: 0.8 }, 0)
            .to(q('[data-dot]'), { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9', scale: 1.2, duration: 0.4 }, 0.1)
            .from(q('[data-step-mini]'), { autoAlpha: 0, y: 24, duration: 0.7 }, 0.3);

          const at = 1.0;
          if (i === 0) {
            tl.to(q('[data-s1-btn]'), { scale: 0.95, duration: 0.14, yoyo: true, repeat: 1 }, at)
              .to(q('[data-s1-btn]'), { autoAlpha: 0, duration: 0.25 }, at + 0.4)
              .to(q('[data-s1-done]'), { autoAlpha: 1, duration: 0.4 }, at + 0.4);
          } else if (i === 1) {
            tl.from(q('[data-s2-node]'), { scale: 0.5, autoAlpha: 0, stagger: 0.25, duration: 0.5, ease: 'back.out(1.6)' }, at)
              .from(q('[data-s2-line]'), { scaleX: 0, stagger: 0.55, duration: 0.7, ease: 'power2.inOut' }, at + 0.3)
              .to(q('[data-s2-pending]'), { autoAlpha: 0, duration: 0.25 }, at + 1.6)
              .to(q('[data-s2-ok]'), { autoAlpha: 1, duration: 0.35 }, at + 1.6);
          } else if (i === 2) {
            tl.from(q('[data-s3-card]'), { x: 60, autoAlpha: 0, duration: 0.7 }, at)
              .to(q('[data-s3-a]'), { autoAlpha: 0, duration: 0.25 }, at + 1)
              .to(q('[data-s3-b]'), { autoAlpha: 1, duration: 0.35 }, at + 1)
              .from(q('[data-s3-bar]'), { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, at + 1);
          } else if (i === 3) {
            tl.from(q('[data-s4-q]'), { y: 14, autoAlpha: 0, duration: 0.5 }, at)
              .from(q('[data-s4-dots]'), { autoAlpha: 0, duration: 0.3 }, at + 0.6)
              .to(q('[data-s4-dots]'), { autoAlpha: 0, duration: 0.2 }, at + 1.9)
              .to(q('[data-s4-a]'), { autoAlpha: 1, y: 0, duration: 0.5 }, at + 1.9);
          } else {
            tl.from(q('[data-s5-item]'), { y: 16, autoAlpha: 0, stagger: 0.3, duration: 0.55 }, at)
              .from(q('[data-s5-mail]'), { x: -24, scale: 0.6, duration: 0.6, ease: 'back.out(1.8)' }, at + 0.9);
          }
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="story" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-indigo top-10 -right-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[420px] h-[420px]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={CircleDot}
          pill="A day in Hestia"
          title="One day, one platform, everyone in sync."
          text="Follow an ordinary working day and see how each part of Hestia quietly connects your people."
        />

        <div data-story-track className="relative">
          {/* track + progress */}
          <div aria-hidden="true" className="absolute top-2 bottom-2 left-5 md:left-1/2 w-0.5 -translate-x-1/2 bg-sky-100 rounded-full">
            <div data-story-fill className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-400 via-indigo-400 to-violet-400 origin-top" />
          </div>

          <div className="space-y-12 md:space-y-16">
            {STEPS.map((s, i) => (
              <div key={s.time} data-step className="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-20">
                <span
                  data-dot
                  aria-hidden="true"
                  className="absolute left-5 md:left-1/2 top-3 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-sky-200 z-10"
                />
                <div data-step-body className={i % 2 === 0 ? 'md:col-start-1 md:text-right md:pr-4' : 'md:col-start-2 md:pl-4'}>
                  <p className={`inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 rounded-full px-2.5 py-1 mb-2.5`}>
                    {s.time}
                  </p>
                  <h3 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-slate-950 mb-1.5">{s.title}</h3>
                  <p className={`text-[14.5px] text-slate-600 leading-relaxed max-w-md ${i % 2 === 0 ? 'md:ml-auto' : ''}`}>{s.text}</p>
                </div>
                <div data-step-mini className={`mt-4 md:mt-0 ${i % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1'}`}>
                  <div className="max-w-sm">{s.mini}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-12 text-center text-[13px] text-slate-500 flex items-center justify-center gap-1.5">
          All of this, and more, in one place <ArrowRight className="w-3.5 h-3.5" />
        </p>
      </div>
    </section>
  );
};
