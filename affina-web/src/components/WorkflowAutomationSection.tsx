'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Workflow,
  Zap,
  GitBranch,
  UserCheck,
  Sparkles,
  Bell,
  Play,
  ArrowDown,
  PenLine,
  Blocks,
  Bot,
} from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '../animation';
import { SectionHeading } from './SectionHeading';
import { StaggerGroup } from './MotionPrimitives';

type NodeKind = 'trigger' | 'condition' | 'action' | 'ai';
type Mode = 'scroll' | 'play' | 'static';

interface FlowNode {
  id: string;
  kind: NodeKind;
  title: string;
  sub: string;
  icon: React.ElementType;
}

interface Layout {
  compact: boolean;
  W: number;
  H: number;
  width: number;
  height: number;
  pos: Record<string, [number, number]>;
}

/** Desktop / tablet canvas. */
const FULL: Layout = {
  compact: false,
  W: 190,
  H: 84,
  width: 980,
  height: 360,
  pos: { n1: [20, 138], n2: [270, 138], n3: [520, 36], n4: [520, 240], n5: [770, 138] },
};

/** Narrower canvas with larger type, scaled down to fit phone screens without horizontal scrolling. */
const COMPACT: Layout = {
  compact: true,
  W: 170,
  H: 112,
  width: 752,
  height: 300,
  pos: { n1: [0, 94], n2: [194, 94], n3: [388, 6], n4: [388, 182], n5: [582, 94] },
};

const NODES: FlowNode[] = [
  { id: 'n1', kind: 'trigger', title: 'New lead captured', sub: 'Meta Ads, website or call', icon: Zap },
  { id: 'n2', kind: 'condition', title: 'Check lead details', sub: 'Source, location or score', icon: GitBranch },
  { id: 'n3', kind: 'action', title: 'Assign to sales rep', sub: 'Route to the right owner', icon: UserCheck },
  { id: 'n4', kind: 'ai', title: 'AI follow-up message', sub: 'Drafted and sent by AI', icon: Sparkles },
  { id: 'n5', kind: 'action', title: 'Notify the team', sub: 'Create task and alert', icon: Bell },
];

const EDGES: [string, string][] = [
  ['n1', 'n2'],
  ['n2', 'n3'],
  ['n2', 'n4'],
  ['n3', 'n5'],
  ['n4', 'n5'],
];

const KIND_STYLE: Record<NodeKind, { label: string; chip: string; icon: string }> = {
  trigger: { label: 'Trigger', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'bg-emerald-50 text-emerald-600' },
  condition: { label: 'Condition', chip: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'bg-amber-50 text-amber-600' },
  action: { label: 'Action', chip: 'bg-sky-50 text-sky-700 border-sky-200', icon: 'bg-sky-50 text-sky-600' },
  ai: { label: 'AI step', chip: 'bg-slate-950 text-white border-slate-950', icon: 'bg-slate-950 text-sky-300' },
};

const PALETTE = [
  { title: 'Triggers', items: ['New lead', 'Form submitted', 'Stage changed'] },
  { title: 'Conditions', items: ['Lead source', 'Location', 'Lead score'] },
  { title: 'Actions', items: ['Assign owner', 'Send WhatsApp', 'Create task'] },
  { title: 'AI steps', items: ['Draft a reply', 'Summarise a call', 'Suggest next step'] },
];

const HOW_IT_WORKS = [
  { icon: PenLine, title: 'Describe your process', text: 'Decide what should happen when a lead arrives, a deal moves or a customer replies.' },
  { icon: Blocks, title: 'Build the workflow', text: 'Connect triggers, conditions and actions on a visual canvas. No code required.' },
  { icon: Bot, title: 'Let AI do the work', text: 'Affina runs the workflow in the background and AI handles the repetitive steps.' },
];

