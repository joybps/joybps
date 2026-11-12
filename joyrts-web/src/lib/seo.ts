import type { Metadata } from 'next';
import { SITE, abs } from './site';
import type { Service } from '../data/services';
import { PRODUCTS, type Product } from '../data/products';

/** Builds the metadata for a page: title, description, canonical URL, Open Graph and Twitter cards. */
export function pageMeta(opts: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  const url = abs(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: { title: opts.title, description: opts.description, url, siteName: SITE.name, type: 'website', locale: 'en_IN' },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
  };
}

const sameAs = () => Object.values(SITE.social).filter(Boolean);

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  email: SITE.email,
  ...(SITE.phone ? { telephone: SITE.phone } : {}),
  description: SITE.description,
  address: { '@type': 'PostalAddress', addressLocality: SITE.address.locality, addressRegion: SITE.address.region, addressCountry: SITE.address.country },
  ...(sameAs().length ? { sameAs: sameAs() } : {}),
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: SITE.email, areaServed: 'Worldwide', availableLanguage: ['English'] }],
});

export const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { '@id': `${SITE.url}/#organization` },
  inLanguage: 'en',
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});

export const serviceLd = (s: Service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.name,
  serviceType: s.name,
  description: s.short,
  url: abs('/services'),
  provider: { '@id': `${SITE.url}/#organization` },
  areaServed: 'Worldwide',
});

export const faqLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const productLd = (p: Product) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: p.name,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: p.short,
  url: abs(`/products/${p.slug}`),
  publisher: { '@id': `${SITE.url}/#organization` },
});

export const productsListLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: PRODUCTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/products/${p.slug}`), name: p.name })),
});
