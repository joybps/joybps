import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { ContactSection } from '../../components/ContactSection';

export const metadata: Metadata = pageMeta('Contact', 'Talk to the Hestia team about HR, attendance and payroll for your organisation. We reply within one working day.', '/contact');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Contact"
        title="Talk to the Hestia team"
        text="Tell us about your organisation and how you manage your people today. We’ll show you how Hestia can bring it all into one place."
      />
      <ContactSection showHeading={false} />
    </>
  );
}
