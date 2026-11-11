'use client';

import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  Plus, ListTodo, Clock, Eye, CircleCheck, LayoutDashboard, CalendarCheck, FileText, KanbanSquare, Users, Wallet, TrendingUp, X,
  MousePointer2, ChevronDown, Check,
} from 'lucide-react';
import { gsap, Flip, sleep, typeInto, useVisibleLoop } from '../animation';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './MotionPrimitives';

type ColId = 'todo' | 'progress' | 'review' | 'done';
type Prio = 'high' | 'medium' | 'low';
interface Task {
  id: string;
  title: string;
  who: string;
  dept: string;
  prio: Prio;
  due: string;
}

const COLS: { id: ColId; label: string; icon: React.ElementType }[] = [
  { id: 'todo', label: 'To Do', icon: ListTodo },
  { id: 'progress', label: 'In Progress', icon: Clock },
  { id: 'review', label: 'Review', icon: Eye },
  { id: 'done', label: 'Completed', icon: CircleCheck },
];

const INITIAL: Record<ColId, Task[]> = {
  todo: [
    { id: 't1', title: 'Update onboarding checklist', who: 'Ishita', dept: 'Operations', prio: 'medium', due: 'Nov 14' },
    { id: 't2', title: 'Review IT access list', who: 'Aditya', dept: 'IT', prio: 'high', due: 'Nov 15' },
  ],
  progress: [{ id: 't3', title: 'Refresh careers page', who: 'Selva', dept: 'Marketing', prio: 'medium', due: 'Nov 18' }],
  review: [],
  done: [],
};

const NEW_TASK: Task = { id: 'new', title: 'Prepare Q4 onboarding plan', who: 'Nandini', dept: 'HR', prio: 'high', due: 'Nov 20' };

const PRIO: Record<Prio, string> = {
  high: 'bg-rose-50 border-rose-200 text-rose-700',
  medium: 'bg-sky-50 border-sky-200 text-sky-700',
  low: 'bg-slate-50 border-slate-200 text-slate-600',
};

const SIDE = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: CalendarCheck, label: 'Attendance' },
  { icon: FileText, label: 'Leave Requests' },
  { icon: KanbanSquare, label: 'Tasks', active: true },
  { icon: TrendingUp, label: 'Performance' },
  { icon: Users, label: 'Employees' },
  { icon: Wallet, label: 'Payroll' },
];

const PHASES = ['Create a task', 'Assign and prioritise', 'Move it across the board', 'Mark it complete'];

interface Modal {
  open: boolean;
  title: string;
  assignee: string;
  prio: string;
  field: 'title' | 'assignee' | 'prio' | null;
}
const CLOSED: Modal = { open: false, title: '', assignee: '', prio: '', field: null };

const TaskCard: React.FC<{ t: Task; fresh?: boolean }> = ({ t, fresh }) => (
  <div
    data-flip-id={t.id}
    className={`rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm ${fresh ? 'animate-[fadeIn_.5s_ease]' : ''}`}
  >
    <div className="flex items-start gap-2">
      <span className="w-6 h-6 shrink-0 rounded-full bg-sky-100 text-sky-700 text-[10.5px] font-bold flex items-center justify-center">{t.who[0]}</span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-slate-900 leading-snug">{t.title}</p>
        <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5">{t.who} · {t.dept}</p>
      </div>
    </div>
    <div className="mt-2 flex items-center justify-between">
      <span className={`px-1.5 py-0.5 rounded-full border text-[10px] font-semibold ${PRIO[t.prio]}`}>{t.prio}</span>
      <span className="text-[10px] text-slate-400">{t.due}</span>
    </div>
  </div>
);

