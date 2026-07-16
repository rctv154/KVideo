/**
 * IndexNow URL submission script.
 *
 * Parses the live sitemap.xml and bulk-submits all URLs to the IndexNow API,
 * which fans the request out to Yandex, Bing, Naver, Sogou, and other
 * participating engines. Most engines index submitted URLs within minutes
 * instead of waiting days for the crawler to discover them.
 *
 * Usage:
 *   INDEXNOW_KEY=<your-uuid> SITE_URL=https://vv19.com node scripts/submit-indexnow.mjs
 *
 *   Or after setting env vars in your shell / .env file:
 *   node scripts/submit-indexnow.mjs
 *
 * Recommended: run once after each deployment that adds or changes pages.
 * IndexNow has a generous quota (up to 10 000 URLs per day per key for free).
 *
 * IndexNow API docs: https://www.indexnow.org/documentation
 * Yandex IndexNow:   https://webmaster.yandex.com/indexnow/
 * Bing IndexNow:     https://www.bing.com/indexnow
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Config ----------------------------------------------------------------

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITE_URL =
  process.env.SITE_URL ||
  (() => {
    // Fall back to reading siteConfig.url from the site-config file if possible
    const cfgPath = join(__dirname, '..', 'lib', 'config', 'site-config.ts');
    if (existsSync(cfgPath)) {
      const src = readFileSync(cfgPath, 'utf8');
      const m = src.match(/DEFAULT_URL\s*=\s*['"]([^'"]+)['"]/);
      if (m) return m[1];
    }
    return 'https://vv19.com';
  })();

const KEY_LOCATION = `${SITE_URL}/indexnow-key.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Engines that run their own IndexNow endpoint (submit to all for maximum coverage)
const ENGINES = [
  'https://api.indexnow.org/indexnow',        // IndexNow aggregator → fans out to all
  'https://www.bing.com/indexnow',             // Bing / Microsoft
  'https://yandex.com/indexnow',               // Yandex
];

// ---------------------------------------------------------------------------

if (!INDEXNOW_KEY) {
  console.error('[IndexNow] Error: INDEXNOW_KEY environment variable is not set.');
  console.error('  Set it with:  INDEXNOW_KEY=<your-uuid> node scripts/submit-indexnow.mjs');
  process.exit(1);
}

async function fetchSitemapUrls() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  console.log(`[IndexNow] Fetching sitemap from ${sitemapUrl} …`);

  const res = await fetch(sitemapUrl);
  if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status}`);

  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

async function submitUrls(urls, engineEndpoint) {
  const host = new URL(SITE_URL).hostname;

  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(engineEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  return res.status;
}

async function main() {
  const urls = await fetchSitemapUrls();
  console.log(`[IndexNow] Found ${urls.length} URLs in sitemap.`);

  if (urls.length === 0) {
    console.warn('[IndexNow] No URLs found. Check if the sitemap is accessible.');
    return;
  }

  for (const engine of ENGINES) {
    try {
      const status = await submitUrls(urls, engine);
      if (status === 200 || status === 202) {
        console.log(`[IndexNow] ✓ ${engine.replace('https://', '')} → HTTP ${status} (accepted)`);
      } else if (status === 422) {
        console.warn(`[IndexNow] ⚠ ${engine}: HTTP 422 — URL format invalid or key mismatch`);
      } else if (status === 429) {
        console.warn(`[IndexNow] ⚠ ${engine}: HTTP 429 — rate limited, try again later`);
      } else {
        console.warn(`[IndexNow] ⚠ ${engine}: HTTP ${status}`);
      }
    } catch (err) {
      console.error(`[IndexNow] ✗ ${engine}: ${err.message}`);
    }
  }

  console.log('\n[IndexNow] Done. Engines will index submitted URLs within minutes.');
  console.log('[IndexNow] Track indexing progress in:');
  console.log('  Yandex → https://webmaster.yandex.com/');
  console.log('  Bing   → https://www.bing.com/webmasters/');
}

main().catch((err) => {
  console.error('[IndexNow] Fatal:', err.message);
  process.exit(1);
});
