import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LegalBody } from '../../components/LegalBody';
import { COOKIES } from '../../data/legal';
import { pageMeta } from '../../lib/seo';

const DESC = 'How the Joybps website uses cookies and similar technologies.';
export const metadata = pageMeta({ title: 'Cookie Policy', description: DESC, path: '/cookie-policy' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Cookie Policy', path: '/cookie-policy' }]} />
      <PageHeader pill="Legal" title="Cookie Policy" text={DESC} />
      <LegalBody sections={COOKIES} />
    </>
  );
}