const edgePath = (layout: Layout, fromId: string, toId: string) => {
  const [fx, fy] = layout.pos[fromId];
  const [tx, ty] = layout.pos[toId];
  const x1 = fx + layout.W;
  const y1 = fy + layout.H / 2;
  const x2 = tx;
  const y2 = ty + layout.H / 2;
  const dx = (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
};

const STICKY_TOP = 112; // css px the card sticks below the top of the viewport
const SCROLL_DIST = 1300; // css px of scrolling that runs the workflow

const NODE_OFF ={ opacity: 0.5, scale: 0.94, borderColor: '#e2e8f0', boxShadow: '0 1px 2px rgba(15,23,42,0.05)' };
const NODE_ON = {
  opacity: 1,
  scale: 1,
  borderColor: '#38bdf8',
  boxShadow: '0 0 0 4px #e0f2fe, 0 14px 30px -10px rgba(14,165,233,0.4)',
  duration: 0.5,
  ease: 'back.out(1.4)',
};

export const WorkflowAutomationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [mode, setMode] = useState<Mode>('play');

  // Fit the canvas to its container: on small screens it is zoomed out instead of scrolling sideways.
  const viewportRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(FULL.width);
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setBoxWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const layout = boxWidth < 640 ? COMPACT : FULL;
  const scale = Math.min(1, boxWidth / layout.width);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [layout.compact, scale]);

  useGSAP(
    () => {
      const root = sectionRef.current;
      const card = cardRef.current;
      if (!root || !card) return;
      const q = gsap.utils.selector(root);

      const build = () => {
        const tl = gsap.timeline({ paused: true });
        const light = (id: string, at: number) => tl.fromTo(q(`[data-node="${id}"]`), NODE_OFF, NODE_ON, at);
        const draw = (a: string, b: string, at: number) =>
          tl.fromTo(
            q(`[data-edge="${a}-${b}"]`),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' },
            at,
          );

        light('n1', 0);
        draw('n1', 'n2', 0.45);
        light('n2', 0.95);
        draw('n2', 'n3', 1.4);
        draw('n2', 'n4', 1.4);
        light('n3', 1.9);
        light('n4', 1.9);
        draw('n3', 'n5', 2.4);
        draw('n4', 'n5', 2.4);
        light('n5', 2.9);
        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          full: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          compact: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { full, compact } = ctx.conditions as { full: boolean; compact: boolean };
          const tl = build();
          tlRef.current = tl;

          if (full) {
            // Pinned: scrolling drives the workflow forward.
            setMode('scroll');
            // Sticky (not ScrollTrigger pin): pin uses position:fixed with measured px, which breaks under html zoom.
            const wrap = wrapRef.current;
            const zf = () => (wrap ? wrap.getBoundingClientRect().width / (wrap.offsetWidth || 1) || 1 : 1);
            ScrollTrigger.create({
              trigger: wrap ?? card,
              start: () => `top top+=${STICKY_TOP * zf()}`,
              end: () => `+=${SCROLL_DIST * zf()}`,
              scrub: 0.5,
              invalidateOnRefresh: true,
              animation: tl,
            });
          } else if (compact) {
            // Phones / tablets: no pinning, play once when it appears.
            setMode('play');
            ScrollTrigger.create({ trigger: card, start: 'top 75%', once: true, onEnter: () => tl.play() });
          } else {
            // Reduced motion: show the finished workflow.
            setMode('static');
            tl.progress(1);
          }

          return () => {
            tlRef.current = null;
          };
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="automation" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-clip">
      <div aria-hidden="true" className="aurora aurora-sky top-8 -left-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[400px] h-[400px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Workflow}
          pill="AI Workflow Automation"
          title="Build Workflows Around Your Business. AI Does the Rest."
          text="Design the workflow your business needs, step by step, on a simple visual canvas. Once it is live, Affina and AI carry out the work for you automatically."
        />

        {/* Step palette */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {PALETTE.map((group) => (
            <div key={group.title} className="rounded-2xl border border-sky-100 bg-slate-50/60 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">{group.title}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((i) => (
                  <span key={i} className="px-2 py-1 rounded-md bg-white border border-slate-200 text-[11.5px] font-medium text-slate-700">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div ref={wrapRef}>
        <div ref={cardRef} className="rounded-3xl border border-sky-200/90 shadow-float overflow-hidden bg-white" style={mode === 'scroll' ? { position: 'sticky', top: STICKY_TOP } : undefined}>
          <div className="px-5 py-3.5 border-b border-sky-100 bg-slate-50/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="text-[13px] font-bold text-slate-900 ml-2 truncate">New lead workflow</span>
            </div>

            {mode === 'play' && (
              <button
                type="button"
                onClick={() => tlRef.current?.restart()}
                className="px-4 py-2 rounded-lg bg-slate-950 text-white text-[13px] font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Replay workflow
              </button>
            )}
            {mode === 'scroll' && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-sky-700 shrink-0">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                Keep scrolling to run it
              </span>
            )}
          </div>

          <div ref={viewportRef} className="overflow-hidden bg-dot-grid-light" style={{ height: layout.height * scale }}>
            <div
              className="relative"
              style={{ width: layout.width, height: layout.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
            >
              <svg className="absolute inset-0 pointer-events-none" width={layout.width} height={layout.height} aria-hidden="true">
                {EDGES.map(([a, b]) => (
                  <path
                    key={`base-${a}-${b}`}
                    d={edgePath(layout, a, b)}
                    fill="none"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    stroke="#cbd5e1"
                  />
                ))}
                {EDGES.map(([a, b]) => (
                  <path
                    key={`flow-${a}-${b}`}
                    data-edge={`${a}-${b}`}
                    d={edgePath(layout, a, b)}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={0}
                    fill="none"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    stroke="#0ea5e9"
                  />
                ))}
              </svg>

              {NODES.map((n) => {
                const s = KIND_STYLE[n.kind];
                const Icon = n.icon;
                const [x, y] = layout.pos[n.id];
                return (
                  <div
                    key={n.id}
                    data-node={n.id}
                    style={{ left: x, top: y, width: layout.W, height: layout.H }}
                    className="absolute rounded-2xl bg-white border border-slate-200 p-3"
                  >
                    {layout.compact ? (
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex items-center gap-2">
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.icon}`}>
                            <Icon className="w-5 h-5" />
                          </span>
                          <span className={`px-1.5 rounded border text-[11px] font-bold uppercase tracking-wide ${s.chip}`}>
                            {s.label}
                          </span>
                        </div>
                        <p className="text-[18px] font-bold text-slate-950 leading-tight">{n.title}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.icon}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <span className={`inline-block px-1.5 rounded border text-[9.5px] font-bold uppercase tracking-wide mb-0.5 ${s.chip}`}>
                              {s.label}
                            </span>
                            <p className="text-[12.5px] font-bold text-slate-950 leading-tight truncate">{n.title}</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 truncate">{n.sub}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {mode === 'scroll' && <div aria-hidden="true" style={{ height: SCROLL_DIST }} />}
        </div>
        <p className="text-[12.5px] text-slate-400 mt-2.5 text-center">Example workflow. Build your own to fit your process.</p>

        {/* How it works */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10" y={28} stagger={0.12}>
          {HOW_IT_WORKS.map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="rounded-3xl border border-sky-100 bg-slate-50/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[12px] font-mono font-bold text-sky-700">0{i + 1}</span>
                </div>
                <h3 className="text-[17px] font-bold text-slate-950 mb-1.5">{h.title}</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">{h.text}</p>
              </div>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
};
