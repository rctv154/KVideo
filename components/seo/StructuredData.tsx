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
