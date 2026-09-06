'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';
const themeChangeEvent = 'portfolio-theme-change';

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

function getTheme(): Theme {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerTheme(): Theme {
    return 'light';
}

function subscribeToTheme(onChange: () => void) {
    try {
        applyTheme(window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
    } catch {
        // Theme switching still works when the browser blocks persistent storage.
    }

    const onStorage = (event: StorageEvent) => {
        if (event.key !== 'theme' && event.key !== null) return;
        applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
        onChange();
    };

    window.addEventListener(themeChangeEvent, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
        window.removeEventListener(themeChangeEvent, onChange);
        window.removeEventListener('storage', onStorage);
    };
}

export function ThemeToggle() {
    const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const toggleTheme = () => {
        applyTheme(nextTheme);
        try {
            window.localStorage.setItem('theme', nextTheme);
        } catch {
            // Keep the selected theme for this visit even if it cannot be saved.
        }
        window.dispatchEvent(new Event(themeChangeEvent));
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
            className="nav-icon-button nav-theme-toggle"
        >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
    );
}
