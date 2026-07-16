/**
 * Prebuild script: fetches popular movie/TV metadata from Douban and writes
 * it to lib/data/popular-movies.json. This file is then imported statically
 * by generateStaticParams and sitemap(), so the main Next.js build makes
 * zero outbound API calls (avoids rate-limiting and fragile builds).
 *
 * Usage (runs automatically before `next build` via package.json "prebuild"):
 *   node scripts/fetch-popular-movies.mjs
 *
 * If Douban is unreachable, the existing lib/data/popular-movies.json
 * is kept unchanged and the build continues with cached data.
 */

import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'lib', 'data', 'popular-movies.json');

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Referer: 'https://movie.douban.com/',
  Accept: '*/*',
};

const MOVIE_TAGS = ['热门', '豆瓣高分', '动作', '喜剧', '科幻', '爱情'];
const TV_TAGS = ['热门', '美剧', '韩剧', '日剧', '动漫'];
const PAGE_LIMIT = 12;
const DETAIL_DELAY_MS = 150; // throttle subject_abstract calls

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchSubjects(type, tag, limit = PAGE_LIMIT) {
  const url = `https://movie.douban.com/j/search_subjects?type=${type}&tag=${encodeURIComponent(tag)}&sort=recommend&page_limit=${limit}&page_start=0`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${type}/${tag}`);
  const data = await res.json();
  return Array.isArray(data?.subjects) ? data.subjects : [];
}

async function fetchDetail(id) {
  const url = `https://movie.douban.com/j/subject_abstract?subject_id=${id}`;
  const res = await fetch(url, {
    headers: {
      ...HEADERS,
      Referer: `https://movie.douban.com/subject/${id}/`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.subject ?? null;
}

function extractShortTitle(full) {
  const m = full?.match(/^([^\x20-\x7E\uff01-\uff5e（【\[]+)/u);
  return m ? m[1].trim() : (full ?? '').trim();
}

async function main() {
  console.log('[prebuild] Fetching popular movie/TV subjects from Douban...');

  // 1. Collect all subject IDs (search_subjects is relatively fast)
  const seen = new Map(); // id -> basic data
  for (const tag of MOVIE_TAGS) {
    try {
      const subjects = await fetchSubjects('movie', tag);
      for (const s of subjects) {
        if (!seen.has(s.id)) seen.set(s.id, { ...s, isTv: false });
      }
      console.log(`  movie/${tag}: ${subjects.length} items`);
    } catch (e) {
      console.warn(`  movie/${tag} failed:`, e.message);
    }
  }
  for (const tag of TV_TAGS) {
    try {
      const subjects = await fetchSubjects('tv', tag);
      for (const s of subjects) {
        if (!seen.has(s.id)) seen.set(s.id, { ...s, isTv: true });
      }
      console.log(`  tv/${tag}: ${subjects.length} items`);
    } catch (e) {
      console.warn(`  tv/${tag} failed:`, e.message);
    }
  }

  const ids = [...seen.keys()];
  console.log(`[prebuild] Total unique subjects: ${ids.length}. Fetching details...`);

  // 2. Fetch subject_abstract for each, with throttling
  const results = [];
  for (const id of ids) {
    const basic = seen.get(id);
    await delay(DETAIL_DELAY_MS);
    try {
      const detail = await fetchDetail(id);
      const titleFull = detail?.title ?? basic.title ?? '';
      const titleShort = extractShortTitle(titleFull) || titleFull;
      const rawCover = detail?.cover_url ?? detail?.cover ?? basic.cover ?? '';
      const cover = rawCover
        ? `/api/douban/image?url=${encodeURIComponent(rawCover)}`
        : '';
      results.push({
        id,
        titleShort: titleShort || titleFull,
        titleFull,
        rate: detail?.rate ?? basic.rate ?? '',
        cover,
        releaseYear: detail?.release_year ?? '',
        region: detail?.region ?? '',
        duration: detail?.duration ?? '',
        directors: Array.isArray(detail?.directors) ? detail.directors : [],
        actors: Array.isArray(detail?.actors) ? detail.actors.slice(0, 6) : [],
        genres: Array.isArray(detail?.types) ? detail.types : [],
        isTv: detail?.is_tv ?? basic.isTv ?? false,
        shortComment: detail?.short_comment?.content ?? null,
        doubanUrl: detail?.url ?? `https://movie.douban.com/subject/${id}/`,
      });
      process.stdout.write('.');
    } catch {
      // Use just the basic data if detail fetch fails
      const titleFull = basic.title ?? '';
      const titleShort = extractShortTitle(titleFull) || titleFull;
      const rawCover = basic.cover ?? '';
      const cover = rawCover
        ? `/api/douban/image?url=${encodeURIComponent(rawCover)}`
        : '';
      results.push({
        id,
        titleShort,
        titleFull,
        rate: basic.rate ?? '',
        cover,
        releaseYear: '',
        region: '',
        duration: '',
        directors: [],
        actors: [],
        genres: [],
        isTv: basic.isTv ?? false,
        shortComment: null,
        doubanUrl: `https://movie.douban.com/subject/${id}/`,
      });
      process.stdout.write('x');
    }
  }

  console.log(`\n[prebuild] Done. Writing ${results.length} entries to lib/data/popular-movies.json`);
  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), 'utf8');
  console.log('[prebuild] ✓ popular-movies.json updated.');
}

main().catch((err) => {
  console.error('[prebuild] Fatal error:', err.message);
  if (existsSync(OUTPUT_PATH)) {
    console.log('[prebuild] Keeping existing popular-movies.json (build will use cached data).');
  } else {
    console.error('[prebuild] No cached data available. Build may fail or pre-generate no movie pages.');
  }
  process.exit(0); // Non-fatal - let the build continue
});
