import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { PricingSection } from '../../components/PricingSection';

export const metadata: Metadata = pageMeta('Pricing', 'Joybooks accounting software pricing. Compare plans and book a demo.', '/pricing');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Pricing"
        title="Simple, transparent pricing"
        text="Start with the essentials for your books. Add inventory, automation and multi-currency as your business grows."
      />
      <PricingSection showHeading={false} />
    </>
  );
}
