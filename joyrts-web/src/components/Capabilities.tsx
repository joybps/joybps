import React from 'react';
import { Brain } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { StaggerGroup } from './MotionPrimitives';

const frame = 'relative h-[148px] rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 overflow-hidden';

/** Chat: a question arrives and the assistant answers as the dots pulse. */
const AssistantVisual: React.FC = () => (
  <div aria-hidden="true" className={`${frame} p-3 flex flex-col justify-center gap-2`}>
    <div className="self-end max-w-[78%] rounded-2xl rounded-br-md bg-indigo-500 text-white text-[11px] font-medium px-3 py-1.5 shadow-sm">Which deals will close this week?</div>
    <div className="self-start w-[82%] rounded-2xl rounded-bl-md bg-white border border-sky-100 px-3 py-2 shadow-sm space-y-1.5">
      <span className="v-type block h-1.5 w-full rounded bg-slate-300" />
      <span className="v-type block h-1.5 w-4/5 rounded bg-slate-200" style={{ animationDelay: '0.25s' }} />
      <span className="v-type block h-1.5 w-1/2 rounded bg-sky-300" style={{ animationDelay: '0.5s' }} />
    </div>
    <div className="self-start flex gap-1 pl-2">
      {[0, 1, 2].map((i) => <span key={i} className="v-dot w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ animationDelay: `${i * 0.16}s` }} />)}
    </div>
  </div>
);

const BARS = [8, 14, 22, 30, 18, 38, 26, 44, 20, 34, 46, 24, 36, 16, 40, 28, 12, 32, 20, 10];
/** Voice: a live call with a waveform that breathes. */
const VoiceVisual: React.FC = () => (
  <div aria-hidden="true" className={`${frame} flex flex-col items-center justify-center gap-3`}>
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-emerald-200 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-700 shadow-sm">
      <span className="relative flex w-2 h-2"><span className="v-ring absolute inset-0 rounded-full bg-emerald-400" /><span className="relative w-2 h-2 rounded-full bg-emerald-500" /></span>
      Live call · AI answering
    </span>
    <div className="flex items-center gap-[3px] h-12">
      {BARS.map((h, i) => (
        <span key={i} className="v-bar w-[3px] rounded-full bg-gradient-to-t from-sky-500 to-indigo-500" style={{ height: `${h}px`, animationDelay: `${(i % 7) * 0.11}s`, animationDuration: `${1 + (i % 5) * 0.18}s` }} />
      ))}
    </div>
  </div>
);

const TREND = [26, 38, 32, 52, 46, 68, 60, 84];
/** Insights: bars grow, a trend line draws and the AI calls out what changed. */
const InsightVisual: React.FC = () => (
  <div aria-hidden="true" className={`${frame} p-3`}>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[9.5px] font-semibold uppercase tracking-wide text-slate-400">Pipeline</span>
      <span className="v-pop rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">+18% this month</span>
    </div>
    <div className="relative h-[78px]">
      <div className="absolute inset-0 flex items-end gap-1.5">
        {TREND.map((h, i) => <span key={i} className="v-grow flex-1 rounded-t bg-gradient-to-t from-sky-400 to-indigo-400" style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />)}
      </div>
      <svg viewBox="0 0 200 70" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <path d="M0 56 C30 50 45 58 70 40 S120 34 140 22 S180 14 200 6" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" className="v-draw" />
      </svg>
    </div>
    <div className="v-pop mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-white border border-sky-100 shadow-sm px-2 py-1 text-[10.5px] font-semibold text-slate-700" style={{ animationDelay: '0.9s' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Q3 on track, 2 deals at risk
    </div>
  </div>
);

/** Automation: an n8n-style workflow. A trigger feeds an AI Agent (with model, memory and tool sub-nodes) that fans out to actions; nodes light up as they execute. */
const AutomationVisual: React.FC = () => {
  const node = (x: number, y: number, w: number, h: number, delay: number, label: string, sub: string, color: string) => (
    <g key={label}>
      <rect x={x} y={y} width={w} height={h} rx="9" fill="white" strokeWidth="1.7" className="v-exec" style={{ animationDelay: `${delay}s` }} />
      <rect x={x + 5} y={y + h / 2 - 6} width="12" height="12" rx="3.5" fill={color} />
      <text x={x + 21} y={y + h / 2 - 0.5} fontSize="8.4" fontWeight="700" fill="#1e293b">{label}</text>
      <text x={x + 21} y={y + h / 2 + 8.5} fontSize="6.4" fill="#94a3b8">{sub}</text>
      <g className="v-pop" style={{ animationDelay: `${delay}s` }}>
        <circle cx={x + w - 1} cy={y + 1} r="5.5" fill="#10b981" />
        <path d={`M${x + w - 3.6} ${y + 1} l1.7 1.8 l3.2 -3.6`} stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
  const main = ['M56 73 C70 73 72 65 84 65', 'M146 65 C158 65 158 36 170 36', 'M146 65 C158 65 158 98 170 98'];
  const subs = [[91, 'Model'], [115, 'Memory'], [139, 'Tool']] as const;
  return (
    <div aria-hidden="true" className={frame}>
      <svg viewBox="0 0 224 148" className="absolute inset-0 w-full h-full">
        {main.map((d) => <path key={d} d={d} fill="none" stroke="#94a3b8" strokeWidth="1.4" className="v-dash" />)}
        {subs.map(([x]) => <path key={x} d={`M${x} 88 V104`} stroke="#a5b4fc" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />)}
        {main.map((d, i) => (
          <circle key={`p${i}`} r="2.8" fill="#6366f1">
            <animateMotion dur="2.2s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}
        {node(4, 56, 52, 34, 0, 'Trigger', 'New lead', '#f59e0b')}
        {node(84, 42, 62, 46, 0.9, 'AI Agent', 'Qualify', '#6366f1')}
        {node(170, 20, 50, 32, 2.2, 'CRM', 'Add deal', '#0ea5e9')}
        {node(170, 82, 50, 32, 2.6, 'Email', 'Reply', '#10b981')}
        {subs.map(([x, l], i) => (
          <g key={l}>
            <circle cx={x} cy="110" r="6.5" fill="white" strokeWidth="1.5" className="v-exec" style={{ animationDelay: `${1.3 + i * 0.25}s` }} />
            <path d={`M${x - 2.6} 110 h5.2 M${x} 107.4 v5.2`} stroke="#6366f1" strokeWidth="1.1" strokeLinecap="round" />
            <text x={x} y="127" textAnchor="middle" fontSize="6" fontWeight="600" fill="#64748b">{l}</text>
          </g>
        ))}
        <rect x="84" y="42" width="62" height="46" rx="9" fill="none" stroke="#6366f1" strokeWidth="1.2" className="v-ring" style={{ transformOrigin: '115px 65px', transformBox: 'view-box' }} />
      </svg>
    </div>
  );
};

const ITEMS = [
  { visual: AssistantVisual, title: 'AI chat assistants', text: 'Chat assistants that answer questions from your own data, inside the tools your team already uses.' },
  { visual: VoiceVisual, title: 'AI voice agents', text: 'Agents that answer calls, speak naturally and hand over to a person when it matters.' },
  { visual: AutomationVisual, title: 'Automations', text: 'Workflows that trigger follow-ups, approvals and updates without anyone chasing.' },
  { visual: InsightVisual, title: 'AI insights', text: 'Forecasts and summaries drawn from your own data, explained in plain language so people can act on them.' },
];

export const AICapabilities: React.FC = () => (
  <section id="ai" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-indigo top-10 -right-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[420px] h-[420px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading icon={<Brain />} pill="AI capabilities" title="Intelligence built into the work, not bolted on." text="We use AI where it removes real effort from your team, and keep a person in control wherever it matters." />
      <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" y={24} stagger={0.09}>
        {ITEMS.map((a) => (
          <div key={a.title} className="group rounded-3xl bg-white border border-sky-100 shadow-card p-4 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-sky-300 hover:shadow-float">
            <a.visual />
            <h3 className="mt-4 mb-1 px-1 text-[17px] font-bold text-slate-950">{a.title}</h3>
            <p className="px-1 pb-1 text-[13.5px] text-slate-600 leading-relaxed">{a.text}</p>
          </div>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
