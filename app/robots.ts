import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site-config';

/**
 * robots.txt
 *
 * SEO: standard crawlers are allowed on all indexable content; utility/dynamic
 * routes (settings, player, proxy, internal API) are disallowed since they
 * hold no unique indexable value and would otherwise create thin/duplicate pages.
 *
 * GEO: AI answer-engine crawlers are explicitly allowed so this site's content
 * can be cited by generative search / chat products.
 *
 * YANDEX: Yandex crawler family is listed explicitly (in addition to the catch-all
 * `*` rule) so their indexing priority queue treats the site as cooperative.
 * The `Host:` directive at the end is Yandex-specific — it tells Yandex which
 * of the site's mirrors/protocol variants to treat as canonical.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/settings', '/premium/settings', '/player'];

  // OpenAI / Anthropic / Perplexity / Google / Apple / ByteDance AI crawlers
  const aiCrawlers = [
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'Bytespider',
    'CCBot',
  ];

  // Yandex crawler family — explicit rules signal cooperation to Yandex's
  // crawl scheduler and are required for Yandex Webmaster to report correctly.
  // `Ya` is the crawler for Alice (Yandex's AI assistant) and YandexGPT.
  const yandexCrawlers = [
    'YandexBot',         // main web crawler
    'YandexImages',      // image indexing
    'YandexVideo',       // video indexing
    'YandexMedia',       // media content
    'YandexMobileBot',   // mobile-first indexing
    'YandexDirect',      // ad relevance
    'YandexMetrika',     // analytics beacon
    'Ya',                // Alice AI assistant / YandexGPT training
  ];

  return {
    rules: [
      // Catch-all: all standard bots follow these rules
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      // Explicit allow for AI crawlers (GEO: generative-engine indexing)
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow,
      })),
      // Explicit allow for the full Yandex crawler family
      ...yandexCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    // `host` is a Yandex-specific directive that canonicalises the preferred
    // domain/protocol; other engines ignore it.
    host: siteConfig.url,
  };
}
