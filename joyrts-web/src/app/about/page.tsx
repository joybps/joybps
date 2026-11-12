import { PageHeader, SectionHeading } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Band, StatsBand, ValuesGrid, ProductsGrid, CTABand } from '../../components/Sections';
import { pageMeta } from '../../lib/seo';
import { SITE } from '../../lib/site';

export const metadata = pageMeta({ title: 'About Joyrts', description: 'Joyrts turns human insight into intelligent systems. Learn how we think and who we build with.', path: '/about' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'About', path: '/about' }]} />
      <PageHeader pill="About" title="An AI company, built around real work" text={`Joyrts is based in ${SITE.office}.`} />
      <Band tone="dots">
        <div className="max-w-3xl mx-auto space-y-4 text-[16px] text-slate-600 leading-relaxed">
          <h2 className="text-[26px] font-bold text-slate-950">Our story</h2>
          <p>We believe the best AI starts with how people actually think and work. Joyrts builds systems that learn from that insight, and stay explainable once they do.</p>
          <p>We sit alongside five AI-powered products from the same team: Affina, Iris, Hestia, Joybooks and Athena. Each one solves one part of running a business with intelligence at its core, and together they shape how we build for clients.</p>
          <h2 className="pt-4 text-[26px] font-bold text-slate-950">What we believe</h2>
        </div>
        <div className="mt-6"><ValuesGrid /></div>
      </Band>
      <StatsBand />
      <Band tone="dots"><SectionHeading pill="Our products" title="Five AI-powered products from our team" text="The same thinking we bring to client work, shipped as products." /><ProductsGrid /></Band>
      <CTABand />
    </>
  );
}