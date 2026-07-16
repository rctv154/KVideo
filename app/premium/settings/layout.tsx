import type { Metadata } from 'next';

// Premium settings is a pure utility page with no unique public content value.
export const metadata: Metadata = {
    title: '高级设置',
    robots: {
        index: false,
        follow: false,
    },
};

export default function PremiumSettingsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
