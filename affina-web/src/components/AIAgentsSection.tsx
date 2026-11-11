'use client';

import React, { useRef, useState, useEffect, type RefObject } from 'react';
import { Bot, MessageSquare, Mic, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, onVisibility } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

const CHAT_POINTS = [
  'Ask in plain, natural language',
  'Get answers on leads, sales, customers and performance',
  'Receive recommended next actions',
];

const VOICE_POINTS = [
  'Speak your question, hands-free',
  'Hear the answer read back to you',
  'Same insight as chat, wherever you are',
];

const CHAT_SCRIPT = [
  {
    q: 'Which leads need follow-up today?',
    a: 'You have high-priority leads waiting for a follow-up. A few leads have no owner yet, so I suggest assigning them to your team.',
  },
  {
    q: 'How is this month compared to last month?',
    a: 'Revenue is ahead of last month. Open the Revenue tab to see next month’s forecast.',
  },
  {
    q: 'Which deals are close to closing?',
    a: 'Several deals are in Negotiation and Contract. A quick follow-up this week could help move them to Closed Won.',
  },
];

const VOICE_SCRIPT = [
  {
    q: 'How is my sales team performing this month?',
    a: 'Your team is on track this month. A few leads are still waiting for a follow-up.',
  },
  {
    q: 'Read me today’s follow-ups.',
    a: 'You have leads to follow up today. The high-priority ones come first.',
  },
];

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Types `text` into `setter` one character at a time. Returns false if the loop was stopped. */
async function typeInto(setter: (s: string) => void, text: string, perChar: number, alive: () => boolean) {
  for (let i = 1; i <= text.length; i++) {
    if (!alive()) return false;
    setter(text.slice(0, i));
    await sleep(perChar + Math.random() * perChar * 0.6);
  }
  return true;
}

/** Runs `run` in an endless loop while the element is on screen; stops when it leaves view. */
function useVisibleLoop(ref: RefObject<HTMLElement | null>, run: (alive: () => boolean) => Promise<void>) {
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let token = 0;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      const mine = ++token;
      const alive = () => token === mine;
      (async () => {
        while (alive()) await runRef.current(alive);
      })();
    };
    const stop = () => {
      running = false;
      token++;
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.35 });
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [ref]);
}

/* ---------------------------------- Chat ---------------------------------- */

interface Msg {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

const Bubble: React.FC<{ msg: Msg }> = ({ msg }) => {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, { autoAlpha: 0, y: 14, scale: 0.96, duration: 0.45, ease: 'back.out(1.5)' });
      });
    },
    { scope: ref },
  );

  if (msg.role === 'user') {
    return (
      <div ref={ref} className="flex justify-end">
        <p className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-slate-950 text-white text-[13.5px] leading-snug">
          {msg.text}
        </p>
      </div>
    );
  }
  return (
    <div ref={ref} className="flex items-start gap-2.5">
      <span className="w-7 h-7 shrink-0 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5" />
      </span>
      <p className="max-w-[88%] px-3.5 py-2.5 rounded-2xl rounded-tl-md bg-sky-50 border border-sky-100 text-slate-800 text-[13.5px] leading-relaxed">
        {msg.text}
      </p>
    </div>
  );
};

const TypingDots = () => (
  <div className="flex items-start gap-2.5">
    <span className="w-7 h-7 shrink-0 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
      <Sparkles className="w-3.5 h-3.5" />
    </span>
    <div className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl rounded-tl-md bg-sky-50 border border-sky-100">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: `${i * 140}ms` }} />
      ))}
    </div>
  </div>
);

const ChatDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const [messages, setMessages] = useState<Msg[]>([
    { id: -2, role: 'user', text: CHAT_SCRIPT[0].q },
    { id: -1, role: 'ai', text: CHAT_SCRIPT[0].a },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [thinking, setThinking] = useState(false);

  useVisibleLoop(boxRef, async (alive) => {
    setMessages([]);
    setInput('');
    setThinking(false);
    await sleep(700);

    for (const pair of CHAT_SCRIPT) {
      if (!alive()) return;

      // 1. Type the question into the input
      setTyping(true);
      if (!(await typeInto(setInput, pair.q, 42, alive))) return;
      setTyping(false);
      await sleep(400);

      // 2. Press send
      if (!alive()) return;
      setSending(true);
      await sleep(220);
      setMessages((m) => [...m, { id: ++idRef.current, role: 'user', text: pair.q }]);
      setInput('');
      setSending(false);

      // 3. AI thinks, then types the answer
      await sleep(350);
      if (!alive()) return;
      setThinking(true);
      await sleep(1200);
      if (!alive()) return;
      setThinking(false);

      const id = ++idRef.current;
      setMessages((m) => [...m, { id, role: 'ai', text: '' }]);
      const ok = await typeInto(
        (text) => setMessages((m) => m.map((x) => (x.id === id ? { ...x, text } : x))),
        pair.a,
        17,
        alive,
      );
      if (!ok) return;
      await sleep(1900);
    }

    // Hold the finished conversation, then start over.
    await sleep(1800);
  });

  return (
    <div ref={boxRef} className="rounded-2xl bg-white border border-sky-100 shadow-card p-4 sm:p-5 mb-6">
      <div className="h-[300px] sm:h-[310px] flex flex-col justify-end gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_16%)]">
        {messages.map((m) => (
          <Bubble key={m.id} msg={m} />
        ))}
        {thinking && <TypingDots />}
      </div>

      <div className="flex items-center gap-2 pt-3 mt-1 border-t border-slate-100">
        <div className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] truncate">
          {input ? (
            <span className="text-slate-900">
              {input}
              {typing && <span className="inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900 animate-pulse" />}
            </span>
          ) : (
            <span className="text-slate-400">Ask about your leads, sales or customers…</span>
          )}
        </div>
        <span
          className={`w-9 h-9 rounded-xl text-white flex items-center justify-center transition-all duration-200 ${
            sending ? 'bg-sky-500 scale-90' : 'bg-slate-950'
          }`}
        >
          <Send className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

/* ---------------------------------- Voice --------------------------------- */

type Phase = 'idle' | 'listening' | 'thinking' | 'speaking';

const BAR_COUNT = 36;
const PHASE_LABEL: Record<Phase, string> = {
  idle: 'Ready',
  listening: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
};
const PHASE_AMP: Record<Phase, number> = { idle: 0.08, listening: 0.9, thinking: 0.16, speaking: 0.7 };

const VoiceDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const amp = useRef({ a: 0.4 });
  const [phase, setPhase] = useState<Phase>('listening');
  const [transcript, setTranscript] = useState(VOICE_SCRIPT[0].q);
  const [answer, setAnswer] = useState('');

  // Waveform: every bar's height is recomputed each frame from the current amplitude.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const bars = gsap.utils.toArray<HTMLElement>('[data-vbar]');
        const set = bars.map((b) => gsap.quickSetter(b, 'scaleY'));
        const mid = (BAR_COUNT - 1) / 2;

        const tick = () => {
          const t = gsap.ticker.time;
          const a = amp.current.a;
          bars.forEach((_, i) => {
            const envelope = 1 - (Math.abs(i - mid) / mid) * 0.6;
            const wobble = 0.4 + 0.6 * Math.abs(Math.sin(t * (3 + (i % 5) * 0.8) + i * 0.55));
            set[i](0.1 + a * envelope * wobble);
          });
        };
        // Only run the per-frame waveform while the voice demo is on screen.
        const stopWatching = onVisibility(boxRef.current, (visible) =>
          visible ? gsap.ticker.add(tick) : gsap.ticker.remove(tick),
        );
        return () => {
          stopWatching();
          gsap.ticker.remove(tick);
        };
      });
    },
    { scope: boxRef },
  );

  const goTo = (next: Phase) => {
    setPhase(next);
    gsap.to(amp.current, { a: PHASE_AMP[next], duration: 0.6, ease: 'power2.out', overwrite: true });
  };

  useVisibleLoop(boxRef, async (alive) => {
    for (const pair of VOICE_SCRIPT) {
      if (!alive()) return;
      setAnswer('');
      setTranscript('');

      goTo('listening');
      await sleep(600);
      if (!(await typeInto(setTranscript, pair.q, 55, alive))) return;
      await sleep(600);

      goTo('thinking');
      await sleep(1400);
      if (!alive()) return;

      goTo('speaking');
      if (!(await typeInto(setAnswer, pair.a, 32, alive))) return;
      await sleep(700);

      goTo('idle');
      await sleep(1800);
    }
  });

  return (
    <div ref={boxRef} className="rounded-2xl bg-white border border-sky-100 shadow-card p-4 sm:p-5 mb-6 flex flex-col items-center text-center">
      <div className="relative mb-3 mt-1">
        {phase === 'listening' && <span className="absolute inset-0 rounded-full bg-sky-300/60 animate-ping" />}
        <span
          className={`relative w-14 h-14 rounded-full text-white flex items-center justify-center shadow-float transition-all duration-300 ${
            phase === 'listening'
              ? 'bg-gradient-to-tr from-sky-600 via-blue-600 to-sky-400 scale-110'
              : 'bg-gradient-to-tr from-slate-800 to-slate-600'
          }`}
        >
          <Mic className="w-6 h-6" />
        </span>
      </div>

      <p
        className={`text-[12px] font-semibold mb-3 px-2.5 py-0.5 rounded-full border transition-colors ${
          phase === 'idle' ? 'text-slate-500 bg-slate-50 border-slate-200' : 'text-sky-700 bg-sky-50 border-sky-200'
        }`}
      >
        {PHASE_LABEL[phase]}
      </p>

      <div className="flex items-center justify-center gap-[3px] h-20 mb-4 w-full" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <span
            key={i}
            data-vbar
            className={`w-[3px] sm:w-1 h-full rounded-full transition-colors duration-300 ${
              phase === 'speaking' ? 'bg-blue-500' : 'bg-sky-400'
            }`}
            // Rounded so the server-rendered and client-rendered values are the identical string (no hydration mismatch).
            style={{ transform: `scaleY(${(0.2 + 0.5 * Math.abs(Math.sin(i * 0.6))).toFixed(3)})` }}
          />
        ))}
      </div>

      <div className="w-full min-h-[118px] space-y-2.5 text-left">
        <div className="min-h-[40px]">
          {transcript && (
            <p className="ml-auto max-w-[92%] w-fit px-3.5 py-2 rounded-2xl rounded-br-md bg-slate-950 text-white text-[13px] leading-snug">
              “{transcript}”
            </p>
          )}
        </div>
        <div className="min-h-[60px]">
          {answer && (
            <p className="max-w-[92%] w-fit px-3.5 py-2 rounded-2xl rounded-tl-md bg-sky-50 border border-sky-100 text-slate-800 text-[13px] leading-relaxed">
              {answer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Section -------------------------------- */

export const AIAgentsSection: React.FC = () => (
  <section id="ai-models" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-8 -left-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[400px] h-[400px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Bot}
        pill="AI Copilot"
        title="Ask Your CRM Anything. By Chat or by Voice."
        text="Affina has an AI assistant built right into the CRM. Ask a question in natural language and get an answer instantly, through two agents: a Chat Agent and a Voice Agent."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Agent */}
        <Reveal className="rounded-3xl border border-sky-100 bg-slate-50/60 p-6 sm:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-slate-950 leading-tight">Chat Agent</h3>
              <p className="text-[13px] text-slate-500">Type a question, get an answer.</p>
            </div>
          </div>

          <ChatDemo />

          <ul className="space-y-2.5 mt-auto">
            {CHAT_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[14px] text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Voice Agent */}
        <Reveal delay={0.08} className="rounded-3xl border border-sky-100 bg-slate-50/60 p-6 sm:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-slate-950 leading-tight">Voice Agent</h3>
              <p className="text-[13px] text-slate-500">Speak your question, hear the answer.</p>
            </div>
          </div>

          <VoiceDemo />

          <ul className="space-y-2.5 mt-auto">
            {VOICE_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[14px] text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  </section>
);
