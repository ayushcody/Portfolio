'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Interests', href: '/#interests' },
    { name: 'Achievements', href: '/#achievements' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        // initialize
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "fixed top-6 left-0 right-0 z-50 transition-all duration-300 flex justify-center px-4 pointer-events-none",
            )}
        >
            <div className={cn(
                "pointer-events-auto flex items-center gap-1 sm:gap-4 px-4 py-2 rounded-full border transition-all duration-300",
                scrolled
                    ? "bg-surface/70 backdrop-blur-xl border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)]"
                    : "bg-surface/30 backdrop-blur-md border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_16px_rgba(0,0,0,0.3)]"
            )}>
                <Link href="/" className="mr-2 sm:mr-4 text-sm sm:text-base font-bold tracking-tighter text-white hover:text-cyan transition-colors ml-2">
                    AC
                </Link>

                <ul className="flex items-center gap-0.5 sm:gap-1">
                    {navItems.map((item) => {
                        // Very simple active state for now
                        const isActive = pathname === item.href || (pathname === '/' && item.href === '/');
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "relative px-3 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-sm font-medium rounded-full transition-all duration-300 block",
                                        "hover:text-white",
                                        isActive ? "text-white" : "text-muted"
                                    )}
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className="absolute inset-0 rounded-full bg-surface-hover shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(110,91,255,0.2)] border border-white/5 pointer-events-none"
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                    <li>
                        <Link
                            href="/resume"
                            className="relative px-3 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-sm font-bold text-orange rounded-full transition-all duration-300 block hover:bg-orange/10 ml-2"
                        >
                            Resume
                        </Link>
                    </li>
                </ul>
            </div>
        </motion.nav>
    );
}
