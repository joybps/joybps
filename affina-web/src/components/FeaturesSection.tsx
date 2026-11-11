'use client';

import React from 'react';
import {
  Sparkles,
  Users,
  ShieldCheck,
  FolderTree,
  Infinity as InfinityIcon,
  LayoutGrid,
  Building,
  Bot,
  PhoneCall,
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

const FEATURES = [
  { icon: Users, title: 'Team management', text: 'Add your whole team and organize people into groups, with no limit on users.' },
  { icon: ShieldCheck, title: 'Role-based access control', text: 'Create custom roles and decide exactly what each person can see and do.' },
  { icon: FolderTree, title: 'Data groups', text: 'Group data by branch, region or franchise so every team sees only its own.' },
  { icon: InfinityIcon, title: 'No limits on lead sync', text: 'Affina adds no lead sync limits of its own. Only Meta’s API limits apply.' },
  { icon: LayoutGrid, title: 'Unified platform', text: 'Leads, customers, calls and automation, all together in a single platform.' },
  { icon: Building, title: 'Multi-tenant', text: 'Run multiple companies and workspaces from one enterprise-ready platform.' },
  { icon: Bot, title: 'AI Copilot', text: 'Ask questions by chat or by voice and get answers and next actions.' },
  { icon: PhoneCall, title: 'Built-in phone calls', text: 'Call customers and track conversations without leaving the CRM.' },
];

interface FeaturesSectionProps {
  showHeading?: boolean;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ showHeading = true }) => (
  <section id="features" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-indigo top-8 -right-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[400px] h-[400px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {showHeading && (
        <SectionHeading
          icon={Sparkles}
          pill="Features"
          title="Everything You Need to Run Your Customer Relationships"
          text="A complete CRM with the controls, channels and AI your team needs to grow faster."
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((f, idx) => {
          const Icon = f.icon;
          return (
            <Reveal
              key={f.title}
              delay={(idx % 4) * 0.06}
              className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xs hover:border-sky-300 hover:shadow-card transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-[16px] font-bold text-slate-950 mb-1.5">{f.title}</h3>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">{f.text}</p>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
