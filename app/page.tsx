'use client';

import { Suspense, useMemo } from 'react';
import { SearchForm } from '@/components/search/SearchForm';
import { NoResults } from '@/components/search/NoResults';
import { PopularFeatures } from '@/components/home/PopularFeatures';
import { WatchHistorySidebar } from '@/components/history/WatchHistorySidebar';
import { FavoritesSidebar } from '@/components/favorites/FavoritesSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { SearchResults } from '@/components/home/SearchResults';
import { Footer } from '@/components/layout/Footer';
import { useHomePage } from '@/lib/hooks/useHomePage';
import { useLatencyPing } from '@/lib/hooks/useLatencyPing';
import { siteConfig } from '@/lib/config/site-config';

function HomePage() {
  const {
    query,
    hasSearched,
    loading,
    results,
    availableSources,
    completedSources,
    totalSources,
    handleSearch,
    handleReset,
  } = useHomePage();

  // Real-time latency pinging
  const sourceUrls = useMemo(() =>
    availableSources.map(s => ({ id: s.id, baseUrl: s.id })), // Using id as baseUrl if not available elsewhere
    [availableSources]
  );

  const { latencies } = useLatencyPing({
    sourceUrls,
    enabled: hasSearched && results.length > 0,
  });

  return (
    <div className="min-h-screen">
      {/* Glass Navbar */}
      <Navbar onReset={handleReset} />

      {/* Search Form - Separate from navbar */}
      <div className="max-w-7xl mx-auto px-4 mt-6 mb-8 relative" style={{
        transform: 'translate3d(0, 0, 0)',
        zIndex: 1000
      }}>
        <SearchForm
          onSearch={handleSearch}
          onClear={handleReset}
          isLoading={loading}
          initialQuery={query}
          currentSource=""
          checkedSources={completedSources}
          totalSources={totalSources}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Results Section */}
        {(results.length >= 1 || (!loading && results.length > 0)) && (
          <SearchResults
            results={results}
            availableSources={availableSources}
            loading={loading}
            latencies={latencies}
          />
        )}

        {/* Popular Features - Homepage */}
        {!loading && !hasSearched && <PopularFeatures onSearch={handleSearch} />}

        {/* No Results */}
        {!loading && hasSearched && results.length === 0 && (
          <NoResults onReset={handleReset} />
        )}
      </main>

      {/* Favorites Sidebar - Left */}
      <FavoritesSidebar />

      {/* Watch History Sidebar - Right */}
      <WatchHistorySidebar />
    </div>
  );
}

/**
 * SEO / GEO note: `HomePage` uses `useSearchParams()`, which forces the
 * Suspense boundary below into a client-rendered "hole" - none of its
 * content ends up in the static/prerendered HTML that non-JS crawlers
 * (most AI answer-engine bots) receive. The heading, intro copy and
 * footer below are rendered here, *outside* the Suspense boundary, so
 * they remain fully static and crawlable regardless of JavaScript
 * execution, while the interactive search UI still streams in for
 * real users and JS-executing crawlers (Googlebot, Bingbot, etc.).
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 pt-6 sm:pt-8 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-color)]">
          {siteConfig.name} <span className="text-[var(--text-color-secondary)] font-normal">（{siteConfig.englishName}）</span> · 免费多源影视聚合搜索
        </h1>
        <p className="mt-1 text-sm text-[var(--text-color-secondary)]">
          汇聚全网免费电影、电视剧、动漫、综艺资源，多源并行搜索，即搜即看，支持自定义视频源与订阅源管理。
        </p>
      </div>

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--accent-color)] border-t-transparent"></div>
        </div>
      }>
        <HomePage />
      </Suspense>

      <Footer />
    </div>
  );
}
