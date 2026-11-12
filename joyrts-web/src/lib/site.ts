/** Single source of truth for company details. Used by metadata, structured data, the footer and the contact page.
 *  PLACEHOLDER VALUES: confirm the domain, legal name, email and address before launch. */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.joyrts.com').replace(/\/$/, ''),
  name: 'Joyrts',
  legalName: 'Joyrts',
  tagline: 'Human intelligence, engineered into AI',
  description:
    'Joyrts turns human insight into intelligent systems: AI agents, workflow automation and custom AI software that learn from how your people think and work.',
  email: 'admin@joyrts.com',
  /** Leave empty and it is hidden everywhere (including structured data). */
  phone: '',
  social: { linkedin: '', x: '', youtube: '', instagram: '' } as Record<string, string>,
  address: { locality: 'Chennai', region: 'Tamil Nadu', country: 'IN' },
  office: 'Chennai, India',
  updated: '2026-11-12',
};

export const abs = (path = '/') => `${SITE.url}${path === '/' ? '' : path}`;
