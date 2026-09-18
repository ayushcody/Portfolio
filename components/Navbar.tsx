'use client';

import Image from 'next/image';
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

const mobileItems = [...navItems, { name: 'Resume', href: '/resume', match: isResumeActive }];

export default function Navbar() {
    const pathname = usePathname();
    const menuId = useId();
    const navigationRef = useRef<HTMLElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    // The menu belongs to the page it was opened on, so any navigation (links, back/forward) closes it.
    const [menuOpenedOn, setMenuOpenedOn] = useState<string | null>(null);
    const mobileMenuOpen = menuOpenedOn === pathname;
    const closeMenu = () => setMenuOpenedOn(null);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpenedOn(null);
                menuButtonRef.current?.focus();
            }
        };
        const isOutside = (target: EventTarget | null) =>
            target instanceof Node && !navigationRef.current?.contains(target);
        const onPointerDown = (event: PointerEvent) => {
            if (isOutside(event.target)) setMenuOpenedOn(null);
        };
        // Tabbing past the last menu item closes the disclosure instead of leaving it over the page.
        const onFocusIn = (event: FocusEvent) => {
            if (isOutside(event.target)) setMenuOpenedOn(null);
        };
        const desktopQuery = window.matchMedia('(min-width: 1024px)');
        const onBreakpointChange = (event: MediaQueryListEvent) => {
            if (event.matches) setMenuOpenedOn(null);
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('focusin', onFocusIn);
        desktopQuery.addEventListener('change', onBreakpointChange);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('focusin', onFocusIn);
            desktopQuery.removeEventListener('change', onBreakpointChange);
        };
    }, [mobileMenuOpen]);

    return (
        <nav ref={navigationRef} aria-label="Primary" className="portfolio-nav">
            <div className="nav-pill">
                <Link href="/#home" className="nav-brand" onClick={closeMenu}>
                    <Image
                        src="/ac.png"
                        alt="Ayush Chougula, home"
                        width={36}
                        height={36}
                        className="nav-brand-mark"
                        loading="eager"
                        fetchPriority="low"
                    />
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
                    <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile (opens in a new tab)"
                        className="nav-icon-button nav-social"
                    >
                        <Github size={18} aria-hidden="true" />
                    </a>
                    <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn profile (opens in a new tab)"
                        className="nav-icon-button nav-social"
                    >
                        <Linkedin size={18} aria-hidden="true" />
                    </a>

                    <span className="nav-divider" aria-hidden="true" />
                    <ThemeToggle />

                    <Link
                        href="/resume"
                        aria-current={isResumeActive(pathname) ? 'page' : undefined}
                        className="nav-resume"
                        onClick={closeMenu}
                    >
                        Resume <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>

                    <button
                        ref={menuButtonRef}
                        className="nav-icon-button nav-menu-trigger"
                        onClick={() => setMenuOpenedOn(mobileMenuOpen ? null : pathname)}
                        aria-label="Menu"
                        aria-expanded={mobileMenuOpen}
                        aria-controls={menuId}
                        type="button"
                    >
                        {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            <div id={menuId} className="nav-mobile-panel" hidden={!mobileMenuOpen}>
                <ul className="nav-mobile-links">
                    {mobileItems.map((item, index) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                aria-current={item.match(pathname) ? 'page' : undefined}
                                onClick={closeMenu}
                                className={`nav-mobile-link${item.name === 'Resume' ? ' nav-mobile-resume' : ''}`}
                            >
                                <span><span className="nav-mobile-index" aria-hidden="true">0{index + 1}</span>{item.name}</span>
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="nav-mobile-socials">
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                        <Github size={17} aria-hidden="true" /> GitHub <ArrowUpRight size={13} aria-hidden="true" />
                        <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                        <Linkedin size={17} aria-hidden="true" /> LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
                        <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                </div>
            </div>
        </nav>
    );
}
