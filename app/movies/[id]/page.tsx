import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentHeader } from '@/components/layout/ContentHeader';
import { Footer } from '@/components/layout/Footer';
import {
    MovieJsonLd,
    BreadcrumbJsonLd,
    type MovieSchemaData,
} from '@/components/seo/StructuredData';
import { siteConfig } from '@/lib/config/site-config';
import popularMovies from '@/lib/data/popular-movies.json';

type MovieEntry = (typeof popularMovies)[number];

/** O(1) lookup map built once at import time */
const movieMap = new Map<string, MovieEntry>(
    popularMovies.map((m) => [m.id, m])
);

// Pre-generate a static page for every movie in the JSON.
// The JSON is created/updated by the prebuild script (scripts/fetch-popular-movies.mjs)
// so the Next.js build itself makes zero outbound Douban API calls.
export async function generateStaticParams() {
    return popularMovies.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const movie = movieMap.get(id);

    if (!movie?.titleShort) {
        return { title: '影视详情', robots: { index: false, follow: false } };
    }

    const t = movie.titleShort;
    const year = movie.releaseYear ? `(${movie.releaseYear})` : '';
    const genres = movie.genres.slice(0, 2).join('·');

    const titleTag = `《${t}》${year}在线观看免费高清${genres ? ' ' + genres : ''} - ${siteConfig.name}`;
    const descTag =
        `在${siteConfig.name}免费搜索《${t}》${year}高清资源并在线观看。` +
        (movie.directors.length ? `导演：${movie.directors.slice(0, 2).join('、')}。` : '') +
        (movie.actors.length ? `主演：${movie.actors.slice(0, 3).join('、')}。` : '') +
        (movie.rate ? `豆瓣评分 ${movie.rate}。` : '') +
        `多源并行搜索，即找即看，内置智能去广告。`;

    return {
        title: titleTag,
        description: descTag,
        alternates: { canonical: `/movies/${id}` },
        openGraph: {
            title: titleTag,
            description: descTag,
            url: `${siteConfig.url}/movies/${id}`,
            ...(movie.cover
                ? { images: [{ url: `${siteConfig.url}${movie.cover}`, alt: t }] }
                : {}),
        },
        robots: { index: true, follow: true },
    };
}

export default async function MovieDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const movie = movieMap.get(id);

    if (!movie?.titleShort) {
        notFound();
    }

    const {
        titleShort,
        titleFull,
        rate,
        cover,
        releaseYear,
        region,
        duration,
        directors,
        actors,
        genres,
        isTv,
        shortComment,
        doubanUrl,
    } = movie;

    const schemaData: MovieSchemaData = {
        name: titleShort,
        url: `${siteConfig.url}/movies/${id}`,
        ...(cover ? { image: `${siteConfig.url}${cover}` } : {}),
        ...(releaseYear ? { dateCreated: releaseYear } : {}),
        ...(directors.length ? { director: directors } : {}),
        ...(actors.length ? { actor: actors } : {}),
        ...(genres.length ? { genre: genres } : {}),
        ...(rate ? { aggregateRating: { ratingValue: rate } } : {}),
    };

    const metaLine = [releaseYear, region, genres.join(' / '), duration]
        .filter(Boolean)
        .join(' · ');

    return (
        <div className="min-h-screen">
            <MovieJsonLd data={schemaData} isTv={isTv} />
            <BreadcrumbJsonLd
                items={[
                    { name: '首页', url: siteConfig.url },
                    { name: '热门影视', url: `${siteConfig.url}/movies` },
                    { name: titleShort, url: `${siteConfig.url}/movies/${id}` },
                ]}
            />

            <ContentHeader />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <article className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius-2xl)] overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8">
                        {/* Poster */}
                        {cover && (
                            <div className="flex-shrink-0 w-36 sm:w-44 mx-auto sm:mx-0">
                                <div className="relative aspect-[2/3] rounded-[var(--radius-2xl)] overflow-hidden border border-[var(--glass-border)]">
                                    <Image
                                        src={cover}
                                        alt={`《${titleShort}》海报`}
                                        fill
                                        unoptimized
                                        referrerPolicy="no-referrer"
                                        sizes="(max-width: 640px) 144px, 176px"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-4">
                            <header>
                                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)] leading-tight">
                                    {titleShort}
                                </h1>
                                {titleFull !== titleShort && (
                                    <p className="mt-1 text-sm text-[var(--text-color-secondary)] break-words">
                                        {titleFull}
                                    </p>
                                )}
                            </header>

                            {/* Rating + meta */}
                            <div className="flex flex-wrap items-center gap-3">
                                {rate && parseFloat(rate) > 0 && (
                                    <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-[var(--radius-full)]">
                                        <span className="text-yellow-500 text-sm">★</span>
                                        <span className="font-bold text-[var(--text-color)] text-sm">{rate}</span>
                                        <span className="text-[var(--text-color-secondary)] text-xs">豆瓣</span>
                                    </div>
                                )}
                                {metaLine && (
                                    <span className="text-sm text-[var(--text-color-secondary)]">{metaLine}</span>
                                )}
                            </div>

                            {directors.length > 0 && (
                                <div className="text-sm">
                                    <span className="text-[var(--text-color-secondary)]">导演：</span>
                                    <span className="text-[var(--text-color)]">{directors.join(' / ')}</span>
                                </div>
                            )}
                            {actors.length > 0 && (
                                <div className="text-sm">
                                    <span className="text-[var(--text-color-secondary)]">主演：</span>
                                    <span className="text-[var(--text-color)]">{actors.join(' / ')}</span>
                                </div>
                            )}

                            {shortComment && (
                                <blockquote className="border-l-2 border-[var(--accent-color)] pl-3 text-sm italic text-[var(--text-color-secondary)] leading-relaxed">
                                    {shortComment}
                                </blockquote>
                            )}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="px-6 sm:px-8 pb-8 flex flex-col sm:flex-row gap-3">
                        <Link
                            href={`/?q=${encodeURIComponent(titleShort)}`}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-color)] text-white font-bold rounded-[var(--radius-2xl)] hover:brightness-110 transition-all duration-200 shadow-md"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            免费在线观看《{titleShort}》
                        </Link>
                        <a
                            href={doubanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-color-secondary)] rounded-[var(--radius-2xl)] hover:text-[var(--accent-color)] transition-colors"
                        >
                            豆瓣详情
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                    </div>

                    {/* Disclaimer */}
                    <div className="px-6 sm:px-8 pb-6 text-xs text-[var(--text-color-secondary)] border-t border-[var(--glass-border)] pt-4">
                        以上影视信息来自豆瓣公开数据，仅用于参考展示。{siteConfig.name}
                        不存储任何视频文件，点击&ldquo;免费在线观看&rdquo;将调用你自行配置的第三方视频源进行搜索播放。返回{' '}
                        <Link href="/movies" className="underline hover:text-[var(--accent-color)]">热门影视榜单</Link>。
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
