'use client';

import React, { useRef, useState } from 'react';
import {
  LayoutDashboard, FileText, ReceiptText, Landmark, Wallet, Boxes, Percent, BarChart3, Plus, X, MousePointer2, Check, Send, Banknote, FilePlus2,
} from 'lucide-react';
import { gsap, sleep, typeInto, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

interface Item {
  id: string;
  name: string;
  qty: number;
  rate: number;
}
type Status = 'Draft' | 'Sent' | 'Paid';

const ITEM1: Item = { id: 'i1', name: 'Website design', qty: 1, rate: 4800 };
const ITEM2: Item = { id: 'i2', name: 'Support hours', qty: 5, rate: 150 };
const CUSTOMER = 'Northwind Traders';

const SIDE = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FileText, label: 'Invoices', active: true },
  { icon: ReceiptText, label: 'Bills' },
  { icon: Landmark, label: 'Banking' },
  { icon: Wallet, label: 'Expenses' },
  { icon: Boxes, label: 'Inventory' },
  { icon: Percent, label: 'Taxes' },
  { icon: BarChart3, label: 'Reports' },
];
const PHASES = ['Choose the customer', 'Add items', 'Tax applied', 'Send the invoice', 'Get paid'];
const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

interface Modal {
  open: boolean;
  name: string;
  qty: string;
  rate: string;
  field: 'name' | 'qty' | 'rate' | null;
}
const CLOSED: Modal = { open: false, name: '', qty: '', rate: '', field: null };

