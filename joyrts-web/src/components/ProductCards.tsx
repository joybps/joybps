import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Plus } from 'lucide-react';
import { StaggerGroup } from './MotionPrimitives';
import { TiltCard } from './TiltCard';
import { PRODUCT_VISUALS } from './ProductVisuals';
import { Icon } from './Icon';
import { PRODUCTS, type Product } from '../data/products';

/** Where a product's "Visit website" button points. Falls back to the contact page until the product site is deployed. */
export const productHref = (p: Product) => p.url || `/contact?product=${p.slug}`;

/**
 * Each card shows a live mini-scene of its product, tilts toward the pointer and gets a light-sweep border on hover.
 * The whole card opens the product page (a stretched link on the title); "Visit website" sits above it as a separate,
 * valid link, so there is never a link nested inside a link.
 */
export const ProductsGrid: React.FC = () => (
  <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]" y={28} stagger={0.08}>
    {PRODUCTS.map((p, i) => {
      const V = PRODUCT_VISUALS[p.slug];
      return (
        <TiltCard
          key={p.slug}
          accent={p.accent}
          className="group relative overflow-hidden rounded-3xl bg-white border border-sky-100 shadow-card p-4 flex flex-col hover:border-sky-300 hover:shadow-float"
        >
          <span aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-700" style={{ background: p.accent }} />
          {V && <V c={p.accent} />}

          <div className="relative px-2 pt-5 flex flex-col flex-1">
            <div className="flex items-center gap-3.5 mb-3">
              <span className={`v-float w-11 h-11 rounded-2xl flex items-center justify-center ${p.tone}`} style={{ animationDelay: `${i * 0.45}s` }}>
                <Icon name={p.icon} className="w-[22px] h-[22px]" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[19px] font-bold text-slate-950 leading-tight">
                  <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-400 focus-visible:after:rounded-3xl">
                    {p.name}
                  </Link>
                </h3>
                <p className="text-[12px] font-semibold text-slate-500">{p.category}</p>
              </div>
            </div>

            <p className="text-[14px] text-slate-600 leading-relaxed mb-4">{p.short}</p>
            <ul className="mb-5 flex flex-wrap gap-1.5">
              {p.features.slice(0, 3).map((f) => (
                <li key={f.title} className="rounded-full bg-slate-50 border border-slate-100 text-[11.5px] font-semibold text-slate-600 px-2.5 py-1">{f.title}</li>
              ))}
            </ul>

            <div className="mt-auto pb-1 flex items-center justify-between gap-3">
              <a
                href={productHref(p)}
                {...(p.url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="relative z-10 inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white text-slate-800 text-[13px] font-semibold px-4 py-2.5 hover:border-sky-400 hover:bg-sky-50 transition-colors"
              >
                Visit website <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <span aria-hidden="true" className="w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1 group-hover:scale-110">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </TiltCard>
      );
    })}

    {/* the sixth card: your own product */}
    <TiltCard
      accent="#6366f1"
      className="group relative overflow-hidden rounded-3xl border-2 border-dashed border-sky-300 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 flex flex-col justify-center hover:border-sky-500 hover:shadow-float"
    >
      <span aria-hidden="true" className="relative mb-5 flex w-14 h-14 items-center justify-center">
        <span className="v-ring absolute inset-0 rounded-full border border-sky-400" />
        <span className="v-ring absolute inset-0 rounded-full border border-indigo-400" style={{ animationDelay: '1.5s' }} />
        <span className="relative w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
          <Plus className="w-6 h-6" />
        </span>
      </span>
      <h3 className="text-[19px] font-bold text-slate-950 mb-1.5">
        <Link href="/contact?product=custom" className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-400 focus-visible:after:rounded-3xl">Your own product</Link>
      </h3>
      <p className="text-[14px] text-slate-600 leading-relaxed mb-5">Have an idea for an AI-powered product? We designed all five of these the same way. Tell us about yours and we will build it with you.</p>
      <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-sky-700 group-hover:text-sky-900">
        Contact us <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </TiltCard>
  </StaggerGroup>
);
