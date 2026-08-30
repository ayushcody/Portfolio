'use client';

import { useReducedMotion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function RocketIndicator() {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden md:block">
            <Link
                href="/launch"
                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface/80 text-orange shadow-[0_0_18px_rgba(255,122,24,0.16)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-orange/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                aria-label="Open launch page"
            >
                <Rocket className="h-5 w-5 -rotate-45" aria-hidden="true" />
            </Link>
        </div>
    );
}
