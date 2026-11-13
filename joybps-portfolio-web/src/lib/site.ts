/** Single source of truth for company details. Used by metadata, structured data, the footer and the contact page. */
export const SITE = {
  /** Public URL of this site. On Vercel set NEXT_PUBLIC_SITE_URL to the final domain; otherwise the Vercel production URL, then joybps.com, is used. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://www.joybps.com')).replace(/\/+$/, ''),
  name: 'Joybps',
  legalName: 'JBPSI India Private Limited',
  tagline: 'AI-powered software, built for how you work',
  description:
    'Portfolio of Joybps: websites, web applications, mobile apps and custom software built for growing businesses, with client reviews and logos.',
  email: 'admin@joybps.com',
  /** Phone number to be added later. Leave empty and it is hidden everywhere (including structured data). */
  phone: '',
  /** Social profile URLs to be added later. Empty values are hidden. */
  social: { linkedin: '', x: '', youtube: '', instagram: '' } as Record<string, string>,
  address: { locality: 'Chennai', region: 'Tamil Nadu', country: 'IN' },
  office: 'Chennai, India',
  updated: '2026-11-11',
};

export const abs = (path = '/') => `${SITE.url}${path === '/' ? '' : path}`;
