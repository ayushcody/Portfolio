'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { profile as fallbackProfile } from '@/config/portfolio';
import type { Profile } from '@/src/data/profile';

type HeroProps = {
    profile?: Profile;
    profileSource?: 'firestore' | 'fallback';
};

const focusLabelMap: Record<string, string> = {
    'Agentic AI workflows': 'Agentic AI',
    'RAG systems': 'RAG Systems',
    'Voice AI agents': 'Voice AI',
    'AI infrastructure': 'AI Infrastructure',
    'Full-stack AI products': 'Full-Stack AI Products',
};

export default function Hero({ profile, profileSource }: HeroProps) {
    const prefersReducedMotion = useReducedMotion();
    const [photoFailed, setPhotoFailed] = useState(false);
    const activeProfile = profile ?? fallbackProfile;
    const focusChips = activeProfile.currentFocus.slice(0, 5).map((focus) => focusLabelMap[focus] ?? focus);
    const profilePhoto = activeProfile.profilePhoto?.trim() || '/profile.png';

    const motionProps = prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 18 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.45, ease: 'easeOut' as const },
        };

    const resumeHref = activeProfile.links.resume || activeProfile.resumePath || '/resume';
    const availability =
        activeProfile.availability ||
        'Open to AI engineering internships, full-stack roles, and product engineering opportunities.';

    return (
        <section
            id="home"
            aria-labelledby="hero-heading"
            data-profile-source={profileSource}
            className="relative mx-auto grid min-h-[calc(100svh-1rem)] max-w-7xl items-center overflow-hidden px-6 pb-16 pt-28 sm:pt-32 md:px-12 lg:min-h-[760px] lg:grid-cols-12 lg:gap-12 lg:pb-20"
        >
            <div className="pointer-events-none absolute left-0 top-24 -z-10 h-72 w-72 rounded-full bg-purple/12 blur-[90px]" />
            <div className="pointer-events-none absolute bottom-16 right-0 -z-10 h-64 w-64 rounded-full bg-cyan/10 blur-[100px]" />
            <div className="pointer-events-none absolute left-1/3 top-1/2 -z-10 h-56 w-56 rounded-full bg-pink/8 blur-[100px]" />

            <motion.div {...motionProps} className="relative z-10 max-w-3xl lg:col-span-7">
                <h1
                    id="hero-heading"
                    className="max-w-4xl bg-gradient-to-br from-white via-cyan/95 to-purple bg-clip-text pb-2 text-5xl font-black leading-[1.02] tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-[80px]"
                >
                    {activeProfile.fullName}
                </h1>

                <p className="mt-4 max-w-2xl bg-gradient-to-r from-cyan via-white to-orange bg-clip-text text-xl font-semibold leading-tight text-transparent sm:text-2xl md:text-3xl">
                    {activeProfile.headline}
                </p>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg md:text-xl">
                    {activeProfile.heroDescription} I focus on shipped projects, clear architecture, reliable integrations, and AI behavior that can be evaluated.
                </p>

                <div className="mt-6 flex max-w-2xl flex-wrap gap-2" aria-label="Current engineering focus areas">
                    {focusChips.map((chip) => (
                        <span
                            key={chip}
                            className="rounded-full border border-cyan/15 bg-gradient-to-r from-cyan/10 via-purple/10 to-orange/10 px-3 py-1.5 text-xs font-bold text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:text-sm"
                        >
                            {chip}
                        </span>
                    ))}
                </div>

                <p className="mt-6 max-w-2xl rounded-2xl border border-orange/20 bg-orange/10 px-4 py-3 text-sm font-semibold leading-relaxed text-orange">
                    {availability}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                        href="/#projects"
                        className={cn(
                            "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan via-purple to-orange px-6 py-3.5 text-sm font-black text-white shadow-[0_0_28px_rgba(0,229,255,0.18)] transition hover:translate-y-[-1px] hover:shadow-[0_0_36px_rgba(110,91,255,0.26)] sm:w-auto",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                        )}
                        aria-label="View featured portfolio work"
                    >
                        View Featured Work
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>

                    <Link
                        href={resumeHref}
                        className={cn(
                            "inline-flex w-full items-center justify-center gap-2 rounded-full border border-purple/25 bg-purple/10 px-6 py-3.5 text-sm font-black text-white transition hover:border-cyan/40 hover:bg-cyan/10 sm:w-auto",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                        )}
                        aria-label="Open resume page"
                    >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Download Resume
                    </Link>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-bold text-muted">
                    <Link
                        href={activeProfile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                        aria-label={`Open ${activeProfile.fullName} GitHub profile in a new tab`}
                    >
                        <Github className="h-4 w-4" aria-hidden="true" />
                        GitHub
                    </Link>
                    <Link
                        href={activeProfile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                        aria-label={`Open ${activeProfile.fullName} LinkedIn profile in a new tab`}
                    >
                        <Linkedin className="h-4 w-4" aria-hidden="true" />
                        LinkedIn
                    </Link>
                    <span className="text-white/45" aria-hidden="true">
                        {activeProfile.locationShort}
                    </span>
                </div>
            </motion.div>

            <motion.div
                {...(prefersReducedMotion
                    ? {}
                    : {
                        initial: { opacity: 0, scale: 0.97 },
                        animate: { opacity: 1, scale: 1 },
                        transition: { duration: 0.5, delay: 0.12, ease: 'easeOut' as const },
                })}
                className="relative z-10 mt-10 flex justify-center lg:col-span-5 lg:mt-0"
            >
                <div className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-surface/80 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35),0_0_48px_rgba(255,79,216,0.12)] backdrop-blur-xl sm:max-w-[360px]">
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-pink/70 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(0,229,255,0.14),transparent_32%),radial-gradient(circle_at_72%_65%,rgba(255,79,216,0.14),transparent_35%),radial-gradient(circle_at_55%_90%,rgba(255,122,24,0.12),transparent_30%)]" aria-hidden="true" />

                    <div className="relative z-10 h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        {!photoFailed ? (
                            <Image
                                src={profilePhoto}
                                alt="Portrait of Ayush Chougula"
                                fill
                                sizes="(min-width: 1024px) 360px, 320px"
                                className="object-cover"
                                priority
                                unoptimized
                                onError={() => setPhotoFailed(true)}
                            />
                        ) : (
                            <div
                                className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan/18 via-purple/20 to-orange/14 text-6xl font-black text-white"
                                role="img"
                                aria-label="Portrait placeholder for Ayush Chougula"
                            >
                                {activeProfile.initials}
                            </div>
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/28 via-transparent to-white/[0.02]" aria-hidden="true" />
                        <div className="pointer-events-none absolute inset-x-4 bottom-4 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" aria-hidden="true" />
                        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-background/45 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
                            {activeProfile.locationShort}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
