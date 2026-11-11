'use client';

import React from 'react';
import { Check, Minus, X, Scale } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal, StaggerGroup } from './MotionPrimitives';

type Cell = 'yes' | 'partial' | 'limited' | 'per-user' | 'unified' | 'varies';

// Source: affina.work/pricing
const ROWS: { label: string; affina: Cell; typical: Cell }[] = [
  { label: 'Multi Meta Business Account Management', affina: 'yes', typical: 'partial' },
  { label: 'Multiple Facebook Pages', affina: 'yes', typical: 'partial' },
  { label: 'Multiple Instagram Accounts', affina: 'yes', typical: 'partial' },
  { label: 'Meta Lead Synchronization', affina: 'yes', typical: 'yes' },
  { label: 'CRM-Imposed Lead Sync Limits', affina: 'yes', typical: 'limited' },
  { label: 'Multiple Lead Sources', affina: 'yes', typical: 'yes' },
  { label: 'Smart Lead Distribution', affina: 'yes', typical: 'yes' },
  { label: 'Dynamic Role-Based Access Control (RBAC)', affina: 'yes', typical: 'partial' },
  { label: 'Data Groups (Branch / Region / Franchise)', affina: 'yes', typical: 'partial' },
  { label: 'AI Copilot', affina: 'yes', typical: 'partial' },
  { label: 'Natural Language Business Queries', affina: 'yes', typical: 'partial' },
  { label: 'Custom Modules', affina: 'yes', typical: 'partial' },
  { label: 'Custom Fields', affina: 'yes', typical: 'yes' },
  { label: 'Workflow Automation', affina: 'yes', typical: 'yes' },
  { label: 'Built-in Telephony', affina: 'yes', typical: 'partial' },
  { label: 'Call Tracking', affina: 'yes', typical: 'partial' },
  { label: 'Web Application', affina: 'yes', typical: 'yes' },
  { label: 'Mobile Application', affina: 'yes', typical: 'yes' },
  { label: 'Native Desktop Application', affina: 'yes', typical: 'partial' },
  { label: 'Cross Platform Access', affina: 'yes', typical: 'partial' },
  { label: 'Multi-Company / Multi-Workspace', affina: 'yes', typical: 'partial' },
  { label: 'Enterprise APIs', affina: 'yes', typical: 'yes' },
  { label: 'Custom Integrations', affina: 'yes', typical: 'yes' },
  { label: 'User Licensing', affina: 'yes', typical: 'per-user' },
  { label: 'Platform Architecture', affina: 'unified', typical: 'varies' },
];

const REQUIREMENTS: { label: string; typical: boolean; note: string }[] = [
  { label: 'CRM Platform', typical: true, note: '' },
  { label: 'Meta Lead Synchronization', typical: false, note: 'May require additional connectors' },
  { label: 'AI Features', typical: false, note: 'Availability varies by subscription' },
  { label: 'Telephony', typical: false, note: 'May require separate services' },
  { label: 'Workflow Automation', typical: true, note: '' },
  { label: 'Reporting', typical: false, note: 'Advanced reporting may depend on edition' },
  { label: 'Desktop Application', typical: false, note: 'Platform-dependent' },
  { label: 'Multiple Meta Business Management', typical: false, note: 'Platform-dependent' },
  { label: 'Data Grouping', typical: false, note: 'May require customization' },
  { label: 'Custom Roles & Permissions', typical: false, note: 'Varying flexibility' },
  { label: 'One Unified Platform', typical: false, note: 'May involve multiple products' },
];

const BENEFITS = [
  { title: 'No Hidden Costs', text: 'What you see is what you pay. No per-seat add-ons for AI or telephony.' },
  { title: 'Reduced Integration Complexity', text: 'No juggling multiple vendors, contracts, or maintenance overhead.' },
  { title: 'Faster Time to Value', text: 'Deploy once, get every capability from day one.' },
];

const Tick = () => (
  <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 items-center justify-center">
    <Check className="w-3 h-3 text-emerald-600" />
  </span>
);

