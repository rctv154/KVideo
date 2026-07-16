import Link from 'next/link';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { siteConfig } from '@/lib/config/site-config';

/**
 * Static, server-renderable header for content pages (/about, /faq, ...).
 * Unlike components/layout/Navbar.tsx this has no interactive "reset search"
 * behaviour, so it can be used directly from Server Components - keeping
 * these SEO-critical pages fully static and JS-independent.
 */
export function ContentHeader() {
    return (
        <nav className="sticky top-0 z-[2000] pt-4 pb-2">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-[var(--shadow-sm)] px-3 sm:px-6 py-2 sm:py-4 rounded-[var(--radius-2xl)]">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex items-center justify-center flex-shrink-0">
                                <Image src="/icon.png" alt={siteConfig.name} width={40} height={40} className="object-contain" />
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-[var(--text-color)] truncate">{siteConfig.name}</span>
                        </Link>

                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <div className="hidden sm:flex items-center gap-4 text-sm text-[var(--text-color-secondary)]">
                                <Link href="/" className="hover:text-[var(--accent-color)] transition-colors">首页</Link>
                                <Link href="/movies" className="hover:text-[var(--accent-color)] transition-colors">热门影视</Link>
                                <Link href="/premium" className="hover:text-[var(--accent-color)] transition-colors">高级模式</Link>
                                <Link href="/about" className="hover:text-[var(--accent-color)] transition-colors">关于我们</Link>
                                <Link href="/faq" className="hover:text-[var(--accent-color)] transition-colors">常见问题</Link>
                            </div>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
