import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { SiteShell } from '../components/SiteShell';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import { CookieConsent } from '../components/CookieConsent';
import { JsonLd } from '../components/JsonLd';
import { organizationLd, websiteLd } from '../lib/seo';
import { SITE } from '../lib/site';
import '../index.css';

// Self-hosted by Next.js at build time: no render-blocking request to Google Fonts, and the font files are preloaded.
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--font-jakarta' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-jetbrains' });

const TITLE = `${SITE.name} | AI-Powered Software, Websites and Apps for Business`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  category: 'technology',
  keywords: ['AI business software', 'website development', 'web app development', 'mobile app development', 'custom software development', 'Joybps', 'Chennai'],
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
    <html lang="en" className={`scroll-smooth ${sans.variable} ${mono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body className="bg-white text-slate-950 antialiased selection:bg-sky-100 selection:text-slate-900">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
        <CookieConsent />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
