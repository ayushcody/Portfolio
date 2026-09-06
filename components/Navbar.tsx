'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Github, Linkedin, Menu, X } from 'lucide-react';
import { profile } from '@/config/portfolio';
import { ThemeToggle } from './ThemeToggle';
import './navigation.css';

const navItems = [
    { name: 'Home', href: '/#home', match: (pathname: string) => pathname === '/' },
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
    const navigationRef = useRef<HTMLElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        const onPointerDown = (event: PointerEvent) => {
            if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };
        const desktopQuery = window.matchMedia('(min-width: 1024px)');
        const onBreakpointChange = (event: MediaQueryListEvent) => {
            if (event.matches) setMobileMenuOpen(false);
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('pointerdown', onPointerDown);
        desktopQuery.addEventListener('change', onBreakpointChange);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('pointerdown', onPointerDown);
            desktopQuery.removeEventListener('change', onBreakpointChange);
        };
    }, [mobileMenuOpen]);

    return (
        <nav ref={navigationRef} aria-label="Primary navigation" className="portfolio-nav">
            <div className="nav-pill">
                <Link
                    href="/#home"
                    aria-label="Go to homepage"
                    className="nav-brand"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {profile.initials}<span aria-hidden="true">.</span>
                </Link>

                <ul className="nav-desktop-links">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                aria-current={item.match(pathname) ? 'page' : undefined}
                                className="nav-link"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="nav-actions">
                    <Link
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open GitHub profile"
                        className="nav-icon-button nav-social"
                    >
                        <Github size={18} aria-hidden="true" />
                    </Link>
                    <Link
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open LinkedIn profile"
                        className="nav-icon-button nav-social"
                    >
                        <Linkedin size={18} aria-hidden="true" />
                    </Link>

                    <span className="nav-divider" aria-hidden="true" />
                    <ThemeToggle />

                    <Link
                        href="/resume"
                        aria-current={isResumeActive(pathname) ? 'page' : undefined}
                        className="nav-resume"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Resume <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>

                    <button
                        ref={menuButtonRef}
                        className="nav-icon-button nav-menu-trigger"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                        aria-expanded={mobileMenuOpen}
                        aria-controls={menuId}
                        type="button"
                    >
                        {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen ? (
                <div id={menuId} className="nav-mobile-panel">
                    <ul className="nav-mobile-links">
                        {[...navItems, { name: 'Resume', href: '/resume', match: isResumeActive }].map((item, index) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    aria-current={item.match(pathname) ? 'page' : undefined}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`nav-mobile-link${item.name === 'Resume' ? ' nav-mobile-resume' : ''}`}
                                >
                                    <span><span className="nav-mobile-index" aria-hidden="true">0{index + 1}</span>{item.name}</span>
                                    <ArrowUpRight size={18} aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="nav-mobile-socials">
                        <Link href={profile.github} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                            <Github size={17} aria-hidden="true" /> GitHub <ArrowUpRight size={13} aria-hidden="true" />
                        </Link>
                        <Link href={profile.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                            <Linkedin size={17} aria-hidden="true" /> LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            ) : null}
        </nav>
    );
}
