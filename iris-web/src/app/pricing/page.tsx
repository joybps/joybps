import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { PricingSection } from '../../components/PricingSection';

export const metadata: Metadata = pageMeta('Pricing', 'Iris pricing for AI voice and chat agents. Compare plans and book a demo.', '/pricing');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Pricing"
        title="Simple, transparent pricing"
        text="Start small with a voice or chat agent. Scale to unlimited agents, live handover and many organisations as you grow."
      />
      <PricingSection showHeading={false} />
    </>
  );
}
