import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { StaggerGroup } from './MotionPrimitives';
import { PROJECTS } from '../data/portfolio';

/** Portfolio grid: each project is a card with a browser-frame preview, the category and a link to the live site. */
export const PortfolioShowcase: React.FC = () => (
  <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" y={24} stagger={0.07}>
    {PROJECTS.map((p) => (
      <article key={p.name} className="group relative rounded-3xl bg-white border border-sky-100 shadow-card p-4 flex flex-col transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-sky-300 hover:shadow-float">
        <div aria-hidden="true" className={`relative h-[178px] rounded-2xl border border-sky-100 bg-gradient-to-br ${p.tone} overflow-hidden`}>
          <div className="flex items-center gap-1.5 px-3 h-7 border-b border-sky-100/80 bg-white/70">
            <span className="w-2 h-2 rounded-full bg-rose-300" /><span className="w-2 h-2 rounded-full bg-amber-300" /><span className="w-2 h-2 rounded-full bg-emerald-300" />
            <span className="ml-2 flex-1 truncate rounded-md bg-white border border-sky-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">{p.host}</span>
          </div>
          <div className="h-[calc(100%-1.75rem)] flex flex-col items-center justify-center gap-2.5 px-6 transition-transform duration-700 group-hover:scale-[1.04]">
            {p.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logo} alt="" loading="lazy" decoding="async" className="max-h-12 max-w-[60%] object-contain brightness-0 opacity-80" />
            ) : (
              <span className="text-[22px] font-bold tracking-tight text-slate-900">{p.name}</span>
            )}
            <span className="h-1.5 w-24 rounded-full bg-slate-900/10" />
            <span className="h-1.5 w-16 rounded-full bg-slate-900/[0.07]" />
            <span className="mt-1 rounded-md bg-slate-950 px-3 py-1 text-[10px] font-semibold text-white">Visit</span>
          </div>
        </div>
        <div className="px-1.5 pt-4 pb-1 flex flex-col flex-1">
          <p className="text-[12px] font-semibold text-sky-700 mb-1">{p.category}</p>
          <h3 className="text-[18px] font-bold text-slate-950 leading-tight">
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-400 focus-visible:after:rounded-3xl">
              {p.name}<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </h3>
          <p className="mt-2 text-[14px] text-slate-600 leading-relaxed flex-1">{p.summary}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <ul className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => <li key={t} className="rounded-full bg-sky-50 border border-sky-100 px-2.5 py-1 text-[11.5px] font-semibold text-sky-800">{t}</li>)}
            </ul>
            <span aria-hidden="true" className="inline-flex items-center gap-1 text-[13px] font-semibold text-sky-700 group-hover:text-sky-900">Live site <ArrowUpRight className="w-4 h-4" /></span>
          </div>
        </div>
      </article>
    ))}
  </StaggerGroup>
);
