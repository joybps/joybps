import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LegalBody } from '../../components/LegalBody';
import { TERMS } from '../../data/legal';
import { pageMeta } from '../../lib/seo';

const DESC = 'The terms that govern your use of the Joybps website and services.';
export const metadata = pageMeta({ title: 'Terms and Conditions', description: DESC, path: '/terms-and-conditions' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Terms and Conditions', path: '/terms-and-conditions' }]} />
      <PageHeader pill="Legal" title="Terms and Conditions" text={DESC} />
      <LegalBody sections={TERMS} />
    </>
  );
}
