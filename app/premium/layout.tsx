import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config/site-config';

const title = `高级影视资源搜索 - ${siteConfig.name}高级专区`;
const description = `${siteConfig.name}高级专区，独立的高级影视源搜索入口，内容与普通区完全物理隔离，支持自定义高级视频源与多源并行搜索。`;

export const metadata: Metadata = {
    title,
    description,
    alternates: {
        canonical: '/premium',
    },
    openGraph: {
        title,
        description,
        url: `${siteConfig.url}/premium`,
    },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
    return children;
}
