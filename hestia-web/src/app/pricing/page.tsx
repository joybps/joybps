import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { PricingSection } from '../../components/PricingSection';

export const metadata: Metadata = pageMeta('Pricing', 'Hestia HRMS pricing for growing teams. See what is included and book a demo.', '/pricing');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Pricing"
        title="Simple, transparent pricing"
        text="Start with the essentials for your team. Add the AI assistant, payroll, performance and hiring as you grow."
      />
      <PricingSection showHeading={false} />
    </>
  );
}
