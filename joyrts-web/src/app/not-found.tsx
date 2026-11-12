import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="relative bg-tech-grid overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-amber top-10 -left-40 w-[440px] h-[440px]" />
      <div aria-hidden="true" className="aurora aurora-sky bottom-0 -right-40 w-[420px] h-[420px]" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
        <p className="font-mono text-[96px] sm:text-[140px] font-bold leading-none text-transform-grad">404</p>
        <h1 className="mt-4 text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950">That connection doesn&apos;t exist yet.</h1>
        <p className="mt-4 text-[16px] text-slate-600 leading-relaxed">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 text-white text-[14px] font-semibold hover:bg-slate-800 transition-colors">Back to home</Link>
      </div>
    </section>
  );
}
