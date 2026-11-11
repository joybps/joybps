import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { PricingSection } from '../../components/PricingSection';

export const metadata: Metadata = pageMeta('Pricing', 'Athena field billing pricing for contractors and field teams. See what is included and book a demo.', '/pricing');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Pricing"
        title="Simple, transparent pricing"
        text="Start with the essentials for sites, estimates and billing. Add crew scheduling, attendance and expense billing as you grow."
      />
      <PricingSection showHeading={false} />
    </>
  );
}
