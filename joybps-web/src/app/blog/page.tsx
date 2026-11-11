import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Band, CTABand } from '../../components/Sections';
import { POSTS } from '../../data/posts';
import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({ title: 'Blog: AI and Software Insights', description: 'Practical articles on AI, software development and business technology from the Joybps team.', path: '/blog' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }]} />
      <PageHeader pill="Blog" title="Insights on AI and software" text="Practical writing from the people who build it." />
      <Band tone="dots">
        <div className="grid gap-5 md:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.slug} className="rounded-3xl bg-white border border-sky-100 shadow-card p-6 flex flex-col">
              <p className="text-[12px] font-semibold text-sky-700 mb-2">{p.category} · {p.readMinutes} min read</p>
              <h2 className="text-[19px] font-bold text-slate-950 leading-snug mb-2"><Link href={`/blog/${p.slug}`} className="hover:text-sky-700 transition-colors">{p.title}</Link></h2>
              <p className="text-[14px] text-slate-600 leading-relaxed mb-4">{p.description}</p>
              <Link href={`/blog/${p.slug}`} className="mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-sky-700 hover:text-sky-900">Read article <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </Band>
      <CTABand />
    </>
  );
}
