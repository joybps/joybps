import type { Metadata, Viewport } from 'next';
import { SiteShell } from '../components/SiteShell';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import { JsonLd } from '../components/JsonLd';
import { organizationLd, websiteLd } from '../lib/seo';
import { SITE } from '../lib/site';
import '../index.css';

const TITLE = `${SITE.name}: AI-powered software, websites and apps for business`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  alternates: { canonical: SITE.url },
  openGraph: { title: TITLE, description: SITE.description, url: SITE.url, siteName: SITE.name, type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image', title: TITLE, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body className="bg-white text-slate-950 antialiased selection:bg-sky-100 selection:text-slate-900">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
