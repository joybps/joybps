import type { MetadataRoute } from 'next';
import { abs } from '../lib/site';

const PAGES: [string, number][] = [['/', 1], ['/features', 0.7], ['/pricing', 0.7], ['/faq', 0.7], ['/contact', 0.8]];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => ({ url: abs(path), lastModified: new Date('2026-11-11'), changeFrequency: 'monthly', priority }));
}
