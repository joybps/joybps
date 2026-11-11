import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { FeaturesSection } from '../../components/FeaturesSection';
import { PlatformsSection } from '../../components/PlatformsSection';

export const metadata: Metadata = pageMeta('Features', 'Explore Affina CRM features: lead capture from Meta, Google and your website, custom pipelines, revenue forecasts, workflow automation, built-in calling and an AI Copilot for chat and voice.', '/features');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Features"
        title="Everything your team needs in one CRM"
        text="Capture leads, automate workflows and manage every customer relationship, with the controls and AI your team needs to grow faster."
      />
      <FeaturesSection showHeading={false} />
      <PlatformsSection />
    </>
  );
}