export const InvoiceDemoSection: React.FC = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [customer, setCustomer] = useState('');
  const [custActive, setCustActive] = useState(false);
  const [modal, setModal] = useState<Modal>(CLOSED);
  const [tax, setTax] = useState(false);
  const [status, setStatus] = useState<Status>('Draft');
  const [phase, setPhase] = useState(0);
  const [toast, setToast] = useState('');
  const [freshId, setFreshId] = useState('');

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

  const addItem = async (it: Item, alive: () => boolean, fast = false) => {
    await moveTo($('[data-add]'), fast ? 0.7 : 0.9);
    if (!alive()) return false;
    await click();
    setModal({ ...CLOSED, open: true });
    await sleep(400);
    await moveTo($('[data-m-name]'), 0.6);
    await click();
    setModal((m) => ({ ...m, field: 'name' }));
    if (!(await typeInto((s) => setModal((m) => ({ ...m, name: s })), it.name, fast ? 22 : 36, alive))) return false;
    await moveTo($('[data-m-qty]'), 0.5);
    await click();
    setModal((m) => ({ ...m, field: 'qty' }));
    if (!(await typeInto((s) => setModal((m) => ({ ...m, qty: s })), String(it.qty), 70, alive))) return false;
    await moveTo($('[data-m-rate]'), 0.5);
    await click();
    setModal((m) => ({ ...m, field: 'rate' }));
    if (!(await typeInto((s) => setModal((m) => ({ ...m, rate: s })), String(it.rate), 70, alive))) return false;
    await sleep(450);
    await moveTo($('[data-m-submit]'), 0.5);
    await click();
    setFreshId(it.id);
    setModal(CLOSED);
    setItems((l) => [...l, it]);
    await sleep(650);
    return alive();
  };

  useVisibleLoop(frameRef, async (alive) => {
    setItems([]);
    setCustomer('');
    setCustActive(false);
    setModal(CLOSED);
    setTax(false);
    setStatus('Draft');
    setToast('');
    setFreshId('');
    setPhase(0);
    const frame = frameRef.current;
    if (!frame || !curRef.current) return;
    gsap.set(curRef.current, { x: frame.clientWidth - 80, y: frame.clientHeight - 60, scale: 1 });
    await sleep(900);
    if (!alive()) return;

    await moveTo($('[data-customer]'), 1);
    await click();
    setCustActive(true);
    if (!(await typeInto(setCustomer, CUSTOMER, 45, alive))) return;
    setCustActive(false);
    await sleep(400);

    setPhase(1);
    if (!(await addItem(ITEM1, alive))) return;
    if (!(await addItem(ITEM2, alive, true))) return;

    setPhase(2);
    await moveTo($('[data-tax]'), 0.9);
    await click();
    setTax(true);
    await sleep(1100);
    if (!alive()) return;

    setPhase(3);
    await moveTo($('[data-send]'), 0.9);
    await click();
    setStatus('Sent');
    setToast('Invoice emailed to the customer');
    await sleep(1800);
    if (!alive()) return;

    setPhase(4);
    setToast('');
    await moveTo($('[data-pay]'), 0.9);
    await click();
    setStatus('Paid');
    setToast('Payment matched in the bank feed');
    await sleep(3400);
  });

  const sub = items.reduce((n, i) => n + i.qty * i.rate, 0);
  const gst = tax ? sub * 0.18 : 0;
  const mq = Number(modal.qty) || 0;
  const mr = Number(modal.rate) || 0;

  return (
    <section id="demo" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-emerald bottom-0 -right-40 w-[440px] h-[440px]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={FilePlus2}
          pill="See it in action"
          title="From a new invoice to money in the bank."
          text="Watch an invoice come together: choose the customer, add items, let Joybooks apply the tax, send it and see it paid."
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
              <span className="ml-3 text-[11px] font-semibold text-slate-400">Joybooks · Invoices</span>
            </div>

            <div className="flex min-h-[470px]">
              <aside className="hidden md:block w-[168px] shrink-0 border-r border-sky-100 bg-white p-3 space-y-1">
                <p className="px-2 pt-1 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400">FINANCE</p>
                {SIDE.map((s) => (
                  <div key={s.label} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium ${s.active ? 'bg-sky-50 text-slate-950' : 'text-slate-500'}`}>
                    <s.icon className={`w-3.5 h-3.5 ${s.active ? 'text-sky-600' : ''}`} /> {s.label}
                  </div>
                ))}
              </aside>

              <div className="relative flex-1 min-w-0 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-slate-950 leading-tight flex items-center gap-2.5">
                      INV-2204
                      <span
                        className={`text-[11px] font-bold rounded-full px-2.5 py-0.5 border transition-colors duration-500 ${
                          status === 'Paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : status === 'Sent' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {status}
                      </span>
                    </h3>
                    <p className="text-[12px] text-slate-500">Due in 15 days</p>
                  </div>
                  <span data-add className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950 text-white text-[12px] font-semibold">
                    <Plus className="w-3.5 h-3.5" /> Add item
                  </span>
                </div>

                <div data-customer className={`rounded-xl border px-3.5 py-2.5 mb-3 transition-colors ${custActive ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                  <p className="text-[10.5px] text-slate-400">Customer</p>
                  <p className="text-[13.5px] font-semibold text-slate-900 min-h-[20px]">
                    {customer || <span className="font-normal text-slate-400">Choose a customer</span>}
                    {custActive && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="grid grid-cols-[1.5fr_1fr_.8fr] gap-2 px-3 py-2 bg-slate-50 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                    <span>Item</span><span>Qty × rate</span><span className="text-right">Amount</span>
                  </div>
                  <div className="min-h-[84px]">
                    {items.length === 0 && <p className="px-3 py-4 text-[12px] text-slate-400">No items yet</p>}
                    {items.map((it) => (
                      <div key={it.id} className={`grid grid-cols-[1.5fr_1fr_.8fr] gap-2 px-3 py-2.5 border-t border-slate-100 text-[12.5px] ${freshId === it.id ? 'animate-[fadeIn_.5s_ease]' : ''}`}>
                        <span className="font-semibold text-slate-900 truncate">{it.name}</span>
                        <span className="text-slate-600 tabular-nums">{it.qty} × {usd(it.rate)}</span>
                        <span className="text-right font-bold text-slate-900 tabular-nums">{usd(it.qty * it.rate)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between text-[12.5px] text-slate-500">
                    <span>Subtotal</span><span className="tabular-nums">{usd(sub)}</span>
                  </div>
                  <div data-tax className={`mx-3 mb-2 flex items-center justify-between rounded-lg border px-3 py-1.5 text-[12px] transition-colors duration-500 ${tax ? 'bg-violet-50 border-violet-200 text-violet-800' : 'bg-white border-dashed border-slate-300 text-slate-500'}`}>
                    <span className="font-semibold">{tax ? 'GST 18% applied' : 'Apply GST 18%'}</span>
                    <span className="font-bold tabular-nums">{tax ? usd(gst) : ''}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-3 border-t border-slate-200 bg-slate-50/60">
                    <span className="text-[12.5px] font-semibold text-slate-500">Total</span>
                    <span className="text-[20px] font-extrabold text-slate-950 tabular-nums">{usd(sub + gst)}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span data-send className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold border transition-colors duration-500 ${status === 'Draft' && tax ? 'bg-slate-950 border-slate-950 text-white' : status === 'Draft' ? 'bg-white border-slate-300 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    <Send className="w-3.5 h-3.5" /> Send invoice
                  </span>
                  <span data-pay className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold border transition-all duration-500 ${status === 'Paid' ? 'bg-emerald-500 border-emerald-500 text-white' : status === 'Sent' ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    {status === 'Paid' ? <><Check className="w-3.5 h-3.5" strokeWidth={3} /> Paid</> : <><Banknote className="w-3.5 h-3.5" /> Record payment</>}
                  </span>
                </div>
                {status === 'Paid' && (
                  <span className="absolute right-6 top-24 rotate-[-12deg] rounded-md border-[3px] border-emerald-500 text-emerald-600 text-[22px] font-extrabold tracking-widest px-3 py-0.5 bg-white/85 animate-[fadeIn_.3s_ease]">
                    PAID
                  </span>
                )}
              </div>
            </div>

            {modal.open && (
              <div className="absolute inset-0 z-20 bg-slate-900/25 flex items-center justify-center p-4 animate-[fadeIn_.25s_ease]">
                <div className="w-full max-w-[400px] rounded-2xl bg-white border border-slate-200 shadow-float p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[15px] font-bold text-slate-950">Add item</p>
                    <X className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">Item</p>
                  <div data-m-name className={`rounded-lg border px-3 py-2 text-[12.5px] mb-3 min-h-[36px] ${modal.field === 'name' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                    {modal.name}
                    {modal.field === 'name' && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">Quantity</p>
                      <div data-m-qty className={`rounded-lg border px-3 py-2 text-[12.5px] min-h-[36px] tabular-nums ${modal.field === 'qty' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                        {modal.qty}
                        {modal.field === 'qty' && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">Rate ($)</p>
                      <div data-m-rate className={`rounded-lg border px-3 py-2 text-[12.5px] min-h-[36px] tabular-nums ${modal.field === 'rate' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                        {modal.rate}
                        {modal.field === 'rate' && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-sky-50 border border-sky-100 px-3 py-2 mb-4">
                    <span className="text-[11.5px] font-semibold text-sky-800">{mq || 0} × {usd(mr)}</span>
                    <span className="text-[14px] font-extrabold text-slate-950 tabular-nums">{usd(mq * mr)}</span>
                  </div>
                  <div className="flex justify-end">
                    <span data-m-submit className="px-4 py-2 rounded-lg bg-slate-950 text-white text-[12.5px] font-semibold">Add to invoice</span>
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
              <span className="absolute left-5 top-5 whitespace-nowrap rounded-full bg-sky-600 text-white text-[10.5px] font-semibold px-2 py-0.5 shadow-float">Accountant</span>
            </div>
          </div>
        </Reveal>
        <p className="mt-4 text-center text-[11px] font-semibold text-slate-400">Sample data</p>
      </div>
    </section>
  );
};
