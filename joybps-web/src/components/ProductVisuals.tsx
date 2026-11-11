import React from 'react';

const frame = 'relative h-[128px] rounded-2xl border border-slate-100 overflow-hidden';
const tint = (c: string) => ({ background: `linear-gradient(135deg, ${c}1f, #ffffff 60%, ${c}12)` });

/** Affina: a lead moves through the pipeline and is won. */
const AffinaVisual: React.FC<{ c: string }> = ({ c }) => (
  <div aria-hidden="true" className={`${frame} p-3`} style={tint(c)}>
    <div className="grid grid-cols-3 gap-1.5 h-full">
      {[['New', 0], ['Qualified', 1], ['Won', 2]].map(([n, k]) => (
        <div key={n as string} className="rounded-lg bg-white/70 border border-white p-1.5 space-y-1.5">
          <span className="block text-[8.5px] font-bold uppercase tracking-wider text-slate-400">{n}</span>
          {k !== 0 && <span className="block h-5 rounded bg-white border border-slate-100" />}
          {k === 1 && <span className="block h-5 rounded bg-white border border-slate-100" />}
        </div>
      ))}
    </div>
    <div className="v-lead absolute left-3 top-[34px] w-[calc((100%-24px-12px)/3)] rounded-md border bg-white px-1.5 py-1 shadow-card" style={{ borderColor: c }}>
      <span className="block text-[9px] font-bold text-slate-800 leading-tight">Priya S.</span>
      <span className="block text-[8.5px] font-semibold" style={{ color: c }}>₹12,000</span>
    </div>
    <span className="v-pop absolute right-3 top-2 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700" style={{ animationDelay: '3.2s' }}>Deal won</span>
  </div>
);

/** Iris: a call is answered by AI and handed to a person. */
const IrisVisual: React.FC<{ c: string }> = ({ c }) => (
  <div aria-hidden="true" className={`${frame} flex items-center justify-center`} style={tint(c)}>
    {[0, 1, 2].map((i) => <span key={i} className="v-ring absolute w-16 h-16 rounded-full border" style={{ borderColor: c, animationDelay: `${i}s` }} />)}
    <span className="relative w-11 h-11 rounded-full text-white flex items-center justify-center shadow-float" style={{ background: c }}>
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>
    </span>
    <span className="v-pop absolute left-3 top-4 rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[9.5px] font-bold text-slate-700 shadow-sm">AI answering</span>
    <span className="v-pop absolute right-3 bottom-4 rounded-full bg-white border px-2 py-0.5 text-[9.5px] font-bold shadow-sm" style={{ animationDelay: '2.4s', color: c, borderColor: c }}>Handover to Anita</span>
  </div>
);

/** Hestia: the team checks in, leave is approved, payroll runs. */
const HestiaVisual: React.FC<{ c: string }> = ({ c }) => (
  <div aria-hidden="true" className={`${frame} p-3 flex flex-col justify-between`} style={tint(c)}>
    <div className="flex items-center gap-2">
      {['A', 'R', 'M', 'S', 'K'].map((l, i) => (
        <span key={l} className="relative">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: c, opacity: 0.55 + (i % 3) * 0.15 }}>{l}</span>
          <span className="v-pop absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" style={{ animationDelay: `${i * 0.45}s` }}>
            <svg viewBox="0 0 12 12" className="w-2 h-2" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5 5 9l4.5-5.5" /></svg>
          </span>
        </span>
      ))}
    </div>
    <div>
      <div className="flex justify-between text-[9.5px] font-bold text-slate-500 mb-1"><span>Payroll</span><span style={{ color: c }}>Processing</span></div>
      <div className="h-1.5 rounded-full bg-white border border-slate-100 overflow-hidden"><span className="v-type block h-full rounded-full" style={{ background: c }} /></div>
    </div>
  </div>
);

/** Joybooks: an invoice is stamped paid and the books reconcile. */
const JoybooksVisual: React.FC<{ c: string }> = ({ c }) => (
  <div aria-hidden="true" className={`${frame} p-3 flex items-center gap-3`} style={tint(c)}>
    <div className="relative w-[88px] h-[102px] rounded-lg bg-white border border-slate-200 shadow-card p-2 space-y-1.5 shrink-0">
      <span className="block text-[8px] font-bold text-slate-400">INVOICE #1042</span>
      {[100, 80, 90].map((w, i) => <span key={i} className="block h-1 rounded bg-slate-100" style={{ width: `${w}%` }} />)}
      <span className="block text-[10px] font-bold text-slate-800 pt-1">₹48,000</span>
      <span className="v-stamp absolute right-1 bottom-2 rounded border-2 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider" style={{ color: '#059669', borderColor: '#059669' }}>PAID</span>
    </div>
    <div className="flex-1 h-[84px] flex items-end gap-1.5">
      {[40, 62, 50, 78, 66, 94].map((h, i) => <span key={i} className="v-grow flex-1 rounded-t" style={{ height: `${h}%`, background: c, opacity: 0.45 + i * 0.09, animationDelay: `${i * 0.12}s` }} />)}
    </div>
    <span className="v-pop absolute right-3 top-2 rounded-full bg-white border border-emerald-200 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700" style={{ animationDelay: '1.6s' }}>Reconciled</span>
  </div>
);

/** Athena: a site is measured, estimated and the crew checks in. */
const AthenaVisual: React.FC<{ c: string }> = ({ c }) => (
  <div aria-hidden="true" className={frame} style={tint(c)}>
    <svg viewBox="0 0 260 128" className="absolute inset-0 w-full h-full">
      <defs><pattern id="ath-grid" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none" stroke={c} strokeOpacity="0.14" strokeWidth="1" /></pattern></defs>
      <rect width="260" height="128" fill="url(#ath-grid)" />
      <path d="M40 34 H150 V92 H40 Z" fill="white" fillOpacity="0.8" stroke={c} strokeWidth="2" className="v-draw" />
      <path d="M40 106 H150 M40 101 V111 M150 101 V111" stroke="#64748b" strokeWidth="1.2" fill="none" className="v-draw" style={{ animationDelay: '0.5s' }} />
      <path d="M164 34 V92 M159 34 H169 M159 92 H169" stroke="#64748b" strokeWidth="1.2" fill="none" className="v-draw" style={{ animationDelay: '0.8s' }} />
      <text x="95" y="122" textAnchor="middle" fontSize="8" fontWeight="700" fill="#475569">12.4 m</text>
      <text x="178" y="66" fontSize="8" fontWeight="700" fill="#475569">8.1 m</text>
    </svg>
    <span className="v-pop absolute right-3 top-3 rounded-lg bg-white border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-800 shadow-sm" style={{ animationDelay: '1.2s' }}>Estimate ₹2,48,000</span>
    <span className="v-pop absolute right-3 bottom-4 inline-flex items-center gap-1 rounded-full bg-white border border-emerald-200 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700" style={{ animationDelay: '2.6s' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Crew of 6 present
    </span>
  </div>
);

export const PRODUCT_VISUALS: Record<string, React.FC<{ c: string }>> = {
  affina: AffinaVisual,
  iris: IrisVisual,
  hestia: HestiaVisual,
  joybooks: JoybooksVisual,
  athena: AthenaVisual,
};
