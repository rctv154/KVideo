/**
 * Server-only helpers for Douban's public subject endpoints.
 * Used by /movies hub and /movies/[id] detail pages for SSR.
 * Only metadata is fetched (title, poster, rating, cast) - no video streams.
 */

export interface DoubanSubject {
  id: string;
  title: string;
  cover: string;
  rate: string;
  url: string;
}

export interface DoubanSubjectDetail {
  id: string;
  /** Full title as Douban returns it, e.g. "肖申克的救赎 The Shawshank Redemption (1994)" */
  titleFull: string;
  /** First segment only (before the first ASCII space / parenthesis), e.g. "肖申克的救赎" */
  titleShort: string;
  rate: string;
  cover: string;
  releaseYear: string;
  region: string;
  duration: string;
  directors: string[];
  actors: string[];
  genres: string[];
  isTv: boolean;
  shortComment?: string;
  doubanUrl: string;
}

// ─── search_subjects (list) ─────────────────────────────────────────────────

export async function fetchDoubanSubjects(options: {
  type: 'movie' | 'tv';
  tag: string;
  pageLimit?: number;
}): Promise<DoubanSubject[]> {
  const { type, tag, pageLimit = 12 } = options;

  try {
    const url = `https://movie.douban.com/j/search_subjects?type=${type}&tag=${encodeURIComponent(
      tag
    )}&sort=recommend&page_limit=${pageLimit}&page_start=0`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        Referer: 'https://movie.douban.com/',
      },
    });

    if (!response.ok) throw new Error(`Douban API returned ${response.status}`);

    const data = await response.json();
    const subjects: DoubanSubject[] = Array.isArray(data?.subjects) ? data.subjects : [];

    return subjects.map((item) => ({
      ...item,
      cover: item.cover ? `/api/douban/image?url=${encodeURIComponent(item.cover)}` : item.cover,
    }));
  } catch (error) {
    console.error(`[douban-server] Failed to fetch ${type}/${tag}:`, error);
    return [];
  }
}

// ─── Fetch a deduped subject list from multiple popular tags ─────────────────

const POPULAR_MOVIE_TAGS = ['热门', '豆瓣高分', '动作', '喜剧', '科幻', '爱情'] as const;
const POPULAR_TV_TAGS = ['热门', '美剧', '韩剧', '日剧', '动漫'] as const;

export async function fetchPopularSubjects(pageLimit = 12): Promise<DoubanSubject[]> {
  const requests = [
    ...POPULAR_MOVIE_TAGS.map((tag) => fetchDoubanSubjects({ type: 'movie', tag, pageLimit })),
    ...POPULAR_TV_TAGS.map((tag) => fetchDoubanSubjects({ type: 'tv', tag, pageLimit })),
  ];

  const results = await Promise.all(requests);

  const seen = new Set<string>();
  const out: DoubanSubject[] = [];
  for (const list of results) {
    for (const s of list) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        out.push(s);
      }
    }
  }
  return out;
}

// ─── subject_abstract (single subject detail) ───────────────────────────────

function extractShortTitle(full: string): string {
  // "肖申克的救赎 The Shawshank Redemption‎ (1994)" → "肖申克的救赎"
  // Works by taking everything before the first ASCII letter or "("
  const m = full.match(/^([^\x20-\x7E\uff01-\uff5e（【\[]+)/u);
  return m ? m[1].trim() : full.trim();
}

export async function fetchDoubanSubjectDetail(
  id: string,
  /** Optional cover URL from the list page, used as fallback */
  fallbackCover?: string
): Promise<DoubanSubjectDetail | null> {
  try {
    const url = `https://movie.douban.com/j/subject_abstract?subject_id=${id}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: `https://movie.douban.com/subject/${id}/`,
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const s = data?.subject;
    if (!s) return null;

    const titleFull: string = s.title ?? '';
    const titleShort = extractShortTitle(titleFull) || titleFull;

    const rawCover = s.cover_url ?? s.cover ?? '';
    const cover = rawCover
      ? `/api/douban/image?url=${encodeURIComponent(rawCover)}`
      : fallbackCover ?? '';

    return {
      id,
      titleFull,
      titleShort,
      rate: s.rate ?? s.rating?.value?.toString() ?? '',
      cover,
      releaseYear: s.release_year ?? '',
      region: s.region ?? '',
      duration: s.duration ?? '',
      directors: Array.isArray(s.directors) ? s.directors : [],
      actors: Array.isArray(s.actors) ? s.actors.slice(0, 6) : [],
      genres: Array.isArray(s.types) ? s.types : [],
      isTv: s.is_tv === true,
      shortComment: s.short_comment?.content ?? undefined,
      doubanUrl: s.url ?? `https://movie.douban.com/subject/${id}/`,
    };
  } catch (err) {
    console.error(`[douban-server] fetchDoubanSubjectDetail(${id}) error:`, err);
    return null;
  }
}
