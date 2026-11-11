import { notFound } from 'next/navigation';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { JsonLd } from '../../../components/JsonLd';
import { CTABand } from '../../../components/Sections';
import { POSTS, getPost } from '../../../data/posts';
import { pageMeta } from '../../../lib/seo';
import { SITE, abs } from '../../../lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) return {};
  return pageMeta({ title: p.title, description: p.description, path: `/blog/${p.slug}`, type: 'article' });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    mainEntityOfPage: abs(`/blog/${p.slug}`),
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
  };
  return (
    <>
      <JsonLd data={ld} />
      <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }]} />
      <article className="bg-white border-b border-sky-100 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-[13px] font-semibold text-sky-700 mb-3">{p.category} · {p.readMinutes} min read · <time dateTime={p.date}>{p.date}</time></p>
          <h1 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-slate-950 leading-tight mb-5">{p.title}</h1>
          <p className="text-[18px] text-slate-600 leading-relaxed mb-8">{p.description}</p>
          <div className="space-y-4 text-[16px] text-slate-700 leading-[1.75]">
            {p.body.map((b, i) =>
              b.type === 'h2' ? <h2 key={i} className="pt-4 text-[26px] font-bold text-slate-950">{b.text}</h2>
              : b.type === 'h3' ? <h3 key={i} className="pt-2 text-[20px] font-bold text-slate-950">{b.text}</h3>
              : b.type === 'ul' ? <ul key={i} className="list-disc pl-6 space-y-1.5">{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
              : <p key={i}>{b.text}</p>,
            )}
          </div>
        </div>
      </article>
      <CTABand />
    </>
  );
}
