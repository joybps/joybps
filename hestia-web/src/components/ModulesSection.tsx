'use client';

import React from 'react';
import {
  CalendarCheck, Clock, FileText, Users, FolderOpen, Mail, Boxes, KanbanSquare, TrendingUp, Wallet, Megaphone,
  BarChart3, ScrollText, UserPlus, Sparkles, LayoutGrid,
} from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { StaggerGroup } from './MotionPrimitives';
import { SpotlightCard } from './FuturisticPrimitives';

const TONES = [
  'from-sky-50 to-sky-100 text-sky-700',
  'from-indigo-50 to-indigo-100 text-indigo-700',
  'from-violet-50 to-violet-100 text-violet-700',
  'from-emerald-50 to-emerald-100 text-emerald-700',
  'from-amber-50 to-amber-100 text-amber-700',
];

export const MODULES: { icon: React.ElementType; title: string; text: string }[] = [
  { icon: CalendarCheck, title: 'Attendance', text: 'Shift-based check-in, team records and reviewed corrections.' },
  { icon: Clock, title: 'Shifts', text: 'Plan and assign shifts so everyone knows when they work.' },
  { icon: FileText, title: 'Leave requests', text: 'Request, approve and track leave with clear balances.' },
  { icon: Users, title: 'Employees', text: 'One directory with profiles, departments, roles and status.' },
  { icon: FolderOpen, title: 'Documents', text: 'Keep company and employee documents in one safe place.' },
  { icon: Mail, title: 'Letters', text: 'Generate offer, experience and other letters in a few clicks.' },
  { icon: Boxes, title: 'Assets', text: 'Track laptops and equipment, and who holds them.' },
  { icon: KanbanSquare, title: 'Projects and tasks', text: 'Kanban boards to assign, track and finish work.' },
  { icon: TrendingUp, title: 'Performance', text: 'Reviews and progress so growth is visible and fair.' },
  { icon: Wallet, title: 'Payroll', text: 'Compensation, payslips and a personal “My Pay” view.' },
  { icon: Megaphone, title: 'Announcements', text: 'Reach the right people, by role and department.' },
  { icon: UserPlus, title: 'Candidates', text: 'Follow every candidate from application to offer.' },
  { icon: BarChart3, title: 'Reports and analytics', text: 'See attendance, leave and headcount trends at a glance.' },
  { icon: ScrollText, title: 'Audit logs', text: 'A trail of who did what, and when.' },
  { icon: Sparkles, title: 'AI chat assistant', text: 'Ask questions in plain language and get quick answers.' },
];

interface Props {
  showHeading?: boolean;
}

export const ModulesSection: React.FC<Props> = ({ showHeading = true }) => (
  <section id="modules" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[420px] h-[420px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {showHeading && (
        <SectionHeading
          icon={LayoutGrid}
          pill="Everything in one platform"
          title="Every part of people management, connected."
          text="Stop juggling spreadsheets, chats and separate tools. Hestia keeps every HR workflow in one workspace."
        />
      )}
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" y={22} stagger={0.04}>
        {MODULES.map((m, i) => (
          <SpotlightCard key={m.title} className="h-full rounded-2xl bg-white border border-sky-100 shadow-card p-5 hover:border-sky-300 transition-colors">
            <span className={`w-11 h-11 rounded-xl bg-gradient-to-br border border-white/60 flex items-center justify-center mb-4 ${TONES[i % TONES.length]}`}>
              <m.icon className="w-5 h-5" />
            </span>
            <h3 className="text-[15.5px] font-bold text-slate-950 mb-1">{m.title}</h3>
            <p className="text-[13px] text-slate-600 leading-relaxed">{m.text}</p>
          </SpotlightCard>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
