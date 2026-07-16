import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentHeader } from '@/components/layout/ContentHeader';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbJsonLd } from '@/components/seo/StructuredData';
import { siteConfig } from '@/lib/config/site-config';

const title = `关于我们 - ${siteConfig.name}是什么`;
const description = `了解${siteConfig.name}（${siteConfig.englishName}）：一个免费、注重隐私的多源影视聚合搜索平台，支持电影、电视剧、动漫、综艺的并行搜索与在线播放。`;

export const metadata: Metadata = {
    title,
    description,
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title,
        description,
        url: `${siteConfig.url}/about`,
    },
};

const features = [
    {
        title: '多源并行搜索',
        desc: '同时向多个视频源发起搜索请求，快速聚合电影、电视剧、动漫、综艺的搜索结果，无需逐个网站查找。',
    },
    {
        title: '自定义视频源与订阅源',
        desc: '支持自行添加、编辑视频源，或订阅一个包含多个源的 JSON 列表，实现批量导入与自动更新。',
    },
    {
        title: '流畅在线播放',
        desc: '基于 HLS(.m3u8) 的网页播放器，支持选集、倍速播放、断点续播、广告过滤等功能。',
    },
    {
        title: '豆瓣热门推荐',
        desc: '首页展示豆瓣电影与电视剧热门榜单，一键搜索同名影视资源。',
    },
    {
        title: '本地隐私保护',
        desc: '搜索历史、观看记录、收藏与自定义源配置均保存在你的浏览器本地，不上传、不收集任何用户数据。',
    },
    {
        title: '高级专区',
        desc: '独立的高级模式入口（/premium），内容与普通区完全物理隔离，拥有专属的源管理与设置。',
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <BreadcrumbJsonLd
                items={[
                    { name: '首页', url: siteConfig.url },
                    { name: '关于我们', url: `${siteConfig.url}/about` },
                ]}
            />

            <ContentHeader />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <article className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius-2xl)] p-6 sm:p-10 space-y-8">
                    <header>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">
                            关于 {siteConfig.name}（{siteConfig.englishName}）
                        </h1>
                        <p className="mt-3 text-[var(--text-color-secondary)] leading-relaxed">
                            {siteConfig.name} 是一个免费的{' '}
                            <strong className="text-[var(--text-color)]">影视聚合搜索平台</strong>
                            ，专注于帮助用户在多个视频源中快速找到想看的电影、电视剧、动漫和综艺。{siteConfig.name}
                            本身不存储、不上传、不托管任何影视内容，而是同时向你自行配置的第三方视频源发起并行搜索，
                            将结果聚合、排序后展示给你，是一个纯粹的“搜索与播放入口”工具。
                        </p>
                    </header>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">核心功能</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {features.map((f) => (
                                <div key={f.title} className="p-4 rounded-[var(--radius-2xl)] bg-[color-mix(in_srgb,var(--text-color)_4%,transparent)]">
                                    <h3 className="font-semibold text-[var(--text-color)] mb-1">{f.title}</h3>
                                    <p className="text-sm text-[var(--text-color-secondary)]">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--text-color)] mb-3">设计理念：Liquid Glass</h2>
                        <p className="text-[var(--text-color-secondary)] leading-relaxed">
                            {siteConfig.name} 采用自研的“Liquid Glass（液态玻璃）”视觉设计语言，通过磨砂半透明的玻璃拟态效果、
                            统一的圆角与光影交互，打造流畅、现代、舒适的浏览与观看体验，并全面支持深色/浅色主题切换。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--text-color)] mb-3">隐私保护</h2>
                        <p className="text-[var(--text-color-secondary)] leading-relaxed">
                            我们高度重视用户隐私：搜索历史、观看进度、收藏列表以及自定义视频源配置均只保存在你当前浏览器的本地存储中，
                            不会上传到任何服务器，也不会用于追踪或分析。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[var(--text-color)] mb-3">开始使用</h2>
                        <p className="text-[var(--text-color-secondary)] leading-relaxed">
                            前往{' '}
                            <Link href="/" className="text-[var(--accent-color)] underline">
                                首页
                            </Link>{' '}
                            输入关键词即可开始搜索，或查看{' '}
                            <Link href="/faq" className="text-[var(--accent-color)] underline">
                                常见问题
                            </Link>{' '}
                            了解更多使用细节。
                        </p>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
}
