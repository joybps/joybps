import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Brain, Mic, FileSearch, Workflow, Star, Quote, Layers, Boxes, Sparkles, Route, MessageSquareQuote, HelpCircle, Check, HeartHandshake, ShieldCheck, Sprout, Eye } from 'lucide-react';
import { PRINCIPLES } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { PulseMeshBg } from './PulseMeshBg';
import { Reveal, StaggerGroup, Marquee, CountUp } from './MotionPrimitives';
import { SpotlightCard } from './FuturisticPrimitives';
import { Icon } from './Icon';
import { PRODUCTS, type Product } from '../data/products';
import { SERVICES } from '../data/services';
import { TESTIMONIALS } from '../data/testimonials';

export { ProductsGrid, productHref } from './ProductCards';
export { AICapabilities } from './Capabilities';
export { ServicesShowcase as ServicesGrid } from './ServicesShowcase';

/* ---------------- Process ---------------- */
export const ProcessTimeline: React.FC<{ steps?: { title: string; text: string }[] }> = ({ steps = SERVICES[0].steps }) => (
  <section id="process" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[440px] h-[440px]" />
    <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[420px] h-[420px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading icon={<Route />} pill="How we work" title="A clear path from idea to launch." text="Five steps, weekly visibility and no surprises, whether it is a website or a full platform." />
      <ol className="grid gap-4 md:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.title} className="relative rounded-3xl bg-white border border-sky-100 shadow-card p-5">
            <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 text-[13px] font-bold flex items-center justify-center mb-3" aria-hidden="true">{i + 1}</span>
            <h3 className="text-[16px] font-bold text-slate-950 mb-1">{s.title}</h3>
            <p className="text-[13px] text-slate-600 leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* ---------------- Stats ---------------- */
export const StatsBand: React.FC = () => (
  <section aria-label="Joyrts in numbers" className="relative py-14 bg-tech-grid border-b border-sky-100">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {[
        [PRODUCTS.length, '', 'AI-powered products'],
        [TESTIMONIALS.length, '', 'Client reviews'],
        [SERVICES.length, '', 'Services offered'],
        [1, ' day', 'To reply to your enquiry'],
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

/* ---------------- FAQ ---------------- */
export const FaqList: React.FC<{ faqs: { q: string; a: string }[] }> = ({ faqs }) => (
  <div className="max-w-3xl mx-auto space-y-3">
    {faqs.map((f) => (
      <details key={f.q} className="group rounded-2xl bg-white border border-sky-100 shadow-card open:border-sky-300 transition-colors">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-semibold text-slate-950">
          <h3 className="text-[15.5px] font-semibold">{f.q}</h3>
          <span aria-hidden="true" className="shrink-0 w-6 h-6 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center text-[16px] leading-none transition-transform group-open:rotate-45">+</span>
        </summary>
        <p className="px-5 pb-5 text-[14.5px] text-slate-600 leading-relaxed">{f.a}</p>
      </details>
    ))}
  </div>
);

export const HOME_FAQS = [
  { q: 'What does Joyrts do?', a: 'Joyrts is an AI-focused technology company. We build five AI-powered business products (Affina, Iris, Hestia, Joybooks and Athena) and design and develop websites, web applications, mobile apps and custom software for clients, with digital marketing and contact center support to go with them.' },
  { q: 'Can you build software around our own process?', a: 'Yes. Our custom software service starts with your workflow and builds the system around it. Several of our own products began as custom builds for a specific industry.' },
  { q: 'How long does a typical project take?', a: 'A business website usually takes three to six weeks. Web and mobile applications depend on scope, and we agree a milestone plan after a short discovery phase.' },
  { q: 'Do we own the source code?', a: 'For custom projects, yes. The code and documentation are handed over to you so you are never locked in.' },
  { q: 'Do you offer support after launch?', a: 'Yes. Our technical support plans cover monitoring, security updates, backups, bug fixes and monthly improvement hours.' },
  { q: 'Where is Joyrts based?', a: 'Joyrts is based in Chennai, India. We work with clients across India and internationally.' },
];

export const FaqSection: React.FC<{ faqs?: { q: string; a: string }[]; title?: string }> = ({ faqs = HOME_FAQS, title = 'Questions, answered.' }) => (
  <section id="faq" className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <div aria-hidden="true" className="aurora aurora-sky top-10 -right-40 w-[420px] h-[420px]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading icon={<HelpCircle />} pill="FAQ" title={title} text="Straight answers to what clients ask us most." />
      <FaqList faqs={faqs} />
    </div>
  </section>
);

/* ---------------- CTA ---------------- */
export const CTABand: React.FC<{ title?: string; text?: string }> = ({ title = 'Let us build something intelligent.', text = 'Tell us about your idea, your team or your problem. We will show you what is possible and what it takes.' }) => (
  <section className="relative py-20 sm:py-28 bg-white border-b border-sky-100 overflow-hidden">
    <PulseMeshBg />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_34%_40%_at_50%_50%,rgba(255,255,255,0.9),rgba(255,255,255,0.45)_62%,transparent_100%)]" />
    <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
      <h2 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950 leading-tight mb-4">{title}</h2>
      <p className="text-[16px] sm:text-[17px] text-slate-600 leading-relaxed mb-8">{text}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/contact" className="group inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold text-white bg-slate-950 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-float">
          Start a project <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
        <Link href="/services" className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold text-slate-800 bg-white border border-sky-200 rounded-xl hover:bg-sky-50 hover:border-sky-300 transition-colors">
          Explore our services
        </Link>
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

/* ---------------- Values (About page pattern) ---------------- */
const VALUE_ICONS = [HeartHandshake, ShieldCheck, Sprout, Eye];
export const ValuesGrid: React.FC = () => (
  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {PRINCIPLES.map((v, i) => {
      const I = VALUE_ICONS[i % VALUE_ICONS.length];
      return (
        <li key={v.title} className="rounded-3xl bg-white border border-sky-100 shadow-card p-5">
          <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3"><I className="w-5 h-5" aria-hidden="true" /></span>
          <h3 className="text-[16px] font-bold text-slate-950 mb-1">{v.title}</h3>
          <p className="text-[13.5px] text-slate-600 leading-relaxed">{v.text}</p>
        </li>
      );
    })}
  </ul>
);
