'use client';

import React from 'react';
import {
  Sparkles, Layers3, MessageSquare, Phone, Code2, UserCheck, History, FileText, Bot, Plug, Radio, ShieldCheck,
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { StaggerGroup } from './MotionPrimitives';
import { SpotlightCard } from './FuturisticPrimitives';

const FEATURES = [
  { icon: Layers3, title: 'Multi-tenant platform', text: 'Every organisation gets its own private workspace, agents, team and history.' },
  { icon: Bot, title: 'Multiple agents per organisation', text: 'Create as many voice and chat agents as you need, each with its own role.' },
  { icon: MessageSquare, title: 'AI chat agent', text: 'An AI chatbot that answers customers instantly, in natural language.' },
  { icon: Phone, title: 'AI voice agent', text: 'Answers phone calls automatically on a virtual number and speaks with the caller.' },
  { icon: Code2, title: 'Embeddable chat widget', text: 'Place the widget on any website or app with a single snippet.' },
  { icon: UserCheck, title: 'Transfer to a human', text: 'Customers can ask for a person. Chats and live calls are handed to your team.' },
  { icon: Radio, title: 'Online-aware handover', text: 'Chats are transferred to a human only when someone on your team is online.' },
  { icon: History, title: 'Full conversation history', text: 'Monitor every chat and call, and see which agent handled each customer.' },
  { icon: FileText, title: 'Call logs and transcripts', text: 'Every call is logged with a complete transcript.' },
  { icon: Sparkles, title: 'AI summaries', text: 'A short AI summary of each call and conversation, ready the moment it ends.' },
  { icon: Plug, title: 'Integrations', text: 'Connect your CRM, helpdesk, calendar, telephony, webhooks and your own systems.' },
  { icon: ShieldCheck, title: 'Tenant isolation', text: 'People only see the conversations that belong to their own organisation.' },
];

interface FeaturesSectionProps {
  showHeading?: boolean;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ showHeading = true }) => (
  <section id="features" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {showHeading && (
        <SectionHeading
          icon={Sparkles}
          pill="Features"
          title="Everything a modern contact center needs."
          text="From the first hello to the final summary, Iris covers the whole conversation, with your team one click away."
        />
      )}

      <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" y={22} stagger={0.05}>
        {FEATURES.map((f) => (
          <SpotlightCard key={f.title} className="rounded-3xl bg-white border border-sky-100 shadow-card p-6 hover:border-sky-300 transition-colors">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <f.icon className="w-5 h-5" />
            </span>
            <h3 className="text-[16.5px] font-bold text-slate-950 mb-1.5">{f.title}</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed">{f.text}</p>
          </SpotlightCard>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
