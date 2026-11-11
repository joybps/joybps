'use client';

import React from 'react';
import { FileSignature, FileText, Banknote, ReceiptText, ScanLine, Percent, BarChart3, ShieldCheck, Route } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

const STEPS = [
  { icon: FileSignature, title: 'Send a quote', text: 'Price the work, send the quote and get it accepted by the customer.', chips: ['Quote sent', 'Accepted'] },
  { icon: FileText, title: 'Turn it into an invoice', text: 'One click converts the accepted quote into a tax-ready invoice.', chips: ['INV-2204', 'GST applied'] },
  { icon: Banknote, title: 'Get paid', text: 'Customers pay online, and reminders chase anything that runs late.', chips: ['Paid online', 'Auto reminders'] },
  { icon: ReceiptText, title: 'Record bills and expenses', text: 'Capture supplier bills and expenses, then schedule them for payment.', chips: ['Bill captured', 'Due in 7 days'] },
  { icon: ScanLine, title: 'Reconcile the bank', text: 'Match each bank line to an invoice or bill and close the month.', chips: ['48 matched', '0 unmatched'] },
  { icon: Percent, title: 'File your taxes', text: 'Tax is already worked out on every line, so returns are ready when you are.', chips: ['GST summary', 'Ready to file'] },
  { icon: BarChart3, title: 'See the reports', text: 'Profit and loss, cash flow, receivables and payables, always current.', chips: ['Net profit $72K', 'Cash $249K'] },
  { icon: ShieldCheck, title: 'Keep control', text: 'Roles and approvals decide who can create, approve and pay.', chips: ['Approvals', 'Audit trail'] },
];

/** A vertical timeline of the money journey, from quote to report. Reveals as you scroll, then stays still. */
export const FinanceTimeline: React.FC = () => (
  <section id="flow" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-10 -right-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-emerald bottom-0 -left-40 w-[420px] h-[420px]" />
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Route}
        pill="From quote to report"
        title="One flow for all of your money."
        text="Every step hands over to the next, so nothing is retyped and your books are right the moment the work is done."
      />
      <ol className="relative">
        <span aria-hidden="true" className="absolute left-[19px] sm:left-1/2 sm:-translate-x-px top-2 bottom-2 w-0.5 bg-gradient-to-b from-sky-200 via-emerald-300 to-sky-200" />
        {STEPS.map((s, i) => {
          const right = i % 2 === 1;
          return (
            <li key={s.title} className="relative pl-14 sm:pl-0 pb-8 last:pb-0 sm:grid sm:grid-cols-2 sm:gap-12">
              <span className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-1 w-10 h-10 rounded-full bg-white border-2 border-sky-300 text-sky-700 shadow-card flex items-center justify-center z-10">
                <s.icon className="w-4.5 h-4.5" />
              </span>
              <Reveal x={right ? 24 : -24} yOffset={0} className={right ? 'sm:col-start-2' : 'sm:col-start-1 sm:text-right'}>
                <div className="rounded-2xl bg-white border border-sky-100 shadow-card p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600 mb-1">Step {i + 1}</p>
                  <h3 className="text-[16.5px] font-bold text-slate-950 mb-1">{s.title}</h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-3">{s.text}</p>
                  <div className={`flex flex-wrap gap-2 ${right ? '' : 'sm:justify-end'}`}>
                    {s.chips.map((c) => (
                      <span key={c} className="rounded-full bg-sky-50 border border-sky-100 text-sky-800 text-[11.5px] font-semibold px-2.5 py-1">{c}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);
