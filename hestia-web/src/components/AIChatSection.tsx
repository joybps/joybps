'use client';

import React, { useRef, useState } from 'react';
import { Sparkles, SendHorizontal, ShieldCheck, MessageSquareText, Zap } from 'lucide-react';
import { sleep, typeInto, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

interface Msg {
  from: 'user' | 'ai';
  text: string;
}

const QA: { q: string; a: string }[] = [
  { q: 'Who is on leave this week?', a: 'Two people are on approved leave: Priya (Wed to Thu) and Rohan (Friday).' },
  { q: 'What is my leave balance?', a: 'You have 8 days left this year: 5 casual and 3 earned.' },
  { q: 'When will I get my payslip?', a: 'November payslips are published on 30 Nov. You will find yours in My Pay.' },
];

const POINTS = [
  { icon: MessageSquareText, t: 'Ask in plain language', d: 'No menus to hunt through. Just ask.' },
  { icon: ShieldCheck, t: 'Respects every role', d: 'Answers only include what the person is allowed to see.' },
  { icon: Zap, t: 'Instant answers', d: 'Leave, shifts, attendance, policies and more, in seconds.' },
];

export const AIChatSection: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [reply, setReply] = useState('');

  useVisibleLoop(boxRef, async (alive) => {
    setMsgs([]);
    setDraft('');
    setReply('');
    setThinking(false);
    await sleep(900);
    for (const { q, a } of QA) {
      if (!alive()) return;
      if (!(await typeInto(setDraft, q, 34, alive))) return;
      await sleep(350);
      setMsgs((m) => [...m, { from: 'user', text: q }]);
      setDraft('');
      setThinking(true);
      scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
      await sleep(1100);
      setThinking(false);
      if (!(await typeInto(setReply, a, 16, alive))) return;
      setMsgs((m) => [...m, { from: 'ai', text: a }]);
      setReply('');
      scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
      await sleep(1700);
    }
    await sleep(2600);
  });

  return (
    <section id="ai" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-indigo top-10 -right-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[420px] h-[420px]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Sparkles}
          pill="AI chat assistant"
          title="Ask Hestia anything about your work."
          text="An AI assistant built into the platform helps every person find answers fast, without waiting on HR or digging through screens. It works through chat."
        />

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            {POINTS.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.08} x={-24}>
                <div className="flex items-start gap-3.5 rounded-2xl bg-white border border-sky-100 shadow-card p-4">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 text-sky-700 flex items-center justify-center">
                    <p.icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-950 mb-0.5">{p.t}</h3>
                    <p className="text-[13.5px] text-slate-600 leading-snug">{p.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="lg:col-span-7" x={30}>
            <div ref={boxRef} className="rounded-[26px] bg-white border border-sky-200 shadow-float overflow-hidden">
              <div className="px-5 py-3.5 border-b border-sky-100 bg-slate-50/70 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center"><Sparkles className="w-4 h-4" /></span>
                  Hestia Assistant
                </span>
                <span className="text-[11px] font-semibold text-slate-400">Sample conversation</span>
              </div>

              <div ref={scrollRef} className="h-[330px] overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-3">
                {msgs.map((m, i) => (
                  <Bubble key={i} m={m} />
                ))}
                {thinking && (
                  <div className="flex gap-1 w-fit rounded-2xl rounded-tl-sm bg-sky-50 border border-sky-100 px-3.5 py-3">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="anim-blink w-1.5 h-1.5 rounded-full bg-sky-400" style={{ animationDelay: `${d * 0.2}s` }} />
                    ))}
                  </div>
                )}
                {reply && <Bubble m={{ from: 'ai', text: reply }} caret />}
              </div>

              <div className="p-3 border-t border-sky-100">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 min-h-[44px]">
                  <span className={`flex-1 text-[13.5px] ${draft ? 'text-slate-900' : 'text-slate-400'}`}>{draft || 'Ask about leave, shifts, pay…'}</span>
                  <span className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center"><SendHorizontal className="w-4 h-4" /></span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Bubble: React.FC<{ m: Msg; caret?: boolean }> = ({ m, caret }) =>
  m.from === 'user' ? (
    <div className="flex justify-end animate-[fadeIn_.3s_ease]">
      <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-slate-950 text-white text-[13.5px] px-3.5 py-2.5">{m.text}</p>
    </div>
  ) : (
    <div className="flex items-start gap-2 animate-[fadeIn_.3s_ease]">
      <span className="w-7 h-7 shrink-0 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center"><Sparkles className="w-3.5 h-3.5" /></span>
      <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-sky-50 border border-sky-100 text-slate-800 text-[13.5px] leading-snug px-3.5 py-2.5">
        {m.text}
        {caret && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
      </p>
    </div>
  );
