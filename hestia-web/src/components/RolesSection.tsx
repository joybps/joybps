'use client';

import React, { useRef, useState } from 'react';
import { ShieldCheck, Crown, UserCog, Users, BadgeCheck, UserRound, Check, Plus, KeyRound } from 'lucide-react';
import { sleep, typeInto, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

const ROLES = [
  { icon: Crown, name: 'Director', note: 'Full view of the organisation', tone: 'bg-indigo-100 text-indigo-700' },
  { icon: UserCog, name: 'Manager', note: 'Manages teams and approvals', tone: 'bg-sky-100 text-sky-700' },
  { icon: Users, name: 'Lead', note: 'Guides a team day to day', tone: 'bg-violet-100 text-violet-700' },
  { icon: BadgeCheck, name: 'HR', note: 'People, payroll and hiring', tone: 'bg-emerald-100 text-emerald-700' },
  { icon: UserRound, name: 'Employee', note: 'Own records and requests', tone: 'bg-amber-100 text-amber-700' },
];

const MODULES = ['Employees', 'Attendance', 'Payroll', 'Reports', 'Audit logs'];
const ACTIONS = ['View', 'Edit'] as const;
// permissions switched on while the demo runs (module:action)
const GRANTS = ['Payroll:View', 'Reports:View', 'Audit logs:View', 'Employees:View', 'Payroll:Edit'];
const NAME = 'Payroll Auditor';

export const RolesSection: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [on, setOn] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useVisibleLoop(boxRef, async (alive) => {
    setName('');
    setOn([]);
    setSaved(false);
    await sleep(900);
    if (!(await typeInto(setName, NAME, 55, alive))) return;
    await sleep(500);
    for (const g of GRANTS) {
      if (!alive()) return;
      setOn((a) => [...a, g]);
      await sleep(520);
    }
    await sleep(500);
    setSaved(true);
    await sleep(4200);
  });

  return (
    <section id="roles" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[420px] h-[420px]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={ShieldCheck}
          pill="Roles and access"
          title="The right access for every person."
          text="Hestia starts with five ready-made roles. Need something different? Create your own role and choose exactly what it can do. Access is enforced with RBAC."
        />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            {ROLES.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.07} x={-24}>
                <div className="flex items-center gap-3.5 rounded-2xl bg-white border border-sky-100 shadow-card p-3.5">
                  <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${r.tone}`}>
                    <r.icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-950 leading-tight">{r.name}</h3>
                    <p className="text-[13px] text-slate-500 leading-snug">{r.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className={`flex items-center gap-3.5 rounded-2xl border p-3.5 transition-all duration-700 ${saved ? 'bg-sky-50 border-sky-300 shadow-card opacity-100' : 'border-dashed border-sky-200 opacity-60'}`}>
              <span className="w-10 h-10 shrink-0 rounded-xl bg-slate-950 text-white flex items-center justify-center">{saved ? <KeyRound className="w-5 h-5" /> : <Plus className="w-5 h-5" />}</span>
              <div>
                <h3 className="text-[15px] font-bold text-slate-950 leading-tight">{saved ? NAME : 'Your own role'}</h3>
                <p className="text-[13px] text-slate-500 leading-snug">{saved ? 'Custom role, ready to assign' : 'Create as many as you need'}</p>
              </div>
            </div>
          </div>

          <Reveal className="lg:col-span-7" x={30}>
            <div ref={boxRef} className="rounded-[26px] bg-white border border-sky-200 shadow-float overflow-hidden">
              <div className="px-5 py-3.5 border-b border-sky-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-900 flex items-center gap-2"><KeyRound className="w-4 h-4 text-sky-600" /> Create role</span>
                <span className="text-[11px] font-semibold text-slate-400">Sample</span>
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold text-slate-500 mb-1">Role name</p>
                <div className="rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] min-h-[42px] mb-5">
                  {name}
                  {!saved && <span className="anim-blink inline-block w-px h-4 ml-0.5 -mb-0.5 bg-slate-900" />}
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="grid grid-cols-[1fr_72px_72px] bg-slate-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <span>Module</span>
                    {ACTIONS.map((a) => <span key={a} className="text-center">{a}</span>)}
                  </div>
                  {MODULES.map((m) => (
                    <div key={m} className="grid grid-cols-[1fr_72px_72px] items-center px-3 py-2.5 border-t border-slate-100 text-[13.5px] text-slate-800">
                      <span>{m}</span>
                      {ACTIONS.map((a) => {
                        const active = on.includes(`${m}:${a}`);
                        return (
                          <span key={a} className="flex justify-center">
                            <span className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${active ? 'bg-sky-500' : 'bg-slate-200'}`}>
                              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${active ? 'translate-x-4' : ''}`} />
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between min-h-[40px]">
                  <span className={`inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-700 transition-opacity duration-500 ${saved ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3.5} /></span>
                    Role created and assigned to Kavya
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-slate-950 text-white text-[12.5px] font-semibold">Save role</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
