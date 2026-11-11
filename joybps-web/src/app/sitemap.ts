import type { MetadataRoute } from 'next';
import { SITE, abs } from '../lib/site';
import { PRODUCTS } from '../data/products';
import { SERVICES } from '../data/services';
import { POSTS } from '../data/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(SITE.updated);
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'monthly', lastModified = now) => ({
    url: abs(path),
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page('/', 1, 'weekly'),
    page('/products', 0.9),
    ...PRODUCTS.map((p) => page(`/products/${p.slug}`, 0.8)),
    page('/services', 0.9),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.8)),
    page('/demos', 0.7),
    page('/testimonials', 0.6),
    page('/about', 0.6),
    page('/blog', 0.7, 'weekly'),
    ...POSTS.map((p) => page(`/blog/${p.slug}`, 0.6, 'monthly', new Date(p.date))),
    page('/contact', 0.8),
    page('/privacy-policy', 0.2, 'yearly'),
    page('/terms-and-conditions', 0.2, 'yearly'),
    page('/cookie-policy', 0.2, 'yearly'),
  ];
}
