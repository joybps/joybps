import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { ContactSection } from '../../components/ContactSection';

export const metadata: Metadata = pageMeta('Contact', 'Talk to the Joybooks team about accounting and finance software for your business. We reply within one working day.', '/contact');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Contact"
        title="Talk to the Joybooks team"
        text="Tell us about your business and how you handle money today. We’ll show you how Joybooks can bring invoicing, banking and reports into one place."
      />
      <ContactSection showHeading={false} />
    </>
  );
}
