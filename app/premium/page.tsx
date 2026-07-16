'use client';

import { Suspense } from 'react';
import { SearchForm } from '@/components/search/SearchForm';
import { NoResults } from '@/components/search/NoResults';
import { Navbar } from '@/components/layout/Navbar';
import { SearchResults } from '@/components/home/SearchResults';
import { usePremiumHomePage } from '@/lib/hooks/usePremiumHomePage';
import { PremiumContent } from '@/components/premium/PremiumContent';
import { FavoritesSidebar } from '@/components/favorites/FavoritesSidebar';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/lib/config/site-config';

function PremiumHomePage() {
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
    } = usePremiumHomePage();

    return (
        <div className="min-h-screen bg-black">
            {/* Glass Navbar */}
            <Navbar onReset={handleReset} isPremiumMode={true} />

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
                    placeholder="输入关键词开始搜索..."
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
                        isPremium={true}
                    />
                )}

                {/* No Results */}
                {!loading && hasSearched && results.length === 0 && (
                    <NoResults onReset={handleReset} />
                )}

                {/* Premium Content - Trending and Latest */}
                {!loading && !hasSearched && (
                    <PremiumContent onSearch={handleSearch} />
                )}
            </main>

            {/* Favorites Sidebar - Left */}
            <FavoritesSidebar isPremium={true} />
        </div>
    );
}

/**
 * SEO / GEO note: see the equivalent comment in app/page.tsx - the heading,
 * intro copy and footer are rendered outside the Suspense boundary so they
 * remain fully static and crawlable even for bots that don't execute JS.
 */
export default function PremiumPage() {
    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-3xl mx-auto px-4 pt-6 sm:pt-8 text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {siteConfig.name} 高级专区 · 高级影视资源搜索
                </h1>
                <p className="mt-1 text-sm text-[var(--text-color-secondary)]">
                    与普通区完全隔离的独立高级影视源搜索入口，支持自定义高级视频源与多源并行搜索。
                </p>
            </div>

            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-black">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--accent-color)] border-t-transparent"></div>
                </div>
            }>
                <PremiumHomePage />
            </Suspense>

            <Footer isPremiumMode />
        </div>
    );
}
