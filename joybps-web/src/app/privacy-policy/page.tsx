import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LegalBody } from '../../components/LegalBody';
import { PRIVACY } from '../../data/legal';
import { pageMeta } from '../../lib/seo';

const DESC = 'How JBPSI India Private Limited (Joybps) collects, uses, stores and protects your personal information, and the choices and rights you have over it.';
export const metadata = pageMeta({ title: 'Privacy Policy', description: DESC, path: '/privacy-policy' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Privacy Policy', path: '/privacy-policy' }]} />
      <PageHeader pill="Legal" title="Privacy Policy" text={DESC} />
      <LegalBody sections={PRIVACY} />
    </>
  );
}
