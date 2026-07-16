import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ContentHeader } from '@/components/layout/ContentHeader';
import { Footer } from '@/components/layout/Footer';
import { ItemListJsonLd, BreadcrumbJsonLd, type ItemListEntry } from '@/components/seo/StructuredData';
import { fetchDoubanSubjects, type DoubanSubject } from '@/lib/api/douban-server';
import { siteConfig } from '@/lib/config/site-config';

// Douban's "热门" list changes daily - always render fresh on request so
// this stays real, current content instead of a stale build-time snapshot.
export const dynamic = 'force-dynamic';

const title = `热门电影电视剧推荐 - ${siteConfig.name}免费高清资源榜`;
const description = `${siteConfig.name}整理的热门电影、豆瓣高分电影、热门电视剧、热门综艺榜单，基于豆瓣评分与热度实时更新，点击即可免费搜索高清资源在线观看。`;

export const metadata: Metadata = {
    title,
    description,
    alternates: {
        canonical: '/movies',
    },
    openGraph: {
        title,
        description,
        url: `${siteConfig.url}/movies`,
    },
};

interface Section {
    heading: string;
    description: string;
    items: DoubanSubject[];
}

async function getSections(): Promise<Section[]> {
    const [hotMovies, topRatedMovies, hotTv, hotVariety] = await Promise.all([
        fetchDoubanSubjects({ type: 'movie', tag: '热门', pageLimit: 12 }),
        fetchDoubanSubjects({ type: 'movie', tag: '豆瓣高分', pageLimit: 12 }),
        fetchDoubanSubjects({ type: 'tv', tag: '热门', pageLimit: 12 }),
        fetchDoubanSubjects({ type: 'tv', tag: '综艺', pageLimit: 12 }),
    ]);

    const sections: Section[] = [
        { heading: '热门电影', description: '当下热度最高的电影，实时同步豆瓣热门榜单。', items: hotMovies },
        { heading: '豆瓣高分电影', description: '豆瓣评分靠前的高分电影，值得免费高清重温。', items: topRatedMovies },
        { heading: '热门电视剧', description: '正在热播、讨论度最高的电视剧集。', items: hotTv },
        { heading: '热门综艺', description: '近期口碑与热度兼具的综艺节目。', items: hotVariety },
    ];

    return sections.filter((s) => s.items.length > 0);
}

export default async function MoviesPage() {
    const sections = await getSections();

    const allItems: ItemListEntry[] = sections.flatMap((section) =>
        section.items.map((item) => ({
            name: item.title,
            url: `${siteConfig.url}/movies/${item.id}`,
            image: item.cover ? `${siteConfig.url}${item.cover}` : undefined,
        }))
    );

    return (
        <div className="min-h-screen">
            {allItems.length > 0 && <ItemListJsonLd name="热门电影电视剧推荐" items={allItems} />}
            <BreadcrumbJsonLd
                items={[
                    { name: '首页', url: siteConfig.url },
                    { name: '热门影视', url: `${siteConfig.url}/movies` },
                ]}
            />

            <ContentHeader />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="text-center mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">热门电影电视剧推荐</h1>
                    <p className="mt-3 max-w-2xl mx-auto text-[var(--text-color-secondary)] leading-relaxed">
                        以下榜单实时同步豆瓣热门与高分数据，覆盖热门电影、豆瓣高分电影、热门电视剧与综艺。点击任意标题，
                        即可在 {siteConfig.name} 免费高清多源搜索并在线观看。
                    </p>
                </header>

                <div className="space-y-12">
                    {sections.map((section) => (
                        <section key={section.heading}>
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-[var(--text-color)]">{section.heading}</h2>
                                <p className="text-sm text-[var(--text-color-secondary)]">{section.description}</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {section.items.map((item) => (
                                    <Link
                                        key={`${section.heading}-${item.id}`}
                                        href={`/movies/${item.id}`}
                                        className="group"
                                    >
                                        <div className="relative aspect-[2/3] rounded-[var(--radius-2xl)] overflow-hidden bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                            <Image
                                                src={item.cover}
                                                alt={item.title}
                                                fill
                                                unoptimized
                                                referrerPolicy="no-referrer"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {item.rate && parseFloat(item.rate) > 0 && (
                                                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-[var(--radius-full)] text-xs font-bold text-white">
                                                    ★ {item.rate}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="mt-2 text-sm font-medium text-center text-[var(--text-color)] line-clamp-2 group-hover:text-[var(--accent-color)] transition-colors">
                                            {item.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}

                    {sections.length === 0 && (
                        <p className="text-center text-[var(--text-color-secondary)]">榜单数据暂时无法加载，请稍后重试。</p>
                    )}
                </div>

                <p className="mt-12 text-sm text-[var(--text-color-secondary)] text-center">
                    榜单数据来自豆瓣公开热度与评分信息，仅用于内容推荐参考；{siteConfig.name}本身不存储任何影视文件，
                    实际播放资源来自用户自行配置的第三方视频源。返回{' '}
                    <Link href="/" className="text-[var(--accent-color)] underline">
                        首页
                    </Link>{' '}
                    直接搜索，或查看{' '}
                    <Link href="/faq" className="text-[var(--accent-color)] underline">
                        常见问题
                    </Link>
                    。
                </p>
            </main>

            <Footer />
        </div>
    );
}
