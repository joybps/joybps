import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: true } };

/** Branded 404: explains what happened and sends visitors back to the main sections. */
export default function NotFound() {
  const links = [
    { label: 'Products', href: '/products', text: 'Our five AI-powered products' },
    { label: 'Services', href: '/services', text: 'Websites, apps and custom software' },
    { label: 'Demos', href: '/demos', text: 'Watch each product at work' },
    { label: 'Contact', href: '/contact', text: 'Talk to the team' },
  ];
  return (
    <section className="relative bg-tech-grid overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-sky top-10 -left-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-indigo bottom-0 -right-40 w-[420px] h-[420px]" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
        <p className="font-mono text-[96px] sm:text-[140px] font-bold leading-none text-shimmer">404</p>
        <h1 className="mt-4 text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950">This page drifted out of orbit.</h1>
        <p className="mt-4 text-[16px] text-slate-600 leading-relaxed">
          The page you are looking for does not exist or has moved. Try one of these instead, or head back home.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group rounded-2xl bg-white border border-sky-100 shadow-card p-4 hover:border-sky-300 transition-colors">
              <span className="flex items-center justify-between text-[15px] font-bold text-slate-950">
                {l.label}
                <ArrowRight className="w-4 h-4 text-sky-600 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="text-[13px] text-slate-500">{l.text}</span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-slate-500">
          Looking for a product? {PRODUCTS.map((p, i) => (
            <span key={p.slug}>
              <Link href={`/products/${p.slug}`} className="text-sky-700 hover:underline">{p.name}</Link>
              {i < PRODUCTS.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 text-white text-[14px] font-semibold hover:bg-slate-800 transition-colors">
          Back to home
        </Link>
      </div>
    </section>
  );
}
