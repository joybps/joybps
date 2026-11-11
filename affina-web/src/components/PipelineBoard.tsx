'use client';

import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Plus, X, MousePointer2 } from 'lucide-react';
import { gsap, Flip, useGSAP, MOTION_OK } from '../animation';

interface Stage {
  id: number;
  name: string;
  dot: string;
}

interface Lead {
  id: string;
  name: string;
  source: string;
  value: number;
  stage: number;
}

const DOTS = ['bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 'bg-amber-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500'];
const WON_STAGE = 6;

const DEFAULT_STAGES: Stage[] = ['New', 'Contacted', 'Prospect', 'Negotiation', 'Contract', 'Closed Won', 'Disqualified'].map(
  (name, i) => ({ id: i + 1, name, dot: DOTS[i % DOTS.length] }),
);

// Sample leads, for illustration only.
const INITIAL_LEADS: Lead[] = [
  { id: 'l1', name: 'Priya Sharma', source: 'Meta Ads', value: 4200, stage: 1 },
  { id: 'l2', name: 'Arjun Mehta', source: 'Website', value: 2800, stage: 1 },
  { id: 'l3', name: 'Kavya Reddy', source: 'WhatsApp', value: 6500, stage: 2 },
  { id: 'l7', name: 'Ananya Das', source: 'Website', value: 1900, stage: 2 },
  { id: 'l4', name: 'Rohan Iyer', source: 'Google Ads', value: 3900, stage: 3 },
  { id: 'l8', name: 'Karthik Subbu', source: 'Call', value: 7200, stage: 3 },
  { id: 'l5', name: 'Meera Nair', source: 'Call', value: 8800, stage: 4 },
  { id: 'l6', name: 'Vikram Rao', source: 'Meta Ads', value: 5600, stage: 5 },
];

// The automatic demo: [lead, destination stage].
const MOVES: { lead: string; to: number }[] = [
  { lead: 'l1', to: 2 },
  { lead: 'l3', to: 3 },
  { lead: 'l4', to: 4 },
  { lead: 'l5', to: 5 },
  { lead: 'l6', to: WON_STAGE },
  { lead: 'l2', to: 7 },
  { lead: 'l7', to: 3 },
  { lead: 'l8', to: 4 },
];

const SOURCE_STYLE: Record<string, string> = {
  'Meta Ads': 'bg-blue-50 text-blue-700',
  Website: 'bg-emerald-50 text-emerald-700',
  WhatsApp: 'bg-green-50 text-green-700',
  'Google Ads': 'bg-amber-50 text-amber-700',
  Call: 'bg-violet-50 text-violet-700',
};

const AVATARS = ['bg-sky-100 text-sky-700', 'bg-indigo-100 text-indigo-700', 'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700'];

const money = (n: number) => `$${n.toLocaleString('en-US')}`;
const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const tweenP = (target: gsap.TweenTarget, vars: gsap.TweenVars) =>
  new Promise<void>((resolve) => {
    gsap.to(target, { ...vars, onComplete: () => resolve() });
  });

export const PipelineBoard: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [stages, setStages] = useState<Stage[]>(DEFAULT_STAGES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [nextId, setNextId] = useState(DEFAULT_STAGES.length + 1);
  const stagesRef = useRef(stages);
  stagesRef.current = stages;

  // A lead whose stage was removed falls back to the first remaining stage.
  const stageIds = new Set(stages.map((s) => s.id));
  const stageOf = (lead: Lead) => (stageIds.has(lead.stage) ? lead.stage : stages[0]?.id);

  const total = leads.reduce((sum, l) => sum + l.value, 0);
  const won = leads.filter((l) => stageOf(l) === WON_STAGE).reduce((sum, l) => sum + l.value, 0);

  // Entrance
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scrollTrigger = { trigger: rootRef.current, start: 'top 85%', once: true };
        gsap.from('[data-col]', { autoAlpha: 0, y: 26, duration: 0.7, stagger: 0.07, clearProps: 'transform', scrollTrigger });
        gsap.from('[data-lead]', { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.04, delay: 0.35, clearProps: 'transform', scrollTrigger });
      });
    },
    { scope: rootRef },
  );

  // Automatic drag-and-drop demo. Runs while the board is on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let token = 0;
    let running = false;

    const run = async (alive: () => boolean) => {
      const cursor = cursorRef.current;
      const scroller = scrollerRef.current;
      if (!cursor || !scroller) return;

      flushSync(() => setLeads(INITIAL_LEADS));
      gsap.set(cursor, { autoAlpha: 0 });
      let cursorPlaced = false;
      await sleep(1600);

      for (const mv of MOVES) {
        if (!alive()) return;
        if (!stagesRef.current.some((s) => s.id === mv.to)) continue;

        const card = root.querySelector<HTMLElement>(`[data-lead="${mv.lead}"]`);
        const list = root.querySelector<HTMLElement>(`[data-list="${mv.to}"]`);
        const fromList = card?.closest<HTMLElement>('[data-list]');
        if (!card || !list || !fromList || fromList === list) continue;

        // On narrow screens the stages scroll sideways: centre the view on the move.
        if (scroller.scrollWidth > scroller.clientWidth + 4) {
          const a = fromList.getBoundingClientRect();
          const b = list.getBoundingClientRect();
          const s = scroller.getBoundingClientRect();
          const target = scroller.scrollLeft + ((a.left + b.right) / 2 - s.left) - s.width / 2;
          await tweenP(scroller, { scrollLeft: Math.max(0, target), duration: 0.6, ease: 'power2.inOut' });
          if (!alive()) return;
        }

        const origin = root.getBoundingClientRect();
        const z = origin.width / (root.clientWidth || 1) || 1;
        const rel = (el: Element) => {
          const r = el.getBoundingClientRect();
          return { x: (r.left - origin.left) / z, y: (r.top - origin.top) / z, w: r.width / z, h: r.height / z };
        };

        const c = rel(card);
        const cx = c.x + c.w * 0.55;
        const cy = c.y + c.h * 0.5;
        if (!cursorPlaced) {
          gsap.set(cursor, { x: cx + 80, y: cy + 100, autoAlpha: 0 });
          cursorPlaced = true;
        }

        // 1. Cursor travels to the card
        await tweenP(cursor, { x: cx, y: cy, autoAlpha: 1, duration: 0.9, ease: 'power2.inOut' });
        if (!alive()) return;

        // 2. Grab: the card lifts
        gsap.to(cursor, { scale: 0.82, duration: 0.12 });
        await tweenP(card, {
          scale: 1.06,
          rotation: 2.5,
          zIndex: 30,
          boxShadow: '0 22px 34px -12px rgba(15,23,42,0.4)',
          duration: 0.25,
        });
        if (!alive()) return;

        // 3. Drag to the end of the destination column
        const inList = list.querySelectorAll('[data-lead]');
        const last = inList[inList.length - 1];
        const l = rel(list);
        const slotY = last ? rel(last).y + rel(last).h + 10 : l.y;
        const dx = l.x - c.x;
        const dy = slotY - c.y;
        await Promise.all([
          tweenP(card, { x: dx, y: dy, duration: 1.15, ease: 'power2.inOut' }),
          tweenP(cursor, { x: cx + dx, y: cy + dy, duration: 1.15, ease: 'power2.inOut' }),
        ]);
        if (!alive()) return;

        // 4. Drop: settle, then commit the move; the other cards slide into place.
        gsap.to(cursor, { scale: 1, duration: 0.15 });
        await tweenP(card, { scale: 1, rotation: 0, boxShadow: '0 1px 2px rgba(15,23,42,0.06)', duration: 0.2 });

        const state = Flip.getState(root.querySelectorAll('[data-lead]'));
        flushSync(() => setLeads((ls) => ls.map((x) => (x.id === mv.lead ? { ...x, stage: mv.to } : x))));
        Flip.from(state, { duration: 0.55, ease: 'power2.out' });

        const landed = root.querySelector(`[data-lead="${mv.lead}"]`);
        if (landed) {
          const glow = mv.to === WON_STAGE ? '16,185,129' : '14,165,233';
          gsap.fromTo(
            landed,
            { boxShadow: `0 0 0 0 rgba(${glow},0.55)` },
            { boxShadow: `0 0 0 12px rgba(${glow},0)`, duration: 1, ease: 'power2.out' },
          );
        }
        await sleep(900);
      }

      // Loop: cursor leaves, leads fly back to the start.
      await tweenP(cursor, { autoAlpha: 0, duration: 0.4 });
      await sleep(1500);
      if (!alive()) return;
      const state = Flip.getState(root.querySelectorAll('[data-lead]'));
      flushSync(() => setLeads(INITIAL_LEADS));
      Flip.from(state, { duration: 0.9, ease: 'power2.inOut', stagger: 0.04 });
      await sleep(1800);
    };

    const start = () => {
      if (running) return;
      running = true;
      const mine = ++token;
      const alive = () => token === mine;
      (async () => {
        while (alive()) await run(alive);
      })();
    };

    const stop = () => {
      running = false;
      token++;
      const cards = root.querySelectorAll('[data-lead]');
      gsap.killTweensOf([cursorRef.current, scrollerRef.current, ...Array.from(cards)]);
      gsap.set(cards, { clearProps: 'transform,boxShadow,zIndex' });
      if (cursorRef.current) gsap.set(cursorRef.current, { autoAlpha: 0 });
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.4 });
    io.observe(root);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  const addStage = () => {
    const id = nextId;
    flushSync(() => {
      setStages((s) => [...s, { id, name: `New stage ${id - DEFAULT_STAGES.length}`, dot: DOTS[s.length % DOTS.length] }]);
      setNextId((n) => n + 1);
    });
    gsap.from(`[data-stage-id="${id}"]`, { scale: 0.85, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.8)' });
    scrollerRef.current?.scrollTo({ left: scrollerRef.current.scrollWidth, behavior: 'smooth' });
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
          <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-sky-100 font-semibold text-slate-700">
            {leads.length} leads
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-sky-100 font-semibold text-slate-700 tabular-nums">
            Pipeline {money(total)}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 font-semibold text-emerald-700 tabular-nums">
            Won {money(won)}
          </span>
        </div>
        <button
          type="button"
          onClick={addStage}
          className="px-3 py-1.5 rounded-lg border border-sky-200 text-sky-700 hover:bg-sky-50 text-[12.5px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add stage
        </button>
      </div>

      <div ref={scrollerRef} className="overflow-x-auto pb-3 -mx-1 px-1">
        <div className="flex gap-3 min-w-max lg:min-w-0 lg:w-full">
          {stages.map((stage) => {
            const stageLeads = leads.filter((l) => stageOf(l) === stage.id);
            return (
              <div
                key={stage.id}
                data-col
                data-stage-id={stage.id}
                className="group w-[160px] shrink-0 lg:w-auto lg:shrink lg:flex-1 lg:min-w-0 bg-slate-50/70 rounded-2xl border border-sky-100 p-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${stage.dot}`} />
                    <span className="text-[12.5px] font-bold text-slate-900 truncate">{stage.name}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">{stageLeads.length}</span>
                    {stages.length > 2 && (
                      <button
                        type="button"
                        aria-label={`Remove ${stage.name}`}
                        onClick={() => setStages((s) => s.filter((x) => x.id !== stage.id))}
                        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-slate-400 hover:text-slate-800 cursor-pointer transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </span>
                </div>

                <div data-list={stage.id} className="space-y-2.5 min-h-[250px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      data-lead={lead.id}
                      data-flip-id={lead.id}
                      className="bg-white rounded-xl border border-sky-100/90 p-2.5 shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            AVATARS[(Number(lead.id.slice(1)) || 0) % AVATARS.length]
                          }`}
                        >
                          {initials(lead.name)}
                        </span>
                        <span className="text-[12px] font-bold text-slate-900 truncate">{lead.name}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SOURCE_STYLE[lead.source] ?? 'bg-slate-100 text-slate-600'}`}>
                          {lead.source}
                        </span>
                        <span className="text-[12px] font-mono font-bold tabular-nums text-slate-950">{money(lead.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo cursor that "drags" the cards */}
      <div ref={cursorRef} aria-hidden="true" className="absolute left-0 top-0 z-40 pointer-events-none opacity-0 invisible">
        <MousePointer2 className="w-6 h-6 text-slate-950 fill-white drop-shadow-md" />
      </div>

      <p className="text-[13px] text-slate-500 mt-4">
        Sample leads. Watch them move through the pipeline, or add and remove stages to fit your own sales process.
      </p>
    </div>
  );
};
