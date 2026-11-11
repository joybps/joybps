'use client';

import React from 'react';
import { MessageSquare, Phone, Check, Layers } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

const CHAT = [
  'Answers customer questions instantly, in natural language',
  'Lives in a widget you can place on any website or page',
  'Hands the chat to a human when your team is online',
  'Every conversation is saved, searchable and reviewable',
];

const VOICE = [
  'Answers calls on your virtual phone number automatically',
  'Speaks with the customer in a natural, real-time voice',
  'Transfers the live call to your dashboard when a human is needed',
  'Every call gets a log, a full transcript and an AI summary',
];

const Card: React.FC<{
  icon: React.ElementType;
  tag: string;
  title: string;
  text: string;
  points: string[];
  delay: number;
}> = ({ icon: Icon, tag, title, text, points, delay }) => (
  <Reveal delay={delay} className="h-full">
    <div className="beam-border h-full rounded-[28px] bg-white/90 border border-sky-100 shadow-float p-7 sm:p-9">
      <div className="flex items-center justify-between mb-6">
        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-700 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </span>
        <span className="px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-bold uppercase tracking-wide text-sky-800">
          {tag}
        </span>
      </div>
      <h3 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-950 mb-2.5">{title}</h3>
      <p className="text-[15px] text-slate-600 leading-relaxed mb-6">{text}</p>
      <ul className="space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[14.5px] text-slate-700">
            <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
              <Check className="w-3 h-3" strokeWidth={3} />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  </Reveal>
);

export const AgentsSection: React.FC = () => (
  <section id="agents" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-20 -right-40 w-[460px] h-[460px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Layers}
        pill="Two AI agent modes"
        title="One contact center. A voice agent and a chat agent."
        text="Every organisation on Iris can create as many agents as it needs, in either mode. Both are fully AI driven, and both know when to bring in your team."
      />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <Card
          icon={MessageSquare}
          tag="Chat agent"
          title="An AI chatbot on your website"
          text="Customers chat with your organisation straight from the widget, any time of day, and get real answers."
          points={CHAT}
          delay={0}
        />
        <Card
          icon={Phone}
          tag="Voice agent"
          title="An AI that picks up the phone"
          text="Give each agent a virtual phone number. When a customer calls, the AI answers and talks to them, no hold music."
          points={VOICE}
          delay={0.1}
        />
      </div>
    </div>
  </section>
);
