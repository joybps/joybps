import { SITE, abs } from '../../lib/site';
import { PRODUCTS } from '../../data/products';
import { SERVICES } from '../../data/services';

export const dynamic = 'force-static';

/** A plain-text summary of the site for AI search and answer engines. */
export function GET() {
  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} is the brand of ${SITE.legalName}, based in ${SITE.office}. Contact: ${SITE.email}.`,
    '',
    '## Products',
    ...PRODUCTS.map((p) => `- [${p.name}](${abs(`/products/${p.slug}`)}): ${p.short}`),
    '',
    '## Services',
    ...SERVICES.map((s) => `- [${s.name}](${abs(`/services/${s.slug}`)}): ${s.short}`),
    '',
    '## Company',
    `- [Client reviews](${abs('/testimonials')})`,
    `- [Blog](${abs('/blog')})`,
    `- [About](${abs('/about')})`,
    `- [Contact](${abs('/contact')})`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
