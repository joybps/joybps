import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Band, TestimonialsGrid, CTABand } from '../../components/Sections';
import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({ title: 'Client Reviews', description: 'What clients say about working with Joybps on websites, applications, custom software and support.', path: '/testimonials' });

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Reviews', path: '/testimonials' }]} />
      <PageHeader pill="Reviews" title="What our clients say" text="Seven teams, in their own words, on working with Joybps." />
      <Band tone="dots"><TestimonialsGrid /></Band>
      <CTABand />
    </>
  );
}
