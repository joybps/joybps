import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { JsonLd } from '../../components/JsonLd';
import { Band, ServicesGrid, ProcessTimeline, CTABand } from '../../components/Sections';
import { pageMeta, serviceLd } from '../../lib/seo';
import { SERVICES } from '../../data/services';

export const metadata = pageMeta({ title: 'Services', description: 'Website, web app, mobile app and custom software development, digital marketing and contact center support from Joyrts.', path: '/services' });

export default function Page() {
  return (
    <>
      <JsonLd data={SERVICES.map(serviceLd)} />
      <Breadcrumbs items={[{ name: 'Services', path: '/services' }]} />
      <PageHeader pill="What we build" title="Digital work and AI, built to last" text="Six services, one team: from your first website to a contact center that never sleeps." />
      <Band tone="dots"><ServicesGrid /></Band>
      <ProcessTimeline />
      <CTABand />
    </>
  );
}