const CellView: React.FC<{ value: Cell }> = ({ value }) => {
  switch (value) {
    case 'yes':
      return <Tick />;
    case 'limited':
      return (
        <span className="inline-flex w-5 h-5 rounded-full bg-amber-100 items-center justify-center" title="Limited">
          <Minus className="w-3 h-3 text-amber-600" />
        </span>
      );
    case 'partial':
      return <span className="text-[12px] text-slate-500">Platform-dependent</span>;
    case 'per-user':
      return <span className="text-[12px] text-slate-500">Per user</span>;
    case 'unified':
      return <span className="text-[12px] font-semibold text-slate-900">Unified</span>;
    default:
      return <span className="text-[12px] text-slate-500">Varies</span>;
  }
};

export const ComparisonSection: React.FC = () => (
  <>
    {/* Capability comparison */}
    <section className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-indigo top-8 -right-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -left-40 w-[400px] h-[400px]" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Scale}
          pill="Comparison"
          title="Affina vs Typical CRM Platforms"
          text="See how Affina’s native capabilities compare with what typical CRM platforms need add-ons, custom builds or higher-tier plans to deliver."
        />

        <Reveal className="rounded-3xl border border-sky-200/90 shadow-card overflow-hidden bg-white">
          <StaggerGroup className="overflow-x-auto" selector="tbody tr" x={-18} y={0} stagger={0.035}>
            <table className="w-full text-left min-w-[560px]">
              <thead>
                <tr className="bg-slate-50 border-b border-sky-100 text-[12px] uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-5 py-3.5 font-bold">Capability</th>
                  <th scope="col" className="px-5 py-3.5 font-bold text-center text-sky-800">Affina CRM</th>
                  <th scope="col" className="px-5 py-3.5 font-bold text-center">Typical CRM Platforms</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100 last:border-0 hover:bg-sky-50/30 transition-colors">
                    <th scope="row" className="px-5 py-3 text-[13.5px] font-medium text-slate-800">{row.label}</th>
                    <td className="px-5 py-3 text-center bg-sky-50/40"><CellView value={row.affina} /></td>
                    <td className="px-5 py-3 text-center"><CellView value={row.typical} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </StaggerGroup>
        </Reveal>
      </div>
    </section>

    {/* Total cost of ownership */}
    <section className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-8 -left-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[400px] h-[400px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          pill="Total Cost of Ownership"
          title="One Platform. One Price. No Surprises."
          text="Typical CRM ecosystems need separate investments in telephony, AI, lead sync connectors, desktop apps and advanced reporting. Affina includes everything in one unified subscription."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            {BENEFITS.map((b) => (
              <Reveal key={b.title} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-xs">
                <div className="flex items-start gap-3">
                  <Tick />
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-950">{b.title}</h3>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed mt-0.5">{b.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="lg:col-span-7 rounded-3xl border border-sky-200/90 shadow-card overflow-hidden bg-white">
            <StaggerGroup className="overflow-x-auto" selector="tbody tr" x={-18} y={0} stagger={0.05}>
              <table className="w-full text-left min-w-[520px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-sky-100 text-[12px] uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-5 py-3.5 font-bold">Business requirement</th>
                    <th scope="col" className="px-5 py-3.5 font-bold text-center text-sky-800">Affina CRM</th>
                    <th scope="col" className="px-5 py-3.5 font-bold">Typical CRM ecosystem</th>
                  </tr>
                </thead>
                <tbody>
                  {REQUIREMENTS.map((r) => (
                    <tr key={r.label} className="border-b border-slate-100 last:border-0">
                      <th scope="row" className="px-5 py-3 text-[13.5px] font-medium text-slate-800">{r.label}</th>
                      <td className="px-5 py-3 text-center bg-sky-50/40"><Tick /></td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2 text-[12.5px] text-slate-500">
                          {r.typical ? (
                            <Tick />
                          ) : (
                            <span className="inline-flex w-5 h-5 rounded-full bg-red-100 items-center justify-center shrink-0">
                              <X className="w-3 h-3 text-red-500" />
                            </span>
                          )}
                          {r.note}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </StaggerGroup>
          </Reveal>
        </div>
      </div>
    </section>
  </>
);
