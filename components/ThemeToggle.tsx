'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'dark';
        return window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('light', theme === 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        window.localStorage.setItem('theme', nextTheme);
        document.documentElement.classList.toggle('light', nextTheme === 'light');
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 hover:border-cyan/50 transition-all duration-300"
        >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
    );
}
