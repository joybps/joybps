import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { PricingSection } from '../../components/PricingSection';
import { ComparisonSection } from '../../components/ComparisonSection';

export const metadata: Metadata = pageMeta('Pricing', 'Simple Affina CRM pricing for growing teams, with unlimited users and custom roles. See what is included and book a free demo.', '/pricing');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Pricing"
        title="Simple, transparent pricing"
        text="Start free with unlimited users. Scale to AI-powered automation and industry verticals as you grow."
      />
      <PricingSection showHeading={false} />
      <ComparisonSection />
    </>
  );
}
