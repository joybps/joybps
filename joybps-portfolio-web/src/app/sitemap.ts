import type { MetadataRoute } from 'next';
import { SITE, abs } from '../lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: abs('/'), lastModified: new Date(SITE.updated), changeFrequency: 'monthly', priority: 1 }];
}
