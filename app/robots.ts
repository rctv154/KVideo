import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config/site-config';

/**
 * robots.txt
 *
 * SEO: standard crawlers are allowed on all indexable content, while
 * utility/dynamic routes (settings, player, proxy, internal API) are
 * disallowed since they hold no unique indexable value and would
 * otherwise create thin/duplicate-content pages.
 *
 * GEO: AI answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
 * are explicitly allowed so that this site's content can be cited by
 * generative search / chat products.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/settings', '/premium/settings', '/player'];

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

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
