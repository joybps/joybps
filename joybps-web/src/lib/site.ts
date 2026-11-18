/** Single source of truth for company details. Used by metadata, structured data, the footer and the contact page. */
export const SITE = {
  url: 'https://www.joybps.com',
  name: 'Joybps',
  legalName: 'JBPSI India Private Limited',
  tagline: 'AI-powered software, built for how you work',
  description:
    'Joybps designs and builds AI-powered business software, websites, web and mobile apps and custom software for businesses, with ongoing support.',
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
