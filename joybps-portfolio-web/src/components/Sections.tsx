import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Brain, Mic, FileSearch, Workflow, Star, Quote, Layers, Boxes, Sparkles, Route, MessageSquareQuote, HelpCircle, Check } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { AINetworkBg } from './AINetworkBg';
import { Reveal, StaggerGroup, Marquee, CountUp } from './MotionPrimitives';
import { SpotlightCard } from './FuturisticPrimitives';
import { Icon } from './Icon';
import { PROJECTS } from '../data/portfolio';
import { SITE } from '../lib/site';
import { SERVICES } from '../data/services';
import { TESTIMONIALS } from '../data/testimonials';

export { ServicesShowcase as ServicesGrid } from './ServicesShowcase';

/* ---------------- Stats ---------------- */
export const StatsBand: React.FC = () => (
  <section aria-label="Joybps in numbers" className="relative py-14 bg-tech-grid border-b border-sky-100">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {[
        [PROJECTS.length, '+', 'Projects showcased'],
        [20, '+', 'Happy clients'],
        [SERVICES.length, '', 'Services offered'],
        [24, '/7', 'Support available'],
      ].map(([n, suf, l]) => (
        <div key={l as string}>
          <p className="text-[38px] sm:text-[46px] font-bold text-slate-950 tracking-tight font-mono tabular-nums leading-none"><CountUp to={n as number} suffix={suf as string} /></p>
          <p className="mt-1.5 text-[13px] font-medium text-slate-500">{l}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ---------------- Testimonials ---------------- */
const Stars: React.FC<{ n: number }> = ({ n }) => (
  <span className="inline-flex gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`w-3.5 h-3.5 ${i <= n ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} aria-hidden="true" />)}
  </span>
);
export const TestimonialCard: React.FC<{ t: (typeof TESTIMONIALS)[number]; fixed?: boolean }> = ({ t, fixed }) => (
  <figure className={`${fixed ? 'w-[300px] sm:w-[340px] shrink-0' : ''} rounded-3xl bg-white border border-sky-100 shadow-card p-6 flex flex-col`}>
    <Quote className="w-6 h-6 text-sky-300 mb-3" aria-hidden="true" />
    <Stars n={t.rating} />
    <blockquote className="mt-3 text-[14.5px] text-slate-700 leading-relaxed flex-1">{t.quote}</blockquote>
    <figcaption className="mt-4 flex items-center gap-3">
      <span aria-hidden="true" className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-200 to-indigo-200 text-sky-900 text-[14px] font-bold flex items-center justify-center">{t.name[0]}</span>
      <span>
        <span className="block text-[14px] font-bold text-slate-950">{t.name}</span>
        <a href={t.url} target="_blank" rel="noopener noreferrer" className="block text-[12px] text-sky-700 hover:text-sky-900 hover:underline">{t.company}<span className="sr-only"> (opens in a new tab)</span></a>
      </span>
    </figcaption>
  </figure>
);
export const TestimonialsMarquee: React.FC = () => (
  <div className="space-y-4">
    <Marquee duration={70}>{TESTIMONIALS.map((t) => <TestimonialCard key={t.company} t={t} fixed />)}</Marquee>
  </div>
);
export const TestimonialsGrid: React.FC = () => (
  <StaggerGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" y={22} stagger={0.06}>
    {TESTIMONIALS.map((t) => <TestimonialCard key={t.company} t={t} />)}
  </StaggerGroup>
);
export const TestimonialsSection: React.FC<{ marquee?: boolean }> = ({ marquee = true }) => (
  <section id="reviews" className="relative py-20 sm:py-28 bg-dot-grid-light border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[420px] h-[420px]" />
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading icon={<MessageSquareQuote />} pill="Client reviews" title="What our clients say." text="Businesses we have built websites and systems for, in their own words." />
      </div>
      {marquee ? <TestimonialsMarquee /> : <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><TestimonialsGrid /></div>}
          </div>
  </section>
);

/* ---------------- CTA ---------------- */
export const CTABand: React.FC<{ title?: string; text?: string }> = ({ title = 'Let us build something intelligent.', text = 'Tell us about your idea, your team or your problem. We will show you what is possible and what it takes.' }) => (
  <section id="contact" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <AINetworkBg />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_34%_40%_at_50%_50%,rgba(255,255,255,0.9),rgba(255,255,255,0.45)_62%,transparent_100%)]" />
    <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
      <h2 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950 leading-tight mb-4">{title}</h2>
      <p className="text-[16px] sm:text-[17px] text-slate-600 leading-relaxed mb-8">{text}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a href={`mailto:${SITE.email}`} className="group inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold text-white bg-slate-950 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-float">
          Start a project <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
        <a href="#portfolio" className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold text-slate-800 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 hover:border-sky-300 transition-colors">
          See our portfolio
        </a>
      </div>
    </Reveal>
  </section>
);

/* ---------------- Section wrapper for pages ---------------- */
export const Band: React.FC<{ id?: string; tone?: 'white' | 'dots' | 'grid'; children: React.ReactNode; className?: string }> = ({ id, tone = 'white', children, className = '' }) => (
  <section id={id} className={`relative py-20 sm:py-28 border-b border-sky-100 overflow-hidden ${tone === 'dots' ? 'bg-dot-grid-light' : tone === 'grid' ? 'bg-tech-grid' : 'bg-white'} ${className}`}>
    <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[420px] h-[420px]" />
    <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[400px] h-[400px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
);

export { Layers, Boxes, Check };
