import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ContactSection } from '../../components/ContactSection';
import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({ title: 'Contact Joybps', description: 'Book a demo or start a project. Contact the Joybps team in Chennai for websites, apps, custom software, support and product demos.', path: '/contact' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Contact', path: '/contact' }]} />
      <PageHeader pill="Contact" title="Talk to the Joybps team" text="Tell us what you want to build or improve. We will reply within one working day." />
      <ContactSection showHeading={false} />
    </>
  );
}
