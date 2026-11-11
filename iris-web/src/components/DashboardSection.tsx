'use client';

import React, { useRef, useState } from 'react';
import { LayoutDashboard, MessageSquare, Phone, Bot, UserCheck, Clock, Sparkles, Search, History } from 'lucide-react';
import { sleep, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';
import { LiveChip } from './FuturisticPrimitives';

type Channel = 'chat' | 'voice';
type Outcome = 'Resolved by AI' | 'Handled by human' | 'Transferred to human';

interface Convo {
  id: number;
  who: string;
  channel: Channel;
  agent: string;
  outcome: Outcome;
  meta: string;
  when: string;
  summary: string;
  lines: { from: 'Customer' | 'AI' | 'Team'; text: string }[];
}

// Sample data, for illustration only.
const CONVOS: Convo[] = [
  {
    id: 1,
    who: 'Ananya R.',
    channel: 'chat',
    agent: 'Nova (Chat agent)',
    outcome: 'Resolved by AI',
    meta: '6 messages',
    when: '2 min ago',
    summary: 'Customer asked about opening hours and booked a Friday appointment. Resolved without a human.',
    lines: [
      { from: 'Customer', text: 'What time do you open on Fridays?' },
      { from: 'AI', text: 'We’re open from 9 AM to 6 PM. Would you like to book a slot?' },
      { from: 'Customer', text: 'Yes, 10 AM please.' },
    ],
  },
  {
    id: 2,
    who: '+1 555 0142',
    channel: 'voice',
    agent: 'Aria (Voice agent)',
    outcome: 'Transferred to human',
    meta: '03:12 · call log',
    when: '9 min ago',
    summary: 'Caller wanted to dispute a charge. AI collected details, then transferred the live call to a team member.',
    lines: [
      { from: 'AI', text: 'Thanks for calling. How can I help today?' },
      { from: 'Customer', text: 'I need to speak to someone about a charge.' },
      { from: 'AI', text: 'Of course. Connecting you to the team now.' },
    ],
  },
  {
    id: 3,
    who: 'Rohan M.',
    channel: 'chat',
    agent: 'Nova (Chat agent)',
    outcome: 'Handled by human',
    meta: '14 messages',
    when: '27 min ago',
    summary: 'Customer asked for a person. Priya (online) took over the chat and completed the request.',
    lines: [
      { from: 'Customer', text: 'Can I talk to a person?' },
      { from: 'AI', text: 'Priya is online. Transferring you now.' },
      { from: 'Team', text: 'Hi Rohan, I can help with that.' },
    ],
  },
  {
    id: 4,
    who: '+44 7700 900123',
    channel: 'voice',
    agent: 'Aria (Voice agent)',
    outcome: 'Resolved by AI',
    meta: '01:48 · call log',
    when: '1 hr ago',
    summary: 'Caller checked the status of an order. The AI looked it up and answered. No transfer needed.',
    lines: [
      { from: 'Customer', text: 'Where is my order?' },
      { from: 'AI', text: 'It left the warehouse this morning and arrives tomorrow.' },
      { from: 'Customer', text: 'Great, thanks.' },
    ],
  },
];

const OUTCOME_STYLE: Record<Outcome, string> = {
  'Resolved by AI': 'bg-sky-50 text-sky-800 border-sky-200',
  'Handled by human': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Transferred to human': 'bg-amber-50 text-amber-800 border-amber-200',
};

const FEATURES = [
  { icon: History, t: 'Complete history', d: 'Every chat and call, kept and searchable.' },
  { icon: Bot, t: 'Agent attribution', d: 'See which agent handled each customer.' },
  { icon: Phone, t: 'Call logs and transcripts', d: 'Full transcript and AI summary per call.' },
  { icon: UserCheck, t: 'Live takeover', d: 'Attend transferred calls and chats live.' },
];

export const DashboardSection: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState<'all' | Channel>('all');

  const visible = CONVOS.filter((c) => tab === 'all' || c.channel === tab);
  const current = visible[sel % visible.length];

  useVisibleLoop(boxRef, async (alive) => {
    await sleep(3600);
    if (alive()) setSel((s) => s + 1);
  });

  return (
    <section id="dashboard" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[440px] h-[440px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={LayoutDashboard}
          pill="Organisation dashboard"
          title="See every conversation, and which agent handled it."
          text="Your team gets one place to monitor all chats and calls: the full history, transcripts, AI summaries, and live takeover when a customer needs a person."
        />

        <Reveal>
          <div ref={boxRef} className="rounded-[28px] bg-white border border-sky-200 shadow-float overflow-hidden">
            {/* top bar */}
            <div className="px-5 py-3.5 border-b border-sky-100 bg-slate-50/70 flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-bold text-slate-900">Conversations</span>
              <LiveChip label="Team online" tone="green" />
              <span className="ml-auto text-[11px] font-semibold text-slate-400">Sample data</span>
            </div>

            <div className="grid lg:grid-cols-12">
              {/* list */}
              <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-sky-100">
                <div className="p-3 flex items-center gap-2 border-b border-sky-50">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] text-slate-400">
                    <Search className="w-3.5 h-3.5" /> Search conversations
                  </div>
                </div>
                <div className="px-3 pt-3 flex gap-1.5">
                  {(['all', 'chat', 'voice'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTab(t);
                        setSel(0);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize cursor-pointer transition-colors ${
                        tab === t ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t === 'all' ? 'All' : t === 'chat' ? 'Chats' : 'Calls'}
                    </button>
                  ))}
                </div>
                <ul className="p-3 space-y-1.5">
                  {visible.map((c) => {
                    const on = c.id === current.id;
                    const Icon = c.channel === 'chat' ? MessageSquare : Phone;
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setSel(visible.indexOf(c))}
                          className={`w-full text-left rounded-2xl border px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-all duration-300 ${
                            on ? 'bg-sky-50 border-sky-300 shadow-card' : 'bg-white border-transparent hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${c.channel === 'chat' ? 'bg-sky-100 text-sky-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            <Icon className="w-4.5 h-4.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-[13.5px] font-bold text-slate-900 truncate">{c.who}</span>
                              <span className="text-[11px] text-slate-400 shrink-0">{c.when}</span>
                            </span>
                            <span className="block text-[12px] text-slate-500 truncate">{c.agent}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* detail */}
              <div key={current.id} className="lg:col-span-7 p-5 sm:p-6 animate-[fadeIn_.5s_ease]">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-[18px] font-bold text-slate-950">{current.who}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${OUTCOME_STYLE[current.outcome]}`}>{current.outcome}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-slate-500 mb-5">
                  <span className="flex items-center gap-1.5"><Bot className="w-3.5 h-3.5 text-sky-600" /> Handled by {current.agent}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {current.meta}</span>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-sky-50/70 p-4 mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-700 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI summary
                  </p>
                  <p className="text-[13.5px] leading-relaxed text-slate-700">{current.summary}</p>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Transcript</p>
                <ul className="space-y-2">
                  {current.lines.map((l, i) => (
                    <li key={i} className="flex gap-3 text-[13px]">
                      <span className={`w-16 shrink-0 text-[11px] font-bold uppercase tracking-wide pt-0.5 ${l.from === 'AI' ? 'text-sky-700' : l.from === 'Team' ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {l.from}
                      </span>
                      <span className="text-slate-700 leading-snug">{l.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.06}>
              <div className="h-full rounded-2xl bg-sky-50/50 border border-sky-100 p-4">
                <f.icon className="w-5 h-5 text-sky-600 mb-2" />
                <h4 className="text-[14.5px] font-bold text-slate-950 mb-0.5">{f.t}</h4>
                <p className="text-[13px] text-slate-600 leading-snug">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
