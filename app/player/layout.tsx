import { Metadata } from 'next';

// Player URLs are entirely driven by client-side query params (id/source/title)
// and hold no stable, unique canonical content, so they are excluded from indexing.
// `follow` is kept so link equity still flows to other pages via internal links.
export const metadata: Metadata = {
    title: '视频播放',
    referrer: 'no-referrer',
    robots: {
        index: false,
        follow: true,
    },
};

export default function PlayerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
