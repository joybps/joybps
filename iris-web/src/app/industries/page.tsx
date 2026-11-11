import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { IndustriesGrid } from '../../components/IndustriesSection';
import { CTASection } from '../../components/CTASection';

export const metadata: Metadata = pageMeta('Industries', 'See how Iris AI voice and chat agents answer customers for healthcare, real estate, retail, finance and other industries around the clock.', '/industries');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Industries"
        title="Built for any business that talks to customers"
        text="If your customers call or chat with you, Iris can answer. Here is how teams across industries put it to work."
      />
      <IndustriesGrid />
      <CTASection />
    </>
  );
}