export const TaskDemoSection: React.FC = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const [cols, setCols] = useState<Record<ColId, Task[]>>(INITIAL);
  const [modal, setModal] = useState<Modal>(CLOSED);
  const [phase, setPhase] = useState(0);
  const [toast, setToast] = useState('');
  const [fresh, setFresh] = useState(false);

  const $ = (sel: string) => frameRef.current?.querySelector(sel) ?? null;

  const targetOf = (el: Element, ox = 0.5, oy = 0.5) => {
    const f = frameRef.current!.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const z = f.width / (frameRef.current!.clientWidth || 1) || 1;
    return { x: (r.left - f.left + r.width * ox) / z, y: (r.top - f.top + r.height * oy) / z };
  };
  const moveTo = (el: Element | null, dur = 0.9, ox = 0.5, oy = 0.5) =>
    new Promise<void>((res) => {
      if (!el || !curRef.current) return res();
      gsap.to(curRef.current, { ...targetOf(el, ox, oy), duration: dur, ease: 'power2.inOut', onComplete: res });
    });
  const click = () =>
    new Promise<void>((res) => {
      const tl = gsap.timeline({ onComplete: res });
      tl.to(curRef.current, { scale: 0.8, duration: 0.1 }).to(curRef.current, { scale: 1, duration: 0.18 });
      if (rippleRef.current) tl.fromTo(rippleRef.current, { scale: 0.2, autoAlpha: 0.55 }, { scale: 1.8, autoAlpha: 0, duration: 0.5 }, 0);
    });

  /** Moves the new card to another column (animated with Flip) while the cursor rides along with it. */
  const advance = async (to: ColId) => {
    const frame = frameRef.current;
    if (!frame || !curRef.current) return;
    const state = Flip.getState(frame.querySelectorAll('[data-flip-id]'));
    flushSync(() =>
      setCols((c) => {
        const next: Record<ColId, Task[]> = { todo: [...c.todo], progress: [...c.progress], review: [...c.review], done: [...c.done] };
        let task: Task | undefined;
        (Object.keys(next) as ColId[]).forEach((k) => {
          const i = next[k].findIndex((t) => t.id === 'new');
          if (i >= 0) task = next[k].splice(i, 1)[0];
        });
        if (task) next[to].push(task);
        return next;
      }),
    );
    const card = $('[data-flip-id="new"]');
    const end = card ? targetOf(card, 0.3, 0.4) : null;
    Flip.from(state, { duration: 0.8, ease: 'power2.inOut' });
    if (end) gsap.to(curRef.current, { ...end, duration: 0.8, ease: 'power2.inOut' });
    await sleep(900);
  };

  useVisibleLoop(frameRef, async (alive) => {
    // reset
    setCols(INITIAL);
    setModal(CLOSED);
    setToast('');
    setFresh(false);
    setPhase(0);
    const frame = frameRef.current;
    if (!frame || !curRef.current) return;
    gsap.set(curRef.current, { x: frame.clientWidth - 80, y: frame.clientHeight - 60, scale: 1 });
    await sleep(900);
    if (!alive()) return;

    // 1. open the create dialog
    await moveTo($('[data-create]'), 1.1);
    if (!alive()) return;
    await click();
    setModal({ ...CLOSED, open: true });
    await sleep(500);

    // 2. fill it in
    setPhase(1);
    await moveTo($('[data-m-title]'), 0.8);
    await click();
    setModal((m) => ({ ...m, field: 'title' }));
    if (!(await typeInto((s) => setModal((m) => ({ ...m, title: s })), NEW_TASK.title, 38, alive))) return;
    await sleep(250);
    await moveTo($('[data-m-assignee]'), 0.7);
    await click();
    setModal((m) => ({ ...m, field: 'assignee', assignee: 'Nandini · HR' }));
    await sleep(350);
    await moveTo($('[data-m-prio]'), 0.6);
    await click();
    setModal((m) => ({ ...m, field: 'prio', prio: 'high' }));
    await sleep(450);
    if (!alive()) return;
    await moveTo($('[data-m-submit]'), 0.7);
    await click();
    setFresh(true);
    setModal(CLOSED);
    setCols((c) => ({ ...c, todo: [...c.todo, NEW_TASK] }));
    await sleep(900);
    if (!alive()) return;

    // 3. move it across the board
    setPhase(2);
    await moveTo($('[data-flip-id="new"]'), 0.9, 0.3, 0.4);
    await click();
    await advance('progress');
    if (!alive()) return;
    await sleep(700);
    await click();
    await advance('review');
    if (!alive()) return;
    await sleep(700);
    await click();
    setPhase(3);
    await advance('done');
    setToast('Task completed');
    await sleep(3200);
  });

  const total = Object.values(cols).reduce((n, c) => n + c.length, 0);
  const active = total - cols.done.length;

  return (
    <section id="demo" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[460px] h-[460px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[440px] h-[440px]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={MousePointer2}
          pill="See it in action"
          title="Watch a task go from idea to done."
          text="Here is how a manager creates a task, assigns it and moves it across the board in Hestia. The same simple flow applies to leave, hiring and more."
        />

        {/* progress of the story */}
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
            {/* window bar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-sky-100 bg-slate-50/80">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 text-[11px] font-semibold text-slate-400">Hestia · Tasks</span>
            </div>

            <div className="flex min-h-[470px]">
              {/* sidebar */}
              <aside className="hidden md:block w-[180px] shrink-0 border-r border-sky-100 bg-white p-3 space-y-1">
                <p className="px-2 pt-1 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400">MY WORK</p>
                {SIDE.map((s) => (
                  <div key={s.label} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium ${s.active ? 'bg-slate-100 text-slate-950' : 'text-slate-500'}`}>
                    <s.icon className="w-3.5 h-3.5" /> {s.label}
                  </div>
                ))}
              </aside>

              {/* board */}
              <div className="flex-1 min-w-0 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-slate-950 leading-tight">Task Management</h3>
                    <p className="text-[12px] text-slate-500">Organise and track tasks with a Kanban board</p>
                  </div>
                  <span data-create className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-950 text-white text-[12px] font-semibold">
                    <Plus className="w-3.5 h-3.5" /> Create Task
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  {[
                    ['Tasks in scope', total],
                    ['Active', active],
                    ['Completed', cols.done.length],
                  ].map(([l, n]) => (
                    <div key={l as string} className="rounded-xl border border-slate-200 px-3 py-2">
                      <p className="text-[10.5px] text-slate-500">{l}</p>
                      <p className="text-[18px] font-bold text-slate-950 leading-tight tabular-nums">{n}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {COLS.map((c) => (
                    <div key={c.id} data-col={c.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-2 min-h-[190px]">
                      <div className="flex items-center justify-between px-1 pb-2">
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-800"><c.icon className="w-3.5 h-3.5 text-slate-500" /> {c.label}</span>
                        <span className="text-[10.5px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-full px-1.5">{cols[c.id].length}</span>
                      </div>
                      <div className="space-y-2">
                        {cols[c.id].map((t) => (
                          <TaskCard key={t.id} t={t} fresh={fresh && t.id === 'new'} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* create dialog */}
            {modal.open && (
              <div className="absolute inset-0 z-20 bg-slate-900/25 flex items-center justify-center p-4 animate-[fadeIn_.25s_ease]">
                <div className="w-full max-w-[400px] rounded-2xl bg-white border border-slate-200 shadow-float p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[15px] font-bold text-slate-950">Create Task</p>
                    <X className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">Title</p>
                  <div data-m-title className={`rounded-lg border px-3 py-2 text-[12.5px] mb-3 min-h-[36px] ${modal.field === 'title' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                    {modal.title}
                    {modal.field === 'title' && <span className="anim-blink inline-block w-px h-3.5 ml-0.5 -mb-0.5 bg-slate-900" />}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">Assign to</p>
                      <div data-m-assignee className={`flex items-center justify-between rounded-lg border px-3 py-2 text-[12.5px] min-h-[36px] ${modal.field === 'assignee' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                        <span className={modal.assignee ? 'text-slate-900' : 'text-slate-400'}>{modal.assignee || 'Select employee'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">Priority</p>
                      <div data-m-prio className={`flex items-center justify-between rounded-lg border px-3 py-2 text-[12.5px] min-h-[36px] ${modal.field === 'prio' ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'}`}>
                        <span className={modal.prio ? 'text-slate-900 capitalize' : 'text-slate-400'}>{modal.prio || 'Select'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span data-m-submit className="px-4 py-2 rounded-lg bg-slate-950 text-white text-[12.5px] font-semibold">Create</span>
                  </div>
                </div>
              </div>
            )}

            {/* toast */}
            {toast && (
              <div className="absolute right-4 bottom-4 z-20 animate-[fadeIn_.4s_ease] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-200 shadow-float text-[12.5px] font-semibold text-emerald-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3.5} /></span>
                {toast}
              </div>
            )}

            {/* the cursor */}
            <div ref={curRef} className="absolute left-0 top-0 z-30 pointer-events-none will-change-transform" style={{ transform: 'translate(-200px,-200px)' }}>
              <span ref={rippleRef} className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-sky-400/50 opacity-0" />
              <MousePointer2 className="relative w-6 h-6 text-slate-950 fill-white drop-shadow" strokeWidth={1.8} />
              <span className="absolute left-5 top-5 whitespace-nowrap rounded-full bg-indigo-600 text-white text-[10.5px] font-semibold px-2 py-0.5 shadow-float">Meera · Manager</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
