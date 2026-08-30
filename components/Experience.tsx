"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Briefcase, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';
import { cn } from '@/lib/utils';
import { experiencesData, type ExperienceEntry } from '@/config/portfolio';

const colorMap: Record<ExperienceEntry['color'], { text: string; bg: string; border: string; dot: string; shadow: string }> = {
    cyan: { text: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/25', dot: 'bg-cyan', shadow: 'shadow-[0_0_38px_rgba(0,229,255,0.09)]' },
    purple: { text: 'text-purple', bg: 'bg-purple/10', border: 'border-purple/25', dot: 'bg-purple', shadow: 'shadow-[0_0_38px_rgba(110,91,255,0.11)]' },
    orange: { text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/25', dot: 'bg-orange', shadow: 'shadow-[0_0_38px_rgba(255,122,24,0.09)]' },
    white: { text: 'text-white', bg: 'bg-white/10', border: 'border-white/20', dot: 'bg-white', shadow: 'shadow-[0_0_42px_rgba(255,255,255,0.08)]' },
};

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function getBullets(exp: ExperienceEntry) {
    const source = exp.impact?.length
        ? exp.impact
        : exp.responsibilities?.length
            ? exp.responsibilities
            : exp.bullets?.length
                ? exp.bullets
                : exp.description
                    ? [exp.description]
                    : [];

    return source.slice(0, 4);
}

function getTechStack(exp: ExperienceEntry) {
    return exp.techStack?.length ? exp.techStack : exp.tech;
}

function sortExperience(items: ExperienceEntry[]) {
    return [...items].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return 0;
    });
}

