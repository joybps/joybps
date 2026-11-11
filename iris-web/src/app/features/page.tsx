import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { FeaturesSection } from '../../components/FeaturesSection';
import { TenantsSection } from '../../components/TenantsSection';
import { HowItWorksSection } from '../../components/HowItWorksSection';
import { IntegrationsSection } from '../../components/IntegrationsSection';
import { CTASection } from '../../components/CTASection';

export const metadata: Metadata = pageMeta('Features', 'Iris features: AI voice and chat agents, live human handover, call transcripts and summaries, virtual numbers, website chat widget and multi-tenant management.', '/features');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Features"
        title="Everything a modern contact center needs"
        text="Voice and chat AI agents, live human handover, and a complete record of every conversation, on one multi-tenant platform."
      />
      <FeaturesSection showHeading={false} />
      <TenantsSection />
      <HowItWorksSection />
      <IntegrationsSection />
      <CTASection />
    </>
  );
}
