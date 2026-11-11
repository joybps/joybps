'use client';

import React, { useRef, useState } from 'react';
import { Code2, MessageCircle, Send, Sparkles, UserCheck, Check, Globe } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, sleep, typeInto, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';
import { LiveChip } from './FuturisticPrimitives';

const POINTS = [
  { t: 'Place it anywhere', d: 'Paste one snippet on any website, landing page or app. The chat widget appears instantly.' },
  { t: 'AI answers first', d: 'The chat agent replies to customers right away, with no waiting for a free person.' },
  { t: 'Human on request', d: 'If the customer wants a person and your team is online, the chat is transferred to them live.' },
  { t: 'Full history', d: 'Review every conversation, and see exactly which agent handled it.' },
];

type Role = 'user' | 'ai' | 'human' | 'system';
interface Msg {
  id: number;
  role: Role;
  text: string;
}

const SCRIPT: { role: Role; text: string }[] = [
  { role: 'user', text: 'Hi, do you have appointments available this week?' },
  { role: 'ai', text: 'Yes! We have openings on Wednesday and Friday. Which day suits you best?' },
  { role: 'user', text: 'Friday. Actually, can I talk to a person?' },
  { role: 'system', text: 'Checking if a team member is online…' },
  { role: 'system', text: 'Priya from the team is online. Transferring you now.' },
  { role: 'human', text: 'Hi, this is Priya. I’ve got your request and can book Friday for you.' },
];

const Bubble: React.FC<{ msg: Msg }> = ({ msg }) => {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, { autoAlpha: 0, y: 12, scale: 0.96, duration: 0.4, ease: 'back.out(1.4)' });
      });
    },
    { scope: ref },
  );

  if (msg.role === 'system') {
    return (
      <div ref={ref} className="flex justify-center">
        <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-800">{msg.text}</span>
      </div>
    );
  }
  if (msg.role === 'user') {
    return (
      <div ref={ref} className="flex justify-end">
        <p className="max-w-[82%] px-3 py-2 rounded-2xl rounded-br-md bg-slate-950 text-white text-[13px] leading-snug">{msg.text}</p>
      </div>
    );
  }
  const human = msg.role === 'human';
  return (
    <div ref={ref} className="flex items-start gap-2">
      <span
        className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${human ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}
      >
        {human ? <UserCheck className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </span>
      <p
        className={`max-w-[84%] px-3 py-2 rounded-2xl rounded-tl-md border text-[13px] leading-snug text-slate-800 ${
          human ? 'bg-emerald-50 border-emerald-100' : 'bg-sky-50 border-sky-100'
        }`}
      >
        {msg.text}
      </p>
    </div>
  );
};

