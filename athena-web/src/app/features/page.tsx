import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { FeatureCardsScroller } from '../../components/FeatureCardsScroller';
import { ProjectTimeline } from '../../components/ProjectTimeline';
import { CTASection } from '../../components/CTASection';

export const metadata: Metadata = pageMeta('Features', 'Athena features: site surveys and measurements, estimates, crew scheduling and attendance, expenses, project timelines and customer invoicing.', '/features');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Features"
        title="Everything your field team needs"
        text="Sites, surveys, measurements, estimates, crews, attendance, expenses and invoices, in one connected flow."
      />
      <FeatureCardsScroller />
      <ProjectTimeline />
      <CTASection />
    </>
  );
}
