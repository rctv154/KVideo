/**
 * Server-only helper for fetching Douban's public "search_subjects" endpoint
 * directly (bypassing our own /api/douban/recommend route to avoid a
 * self-referential HTTP round trip during server rendering, which is
 * fragile across dev/preview/self-hosted domains).
 *
 * Used by the /movies hub page (real, licensed metadata only - title,
 * poster, rating - never the actual video stream) to produce genuinely
 * unique, stable, indexable content instead of thin/duplicate pages.
 */

export interface DoubanSubject {
  id: string;
  title: string;
  cover: string;
  rate: string;
  url: string;
}

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

    if (!response.ok) {
      throw new Error(`Douban API returned ${response.status}`);
    }

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
