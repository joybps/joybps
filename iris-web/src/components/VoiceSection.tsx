'use client';

import React, { useRef, useState } from 'react';
import { Phone, PhoneIncoming, PhoneForwarded, FileText, Sparkles, UserCheck, Clock, ListChecks } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, onVisibility, sleep, typeInto, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

type Phase = 'ringing' | 'ai' | 'transfer' | 'human' | 'ended';

const PHASE_LABEL: Record<Phase, string> = {
  ringing: 'Incoming call…',
  ai: 'Answered by AI agent',
  transfer: 'Transferring to a team member…',
  human: 'Live with a team member',
  ended: 'Call ended',
};
const PHASE_AMP: Record<Phase, number> = { ringing: 0.05, ai: 0.75, transfer: 0.18, human: 0.6, ended: 0.02 };

const BARS = 40;

interface Line {
  who: 'ai' | 'caller' | 'human';
  text: string;
}

const LINES: Line[] = [
  { who: 'ai', text: 'Thanks for calling. This is Iris. How can I help?' },
  { who: 'caller', text: 'I want to reschedule my appointment.' },
  { who: 'ai', text: 'Sure. I can see your booking on Friday at 10. What time works better?' },
  { who: 'caller', text: 'Actually, I’d like to speak to a person.' },
  { who: 'ai', text: 'Of course. Connecting you to the team now.' },
];

const SUMMARY =
  'Caller wanted to reschedule a Friday 10:00 appointment, then asked for a human. Transferred to the team and resolved on the live call.';

const STEPS = [
  { icon: PhoneIncoming, t: 'Customer dials your virtual number' },
  { icon: Sparkles, t: 'The AI voice agent answers and talks with them' },
  { icon: PhoneForwarded, t: 'Need a human? The live call lands in your dashboard' },
  { icon: FileText, t: 'Call log, transcript and AI summary are saved' },
];

const VoiceDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const amp = useRef({ a: 0.05 });
  const [phase, setPhase] = useState<Phase>('ringing');
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState('');
  const [typingWho, setTypingWho] = useState<Line['who']>('ai');
  const [summary, setSummary] = useState('');
  const [secs, setSecs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // waveform driven by the current call level, only while on screen
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const bars = gsap.utils.toArray<HTMLElement>('[data-vbar]');
        const set = bars.map((b) => gsap.quickSetter(b, 'scaleY'));
        const mid = (BARS - 1) / 2;
        const tick = () => {
          const t = gsap.ticker.time;
          const a = amp.current.a;
          for (let i = 0; i < bars.length; i++) {
            const env = 1 - (Math.abs(i - mid) / mid) * 0.55;
            const wob = 0.35 + 0.65 * Math.abs(Math.sin(t * (3 + (i % 6) * 0.8) + i * 0.5));
            set[i](0.08 + a * env * wob * 0.92);
          }
        };
        const stop = onVisibility(boxRef.current, (v) => (v ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)));
        return () => {
          stop();
          gsap.ticker.remove(tick);
        };
      });
    },
    { scope: boxRef },
  );

  const go = (p: Phase) => {
    setPhase(p);
    gsap.to(amp.current, { a: PHASE_AMP[p], duration: 0.5, ease: 'power2.out', overwrite: true });
  };

  useVisibleLoop(boxRef, async (alive) => {
    setLines([]);
    setTyping('');
    setSummary('');
    setSecs(0);
    if (timerRef.current) clearInterval(timerRef.current);
    go('ringing');
    await sleep(2200);
    if (!alive()) return;

    go('ai');
    timerRef.current = setInterval(() => setSecs((s) => s + 1), 1000);
    for (let i = 0; i < LINES.length; i++) {
      const l = LINES[i];
      if (!alive()) return;
      setTypingWho(l.who);
      if (l.who === 'caller') go('ai');
      if (!(await typeInto(setTyping, l.text, 26, alive))) return;
      setLines((arr) => [...arr, l]);
      setTyping('');
      await sleep(600);
    }

    go('transfer');
    await sleep(2000);
    if (!alive()) return;

    go('human');
    setTypingWho('human');
    if (!(await typeInto(setTyping, 'Hi, this is Priya. Let’s get that sorted for you.', 26, alive))) return;
    setLines((arr) => [...arr, { who: 'human', text: 'Hi, this is Priya. Let’s get that sorted for you.' }]);
    setTyping('');
    await sleep(1600);

    if (timerRef.current) clearInterval(timerRef.current);
    go('ended');
    await typeInto(setSummary, SUMMARY, 14, alive);
    await sleep(4200);
  });

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const live = phase === 'ai' || phase === 'human';

  return (
    <div ref={boxRef} className="grid md:grid-cols-5 gap-4 sm:gap-5">
      {/* Phone card */}
      <div className="md:col-span-2 rounded-[26px] bg-white border border-sky-200 shadow-float p-5 sm:p-6 flex flex-col items-center text-center">
        <div className="relative w-16 h-16 mb-3">
          {phase === 'ringing' && <span className="anim-pulse-ring absolute inset-0 rounded-full bg-sky-300/60" />}
          {phase === 'ringing' && <span className="anim-pulse-ring absolute inset-0 rounded-full bg-sky-300/40" style={{ animationDelay: '0.8s' }} />}
          <span
            className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${
              phase === 'human' ? 'bg-emerald-500' : phase === 'ended' ? 'bg-slate-400' : 'bg-gradient-to-br from-sky-500 to-indigo-500'
            }`}
          >
            {phase === 'human' ? <UserCheck className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
          </span>
        </div>
        <p className="font-mono text-[15px] font-semibold text-slate-900">+1 (555) 010-2030</p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-3">Virtual number</p>
        <p
          className={`text-[13px] font-semibold mb-1 ${
            phase === 'human' ? 'text-emerald-700' : phase === 'transfer' ? 'text-amber-700' : phase === 'ended' ? 'text-slate-500' : 'text-sky-700'
          }`}
        >
          {PHASE_LABEL[phase]}
        </p>
        <p className="font-mono text-[12px] text-slate-500 mb-4 flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {mm}:{ss}
        </p>

        <div className="flex items-center justify-center gap-[3px] h-16 w-full" aria-hidden="true">
          {Array.from({ length: BARS }).map((_, i) => (
            <span
              key={i}
              data-vbar
              className={`w-[3px] h-full rounded-full origin-center transition-colors duration-500 ${
                phase === 'human' ? 'bg-emerald-500' : 'bg-gradient-to-t from-sky-500 to-indigo-400'
              }`}
              style={{ transform: `scaleY(${(0.15 + 0.3 * Math.abs(Math.sin(i * 0.55))).toFixed(3)})` }}
            />
          ))}
        </div>
        {live && <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"><span className="anim-blink w-1.5 h-1.5 rounded-full bg-red-500" /> Recording transcript</span>}
      </div>

      {/* Transcript + summary */}
      <div className="md:col-span-3 rounded-[26px] bg-white border border-sky-200 shadow-float overflow-hidden flex flex-col">
        <div className="px-5 py-3 border-b border-sky-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" /> Live transcript
          </span>
          <span className="text-[11px] font-semibold text-slate-400">Agent: Nova · Voice</span>
        </div>
        <div className="p-4 sm:p-5 space-y-2.5 min-h-[250px] flex-1">
          {lines.map((l, i) => (
            <Row key={i} line={l} />
          ))}
          {typing && <Row line={{ who: typingWho, text: typing }} caret />}
        </div>
        <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-sky-50/70 p-4 min-h-[96px]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-700 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI summary
          </p>
          <p className="text-[13px] leading-relaxed text-slate-700">
            {summary || <span className="text-slate-400">Generated automatically when the call ends…</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ line: Line; caret?: boolean }> = ({ line, caret }) => {
  const style =
    line.who === 'caller'
      ? { label: 'Caller', cls: 'bg-slate-100 text-slate-800', dot: 'bg-slate-400' }
      : line.who === 'human'
        ? { label: 'Team member', cls: 'bg-emerald-50 text-emerald-900 border border-emerald-100', dot: 'bg-emerald-500' }
        : { label: 'AI agent', cls: 'bg-sky-50 text-slate-800 border border-sky-100', dot: 'bg-sky-500' };
  return (
    <div className="flex items-start gap-2.5">
      <span className={`mt-2 w-2 h-2 shrink-0 rounded-full ${style.dot}`} />
      <div className="min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">{style.label}</p>
        <p className={`px-3 py-1.5 rounded-xl text-[13px] leading-snug ${style.cls}`}>
          {line.text}
          {caret && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
        </p>
      </div>
    </div>
  );
};

export const VoiceSection: React.FC = () => (
  <section id="voice" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-indigo -bottom-32 -left-32 w-[480px] h-[480px]" />
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Phone}
        pill="Voice agent"
        title="Customers call. The AI answers. A human joins when needed."
        text="Each voice agent has its own virtual phone number. The AI talks to the caller, and every call is logged, transcribed and summarised."
      />

      <Reveal>
        <VoiceDemo />
      </Reveal>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.07}>
            <div className="h-full rounded-2xl bg-sky-50/50 border border-sky-100 p-4 flex items-start gap-3">
              <span className="w-9 h-9 shrink-0 rounded-xl bg-white border border-sky-100 text-sky-700 flex items-center justify-center">
                <s.icon className="w-4.5 h-4.5" />
              </span>
              <p className="text-[14px] font-medium text-slate-700 leading-snug flex items-start gap-1.5">
                <ListChecks className="hidden" />
                {s.t}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
