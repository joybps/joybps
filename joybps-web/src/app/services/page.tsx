import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Band, ServicesGrid, ProcessTimeline, CTABand } from '../../components/Sections';
import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({ title: 'Software Development Services', description: 'Website development, web and mobile app development, custom software and technical support from Joybps (JBPSI India Private Limited), Chennai.', path: '/services' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Services', path: '/services' }]} />
      <PageHeader pill="What we build" title="Websites, apps and custom software" text="We design, build and support the digital products your business runs on." />
      <Band tone="dots"><ServicesGrid /></Band>
      <ProcessTimeline />
      <CTABand />
    </>
  );
}
