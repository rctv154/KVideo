import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentHeader } from '@/components/layout/ContentHeader';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbJsonLd, ItemListJsonLd, type ItemListEntry } from '@/components/seo/StructuredData';
import { siteConfig } from '@/lib/config/site-config';
import popularMovies from '@/lib/data/popular-movies.json';

const MIN_MOVIES_FOR_STATIC = 3;

/** Unique genres with at least MIN_MOVIES_FOR_STATIC entries */
function allGenres() {
    const counts = new Map<string, number>();
    for (const m of popularMovies) {
        for (const g of m.genres) counts.set(g, (counts.get(g) ?? 0) + 1);
    }
    return [...counts.entries()]
        .filter(([, n]) => n >= MIN_MOVIES_FOR_STATIC)
        .map(([g]) => g);
}

export async function generateStaticParams() {
    return allGenres().map((genre) => ({ genre: encodeURIComponent(genre) }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ genre: string }>;
}): Promise<Metadata> {
    const { genre: rawGenre } = await params;
    const genre = decodeURIComponent(rawGenre);
    const movies = popularMovies.filter((m) => m.genres.includes(genre));
    if (movies.length === 0) return { title: '影视分类', robots: { index: false, follow: false } };

    const tvCount = movies.filter((m) => m.isTv).length;
    const typeWord = tvCount > movies.length / 2 ? '电视剧' : '电影';
    const year = new Date().getFullYear();
    const sample = movies.slice(0, 3).map((m) => `《${m.titleShort}》`).join('、');

    const title = `${genre}${typeWord}在线观看 ${year}最新免费高清合集 - ${siteConfig.name}`;
    const description =
        `${siteConfig.name}整理${movies.length}部${genre}${typeWord}免费高清在线观看，` +
        `包括${sample}等豆瓣高分作品，多源并行搜索，即找即看，内置智能去广告。`;

    return {
        title,
        description,
        alternates: { canonical: `/movies/genre/${encodeURIComponent(genre)}` },
        openGraph: {
            title,
            description,
            url: `${siteConfig.url}/movies/genre/${encodeURIComponent(genre)}`,
        },
    };
}

export default async function GenrePage({
    params,
}: {
    params: Promise<{ genre: string }>;
}) {
    const { genre: rawGenre } = await params;
    const genre = decodeURIComponent(rawGenre);
    const movies = popularMovies.filter((m) => m.genres.includes(genre));
    if (movies.length === 0) notFound();

    const tvCount = movies.filter((m) => m.isTv).length;
    const typeWord = tvCount > movies.length / 2 ? '电视剧' : '电影';
    const year = new Date().getFullYear();

    // Sort by rating desc
    const sorted = [...movies].sort((a, b) => parseFloat(b.rate || '0') - parseFloat(a.rate || '0'));

    const listItems: ItemListEntry[] = sorted.map((m) => ({
        name: m.titleShort,
        url: `${siteConfig.url}/movies/${m.id}`,
        image: m.cover ? `${siteConfig.url}${m.cover}` : undefined,
    }));

    // Related genres (genres that appear together)
    const relatedGenres = new Set<string>();
    for (const m of movies) {
        for (const g of m.genres) {
            if (g !== genre) relatedGenres.add(g);
        }
    }
    const relatedList = [...relatedGenres].slice(0, 8);

    return (
        <div className="min-h-screen">
            <ItemListJsonLd name={`${genre}${typeWord}合集`} items={listItems} />
            <BreadcrumbJsonLd
                items={[
                    { name: '首页', url: siteConfig.url },
                    { name: '热门影视', url: `${siteConfig.url}/movies` },
                    { name: `${genre}${typeWord}`, url: `${siteConfig.url}/movies/genre/${encodeURIComponent(genre)}` },
                ]}
            />

            <ContentHeader />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page header */}
                <header className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">
                        {genre}{typeWord}在线观看 · {year}最新免费高清合集
                    </h1>
                    <p className="mt-3 text-[var(--text-color-secondary)] leading-relaxed">
                        共 <strong className="text-[var(--text-color)]">{movies.length}</strong> 部{genre}
                        {typeWord}资源，全部来自豆瓣热门榜单，点击即可在 {siteConfig.name} 免费高清多源搜索并在线观看。
                    </p>

                    {/* Related genres */}
                    {relatedList.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-sm text-[var(--text-color-secondary)]">相关类型：</span>
                            {relatedList.map((g) => (
                                <Link
                                    key={g}
                                    href={`/movies/genre/${encodeURIComponent(g)}`}
                                    className="text-sm px-3 py-1 rounded-[var(--radius-full)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-color-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-colors"
                                >
                                    {g}
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
                                    alt={`${movie.titleShort}在线观看`}
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
                                {movie.releaseYear && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4">
                                        <span className="text-xs text-white/80">{movie.releaseYear}</span>
                                    </div>
                                )}
                            </div>
                            <h2 className="mt-2 text-sm font-medium text-center text-[var(--text-color)] line-clamp-2 group-hover:text-[var(--accent-color)] transition-colors">
                                {movie.titleShort}
                            </h2>
                        </Link>
                    ))}
                </div>

                {/* SEO content block — crawlable text that reinforces the topical cluster */}
                <section className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius-2xl)] p-6 text-sm text-[var(--text-color-secondary)] space-y-2">
                    <h2 className="text-base font-semibold text-[var(--text-color)]">{genre}{typeWord}说明</h2>
                    <p>
                        以上{genre}{typeWord}列表来自豆瓣实时热门榜单，涵盖{movies.filter(m => !m.isTv).length > 0 ? `电影 ${movies.filter(m => !m.isTv).length} 部` : ''}
                        {movies.filter(m => m.isTv).length > 0 ? `、电视剧 ${movies.filter(m => m.isTv).length} 部` : ''}。
                        {siteConfig.name}本身不存储任何影视文件，所有播放资源来自用户自行配置的第三方视频源。
                    </p>
                    <p>
                        <Link href="/movies" className="text-[var(--accent-color)] underline">返回热门影视榜单</Link>
                        {' · '}
                        <Link href="/" className="text-[var(--accent-color)] underline">首页搜索</Link>
                        {' · '}
                        <Link href="/faq" className="text-[var(--accent-color)] underline">常见问题</Link>
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
