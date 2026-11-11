'use client';

import React from 'react';
import {
  Plug, Users, LifeBuoy, CalendarCheck, Webhook, Code2, PhoneCall, Mail, MessagesSquare, Database, BarChart3, Workflow,
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Marquee } from './MotionPrimitives';

const ITEMS: { icon: React.ElementType; name: string; text: string }[] = [
  { icon: Users, name: 'CRM', text: 'Push customers and conversations into your CRM.' },
  { icon: LifeBuoy, name: 'Helpdesk', text: 'Create and update tickets from any chat or call.' },
  { icon: CalendarCheck, name: 'Calendar and booking', text: 'Let agents check availability and book slots.' },
  { icon: Webhook, name: 'Webhooks', text: 'Send events to your systems as they happen.' },
  { icon: Code2, name: 'REST API', text: 'Build Iris into your own products and flows.' },
  { icon: PhoneCall, name: 'Telephony', text: 'Virtual numbers and call routing for voice agents.' },
  { icon: Mail, name: 'Email', text: 'Send transcripts and summaries to your inbox.' },
  { icon: MessagesSquare, name: 'Messaging', text: 'Notify your team in the tools they already use.' },
  { icon: Database, name: 'Databases', text: 'Give agents live answers from your own data.' },
  { icon: BarChart3, name: 'Analytics', text: 'Feed conversation data into your reports.' },
  { icon: Workflow, name: 'Automation tools', text: 'Trigger workflows after every conversation.' },
];

export const IntegrationsSection: React.FC = () => (
  <section id="integrations" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Plug}
        pill="Integrations"
        title="Connected to the systems you already run."
        text="Iris plugs into your CRM, helpdesk, calendar, phone system and data, so agents can look things up and every conversation reaches the right place."
      />
    </div>

    <Marquee duration={60}>
      {ITEMS.map((it) => (
        <div key={it.name} className="w-[270px] sm:w-[300px] shrink-0 rounded-2xl bg-white border border-sky-100 shadow-card p-5">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-3">
            <it.icon className="w-5 h-5" />
          </span>
          <h3 className="text-[15.5px] font-bold text-slate-950 mb-1">{it.name}</h3>
          <p className="text-[13.5px] text-slate-600 leading-snug">{it.text}</p>
        </div>
      ))}
    </Marquee>
  </section>
);
