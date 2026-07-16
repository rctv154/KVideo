import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentHeader } from '@/components/layout/ContentHeader';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbJsonLd } from '@/components/seo/StructuredData';
import { siteConfig } from '@/lib/config/site-config';
import popularMovies from '@/lib/data/popular-movies.json';

const MIN_MOVIES_FOR_STATIC = 5;

function popularYears() {
    const counts = new Map<string, number>();
    for (const m of popularMovies) {
        if (m.releaseYear) counts.set(m.releaseYear, (counts.get(m.releaseYear) ?? 0) + 1);
    }
    return [...counts.entries()]
        .filter(([, n]) => n >= MIN_MOVIES_FOR_STATIC)
        .map(([y]) => y);
}

export async function generateStaticParams() {
    return popularYears().map((year) => ({ year }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ year: string }>;
}): Promise<Metadata> {
    const { year } = await params;
    const movies = popularMovies.filter((m) => m.releaseYear === year);
    if (movies.length === 0) return { title: '年度影视', robots: { index: false, follow: false } };

    const sample = movies.slice(0, 3).map((m) => `《${m.titleShort}》`).join('、');
    const title = `${year}年热门电影电视剧在线观看免费高清合集 - ${siteConfig.name}`;
    const description =
        `${year}年热门影视推荐：${sample}等，共${movies.length}部高分作品。` +
        `在${siteConfig.name}免费多源搜索并在线观看${year}年最新电影、电视剧、动漫，即找即看，内置智能去广告。`;

    return {
        title,
        description,
        alternates: { canonical: `/movies/year/${year}` },
        openGraph: {
            title,
            description,
            url: `${siteConfig.url}/movies/year/${year}`,
        },
    };
}

export default async function YearPage({
    params,
}: {
    params: Promise<{ year: string }>;
}) {
    const { year } = await params;
    const movies = popularMovies.filter((m) => m.releaseYear === year);
    if (movies.length === 0) notFound();

    const sorted = [...movies].sort((a, b) => parseFloat(b.rate || '0') - parseFloat(a.rate || '0'));

    const movieCount = sorted.filter((m) => !m.isTv).length;
    const tvCount = sorted.filter((m) => m.isTv).length;

    // Adjacent years that have content
    const allYears = popularYears().sort((a, b) => Number(b) - Number(a));

    return (
        <div className="min-h-screen">
            <BreadcrumbJsonLd
                items={[
                    { name: '首页', url: siteConfig.url },
                    { name: '热门影视', url: `${siteConfig.url}/movies` },
                    { name: `${year}年影视`, url: `${siteConfig.url}/movies/year/${year}` },
                ]}
            />

            <ContentHeader />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">
                        {year}年热门电影电视剧 · 免费高清在线观看
                    </h1>
                    <p className="mt-3 text-[var(--text-color-secondary)] leading-relaxed">
                        {year}年热门影视共 <strong className="text-[var(--text-color)]">{movies.length}</strong> 部
                        {movieCount > 0 && `（电影 ${movieCount} 部`}
                        {tvCount > 0 && `${movieCount > 0 ? '、' : '（'}电视剧 ${tvCount} 部`}
                        {(movieCount > 0 || tvCount > 0) && '）'}，基于豆瓣热度与评分排序，点击即可在 {siteConfig.name} 免费多源搜索在线观看。
                    </p>

                    {/* Year navigation */}
                    {allYears.length > 1 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-sm text-[var(--text-color-secondary)]">其他年份：</span>
                            {allYears.filter((y) => y !== year).map((y) => (
                                <Link
                                    key={y}
                                    href={`/movies/year/${y}`}
                                    className="text-sm px-3 py-1 rounded-[var(--radius-full)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-color-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-colors"
                                >
                                    {y}年
                                </Link>
                            ))}
                        </div>
                    )}
                </header>

                {/* Movie grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                    {sorted.map((movie) => (
                        <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                            <div className="relative aspect-[2/3] rounded-[var(--radius-2xl)] overflow-hidden bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                <Image
                                    src={movie.cover || '/placeholder-poster.svg'}
                                    alt={`${movie.titleShort}${year}年在线观看`}
                                    fill
                                    unoptimized
                                    referrerPolicy="no-referrer"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {movie.rate && parseFloat(movie.rate) > 0 && (
                                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-[var(--radius-full)] text-xs font-bold text-white">
                                        ★ {movie.rate}
                                    </div>
                                )}
                                {movie.isTv && (
                                    <div className="absolute top-2 left-2 bg-[var(--accent-color)]/90 px-1.5 py-0.5 rounded text-xs text-white font-bold">剧</div>
                                )}
                            </div>
                            <h2 className="mt-2 text-sm font-medium text-center text-[var(--text-color)] line-clamp-2 group-hover:text-[var(--accent-color)] transition-colors">
                                {movie.titleShort}
                            </h2>
                        </Link>
                    ))}
                </div>

                {/* Bottom nav */}
                <p className="text-sm text-[var(--text-color-secondary)] text-center">
                    <Link href="/movies" className="text-[var(--accent-color)] underline">返回热门影视榜单</Link>
                    {' · '}
                    <Link href="/" className="text-[var(--accent-color)] underline">首页搜索</Link>
                </p>
            </main>

            <Footer />
        </div>
    );
}
