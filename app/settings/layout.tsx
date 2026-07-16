import type { Metadata } from 'next';

// Settings is a pure utility page with no unique public content value.
export const metadata: Metadata = {
    title: '设置',
    robots: {
        index: false,
        follow: false,
    },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
