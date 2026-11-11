import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Check, PlayCircle } from 'lucide-react';
import { PageHeader, SectionHeading } from '../../../components/SectionHeading';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { JsonLd } from '../../../components/JsonLd';
import { Band, FaqSection, CTABand, productHref } from '../../../components/Sections';
import { ProductDemo } from '../../../components/ProductDemo';
import { Icon } from '../../../components/Icon';
import { PRODUCTS, getProduct } from '../../../data/products';
import { pageMeta, productLd, faqLd } from '../../../lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => PRODUCTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return pageMeta({ title: `${p.name}: ${p.category}`, description: p.short, path: `/products/${p.slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  return (
    <>
      <JsonLd data={[productLd(p), faqLd(p.faqs)]} />
      <Breadcrumbs items={[{ name: 'Products', path: '/products' }, { name: p.name, path: `/products/${p.slug}` }]} />
      <PageHeader pill={p.category} title={`${p.name}: ${p.tagline}`} text={p.short} />
      <section className="py-8 bg-white border-b border-sky-100">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap justify-center gap-3">
          <a href={productHref(p)} {...(p.url ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 text-white text-[14px] font-semibold hover:bg-slate-800 transition-colors">
            Visit {p.name} website <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <Link href="/contact" className="inline-flex items-center px-6 py-3 rounded-xl bg-white border border-sky-200 text-slate-800 text-[14px] font-semibold hover:bg-sky-50 transition-colors">Book a Demo</Link>
        </div>
      </section>
      <Band tone="dots">
        <SectionHeading icon={<Icon name={p.icon} />} pill="Overview" title={`What ${p.name} does`} text={p.long} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.features.map((f) => (
            <div key={f.title} className="rounded-3xl bg-white border border-sky-100 shadow-card p-5">
              <h3 className="text-[16px] font-bold text-slate-950 mb-1">{f.title}</h3>
              <p className="text-[13.5px] text-slate-600 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-14 mb-6 text-[22px] font-bold text-slate-950 text-center">Who it is for</h2>
        <ul className="flex flex-wrap justify-center gap-2">
          {p.audience.map((a) => <li key={a} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-sky-100 px-3.5 py-1.5 text-[13px] font-medium text-slate-700"><Check className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />{a}</li>)}
        </ul>
      </Band>
      <Band tone="grid">
        <SectionHeading icon={<PlayCircle />} pill="Live demo" title={`${p.name} in action`} text="A guided walkthrough of the core workflow." />
        <ProductDemo slug={p.slug} />
      </Band>
      <FaqSection faqs={p.faqs} title={`${p.name} questions`} />
      <CTABand title={`See ${p.name} for your business.`} />
    </>
  );
}
