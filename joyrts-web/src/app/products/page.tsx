import { PageHeader } from '../../components/SectionHeading';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { JsonLd } from '../../components/JsonLd';
import { Band, ProductsGrid, CTABand } from '../../components/Sections';
import { pageMeta, productsListLd } from '../../lib/seo';

export const metadata = pageMeta({ title: 'AI-Powered Products', description: 'Explore Affina, Iris, Hestia, Joybooks and Athena: five AI-powered business products from Joyrts for sales, calls, HR, accounting and field billing.', path: '/products' });

export default function Page() {
  return (
    <>
      <JsonLd data={productsListLd()} />
      <Breadcrumbs items={[{ name: 'Products', path: '/products' }]} />
      <PageHeader pill="Products" title="AI-powered products for every part of your business" text="Five platforms we built and run ourselves. Open any of them to see what it does, or visit its own website." />
      <Band tone="dots"><ProductsGrid /></Band>
      <CTABand />
    </>
  );
}
