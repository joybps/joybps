import type { Metadata, Viewport } from 'next';
import { JsonLd } from '../components/JsonLd';
import { SITE, softwareLd, websiteLd } from '../lib/site';
import { SiteShell } from '../components/SiteShell';
import '../index.css';

const TITLE = 'Affina — CRM with AI Copilot, Pipelines and Automation';
const DESCRIPTION =
  'Affina is a CRM that captures leads, automates workflows and manages customer relationships, with an AI Copilot for chat and voice, built-in calling and Meta, Google and website lead capture.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: DESCRIPTION,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  authors: [{ name: SITE.publisher.name, url: SITE.publisher.url }],
  alternates: { canonical: '/' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/', siteName: SITE.name, type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: SITE.themeColor };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={[softwareLd(), websiteLd()]} />
      </head>
      <body className="bg-white text-slate-950 antialiased selection:bg-sky-100 selection:text-slate-900">
        <noscript>
          <style>{'html body{visibility:visible!important;animation:none!important}'}</style>
        </noscript>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
