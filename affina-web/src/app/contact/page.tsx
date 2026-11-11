import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { ContactSection } from '../../components/ContactSection';

export const metadata: Metadata = pageMeta('Contact', 'Talk to the Affina team. Tell us about your industry, team size and workflow and we will respond within 24 hours.', '/contact');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Contact"
        title="Talk to the Affina team"
        text="Tell us about your industry, team size and workflow challenges. We’ll respond within 24 hours."
      />
      <ContactSection showHeading={false} />
    </>
  );
}
