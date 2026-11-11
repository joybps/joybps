import type { Metadata } from 'next';
import { pageMeta } from '../../lib/site';
import { PageHeader } from '../../components/SectionHeading';
import { ContactSection } from '../../components/ContactSection';

export const metadata: Metadata = pageMeta('Contact', 'Talk to the Iris team about AI voice and chat agents for your business. We reply within one working day.', '/contact');

export default function Page() {
  return (
    <>
      <PageHeader
        pill="Contact"
        title="Talk to the Iris team"
        text="Tell us about your business and how your customers reach you. We’ll show you what Iris can answer for you."
      />
      <ContactSection showHeading={false} />
    </>
  );
}
