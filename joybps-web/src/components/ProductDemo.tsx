'use client';

import React, { useRef, useState } from 'react';
import { MousePointer2, Check, Phone, User, Clock, FileText, Wallet, Users, LayoutDashboard, Landmark, Boxes, BarChart3, Target, Headset, CalendarCheck, Banknote, Ruler, HardHat, Receipt, MapPin, PhoneCall, Bot, ArrowRightLeft } from 'lucide-react';
import { gsap, sleep, useVisibleLoop } from '../animation';
import { PRODUCTS } from '../data/products';

/**
 * Cursor-driven product walkthroughs. Each demo is a small scripted app: the cursor moves to the action button, clicks it,
 * the screen reacts, and the cursor glances at the result before the next step. No video files, so they load instantly and stay sharp.
 */

type Side = { icon: React.ComponentType<{ className?: string }>; label: string };
interface DemoDef {
  slug: string;
  side: Side[];
  active: string;
  title: string;
  cursor: string;
  actions: string[];
  render: (step: number) => React.ReactNode;
}

const usd = (n: number) => '$' + n.toLocaleString('en-US');
const Tag: React.FC<{ tone?: 'sky' | 'green' | 'amber' | 'violet' | 'slate'; children: React.ReactNode }> = ({ tone = 'sky', children }) => {
  const t = { sky: 'bg-sky-50 border-sky-200 text-sky-700', green: 'bg-emerald-50 border-emerald-200 text-emerald-700', amber: 'bg-amber-50 border-amber-200 text-amber-700', violet: 'bg-violet-50 border-violet-200 text-violet-700', slate: 'bg-slate-50 border-slate-200 text-slate-500' }[tone];
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${t}`}>{children}</span>;
};
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-3 ${className}`}>{children}</div>
);

