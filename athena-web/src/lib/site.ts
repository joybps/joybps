/** Single source of truth for SEO. Set NEXT_PUBLIC_SITE_URL in production to the live domain. */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://athena.joybps.com').replace(/\/$/, ''),
  name: 'Athena',
  tagline: 'Every site. Every crew. Built to bill.',
  description: 'Athena is a field billing app: survey a site, turn measurements into estimates, schedule crews, track attendance and expenses, and bill the customer, all in one place.',
  category: 'BusinessApplication',
  keywords: ['field billing software','estimating software','contractor software','crew scheduling','site survey','construction invoicing'],
  publisher: { name: 'Joybps', legalName: 'JBPSI India Private Limited', url: 'https://www.joybps.com' },
  email: 'admin@joybps.com',
  themeColor: '#0ea5e9',
};

export const abs = (path = '/') => `${SITE.url}${path === '/' ? '' : path}`;

/** Metadata for an inner page: unique title and description, canonical URL and share tags. */
export const pageMeta = (title: string, description: string, path: string) => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | ${SITE.name}`, description, url: path, type: 'website' as const, siteName: SITE.name },
  twitter: { card: 'summary_large_image' as const, title: `${title} | ${SITE.name}`, description },
});

export const softwareLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  applicationCategory: SITE.category,
  operatingSystem: 'Web',
  publisher: { '@type': 'Organization', name: SITE.publisher.name, legalName: SITE.publisher.legalName, url: SITE.publisher.url },
});

export const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
  inLanguage: 'en',
});

export const faqLd = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});
