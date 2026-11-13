import type { Metadata } from 'next';
import { SITE, abs } from './site';

/** Builds the metadata for a page: title, description, canonical URL, Open Graph and Twitter cards. */
export function pageMeta(opts: { title: string; description: string; path: string; type?: 'website' | 'article'; noindex?: boolean }): Metadata {
  const url = abs(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE.name,
      type: opts.type ?? 'website',
      locale: 'en_IN',
    },
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

