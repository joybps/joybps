import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { FeatureCardsScroller } from '../../components/FeatureCardsScroller';
import { FinanceTimeline } from '../../components/FinanceTimeline';
import { StatsSection } from '../../components/StatsSection';
import { CTASection } from '../../components/CTASection';

export const metadata: Metadata = pageMeta('Features', 'Joybooks features: invoicing, bills, expenses, banking and reconciliation, inventory, GST and taxes, multi-currency and real-time financial reports.', '/features');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Features"
        title="Everything your finance team needs"
        text="Invoicing, banking, expenses, inventory, taxes and reports, with approvals and roles, in one connected platform."
      />
      <FeatureCardsScroller />
      <FinanceTimeline />
      <StatsSection />
      <CTASection />
    </>
  );
}
