import type { MetadataRoute } from 'next';
import { SITE, abs } from '../lib/site';
import { SERVICES } from '../data/services';
import { PRODUCTS } from '../data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(SITE.updated);
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' = 'monthly') => ({ url: abs(path), lastModified: now, changeFrequency, priority });
  return [
    page('/', 1, 'weekly'), page('/services', 0.9), page('/products', 0.9), page('/demos', 0.7), page('/testimonials', 0.6), page('/about', 0.7), page('/contact', 0.8),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.8)),
    ...PRODUCTS.map((p) => page(`/products/${p.slug}`, 0.8)),
  ];
}
