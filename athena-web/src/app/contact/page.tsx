import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { ContactSection } from '../../components/ContactSection';

export const metadata: Metadata = pageMeta('Contact', 'Talk to the Athena team about field billing for your business. We reply within one working day.', '/contact');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Contact"
        title="Talk to the Athena team"
        text="Tell us about the work you do in the field and how you bill for it today. We’ll show you how Athena takes you from site survey to final invoice."
      />
      <ContactSection showHeading={false} />
    </>
  );
}
