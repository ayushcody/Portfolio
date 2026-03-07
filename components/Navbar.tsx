'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Interests', href: '#interests' },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('');

    // Simple scroll spy (can be enhanced later)
    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => item.href.substring(1));

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300 backdrop-blur-md bg-background/80 border-b border-muted/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity">
                    AC.
                </Link>

                <ul className="hidden md:flex gap-8">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.href.substring(1);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-sm uppercase tracking-wider font-medium transition-colors hover:text-accent-1 relative",
                                        isActive ? "text-accent-1" : "text-muted"
                                    )}
                                >
                                    {item.name}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-1 rounded-full animate-in fade-in zoom-in duration-300" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Mobile Menu Toggle (to be implemented if needed, sticking to desktop focus for now as per brief "clean enough to scan") */}
                <Link href="#contact" className="md:hidden text-sm uppercase font-bold text-accent-1">
                    Menu
                </Link>
            </div>
        </nav>
    );
}
