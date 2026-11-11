'use client';

import React from 'react';
import {
  FileText, Landmark, ScanLine, Boxes, Percent, BarChart3, Workflow, Repeat, FileSignature, ShoppingCart, Globe2, Users, LayoutGrid, ReceiptText, Bell,
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Marquee } from './MotionPrimitives';

const ROW1 = [
  { icon: FileText, title: 'Invoicing', text: 'Professional, tax-ready invoices you can send in seconds and track until paid.', tone: 'bg-sky-100 text-sky-700' },
  { icon: FileSignature, title: 'Quotes and estimates', text: 'Send a quote, get it accepted and turn it into an invoice in one click.', tone: 'bg-violet-100 text-violet-700' },
  { icon: Landmark, title: 'Banking', text: 'Connect your accounts and see every transaction in one place.', tone: 'bg-emerald-100 text-emerald-700' },
  { icon: ScanLine, title: 'Bank reconciliation', text: 'Match bank lines to invoices and bills, and close the month with confidence.', tone: 'bg-sky-100 text-sky-700' },
  { icon: ReceiptText, title: 'Bills and expenses', text: 'Capture supplier bills and expenses, and pay them on time.', tone: 'bg-amber-100 text-amber-700' },
  { icon: Repeat, title: 'Recurring invoices', text: 'Bill retainers and subscriptions automatically on your schedule.', tone: 'bg-indigo-100 text-indigo-700' },
];
const ROW2 = [
  { icon: Boxes, title: 'Inventory', text: 'Track stock levels and cost as you buy and sell.', tone: 'bg-emerald-100 text-emerald-700' },
  { icon: Percent, title: 'Taxes', text: 'GST worked out on every line, with returns ready to file.', tone: 'bg-violet-100 text-violet-700' },
  { icon: BarChart3, title: 'Reports', text: 'Profit and loss, cash flow, receivables and payables, always current.', tone: 'bg-sky-100 text-sky-700' },
  { icon: Workflow, title: 'Approvals and roles', text: 'Control who can create, approve and pay, with a clear audit trail.', tone: 'bg-amber-100 text-amber-700' },
  { icon: Globe2, title: 'Multi-currency', text: 'Invoice and pay in other currencies with live exchange rates.', tone: 'bg-sky-100 text-sky-700' },
  { icon: ShoppingCart, title: 'Purchase orders', text: 'Raise orders, receive goods and turn them into bills.', tone: 'bg-indigo-100 text-indigo-700' },
  { icon: Bell, title: 'Payment reminders', text: 'Chase overdue invoices automatically and politely.', tone: 'bg-amber-100 text-amber-700' },
  { icon: Users, title: 'Customer portal', text: 'Let customers view, approve and pay their invoices online.', tone: 'bg-emerald-100 text-emerald-700' },
];

const Card: React.FC<(typeof ROW1)[number]> = ({ icon: Icon, title, text, tone }) => (
  <article className="w-[270px] sm:w-[300px] shrink-0 rounded-3xl bg-white border border-sky-100 shadow-card p-5 hover:border-sky-300 transition-colors">
    <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tone}`}>
      <Icon className="w-5 h-5" />
    </span>
    <h3 className="text-[16.5px] font-bold text-slate-950 mb-1">{title}</h3>
    <p className="text-[13.5px] text-slate-600 leading-relaxed">{text}</p>
  </article>
);

/** Two slow rows of feature cards that scroll sideways. */
export const FeatureCardsScroller: React.FC = () => (
  <section id="features" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-emerald bottom-0 -right-40 w-[420px] h-[420px]" />
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={LayoutGrid}
          pill="Everything for your books"
          title="One finance suite for the whole business."
          text="From the first quote to the final report, Joybooks keeps sales, purchases, banking and taxes in one connected place."
        />
      </div>
      <div className="space-y-4">
        <Marquee duration={60}>{ROW1.map((c) => <Card key={c.title} {...c} />)}</Marquee>
        <Marquee duration={70} reverse>{ROW2.map((c) => <Card key={c.title} {...c} />)}</Marquee>
      </div>
    </div>
  </section>
);