function ExperienceCard({
    exp,
    emphasized,
    active,
    side,
}: {
    exp: ExperienceEntry;
    emphasized: boolean;
    active: boolean;
    side: 'left' | 'right';
}) {
    const theme = colorMap[exp.color] ?? colorMap.white;
    const bullets = getBullets(exp);
    const techStack = getTechStack(exp);
    const headingId = `experience-${exp.id}-heading`;

    return (
        <SkeuomorphicCard
            role="article"
            tabIndex={0}
            aria-labelledby={headingId}
            className={cn(
                "group relative h-full overflow-visible p-5 transition duration-200 focus-visible:border-cyan/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:p-6 md:p-7",
                "hover:-translate-y-1 hover:border-white/20",
                active ? cn("border-white/25 bg-white/[0.055]", theme.shadow) : "",
                emphasized ? "border-cyan/25 bg-white/[0.045] shadow-[0_0_42px_rgba(0,229,255,0.08)]" : "",
                side === 'left'
                    ? "md:after:absolute md:after:left-full md:after:top-10 md:after:h-px md:after:w-6 md:after:bg-gradient-to-r md:after:from-white/30 md:after:to-transparent"
                    : "md:before:absolute md:before:right-full md:before:top-10 md:before:h-px md:before:w-6 md:before:bg-gradient-to-l md:before:from-white/30 md:before:to-transparent"
            )}
        >
            {emphasized ? (
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
            ) : null}

            <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="mb-3 flex flex-wrap gap-2">
                            {exp.type ? (
                                <span className={cn("rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em]", theme.bg, theme.border, theme.text)}>
                                    {exp.type}
                                </span>
                            ) : null}
                            {emphasized ? (
                                <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan">
                                    Featured
                                </span>
                            ) : null}
                        </div>
                        <h3 id={headingId} className="text-xl font-black leading-tight text-white sm:text-2xl">{exp.role}</h3>
                        <p className={cn("mt-1 text-lg font-bold", theme.text)}>{exp.company}</p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 text-sm font-semibold text-muted sm:items-end">
                        <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            {exp.period}
                        </span>
                        {exp.location ? (
                            <span className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4" aria-hidden="true" />
                                {exp.location}
                            </span>
                        ) : null}
                    </div>
                </div>

                <p className="text-base leading-relaxed text-muted">{exp.shortSummary || exp.description}</p>

                {bullets.length > 0 ? (
                    <ul className="mt-5 space-y-3">
                        {bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-muted/95">
                                <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", theme.dot)} aria-hidden="true" />
                                <span>{bullet}</span>
                            </li>
                        ))}
                    </ul>
                ) : null}

                {techStack.length > 0 ? (
                    <div className="mt-auto flex flex-wrap gap-2 border-t border-white/10 pt-5">
                        {techStack.map((tech) => (
                            <span key={tech} className="rounded-full border border-white/10 bg-surface px-2.5 py-1 text-[11px] font-bold text-muted">
                                {tech}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        </SkeuomorphicCard>
    );
}

export default function Experience() {
    const orderedExperience = useMemo(() => sortExperience(experiencesData), []);
    const timelineRef = useRef<HTMLDivElement | null>(null);
    const orbRef = useRef<HTMLDivElement | null>(null);
    const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
    const frameRef = useRef<number | null>(null);
    const [visitedIndex, setVisitedIndex] = useState(-1);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timeline = timelineRef.current;
        if (!timeline) return;

        const updateProgress = () => {
            frameRef.current = null;

            const rect = timeline.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const anchorY = viewportHeight * 0.55;
            const progress = rect.height > 0 ? clamp((anchorY - rect.top) / rect.height) : 0;

            timeline.style.setProperty('--timeline-progress', progress.toFixed(4));
            orbRef.current?.style.setProperty('top', `${20 + progress * Math.max(rect.height - 40, 0)}px`);

            const progressY = progress * rect.height;
            let nextVisitedIndex = -1;
            let nextActiveIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            nodeRefs.current.forEach((node, index) => {
                if (!node) return;

                const nodeRect = node.getBoundingClientRect();
                const nodeCenter = nodeRect.top - rect.top + nodeRect.height / 2;

                if (nodeCenter <= progressY + 8) {
                    nextVisitedIndex = index;
                }

                const distance = Math.abs(nodeCenter - progressY);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    nextActiveIndex = index;
                }
            });

            setVisitedIndex((current) => (current === nextVisitedIndex ? current : nextVisitedIndex));
            setActiveIndex((current) => (current === nextActiveIndex ? current : nextActiveIndex));
        };

        const requestProgressUpdate = () => {
            if (frameRef.current !== null) return;
            frameRef.current = window.requestAnimationFrame(updateProgress);
        };

        updateProgress();
        window.addEventListener('scroll', requestProgressUpdate, { passive: true });
        window.addEventListener('resize', requestProgressUpdate);

        return () => {
            window.removeEventListener('scroll', requestProgressUpdate);
            window.removeEventListener('resize', requestProgressUpdate);

            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, [orderedExperience.length]);

    return (
        <section id="experience" className="relative z-10 w-full scroll-mt-28 overflow-hidden px-6 py-20 md:px-12 md:py-24">
            <div className="pointer-events-none absolute right-0 top-28 -z-10 h-72 w-72 rounded-full bg-purple/10 blur-[110px]" />
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-purple/20 bg-purple/10">
                            <Briefcase className="h-5 w-5 text-purple" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-purple">Experience</p>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">Experience</h2>
                            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
                                Professional and project-based work across AI voice agents, full-stack systems, and applied AI products.
                            </p>
                        </div>
                        <div className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-muted">
                            {orderedExperience.length} roles
                        </div>
                    </div>
                </div>

                <div
                    ref={timelineRef}
                    className="relative mt-14 [--timeline-progress:0]"
                    style={{ '--timeline-progress': 0 } as CSSProperties}
                >
                    <div className="pointer-events-none absolute bottom-5 left-4 top-5 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
                    <div
                        className="pointer-events-none absolute bottom-5 left-4 top-5 w-[2px] origin-top rounded-full bg-gradient-to-b from-cyan via-purple to-orange shadow-[0_0_24px_rgba(0,229,255,0.22)] motion-safe:transition-transform motion-safe:duration-150 md:left-1/2 md:-translate-x-1/2"
                        style={{ transform: 'scaleY(var(--timeline-progress))' }}
                        aria-hidden="true"
                    />
                    <div
                        ref={orbRef}
                        className="pointer-events-none absolute left-4 top-5 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/50 bg-background shadow-[0_0_0_5px_rgba(0,229,255,0.08),0_0_26px_rgba(0,229,255,0.55)] motion-safe:transition-[top] motion-safe:duration-150 md:left-1/2"
                        aria-hidden="true"
                    >
                        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan" />
                    </div>

                    <div className="space-y-8 md:space-y-12">
                        {orderedExperience.map((exp, index) => {
                            const side = index % 2 === 0 ? 'left' : 'right';
                            const isVisited = index <= visitedIndex;
                            const isActive = index === activeIndex || isVisited;
                            const theme = colorMap[exp.color] ?? colorMap.white;

                            return (
                                <div
                                    key={exp.id}
                                    className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] md:gap-6"
                                >
                                    <div
                                        className={cn(
                                            "relative col-start-1 row-start-1 flex justify-center pt-8 md:col-start-2",
                                            side === 'right' ? "md:row-start-1" : ""
                                        )}
                                    >
                                        <div
                                            ref={(node) => {
                                                nodeRefs.current[index] = node;
                                            }}
                                            className={cn(
                                                "z-10 h-4 w-4 rounded-full border bg-background transition duration-200",
                                                isVisited
                                                    ? cn("border-white/70 shadow-[0_0_0_6px_rgba(255,255,255,0.05)]", theme.dot)
                                                    : "border-white/20 shadow-[0_0_0_6px_rgba(255,255,255,0.025)]",
                                                index === activeIndex ? "scale-125 shadow-[0_0_0_7px_rgba(0,229,255,0.10),0_0_24px_rgba(0,229,255,0.32)]" : ""
                                            )}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div
                                        className={cn(
                                            "col-start-2 min-w-0 md:row-start-1",
                                            side === 'left' ? "md:col-start-1 md:pr-1" : "md:col-start-3 md:pl-1"
                                        )}
                                    >
                                        <ExperienceCard exp={exp} emphasized={index === 0} active={isActive} side={side} />
                                    </div>

                                    <div
                                        className={cn(
                                            "hidden md:row-start-1 md:block",
                                            side === 'left' ? "md:col-start-3" : "md:col-start-1"
                                        )}
                                        aria-hidden="true"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div>
                        <p className="text-lg font-black text-white">Want the formal version?</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                            Open the resume page for a tighter credential-first version of this background.
                        </p>
                    </div>
                    <Link
                        href="/resume"
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-background transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:mt-0 sm:w-auto"
                        aria-label="View Ayush Chougula resume"
                    >
                        View Resume
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
