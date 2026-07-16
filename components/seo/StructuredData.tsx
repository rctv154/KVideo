/**
 * Structured data (JSON-LD) helpers for SEO & GEO (Generative Engine Optimization).
 * These give search engines and AI answer engines (Google AI Overviews, ChatGPT,
 * Perplexity, etc.) an unambiguous, machine-readable description of the site.
 */

import { siteConfig } from '@/lib/config/site-config';

function JsonLdScript({ id, data }: { id: string; data: Record<string, unknown> }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Sitewide WebSite + SearchAction schema, enables Google sitelinks searchbox. */
export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: siteConfig.englishName,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLdScript id="ld-website" data={data} />;
}

/** Organization / brand identity schema. */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    alternateName: siteConfig.englishName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    description: siteConfig.description,
  };

  return <JsonLdScript id="ld-organization" data={data} />;
}

/** Describes the app itself as a free web application (helps AI tools summarize "what is this site"). */
export function SoftwareApplicationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    alternateName: siteConfig.englishName,
    url: siteConfig.url,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (Web Browser)',
    description: siteConfig.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
  };

  return <JsonLdScript id="ld-webapp" data={data} />;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage schema - one of the highest-value structured data types for GEO / AI Overviews. */
export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return <JsonLdScript id="ld-faq" data={data} />;
}

export interface ItemListEntry {
  name: string;
  url: string;
  image?: string;
}

/**
 * ItemList schema for collection/hub pages (e.g. /movies). Deliberately
 * uses the generic ItemList + CreativeWork shape rather than a strict
 * Movie/TVSeries type, since we only have title/poster/rating from Douban's
 * public API - claiming full Movie schema fields we don't actually have
 * would be inaccurate structured data.
 */
export function ItemListJsonLd({ name, items }: { name: string; items: ItemListEntry[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: item.name,
        url: item.url,
        ...(item.image ? { image: item.image } : {}),
      },
    })),
  };

  return <JsonLdScript id="ld-itemlist" data={data} />;
}

export interface MovieSchemaData {
  name: string;
  description?: string;
  image?: string;
  dateCreated?: string;
  director?: string[];
  actor?: string[];
  genre?: string[];
  aggregateRating?: { ratingValue: string; ratingCount?: number };
  url: string;
}

/**
 * Movie/TVSeries structured data for /movies/[id] detail pages.
 * Only includes fields we actually have from Douban's public API.
 * This helps Google show rich cards (rating stars, release year) in search results.
 */
export function MovieJsonLd({ data, isTv }: { data: MovieSchemaData; isTv?: boolean }) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isTv ? 'TVSeries' : 'Movie',
    name: data.name,
    url: data.url,
    ...(data.description ? { description: data.description } : {}),
    ...(data.image ? { image: data.image } : {}),
    ...(data.dateCreated ? { dateCreated: data.dateCreated } : {}),
    ...(data.director?.length
      ? { director: data.director.map((n) => ({ '@type': 'Person', name: n })) }
      : {}),
    ...(data.actor?.length
      ? { actor: data.actor.map((n) => ({ '@type': 'Person', name: n })) }
      : {}),
    ...(data.genre?.length ? { genre: data.genre } : {}),
    ...(data.aggregateRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: data.aggregateRating.ratingValue,
            bestRating: '10',
            worstRating: '1',
            ...(data.aggregateRating.ratingCount
              ? { ratingCount: data.aggregateRating.ratingCount }
              : {}),
          },
        }
      : {}),
  };

  return <JsonLdScript id="ld-movie" data={schema} />;
}

/** BreadcrumbList schema for secondary pages, improves rich result display. */
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript id="ld-breadcrumb" data={data} />;
}
