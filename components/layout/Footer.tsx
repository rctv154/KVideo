import Link from 'next/link';
import { siteConfig } from '@/lib/config/site-config';

interface FooterProps {
    isPremiumMode?: boolean;
}

/**
 * Sitewide footer with internal links.
 * Provides crawlable, static anchor-text links between key pages (home, premium,
 * about, FAQ) which helps search engines discover and understand site structure.
 */
export function Footer({ isPremiumMode = false }: FooterProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-6">
            <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius-2xl)] px-6 py-6 text-sm text-[var(--text-color-secondary)]">
                <nav aria-label="footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
                    <Link href="/" className="hover:text-[var(--accent-color)] transition-colors">首页</Link>
                    <Link href="/premium" className="hover:text-[var(--accent-color)] transition-colors">高级模式</Link>
                    <Link href="/about" className="hover:text-[var(--accent-color)] transition-colors">关于我们</Link>
                    <Link href="/faq" className="hover:text-[var(--accent-color)] transition-colors">常见问题</Link>
                    <Link href={isPremiumMode ? '/premium/settings' : '/settings'} className="hover:text-[var(--accent-color)] transition-colors">设置</Link>
                    <a
                        href="https://github.com/KuekHaoYang/KVideo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent-color)] transition-colors"
                    >
                        GitHub
                    </a>
                </nav>
                <p className="text-center">
                    &copy; {year} {siteConfig.name} ({siteConfig.englishName}) &middot; {siteConfig.tagline}
                </p>
            </div>
        </footer>
    );
}
