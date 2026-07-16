import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentHeader } from '@/components/layout/ContentHeader';
import { Footer } from '@/components/layout/Footer';
import { FaqJsonLd, BreadcrumbJsonLd, type FaqItem } from '@/components/seo/StructuredData';
import { siteConfig } from '@/lib/config/site-config';

const title = `常见问题 FAQ - ${siteConfig.name}使用指南`;
const description = `${siteConfig.name}常见问题解答：视频源与订阅源的区别、如何自定义视频源、观看历史与收藏是否会上传、广告过滤模式、密码访问控制、自行部署等。`;

export const metadata: Metadata = {
    title,
    description,
    alternates: {
        canonical: '/faq',
    },
    openGraph: {
        title,
        description,
        url: `${siteConfig.url}/faq`,
    },
};

const faqs: FaqItem[] = [
    {
        question: `${siteConfig.name}是什么？可以免费使用吗？`,
        answer: `${siteConfig.name}（${siteConfig.englishName}）是一个免费的影视聚合搜索平台，支持电影、电视剧、动漫、综艺的多源并行搜索与在线播放。完全免费，无需注册、无需付费。`,
    },
    {
        question: `${siteConfig.name}上的视频资源来自哪里？`,
        answer: `${siteConfig.name}本身不存储、不上传、不托管任何影视内容。所有搜索结果均来自你自行添加或订阅的第三方视频源 API，${siteConfig.name}只负责并行搜索、聚合展示与播放入口。`,
    },
    {
        question: '视频源和订阅源有什么区别？',
        answer: '视频源（Source）指向单个 CMS/App API 接口，例如一个 https://api.example.com/vod 地址，只能在“自定义源管理”中作为单个源添加。订阅源（Subscription）指向一个包含多个视频源列表的 JSON 文件链接，添加后可以自动更新、批量导入多个源。简单来说：只有一个接口地址就添加“视频源”，有一个包含多个源的 JSON 列表链接就添加“订阅源”。',
    },
    {
        question: '如何添加或管理自定义视频源？',
        answer: '进入设置页面（右上角齿轮图标），在“视频源管理”中点击添加，填写名称与 API 地址即可。也可以通过“订阅管理”添加一个订阅源 JSON 链接，实现自动更新。',
    },
    {
        question: '我的搜索历史、观看记录和收藏会上传到服务器吗？',
        answer: `不会。${siteConfig.name}高度重视用户隐私，搜索历史、观看进度、收藏列表以及自定义视频源配置均只保存在你当前浏览器的本地存储（localStorage）中，不会上传、不会被收集或用于追踪分析。`,
    },
    {
        question: '什么是“高级模式”？',
        answer: `高级模式是 ${siteConfig.name} 的一个独立入口（/premium），拥有与普通区完全物理隔离的内容源、搜索结果和设置，互不干扰。`,
    },
    {
        question: '播放时可以过滤广告吗？支持高清播放吗？',
        answer: `播放清晰度取决于你所选视频源提供的画质（多数源提供高清 720P/1080P）。广告方面，播放器设置中提供关闭、关键词过滤、智能启发式过滤（Beta）和激进模式四种广告过滤选项，可以自动屏蔽大部分片源自带的广告片段，基于流式处理，对播放加载速度影响很小。`,
    },
    {
        question: '视频无法播放或加载失败怎么办？',
        answer: '可以尝试切换到该影片的其他视频源，或在设置中调整“代理模式”（重试 / 不代理 / 始终代理），部分源可能需要代理转发才能正常播放。',
    },
    {
        question: '可以设置密码保护访问吗？',
        answer: '可以。支持在设置页面本地添加访问密码（仅在当前设备生效），也支持部署时通过 ACCESS_PASSWORD 环境变量设置全局密码，并可通过 PERSIST_PASSWORD 控制是否记住解锁状态。',
    },
    {
        question: `${siteConfig.name}支持哪些设备和平台？`,
        answer: '支持桌面、平板和移动设备的响应式浏览器访问，针对移动端做了专门的触摸手势与交互优化，并支持深色/浅色主题自动切换。',
    },
    {
        question: '可以自己部署一套吗？',
        answer: '可以，项目在 GitHub 开源，支持 Vercel 一键部署、Cloudflare Pages 部署、Docker 部署以及传统 Node.js 部署，部署完成后即拥有一个完全独立、可自定义品牌的实例。',
    },
];

export default function FaqPage() {
    return (
        <div className="min-h-screen">
            <FaqJsonLd items={faqs} />
            <BreadcrumbJsonLd
                items={[
                    { name: '首页', url: siteConfig.url },
                    { name: '常见问题', url: `${siteConfig.url}/faq` },
                ]}
            />

            <ContentHeader />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <article className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius-2xl)] p-6 sm:p-10">
                    <header className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">常见问题</h1>
                        <p className="mt-3 text-[var(--text-color-secondary)] leading-relaxed">
                            关于 {siteConfig.name}（{siteConfig.englishName}）的功能、隐私与部署常见问题解答。如果这里没有解决你的疑问，
                            欢迎前往{' '}
                            <a
                                href="https://github.com/KuekHaoYang/KVideo/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--accent-color)] underline"
                            >
                                GitHub Issues
                            </a>{' '}
                            反馈。
                        </p>
                    </header>

                    <div className="space-y-6">
                        {faqs.map((item) => (
                            <section key={item.question}>
                                <h2 className="text-lg font-semibold text-[var(--text-color)] mb-2">{item.question}</h2>
                                <p className="text-[var(--text-color-secondary)] leading-relaxed">{item.answer}</p>
                            </section>
                        ))}
                    </div>

                    <p className="mt-10 text-sm text-[var(--text-color-secondary)]">
                        了解更多产品信息，请查看{' '}
                        <Link href="/about" className="text-[var(--accent-color)] underline">
                            关于我们
                        </Link>
                        ，或返回{' '}
                        <Link href="/" className="text-[var(--accent-color)] underline">
                            首页
                        </Link>{' '}
                        开始搜索。
                    </p>
                </article>
            </main>

            <Footer />
        </div>
    );
}
