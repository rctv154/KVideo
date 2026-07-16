import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site-config';

/**
 * sitemap.xml
 *
 * Only static, indexable, content-bearing routes are listed. Dynamic
 * routes driven purely by query params (/player, search results) are
 * intentionally excluded - see app/robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/premium`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