const Typing: React.FC = () => (
  <div className="flex items-center gap-1 pl-8">
    {[0, 1, 2].map((i) => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </div>
);

const WidgetDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [human, setHuman] = useState(false);
  const idRef = useRef(0);

  const scroll = () => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };
  const push = (role: Role, text: string) => {
    setMsgs((m) => [...m, { id: ++idRef.current, role, text }]);
    requestAnimationFrame(scroll);
  };

  useVisibleLoop(boxRef, async (alive) => {
    setMsgs([]);
    setInput('');
    setHuman(false);
    await sleep(900);
    for (const step of SCRIPT) {
      if (!alive()) return;
      if (step.role === 'user') {
        if (!(await typeInto(setInput, step.text, 32, alive))) return;
        await sleep(350);
        setInput('');
        push('user', step.text);
        await sleep(500);
      } else if (step.role === 'ai') {
        setTyping(true);
        requestAnimationFrame(scroll);
        await sleep(1300);
        setTyping(false);
        push('ai', step.text);
        await sleep(900);
      } else if (step.role === 'system') {
        push('system', step.text);
        await sleep(1300);
        if (step.text.includes('Transferring')) setHuman(true);
      } else {
        setTyping(true);
        requestAnimationFrame(scroll);
        await sleep(1100);
        setTyping(false);
        push('human', step.text);
        await sleep(3600);
      }
    }
  });

  return (
    <div ref={boxRef} className="w-[300px] sm:w-[340px] rounded-3xl bg-white border border-sky-200 shadow-float overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white flex items-center gap-3">
        <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          {human ? <UserCheck className="w-4.5 h-4.5" /> : <Sparkles className="w-4.5 h-4.5" />}
        </span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-bold leading-tight">{human ? 'Priya · Team member' : 'Iris · AI assistant'}</p>
          <p className="text-[11px] text-white/85 leading-tight flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            {human ? 'Human agent · online' : 'Online now'}
          </p>
        </div>
      </div>

      <div ref={bodyRef} className="h-[300px] overflow-y-auto no-scrollbar bg-slate-50/60 px-3.5 py-3.5 space-y-2.5">
        {msgs.map((m) => (
          <Bubble key={m.id} msg={m} />
        ))}
        {typing && <Typing />}
      </div>

      <div className="px-3 py-2.5 border-t border-sky-100 bg-white flex items-center gap-2">
        <div className="flex-1 min-h-[36px] flex items-center px-3 rounded-full bg-slate-50 border border-slate-200 text-[12.5px] text-slate-800 overflow-hidden">
          {input ? <span className="truncate">{input}</span> : <span className="text-slate-400">Type your message…</span>}
        </div>
        <span className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${input ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Send className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

export const WidgetSection: React.FC = () => (
  <section id="widget" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={MessageCircle}
        pill="Chat agent and widget"
        title="Drop the widget anywhere. Let AI start the conversation."
        text="Customers chat with your organisation from any page. The AI handles it, and a real person can step in whenever your team is online."
      />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
          {POINTS.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.07}>
              <div className="flex gap-4">
                <span className="w-9 h-9 shrink-0 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Check className="w-4.5 h-4.5" strokeWidth={2.6} />
                </span>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-950 mb-0.5">{p.t}</h3>
                  <p className="text-[14.5px] text-slate-600 leading-relaxed">{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.3}>
            <div className="rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Code2 className="w-4 h-4" />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wide">Embed on your site</span>
              </div>
              <span className="text-sky-300">{'<script'}</span> <span className="text-indigo-300">src</span>=
              <span className="text-emerald-300">&quot;https://your-iris-domain/widget.js&quot;</span> <span className="text-indigo-300">data-agent</span>=
              <span className="text-emerald-300">&quot;YOUR_AGENT_ID&quot;</span> <span className="text-sky-300">{'async></script>'}</span>
            </div>
          </Reveal>
        </div>

        {/* Browser mock with live widget */}
        <Reveal className="lg:col-span-7 order-1 lg:order-2" x={30}>
          <div className="relative rounded-[28px] bg-white border border-sky-200 shadow-float overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-sky-100">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="ml-3 flex-1 max-w-xs flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11.5px] text-slate-500">
                <Globe className="w-3 h-3" /> yourcompany.com
              </span>
              <span className="ml-auto hidden sm:block"><LiveChip label="Live demo" tone="green" /></span>
            </div>
            <div className="relative px-5 sm:px-8 pt-8 pb-6 min-h-[480px] bg-gradient-to-b from-white to-sky-50/50">
              {/* skeleton page */}
              <div className="space-y-3 max-w-[55%]">
                <div className="h-5 w-3/5 rounded-full bg-slate-200/80" />
                <div className="h-3 w-full rounded-full bg-slate-100" />
                <div className="h-3 w-11/12 rounded-full bg-slate-100" />
                <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                <div className="h-9 w-32 rounded-xl bg-sky-100 mt-4" />
              </div>
              <div className="hidden sm:grid grid-cols-3 gap-3 mt-8 max-w-[55%]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-slate-100/80" />
                ))}
              </div>
              <div className="absolute bottom-5 right-4 sm:right-6">
                <WidgetDemo />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
