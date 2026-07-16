import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site-config';
import popularMovies from '@/lib/data/popular-movies.json';

/**
 * sitemap.xml
 *
 * Generated at build time from static sources only (no runtime API calls):
 * - Static content routes listed explicitly.
 * - Movie/TV detail pages (/movies/[id]) derived from the pre-fetched JSON
 *   produced by `scripts/fetch-popular-movies.mjs` (runs as "prebuild").
 *
 * This ensures the sitemap is always in sync with the pre-generated pages
 * from generateStaticParams, and the build never hits Douban rate limits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
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
            url: `${siteConfig.url}/movies`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.7,
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

    const movieDetailRoutes: MetadataRoute.Sitemap = popularMovies.map((m) => ({
        url: `${siteConfig.url}/movies/${m.id}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
    }));

    return [...staticRoutes, ...movieDetailRoutes];
}