/* ---------- Affina: lead to won deal ---------- */
const AFFINA_COLS = ['New', 'Qualified', 'Proposal', 'Won'];
const affina: DemoDef = {
  slug: 'affina',
  side: [{ icon: LayoutDashboard, label: 'Dashboard' }, { icon: Target, label: 'Pipeline' }, { icon: Users, label: 'Contacts' }, { icon: PhoneCall, label: 'Calls' }, { icon: BarChart3, label: 'Forecast' }],
  active: 'Pipeline',
  title: 'Affina · Sales pipeline',
  cursor: 'Sales rep',
  actions: ['Qualify the lead', 'Send a proposal', 'Call the customer', 'Mark as won'],
  render: (step) => {
    const col = [0, 1, 2, 2, 3][Math.min(step, 4)];
    const others = [[], [['Acme Supplies', '$9,000']], [['Nova Retail', '$15,000']], [['Bluebird Studio', '$24,000']]];
    return (
      <>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] text-slate-500">Expected revenue</p>
          <p className="text-[18px] font-extrabold text-slate-950 tabular-nums">{step >= 4 ? '$60,000' : '$48,000'}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {AFFINA_COLS.map((c, i) => (
            <div key={c} className="rounded-lg bg-slate-50 p-2 min-h-[170px]">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">{c}</p>
              {others[i].map(([n, v]) => (
                <div key={n} className="rounded-md bg-white border border-slate-100 p-1.5 mb-1.5"><p className="text-[10.5px] font-semibold text-slate-700 truncate">{n}</p><p className="text-[10px] text-slate-400">{v}</p></div>
              ))}
              {col === i && (
                <div data-result className="rounded-md bg-white border-2 border-sky-400 shadow-card p-1.5 animate-[fadeIn_.4s_ease]">
                  <p className="text-[10.5px] font-bold text-slate-900 truncate">Priya Sharma</p>
                  <p className="text-[10px] text-slate-500">{i === 3 ? '$12,000 · Won' : '$12,000 · Meta Ads'}</p>
                  {step === 3 && <p className="mt-1"><Tag tone="green">Call logged</Tag></p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  },
};

/* ---------- Iris: AI call with human handover ---------- */
const LINES: [string, string][] = [
  ['Caller', 'Hi, I need to move my appointment.'],
  ['AI agent', 'Of course. Which day works for you?'],
  ['Caller', 'Friday morning, please.'],
  ['AI agent', 'Done. You are booked for Friday at 10:30.'],
];
const iris: DemoDef = {
  slug: 'iris',
  side: [{ icon: LayoutDashboard, label: 'Dashboard' }, { icon: Headset, label: 'Live calls' }, { icon: Bot, label: 'Agents' }, { icon: FileText, label: 'Call logs' }, { icon: BarChart3, label: 'Reports' }],
  active: 'Live calls',
  title: 'Iris · Live calls',
  cursor: 'Supervisor',
  actions: ['Answer with AI', 'Hand over to a human', 'Save the summary'],
  render: (step) => (
    <div className="grid sm:grid-cols-5 gap-3">
      <Card className="sm:col-span-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-600" /> +91 ••• 4821</p>
          <Tag tone={step === 0 ? 'amber' : step >= 2 ? 'violet' : 'green'}>{step === 0 ? 'Ringing' : step >= 2 ? 'With human' : 'AI on call'}</Tag>
        </div>
        <div className="space-y-1.5 min-h-[150px]">
          {step === 0 && <p className="text-[12px] text-slate-400 py-6 text-center">Incoming call on the support line…</p>}
          {step >= 1 && LINES.map(([who, t], i) => (
            <div key={i} className={`rounded-lg px-2.5 py-1.5 text-[11.5px] animate-[fadeIn_.4s_ease] ${who === 'AI agent' ? 'bg-indigo-50 text-indigo-900 ml-6' : 'bg-slate-50 text-slate-700 mr-6'}`}>
              <span className="font-bold">{who}: </span>{t}
            </div>
          ))}
          {step >= 2 && (
            <div className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-[11.5px] font-semibold text-violet-800 flex items-center gap-1.5 animate-[fadeIn_.4s_ease]"><ArrowRightLeft className="w-3.5 h-3.5" /> Transferred to Ravi (human agent)</div>
          )}
        </div>
      </Card>
      <Card className="sm:col-span-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Call log</p>
        {step >= 3 ? (
          <div data-result className="animate-[fadeIn_.4s_ease]">
            <p className="text-[12px] font-bold text-slate-900 mb-1">AI summary</p>
            <p className="text-[11.5px] text-slate-600 leading-relaxed">Appointment moved to Friday 10:30. Customer happy. No follow-up needed.</p>
            <div className="mt-2 flex gap-1.5"><Tag tone="green">Resolved</Tag><Tag tone="slate">2:14</Tag></div>
          </div>
        ) : <p className="text-[12px] text-slate-400">Summary appears when the call ends.</p>}
      </Card>
    </div>
  ),
};

/* ---------- Hestia: people workflow ---------- */
const hestia: DemoDef = {
  slug: 'hestia',
  side: [{ icon: LayoutDashboard, label: 'Home' }, { icon: User, label: 'People' }, { icon: CalendarCheck, label: 'Attendance' }, { icon: Clock, label: 'Leave' }, { icon: Wallet, label: 'Payroll' }],
  active: 'Leave',
  title: 'Hestia · Workspace',
  cursor: 'Employee',
  actions: ['Check in', 'Request leave', 'Approve leave', 'Run payroll'],
  render: (step) => (
    <div className="grid sm:grid-cols-3 gap-3">
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Employee · Meera</p>
        <p className="text-[12px] text-slate-600 mb-1.5">Attendance today</p>
        {step >= 1 ? <div data-result={step === 1 ? '' : undefined}><Tag tone="green">Checked in 09:02</Tag></div> : <Tag tone="slate">Not checked in</Tag>}
        <p className="text-[12px] text-slate-600 mt-3 mb-1.5">Leave balance</p>
        <p className="text-[18px] font-extrabold text-slate-950 tabular-nums">{step >= 3 ? '10' : '12'} <span className="text-[11px] font-semibold text-slate-400">days</span></p>
      </Card>
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Manager approvals</p>
        {step >= 2 ? (
          <div data-result={step >= 2 && step < 4 ? '' : undefined} className="rounded-lg bg-slate-50 p-2 animate-[fadeIn_.4s_ease]">
            <p className="text-[11.5px] font-semibold text-slate-800">Meera · 2 days</p>
            <p className="text-[10.5px] text-slate-500 mb-1.5">Nov 20 to Nov 21</p>
            <Tag tone={step >= 3 ? 'green' : 'amber'}>{step >= 3 ? 'Approved' : 'Pending'}</Tag>
          </div>
        ) : <p className="text-[12px] text-slate-400">No requests yet.</p>}
      </Card>
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">HR · Payroll</p>
        <p className="text-[12px] text-slate-600 mb-1">November payroll</p>
        <p className="text-[18px] font-extrabold text-slate-950 tabular-nums">{step >= 4 ? usd(42180) : '--'}</p>
        <div className="mt-1.5">{step >= 4 ? <span data-result=""><Tag tone="green">Ready to pay</Tag></span> : <Tag tone="slate">Draft</Tag>}</div>
      </Card>
    </div>
  ),
};

/* ---------- Joybooks: invoice to reconciled ---------- */
const joybooks: DemoDef = {
  slug: 'joybooks',
  side: [{ icon: LayoutDashboard, label: 'Dashboard' }, { icon: FileText, label: 'Invoices' }, { icon: Receipt, label: 'Bills' }, { icon: Landmark, label: 'Banking' }, { icon: Boxes, label: 'Inventory' }, { icon: BarChart3, label: 'Reports' }],
  active: 'Invoices',
  title: 'Joybooks · Invoices',
  cursor: 'Accountant',
  actions: ['Create the invoice', 'Send to the customer', 'Record the payment', 'Reconcile the bank'],
  render: (step) => (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {[['Outstanding', step >= 3 ? '$0' : step >= 1 ? '$6,549' : '$0'], ['Received', step >= 3 ? '$6,549' : '$0'], ['Cash in bank', step >= 4 ? '$255.5K' : '$249K']].map(([k, v]) => (
          <Card key={k}><p className="text-[10.5px] text-slate-500">{k}</p><p className="text-[16px] font-extrabold text-slate-950 tabular-nums">{v}</p></Card>
        ))}
      </div>
      <Card>
        <div className="grid grid-cols-[1fr_.8fr_.7fr] gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400 pb-1.5 border-b border-slate-100"><span>Invoice</span><span>Amount</span><span className="text-right">Status</span></div>
        {step >= 1 ? (
          <div data-result className="grid grid-cols-[1fr_.8fr_.7fr] gap-2 items-center py-2 text-[12px] animate-[fadeIn_.4s_ease]">
            <span className="font-semibold text-slate-900">INV-2204 · Northwind</span>
            <span className="tabular-nums text-slate-700">{usd(6549)}</span>
            <span className="text-right"><Tag tone={step >= 3 ? 'green' : step >= 2 ? 'sky' : 'amber'}>{step >= 3 ? 'Paid' : step >= 2 ? 'Sent' : 'Draft'}</Tag></span>
          </div>
        ) : <p className="py-4 text-[12px] text-slate-400">No invoices yet.</p>}
        {step >= 4 && <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-700"><Check className="w-3.5 h-3.5" strokeWidth={3} /> Matched to bank line, reconciled</p>}
      </Card>
    </div>
  ),
};

/* ---------- Athena: site to closed project ---------- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const athena: DemoDef = {
  slug: 'athena',
  side: [{ icon: MapPin, label: 'Sites' }, { icon: FileText, label: 'Estimates' }, { icon: HardHat, label: 'Crews' }, { icon: Users, label: 'Labour' }, { icon: Wallet, label: 'Expenses' }, { icon: Receipt, label: 'Invoices' }],
  active: 'Sites',
  title: 'Athena · 24 Maple Street',
  cursor: 'Site supervisor',
  actions: ['Take measurements', 'Build the estimate', 'Schedule a crew', 'Mark attendance', 'Invoice and close'],
  render: (step) => (
    <div className="grid sm:grid-cols-2 gap-3">
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Measurements and estimate</p>
        {step >= 1 ? (
          <div data-result={step <= 2 ? '' : undefined} className="space-y-1 text-[11.5px] animate-[fadeIn_.4s_ease]">
            {[['Flooring', '240 sq ft', 4.2], ['Wall painting', '420 sq ft', 2.5], ['Door frames', '6 nos', 85]].map(([n, q, r]) => (
              <div key={n as string} className="flex justify-between"><span className="text-slate-700 flex items-center gap-1"><Ruler className="w-3 h-3 text-amber-600" />{n as string} · {q as string}</span><span className="tabular-nums font-semibold text-slate-900">{step >= 2 ? usd(Math.round(parseFloat(q as string) * (r as number))) : ''}</span></div>
            ))}
            {step >= 2 && <div className="flex justify-between pt-1.5 border-t border-slate-100 text-[12px] font-extrabold text-slate-950"><span>Estimate</span><span className="tabular-nums">{usd(2568)}</span></div>}
          </div>
        ) : <p className="text-[12px] text-slate-400">Survey the site to begin.</p>}
      </Card>
      <Card className="relative">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Crew and attendance</p>
        {step >= 3 ? (
          <div data-result={step >= 3 ? '' : undefined} className="animate-[fadeIn_.4s_ease]">
            <p className="text-[12px] font-semibold text-slate-800 mb-1.5">Crew A · 5 labourers</p>
            <div className="flex gap-1">{DAYS.map((d) => <span key={d} className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold ${step >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{step >= 4 ? <Check className="w-3 h-3" strokeWidth={3.5} /> : d[0]}</span>)}</div>
            {step >= 4 && <p className="mt-1.5 text-[11.5px] text-slate-600">Labour cost <span className="font-bold text-slate-900">{usd(1440)}</span></p>}
          </div>
        ) : <p className="text-[12px] text-slate-400">No crew scheduled.</p>}
        {step >= 5 && (
          <div className="mt-2 flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1.5 animate-[fadeIn_.4s_ease]">
            <span className="text-[11.5px] font-semibold text-amber-900">Invoice total</span><span className="text-[14px] font-extrabold text-slate-950 tabular-nums">{usd(4996)}</span>
          </div>
        )}
        {step >= 5 && <span className="absolute right-3 top-8 rotate-[-10deg] rounded-md border-[3px] border-emerald-500 text-emerald-600 text-[15px] font-extrabold tracking-widest px-2 bg-white/85">CLOSED</span>}
      </Card>
    </div>
  ),
};

export const DEMOS: DemoDef[] = [affina, iris, hestia, joybooks, athena];

/** One scripted walkthrough. */
export const ProductDemo: React.FC<{ slug: string }> = ({ slug }) => {
  const def = DEMOS.find((d) => d.slug === slug) ?? DEMOS[0];
  const product = PRODUCTS.find((p) => p.slug === def.slug)!;
  const frameRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState(0);
  const n = def.actions.length;

  const $ = (sel: string) => frameRef.current?.querySelector(sel) ?? null;
  const moveTo = (el: Element | null, dur = 0.9) =>
    new Promise<void>((res) => {
      if (!el || !curRef.current || !frameRef.current) return res();
      const f = frameRef.current.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const z = f.width / (frameRef.current.clientWidth || 1) || 1;
      gsap.to(curRef.current, { x: (r.left - f.left + r.width * 0.5) / z, y: (r.top - f.top + r.height * 0.5) / z, duration: dur, ease: 'power2.inOut', onComplete: res });
    });
  const click = () =>
    new Promise<void>((res) => {
      const tl = gsap.timeline({ onComplete: res });
      tl.to(curRef.current, { scale: 0.8, duration: 0.1 }).to(curRef.current, { scale: 1, duration: 0.18 });
      if (rippleRef.current) tl.fromTo(rippleRef.current, { scale: 0.2, autoAlpha: 0.55 }, { scale: 1.8, autoAlpha: 0, duration: 0.5 }, 0);
    });

  useVisibleLoop(frameRef, async (alive) => {
    setStep(0);
    setPhase(0);
    const frame = frameRef.current;
    if (!frame || !curRef.current) return;
    gsap.set(curRef.current, { x: frame.clientWidth - 90, y: frame.clientHeight - 60, scale: 1 });
    await sleep(900);
    for (let k = 0; k < n; k++) {
      if (!alive()) return;
      setPhase(k);
      await moveTo($('[data-act]'), k === 0 ? 1 : 0.8);
      if (!alive()) return;
      await click();
      setStep(k + 1);
      await sleep(550);
      await moveTo($('[data-result]'), 0.8);
      await sleep(1100);
    }
    setPhase(n);
    await sleep(2600);
  });

  return (
    <div>
      <ol aria-label={`${product.name} walkthrough steps`} className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {def.actions.map((a, i) => (
          <li
            key={a}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all duration-500 ${
              i === phase ? 'bg-slate-950 text-white border-slate-950 shadow-float' : i < phase ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[9.5px] flex items-center justify-center ${i === phase ? 'bg-white text-slate-950' : i < phase ? 'bg-sky-500 text-white' : 'bg-slate-100'}`}>
              {i < phase ? <Check className="w-2.5 h-2.5" strokeWidth={3.5} /> : i + 1}
            </span>
            {a}
          </li>
        ))}
      </ol>
      <div ref={frameRef} role="img" aria-label={`Animated walkthrough of ${product.name}: ${def.actions.join(', ')}.`} className="relative rounded-[22px] bg-white border border-sky-200 shadow-float overflow-hidden select-none">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-sky-100 bg-slate-50/80">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-300" /><span className="w-2.5 h-2.5 rounded-full bg-amber-300" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 text-[11px] font-semibold text-slate-400">{def.title}</span>
        </div>
        <div className="flex min-h-[430px] lg:min-h-[500px]">
          <aside aria-hidden="true" className="hidden md:block w-[150px] shrink-0 border-r border-sky-100 p-3 space-y-1">
            {def.side.map((s) => (
              <div key={s.label} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium ${s.label === def.active ? 'text-slate-950' : 'text-slate-500'}`} style={s.label === def.active ? { background: `${product.accent}1f` } : undefined}>
                <s.icon className="w-3.5 h-3.5" /> {s.label}
              </div>
            ))}
          </aside>
          <div aria-hidden="true" className="flex-1 min-w-0 p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-[13px] font-bold text-slate-900">{product.name}</p>
              <span
                data-act
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-colors duration-500 ${step >= n ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-white'}`}
              >
                {step >= n ? <><Check className="w-3.5 h-3.5" strokeWidth={3} /> All done</> : def.actions[step]}
              </span>
            </div>
            <div className="demo-zoom flex-1 flex flex-col justify-start pt-2">{def.render(step)}</div>
          </div>
        </div>
        <div aria-hidden="true" ref={curRef} className="absolute left-0 top-0 z-30 pointer-events-none will-change-transform" style={{ transform: 'translate(-200px,-200px)' }}>
          <span ref={rippleRef} className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-sky-400/50 opacity-0" />
          <MousePointer2 className="relative w-6 h-6 text-slate-950 fill-white drop-shadow" strokeWidth={1.8} />
          <span className="absolute left-5 top-5 whitespace-nowrap rounded-full text-white text-[10.5px] font-semibold px-2 py-0.5 shadow-float" style={{ background: product.accent }}>{def.cursor}</span>
        </div>
      </div>
    </div>
  );
};

/** Tabbed player for all five demos. */
export const ProductDemos: React.FC<{ initial?: string }> = ({ initial = 'affina' }) => {
  const [slug, setSlug] = useState(initial);
  return (
    <div>
      <div role="tablist" aria-label="Choose a product demo" className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {PRODUCTS.map((p) => (
          <button
            key={p.slug}
            role="tab"
            aria-selected={slug === p.slug}
            onClick={() => setSlug(p.slug)}
            className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors cursor-pointer ${slug === p.slug ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-sky-200 hover:border-sky-400'}`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <ProductDemo key={slug} slug={slug} />
    </div>
  );
};
