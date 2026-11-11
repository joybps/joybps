'use client';

import React, { useRef, useState } from 'react';
import { MapPin, FileText, FolderKanban, Users, HardHat, Wallet, Receipt, Plus, X, ChevronDown, MousePointer2, Check, Ruler, Rocket, FileDown, Download } from 'lucide-react';
import { gsap, sleep, typeInto, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

interface Line {
  id: string;
  item: string;
  qty: number;
  unit: string;
  rate: number;
}
type Status = 'Draft' | 'Sent' | 'Approved';

const BASE: Line[] = [{ id: 'l0', item: 'Flooring', qty: 240, unit: 'sq ft', rate: 4.2 }];
const NEW1: Line = { id: 'l1', item: 'Wall painting', qty: 420, unit: 'sq ft', rate: 2.5 };
const NEW2: Line = { id: 'l2', item: 'Door frames', qty: 6, unit: 'nos', rate: 85 };
const UNITS = ['sq ft', 'ft', 'nos', 'unit'];

const SIDE = [
  { icon: MapPin, label: 'Sites' },
  { icon: FileText, label: 'Estimates', active: true },
  { icon: FolderKanban, label: 'Projects' },
  { icon: HardHat, label: 'Crews' },
  { icon: Users, label: 'Labour' },
  { icon: Wallet, label: 'Expenses' },
  { icon: Receipt, label: 'Invoices' },
];
const PHASES = ['Add measurements', 'Price them', 'Get approval', 'Start the project', 'Estimate PDF'];
const usd = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

interface Modal {
  open: boolean;
  item: string;
  qty: string;
  unit: string;
  rate: string;
  field: 'item' | 'qty' | 'unit' | 'rate' | null;
  list: boolean;
}
const CLOSED: Modal = { open: false, item: '', qty: '', unit: '', rate: '', field: null, list: false };

export const EstimateDemoSection: React.FC = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Line[]>(BASE);
  const [modal, setModal] = useState<Modal>(CLOSED);
  const [status, setStatus] = useState<Status>('Draft');
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [toast, setToast] = useState('');
  const [freshId, setFreshId] = useState('');
  const [pdf, setPdf] = useState<'off' | 'making' | 'ready'>('off');

  const $ = (sel: string) => frameRef.current?.querySelector(sel) ?? null;
  const targetOf = (el: Element, ox = 0.5, oy = 0.5) => {
    const f = frameRef.current!.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const z = f.width / (frameRef.current!.clientWidth || 1) || 1;
    return { x: (r.left - f.left + r.width * ox) / z, y: (r.top - f.top + r.height * oy) / z };
  };
  const moveTo = (el: Element | null, dur = 0.9, ox = 0.5, oy = 0.5) =>
    new Promise<void>((res) => {
      if (!el || !curRef.current) return res();
      gsap.to(curRef.current, { ...targetOf(el, ox, oy), duration: dur, ease: 'power2.inOut', onComplete: res });
    });
  const click = () =>
    new Promise<void>((res) => {
      const tl = gsap.timeline({ onComplete: res });
      tl.to(curRef.current, { scale: 0.8, duration: 0.1 }).to(curRef.current, { scale: 1, duration: 0.18 });
      if (rippleRef.current) tl.fromTo(rippleRef.current, { scale: 0.2, autoAlpha: 0.55 }, { scale: 1.8, autoAlpha: 0, duration: 0.5 }, 0);
    });

  /** Fills the "add measurement" dialog for one line, with the cursor, then adds it. */
  const addLine = async (ln: Line, alive: () => boolean, fast = false) => {
    await moveTo($('[data-add]'), fast ? 0.7 : 1);
    if (!alive()) return false;
    await click();
    setModal({ ...CLOSED, open: true });
    await sleep(400);
    await moveTo($('[data-m-item]'), 0.6);
    await click();
    setModal((m) => ({ ...m, field: 'item' }));
    if (!(await typeInto((s) => setModal((m) => ({ ...m, item: s })), ln.item, fast ? 22 : 36, alive))) return false;
    await moveTo($('[data-m-qty]'), 0.5);
    await click();
    setModal((m) => ({ ...m, field: 'qty' }));
    if (!(await typeInto((s) => setModal((m) => ({ ...m, qty: s })), String(ln.qty), 70, alive))) return false;
    await moveTo($('[data-m-unit]'), 0.5);
    await click();
    setModal((m) => ({ ...m, field: 'unit', list: true }));
    await sleep(350);
    const opt = $(`[data-unit="${ln.unit}"]`);
    await moveTo(opt, 0.5, 0.4, 0.5);
    await click();
    setModal((m) => ({ ...m, unit: ln.unit, list: false }));
    await sleep(200);
    await moveTo($('[data-m-rate]'), 0.5);
    await click();
    setModal((m) => ({ ...m, field: 'rate' }));
    if (!(await typeInto((s) => setModal((m) => ({ ...m, rate: s })), String(ln.rate), 70, alive))) return false;
    await sleep(500);
    await moveTo($('[data-m-submit]'), 0.5);
    await click();
    setFreshId(ln.id);
    setModal(CLOSED);
    setLines((l) => [...l, ln]);
    await sleep(700);
    return alive();
  };

  useVisibleLoop(frameRef, async (alive) => {
    setLines(BASE);
    setModal(CLOSED);
    setStatus('Draft');
    setStarted(false);
    setToast('');
    setFreshId('');
    setPdf('off');
    setPhase(0);
    const frame = frameRef.current;
    if (!frame || !curRef.current) return;
    gsap.set(curRef.current, { x: frame.clientWidth - 80, y: frame.clientHeight - 60, scale: 1 });
    await sleep(900);
    if (!alive()) return;

    if (!(await addLine(NEW1, alive))) return;
    setPhase(1);
    if (!(await addLine(NEW2, alive, true))) return;

    setPhase(2);
    await moveTo($('[data-send]'), 0.9);
    await click();
    setStatus('Sent');
    await sleep(1400);
    if (!alive()) return;
    setToast('Customer approved the estimate');
    setStatus('Approved');
    await sleep(1300);
    if (!alive()) return;

    setPhase(3);
    setToast('');
    await moveTo($('[data-start]'), 0.9);
    await click();
    setStarted(true);
    setToast('Project started');
    await sleep(1400);
    if (!alive()) return;

    setPhase(4);
    setToast('');
    await moveTo($('[data-pdf]'), 0.9);
    await click();
    setPdf('making');
    await sleep(1800);
    if (!alive()) return;
    setPdf('ready');
    await sleep(1600);
    if (!alive()) return;
    await moveTo($('[data-download]'), 0.9);
    await click();
    setToast('Estimate PDF ready to send');
    await sleep(3200);
  });

  const total = lines.reduce((n, l) => n + l.qty * l.rate, 0);
  const mq = Number(modal.qty) || 0;
  const mr = Number(modal.rate) || 0;

  return (
    <section id="demo" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-amber bottom-0 -right-40 w-[440px] h-[440px]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={MousePointer2}
          pill="See it in action"
          title="From measurements to an estimate PDF."
          text="Watch an estimate take shape: add measurements in any unit, let Athena do the maths, get approval, start the job and generate the PDF for your customer."
        />

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {PHASES.map((p, i) => (
            <span
              key={p}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all duration-500 ${
                i === phase ? 'bg-slate-950 text-white border-slate-950 shadow-float' : i < phase ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[9.5px] flex items-center justify-center ${i === phase ? 'bg-white text-slate-950' : i < phase ? 'bg-sky-500 text-white' : 'bg-slate-100'}`}>
                {i < phase ? <Check className="w-2.5 h-2.5" strokeWidth={3.5} /> : i + 1}
              </span>
              {p}
            </span>
          ))}
        </div>

        <Reveal>
          <div ref={frameRef} aria-hidden="true" className="relative rounded-[26px] bg-white border border-sky-200 shadow-float overflow-hidden select-none">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-sky-100 bg-slate-50/80">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 text-[11px] font-semibold text-slate-400">Athena · Estimates</span>
            </div>

            <div className="flex min-h-[440px]">
              <aside className="hidden md:block w-[168px] shrink-0 border-r border-sky-100 bg-white p-3 space-y-1">
                <p className="px-2 pt-1 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400">WORKSPACE</p>
                {SIDE.map((s) => (
                  <div key={s.label} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium ${s.active ? 'bg-amber-50 text-slate-950' : 'text-slate-500'}`}>
                    <s.icon className={`w-3.5 h-3.5 ${s.active ? 'text-amber-600' : ''}`} /> {s.label}
                  </div>
                ))}
              </aside>

              <div className="flex-1 min-w-0 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-slate-950 leading-tight flex items-center gap-2.5">
                      EST-0112
                      <span
                        className={`text-[11px] font-bold rounded-full px-2.5 py-0.5 border transition-colors duration-500 ${
                          status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : status === 'Sent' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {status}
                      </span>
                    </h3>
                    <p className="text-[12px] text-slate-500">24 Maple Street · Site survey done</p>
                  </div>
                  <span data-add className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 text-white text-[12px] font-semibold">
                    <Plus className="w-3.5 h-3.5" /> Add measurement
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="grid grid-cols-[1.4fr_1fr_.7fr_.9fr] gap-2 px-3 py-2 bg-slate-50 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                    <span>Item</span><span>Measurement</span><span>Rate</span><span className="text-right">Amount</span>
                  </div>
                  {lines.map((l) => (
                    <div key={l.id} className={`grid grid-cols-[1.4fr_1fr_.7fr_.9fr] gap-2 px-3 py-2.5 border-t border-slate-100 text-[12.5px] ${freshId === l.id ? 'animate-[fadeIn_.5s_ease]' : ''}`}>
                      <span className="font-semibold text-slate-900 truncate">{l.item}</span>
                      <span className="text-slate-600 tabular-nums"><Ruler className="inline w-3 h-3 mr-1 text-amber-600" />{l.qty} {l.unit}</span>
                      <span className="text-slate-600 tabular-nums">{usd(l.rate)}</span>
                      <span className="text-right font-bold text-slate-900 tabular-nums">{usd(l.qty * l.rate)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-3 border-t border-slate-200 bg-slate-50/60">
                    <span className="text-[12.5px] font-semibold text-slate-500">Estimate total</span>
                    <span className="text-[20px] font-extrabold text-slate-950 tabular-nums">{usd(total)}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span data-send className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold border transition-colors ${status === 'Draft' ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    Send for approval
                  </span>
                  <span data-start className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold border transition-all duration-500 ${started ? 'bg-emerald-500 border-emerald-500 text-white' : status === 'Approved' ? 'bg-amber-400 border-amber-400 text-slate-950' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    {started ? <><Check className="w-3.5 h-3.5" strokeWidth={3} /> Project started</> : <><Rocket className="w-3.5 h-3.5" /> Start project</>}
                  </span>
                  <span data-pdf className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold border transition-colors duration-500 ${started ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    <FileDown className="w-3.5 h-3.5" /> Generate PDF
                  </span>
                </div>
              </div>
            </div>

            {pdf !== 'off' && (
              <div className="absolute inset-0 z-20 bg-slate-900/30 flex flex-col items-center justify-center p-3 sm:p-4 animate-[fadeIn_.25s_ease]">
                <div className="w-full max-w-[400px] flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-[12px] font-semibold text-slate-800">
                    <FileDown className="w-3.5 h-3.5 text-rose-500" /> EST-0112.pdf
                  </span>
                  <span data-download className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors duration-500 ${pdf === 'ready' ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <Download className="w-3.5 h-3.5" /> Download
                  </span>
                </div>
                <div className="w-full max-w-[400px] rounded-lg bg-white shadow-float border border-slate-200 p-4 sm:p-5 min-h-[250px]">
                  {pdf === 'making' ? (
                    <div className="py-8">
                      <p className="text-[13px] font-semibold text-slate-800 mb-3 text-center">Generating PDF…</p>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <span className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-sky-400 jb-growx" style={{ width: '100%' }} />
                      </div>
                      <div className="mt-6 space-y-2">
                        {[90, 70, 80, 55].map((w, i) => <div key={i} className="h-2 rounded-full bg-slate-100" style={{ width: `${w}%` }} />)}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-[fadeIn_.5s_ease]">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[13px] font-extrabold text-slate-950 leading-tight">Your Company Name</p>
                          <p className="text-[10px] text-slate-400 leading-tight">Your address, city</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] font-bold text-slate-900 leading-tight">ESTIMATE</p>
                          <p className="text-[10px] text-slate-400 leading-tight">EST-0112</p>
                        </div>
                      </div>
                      <div className="rounded-md bg-slate-50 border border-slate-100 px-2.5 py-1.5 mb-3 text-[10.5px] text-slate-600">
                        <span className="font-semibold text-slate-800">Prepared for</span> · Customer, 24 Maple Street
                      </div>
                      <div className="grid grid-cols-[1.3fr_1fr_.6fr_.8fr] gap-1.5 pb-1 text-[9.5px] font-bold uppercase tracking-wide text-slate-400 border-b border-slate-200">
                        <span>Item</span><span>Quantity</span><span>Rate</span><span className="text-right">Amount</span>
                      </div>
                      {lines.map((l) => (
                        <div key={l.id} className="grid grid-cols-[1.3fr_1fr_.6fr_.8fr] gap-1.5 py-1.5 border-b border-slate-100 text-[10.5px] text-slate-700 tabular-nums">
                          <span className="font-semibold text-slate-900">{l.item}</span>
                          <span>{l.qty} {l.unit}</span>
                          <span>{usd(l.rate)}</span>
                          <span className="text-right font-semibold text-slate-900">{usd(l.qty * l.rate)}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2.5">
                        <span className="text-[11px] font-semibold text-slate-500">Total</span>
                        <span className="text-[16px] font-extrabold text-slate-950 tabular-nums">{usd(total)}</span>
                      </div>
                      <p className="mt-4 text-[9.5px] text-slate-400">Prices are valid for 30 days from the date of issue.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {modal.open && (
              <div className="absolute inset-0 z-20 bg-slate-900/25 flex items-center justify-center p-4 animate-[fadeIn_.25s_ease]">
                <div className="w-full max-w-[420px] rounded-2xl bg-white border border-slate-200 shadow-float p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[15px] font-bold text-slate-950">Add measurement</p>
                    <X className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">Item</p>
                  <div data-m-item className={`rounded-lg border px-3 py-2 text-[12.5px] mb-3 min-h-[36px] ${modal.field === 'item' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                    {modal.item}
                    {modal.field === 'item' && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">Quantity</p>
                      <div data-m-qty className={`rounded-lg border px-3 py-2 text-[12.5px] min-h-[36px] tabular-nums ${modal.field === 'qty' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                        {modal.qty}
                        {modal.field === 'qty' && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
                      </div>
                    </div>
                    <div className="relative">
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">Unit</p>
                      <div data-m-unit className={`flex items-center justify-between rounded-lg border px-3 py-2 text-[12.5px] min-h-[36px] ${modal.field === 'unit' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                        <span className={modal.unit ? 'text-slate-900' : 'text-slate-400'}>{modal.unit || 'Select'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      {modal.list && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-10 rounded-lg border border-slate-200 bg-white shadow-float p-1 animate-[fadeIn_.2s_ease]">
                          {UNITS.map((u) => (
                            <div key={u} data-unit={u} className="px-2.5 py-1.5 rounded-md text-[12px] text-slate-700 hover:bg-slate-50">{u}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">Rate ($)</p>
                      <div data-m-rate className={`rounded-lg border px-3 py-2 text-[12.5px] min-h-[36px] tabular-nums ${modal.field === 'rate' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                        {modal.rate}
                        {modal.field === 'rate' && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 mb-4">
                    <span className="text-[11.5px] font-semibold text-amber-800">{mq || 0} {modal.unit || 'units'} × {usd(mr)}</span>
                    <span className="text-[14px] font-extrabold text-slate-950 tabular-nums">{usd(mq * mr)}</span>
                  </div>
                  <div className="flex justify-end">
                    <span data-m-submit className="px-4 py-2 rounded-lg bg-slate-950 text-white text-[12.5px] font-semibold">Add to estimate</span>
                  </div>
                </div>
              </div>
            )}

            {toast && (
              <div className="absolute right-4 bottom-4 z-20 animate-[fadeIn_.4s_ease] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-200 shadow-float text-[12.5px] font-semibold text-emerald-800 max-w-[88%]">
                <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3.5} /></span>
                {toast}
              </div>
            )}

            <div ref={curRef} className="absolute left-0 top-0 z-30 pointer-events-none will-change-transform" style={{ transform: 'translate(-200px,-200px)' }}>
              <span ref={rippleRef} className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-sky-400/50 opacity-0" />
              <MousePointer2 className="relative w-6 h-6 text-slate-950 fill-white drop-shadow" strokeWidth={1.8} />
              <span className="absolute left-5 top-5 whitespace-nowrap rounded-full bg-amber-500 text-white text-[10.5px] font-semibold px-2 py-0.5 shadow-float">Site supervisor</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
