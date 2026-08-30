'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useId, useState } from 'react';
import { Github, Linkedin, Menu, X } from 'lucide-react';
import { profile } from '@/config/portfolio';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
    { name: 'Home', href: '/', match: (pathname: string) => pathname === '/' },
    { name: 'Work', href: '/projects', match: (pathname: string) => pathname.startsWith('/projects') },
    { name: 'Experience', href: '/#experience', match: () => false },
    { name: 'Skills', href: '/skills', match: (pathname: string) => pathname.startsWith('/skills') },
    { name: 'About', href: '/about', match: (pathname: string) => pathname.startsWith('/about') },
    { name: 'Blog', href: '/blog', match: (pathname: string) => pathname.startsWith('/blog') },
];

function isResumeActive(pathname: string) {
    return pathname.startsWith('/resume');
}

export default function Navbar() {
    const pathname = usePathname();
    const menuId = useId();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mobileMenuOpen]);

    return (
        <>
            <nav
                aria-label="Primary navigation"
                className="fixed left-0 right-0 top-4 z-50 flex h-14 justify-center px-3 pointer-events-none sm:top-6 sm:px-4"
            >
                <div className="pointer-events-auto flex h-14 max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full border border-white/10 bg-surface/80 px-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_28px_rgba(0,0,0,0.38)] backdrop-blur-md sm:px-3">
                    <Link
                        href="/"
                        aria-label="Go to homepage"
                        className="ml-1 mr-1 inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-black tracking-tight text-white transition-colors hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                    >
                        {profile.initials}
                    </Link>

                    <ul className="hidden items-center gap-1 lg:flex">
                        {navItems.map((item) => {
                            const isActive = item.match(pathname);
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        className={cn(
                                            "relative block rounded-full px-3 py-2 text-sm font-semibold transition-colors xl:px-4",
                                            "hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan",
                                            isActive ? "text-white" : "text-muted"
                                        )}
                                    >
                                        <span className="relative z-10">{item.name}</span>
                                        {isActive ? (
                                            <span className="pointer-events-none absolute inset-0 rounded-full border border-white/5 bg-surface-hover shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />
                                        ) : null}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-2">
                        <Link
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open GitHub profile"
                            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted transition hover:border-purple/50 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan xl:flex"
                        >
                            <Github className="w-5 h-5" aria-hidden="true" />
                        </Link>

                        <Link
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open LinkedIn profile"
                            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted transition hover:border-cyan/50 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan xl:flex"
                        >
                            <Linkedin className="w-5 h-5" aria-hidden="true" />
                        </Link>

                        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />

                        <ThemeToggle />

                        <Link
                            href="/resume"
                            aria-current={isResumeActive(pathname) ? 'page' : undefined}
                            className={cn(
                                "relative hidden rounded-full px-4 py-2 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:block",
                                isResumeActive(pathname)
                                    ? "bg-orange text-background"
                                    : "border border-orange/20 bg-orange/10 text-orange hover:bg-orange hover:text-background"
                            )}
                        >
                            Resume
                        </Link>

                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan lg:hidden"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls={menuId}
                            type="button"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen ? (
                <div
                    id={menuId}
                    className="fixed inset-x-4 top-24 z-40 rounded-2xl border border-white/10 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden"
                >
                    <ul className="flex flex-col gap-2">
                        {[...navItems, { name: 'Resume', href: '/resume', match: isResumeActive }].map((item) => {
                            const isActive = item.match(pathname);
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "block rounded-xl px-4 py-3 text-base font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan",
                                            item.name === 'Resume'
                                                ? "bg-orange/10 text-orange hover:bg-orange hover:text-background"
                                                : isActive
                                                    ? "bg-white/10 text-white"
                                                    : "text-muted hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : null}
        </>
    );
}
