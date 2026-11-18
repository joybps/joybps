import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { PageHeader } from '../../../components/SectionHeading';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { JsonLd } from '../../../components/JsonLd';
import { Band, FaqSection, CTABand, ProcessTimeline } from '../../../components/Sections';
import { SERVICES, getService } from '../../../data/services';
import { pageMeta, serviceLd, faqLd } from '../../../lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.name, description: `${s.short} Built by Joybps, from first call to launch and support.`, path: `/services/${s.slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  return (
    <>
      <JsonLd data={[serviceLd(s), faqLd(s.faqs)]} />
      <Breadcrumbs items={[{ name: 'Services', path: '/services' }, { name: s.name, path: `/services/${s.slug}` }]} />
      <PageHeader pill="Service" title={s.name} text={s.short} />
      <Band tone="dots">
        <div className="max-w-3xl mx-auto">
          <p className="text-[16px] text-slate-600 leading-relaxed mb-8">{s.long}</p>
          <h2 className="text-[24px] font-bold text-slate-950 mb-4">What you get</h2>
          <ul className="grid sm:grid-cols-2 gap-3 mb-8">
            {s.deliverables.map((d) => <li key={d} className="flex gap-2.5 rounded-2xl bg-white border border-sky-100 shadow-card p-4 text-[14px] text-slate-700"><Check className="w-4 h-4 mt-0.5 shrink-0 text-sky-600" aria-hidden="true" />{d}</li>)}
          </ul>
          <h2 className="text-[24px] font-bold text-slate-950 mb-3">Technology</h2>
          <ul className="flex flex-wrap gap-2">{s.stack.map((t) => <li key={t} className="rounded-full bg-white border border-sky-100 px-3 py-1 text-[13px] font-medium text-slate-700">{t}</li>)}</ul>
        </div>
      </Band>
      <ProcessTimeline steps={s.steps} />
      <FaqSection faqs={s.faqs} title={`${s.name}: common questions`} />
      <CTABand title={`Start your ${s.name.toLowerCase()} project.`} />
    </>
  );
}
