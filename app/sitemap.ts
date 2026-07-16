import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site-config';
import popularMovies from '@/lib/data/popular-movies.json';

/**
 * sitemap.xml — generated at build time from static sources only.
 *
 * Includes:
 * - Static pages (home, premium, movies hub, about, faq)
 * - 110+ hot movie/TV detail pages at /movies/[id]
 * - Genre cluster pages at /movies/genre/[genre]  ← long-tail keyword pages
 * - Year pages at /movies/year/[year]             ← temporal search intent
 *
 * All data comes from lib/data/popular-movies.json (no runtime API calls).
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
        { url: `${siteConfig.url}/premium`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
        { url: `${siteConfig.url}/movies`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
        { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${siteConfig.url}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ];

    // Movie detail pages
    const movieDetailRoutes: MetadataRoute.Sitemap = popularMovies.map((m) => ({
        url: `${siteConfig.url}/movies/${m.id}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
    }));

    // Genre cluster pages — key long-tail keyword surfaces
    const genreCounts = new Map<string, number>();
    for (const m of popularMovies) {
        for (const g of m.genres) genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1);
    }
    const genreRoutes: MetadataRoute.Sitemap = [...genreCounts.entries()]
        .filter(([, n]) => n >= 3)
        .map(([genre]) => ({
            url: `${siteConfig.url}/movies/genre/${encodeURIComponent(genre)}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

    // Year pages
    const yearCounts = new Map<string, number>();
    for (const m of popularMovies) {
        if (m.releaseYear) yearCounts.set(m.releaseYear, (yearCounts.get(m.releaseYear) ?? 0) + 1);
    }
    const yearRoutes: MetadataRoute.Sitemap = [...yearCounts.entries()]
        .filter(([, n]) => n >= 5)
        .map(([year]) => ({
            url: `${siteConfig.url}/movies/year/${year}`,
            lastModified: now,
            changeFrequency: 'daily' as const,
            priority: 0.65,
        }));

    return [...staticRoutes, ...movieDetailRoutes, ...genreRoutes, ...yearRoutes];
}
