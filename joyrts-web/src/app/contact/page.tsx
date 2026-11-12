import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ContactSection } from '../../components/ContactSection';
import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({ title: 'Contact Joyrts', description: 'Tell the Joyrts team what you want to build or improve. We reply within one working day.', path: '/contact' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Contact', path: '/contact' }]} />
      <PageHeader pill="Contact" title="Talk to the Joyrts team" text="Tell us what you want to build or improve. We will reply within one working day." />
      <ContactSection showHeading={false} />
    </>
  );
}
