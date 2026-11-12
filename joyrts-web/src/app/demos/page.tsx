import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../../components/SectionHeading';
import { SectionHeading } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Band, CTABand, productHref } from '../../components/Sections';
import { ProductDemo } from '../../components/ProductDemo';
import { Icon } from '../../components/Icon';
import { PRODUCTS } from '../../data/products';
import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({ title: 'Product Demos', description: 'Watch a guided walkthrough of each Joyrts product: Affina, Iris, Hestia, Joybooks and Athena, from the first click to the finished result.', path: '/demos' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Demos', path: '/demos' }]} />
      <PageHeader pill="Demos" title="See every product in action" text="One walkthrough per product. Each shows the core workflow from the first click to the finished result." />

      <nav aria-label="Jump to a demo" className="bg-white border-b border-sky-100">
        <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-2">
          {PRODUCTS.map((p) => (
            <li key={p.slug}>
              <a href={`#${p.slug}`} className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:border-sky-400 hover:bg-sky-50 transition-colors">
                <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: p.accent }} />
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {PRODUCTS.map((p, i) => (
        <Band key={p.slug} id={p.slug} tone={i % 2 ? "dots" : "grid"} className="scroll-mt-16">
          <SectionHeading icon={<Icon name={p.icon} />} pill={p.name} title={`See ${p.name} at work`} text={p.short} />
          <div className="-mt-6 mb-10">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={productHref(p)}
                {...(p.url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 text-white text-[13.5px] font-semibold px-5 py-2.5 hover:bg-slate-800 transition-colors"
              >
                Visit {p.name} website <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <Link href={`/products/${p.slug}`} className="inline-flex items-center rounded-xl border border-sky-200 bg-white text-slate-800 text-[13.5px] font-semibold px-5 py-2.5 hover:bg-sky-50 hover:border-sky-300 transition-colors">
                About {p.name}
              </Link>
            </div>
          </div>
          <ProductDemo slug={p.slug} />
        </Band>
      ))}

      <CTABand title="Want a live walkthrough?" text="Book a demo and we will show you the product with your own scenario." />
    </>
  );
}
