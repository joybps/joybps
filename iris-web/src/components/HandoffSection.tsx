'use client';

import React, { useRef, useState } from 'react';
import { MessageSquare, Phone, Sparkles, UserRound, Radio, Headphones, MessagesSquare, ArrowRightLeft } from 'lucide-react';
import { sleep, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

type Lane = 'chat' | 'voice';

const LANES: Record<Lane, { label: string; icon: React.ElementType; steps: { icon: React.ElementType; title: string; text: string }[] }> = {
  chat: {
    label: 'Chat',
    icon: MessageSquare,
    steps: [
      { icon: MessageSquare, title: 'Customer opens the widget', text: 'They start chatting from any page on your site.' },
      { icon: Sparkles, title: 'AI chat agent replies', text: 'Answers instantly and keeps the conversation going.' },
      { icon: UserRound, title: 'Customer asks for a human', text: 'Iris checks whether anyone on your team is online.' },
      { icon: Radio, title: 'Team member is online', text: 'Only then is the chat transferred. If nobody is online, the AI keeps helping.' },
      { icon: MessagesSquare, title: 'Live human chat', text: 'Your team member continues in the same conversation.' },
    ],
  },
  voice: {
    label: 'Voice',
    icon: Phone,
    steps: [
      { icon: Phone, title: 'Customer calls your number', text: 'They dial the agent’s virtual phone number.' },
      { icon: Sparkles, title: 'AI voice agent answers', text: 'Speaks with the caller automatically, in real time.' },
      { icon: UserRound, title: 'Caller asks for a person', text: 'The AI recognises the request to speak to a human.' },
      { icon: ArrowRightLeft, title: 'Call is transferred', text: 'The live call is routed to your organisation’s dashboard.' },
      { icon: Headphones, title: 'Your team takes the call', text: 'A team member attends it live and speaks with the customer.' },
    ],
  },
};

export const HandoffSection: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [lane, setLane] = useState<Lane>('chat');
  const [active, setActive] = useState(0);

  useVisibleLoop(boxRef, async (alive) => {
    // walk the flow one step at a time, then switch lane
    for (let i = 0; i < 5; i++) {
      if (!alive()) return;
      setActive(i);
      await sleep(i === 4 ? 2600 : 1700);
    }
    setLane((l) => (l === 'chat' ? 'voice' : 'chat'));
    setActive(0);
  });

  const L = LANES[lane];
  const step = L.steps[active];

  return (
    <section id="handoff" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={ArrowRightLeft}
          pill="Human handover"
          title="AI first. A human the moment it matters."
          text="Customers never get stuck with a bot. When they ask for a person, Iris brings in your team, as long as someone is online to take it."
        />

        <Reveal>
          <div ref={boxRef} className="rounded-[28px] bg-white border border-sky-200 shadow-float p-5 sm:p-8">
            {/* lane switch */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1 rounded-2xl bg-slate-100 gap-1">
                {(Object.keys(LANES) as Lane[]).map((k) => {
                  const Icon = LANES[k].icon;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setLane(k);
                        setActive(0);
                      }}
                      className={`px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                        lane === k ? 'bg-white text-slate-950 shadow-card' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {LANES[k].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* flow */}
            <ol className="relative grid grid-cols-5 gap-2 sm:gap-4">
              {/* track */}
              <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-6 sm:top-7 h-0.5 bg-sky-100 rounded-full" />
              <div
                aria-hidden="true"
                className="absolute left-[10%] top-6 sm:top-7 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-700 ease-out"
                style={{ width: `${(active / 4) * 80}%` }}
              />
              {L.steps.map((s, i) => {
                const Icon = s.icon;
                const on = i === active;
                const done = i < active;
                return (
                  <li key={s.title} className="relative flex flex-col items-center text-center">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={s.title}
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center cursor-pointer transition-all duration-500 ${
                        on
                          ? 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white border-transparent scale-110 shadow-float'
                          : done
                            ? 'bg-sky-100 text-sky-700 border-sky-200'
                            : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {on && <span className="anim-pulse-ring absolute inset-0 rounded-2xl bg-sky-400/40" />}
                      <Icon className="relative w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <span className={`mt-3 hidden sm:block text-[12.5px] font-semibold leading-tight px-1 transition-colors ${on ? 'text-slate-950' : 'text-slate-500'}`}>
                      {s.title}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* active step detail */}
            <div className="mt-8 rounded-2xl bg-sky-50/70 border border-sky-100 px-5 py-4 text-center min-h-[84px] flex flex-col items-center justify-center">
              <p className="text-[11px] font-bold uppercase tracking-wide text-sky-700 mb-1">
                Step {active + 1} of 5 · {L.label}
              </p>
              <p className="text-[16px] font-bold text-slate-950">{step.title}</p>
              <p className="text-[14px] text-slate-600 mt-0.5 max-w-xl">{step.text}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
