/**
 * Site Configuration
 * Handles environment variables for site branding, SEO and GEO customization
 */

export interface SiteConfig {
  /** Display brand name (Chinese) */
  name: string;
  /** Latin/English brand name, used in <title> suffixes and structured data */
  englishName: string;
  /** Full <title> for the homepage */
  title: string;
  /** Meta description */
  description: string;
  /** Comma separated keyword seed list, used for the `keywords` meta tag */
  keywords: string[];
  /** Canonical site URL, no trailing slash */
  url: string;
  /** Short one-line tagline used in hero sections / structured data */
  tagline: string;
}

const DEFAULT_URL = 'https://vv19.com';

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

function parseKeywords(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback;
  const parsed = value
    .split(/[,，]/)
    .map((k) => k.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : fallback;
}

const DEFAULT_KEYWORDS = [
  'VV影视',
  'VVideo',
  '影视聚合搜索',
  '在线观看',
  '免费电影',
  '免费电视剧',
  '多源影视搜索',
  '影视资源搜索引擎',
  '追剧',
  '高清资源',
  '动漫在线观看',
  '综艺在线观看',
];

/**
 * Site configuration object
 * Uses environment variables with fallback to default values
 * Note: NEXT_PUBLIC_ environment variables are statically embedded at build time
 */
export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'VV影视',
  englishName: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'VVideo',
  title:
    process.env.NEXT_PUBLIC_SITE_TITLE ||
    'VV影视 (VVideo) - 免费在线电影电视剧多源聚合搜索平台',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'VV影视（VVideo）是一个免费的影视聚合搜索平台，支持多源并行搜索电影、电视剧、动漫、综艺，聚合全网免费影视资源，高清流畅在线观看，支持自定义视频源与订阅源管理。',
  keywords: parseKeywords(process.env.NEXT_PUBLIC_SITE_KEYWORDS, DEFAULT_KEYWORDS),
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_URL),
  tagline:
    process.env.NEXT_PUBLIC_SITE_TAGLINE ||
    '免费多源影视聚合搜索，海量电影电视剧一搜即得',
};
