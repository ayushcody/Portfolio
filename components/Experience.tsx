'use client';

import { useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk } from 'lucide-react';
import { ExperienceLogo } from '@/components/ui/ExperienceLogo';
import { TechTags } from '@/components/ui/TechTags';
import { experiencesData, type ExperienceItem } from '@/src/data/experience';
import { useCareerTimeline } from './experience/useCareerTimeline';
import './experience.css';

/** Chapter accents cycle through the flat token colors; each keeps dark text. */
const CHAPTER_TONES = ['lilac', 'yellow', 'coral', 'sage'] as const;
const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
/** Mobile jump links wrap into rows of at most this many (keeps each target at least 44px wide at 320px). */
const MAX_JUMP_COLUMNS = 5;

const pad = (value: number) => String(value).padStart(2, '0');

function countLabel(count: number, noun: string) {
    return `${NUMBER_WORDS[count] ?? count} ${noun}${count === 1 ? '' : 's'}`;
}

/** Earliest year across the periods, through "Present" when any role is ongoing. */
function journeyRange(periods: string[]) {
    const years = periods.flatMap((period) => period.match(/\b(?:19|20)\d{2}\b/g) ?? []).map(Number);
    if (years.length === 0) return null;
    const start = String(Math.min(...years));
    const end = periods.some((period) => /\b(?:present|current|now)\b/i.test(period)) ? 'Present' : String(Math.max(...years));
    return { start, end };
}

export default function Experience({ experiences = experiencesData }: { experiences?: ExperienceItem[] }) {
    // Data is newest-first; the journey reads oldest-first.
    const journey = [...experiences].reverse().map((role, index) => ({ ...role, id: role.id || `role-${index}` }));
    const trackRef = useRef<HTMLOListElement>(null);
    const followed = useCareerTimeline(trackRef, journey.map((role) => role.id).join('|'));
    const active = Math.min(followed, Math.max(journey.length - 1, 0));

    if (journey.length === 0) return null;
    const range = journeyRange(journey.map((role) => role.period));

    return (
        <section id="experience" className="career-section" aria-labelledby="experience-heading">
            <div className="portfolio-wrap">
                <div className="section-heading career-heading">
                    <div>
                        <h2 id="experience-heading">Built along the way<span className="accent-period">.</span></h2>
                        <p>From finding weak points to building systems that speak. {countLabel(journey.length, 'role')}, each adding something to how I work.</p>
                    </div>
                    {range && range.start !== range.end && (
                        <p className="career-range">
                            <span>{range.start}</span>
                            <ArrowRight size={16} aria-hidden="true" />
                            <span className="visually-hidden">to</span>
                            <span>{range.end}</span>
                        </p>
                    )}
                </div>

                <div className="career-layout">
                    <aside className="career-guide" aria-label="Experience chapters">
                        <div className="career-counter" aria-hidden="true">
                            <span>{pad(active + 1)}</span>
                            <small>/ {pad(journey.length)}</small>
                            <Asterisk size={36} />
                        </div>
                        <p className="career-guide-title">A little more range.<br />With every chapter.</p>
                        <nav aria-label="Jump to a role" style={{ '--career-columns': Math.min(journey.length, MAX_JUMP_COLUMNS) } as CSSProperties}>
                            {journey.map((role, index) => (
                                <a key={role.id} href={`#career-${role.id}`} aria-current={index === active ? 'step' : undefined}>
                                    <span className="career-guide-index" aria-hidden="true">{pad(index + 1)}</span>
                                    <span className="career-guide-label">{role.progressionLabel || role.company}</span>
                                    <ArrowUpRight size={16} aria-hidden="true" />
                                </a>
                            ))}
                        </nav>
                        <Link href="/resume" className="text-link">View résumé <ArrowUpRight size={16} aria-hidden="true" /></Link>
                    </aside>

                    <div className="career-track-shell">
                        <ol ref={trackRef} className="career-track">
                            {journey.map((role, index) => {
                                const tone = CHAPTER_TONES[index % CHAPTER_TONES.length];
                                const responsibilities = role.responsibilities.length > 0 ? role.responsibilities : role.bullets ?? [];
                                const highlights = role.impact.filter((item) => item && !responsibilities.includes(item));
                                const summary = role.shortSummary || role.description;
                                return (
                                    <li
                                        key={role.id}
                                        id={`career-${role.id}`}
                                        className="career-stop"
                                        data-active={index === active}
                                        data-passed={index < active}
                                        style={{ '--chapter-color': `var(--${tone})` } as CSSProperties}
                                    >
                                        <span className="career-node" aria-hidden="true">{pad(index + 1)}</span>
                                        <article className="career-entry" aria-labelledby={`career-company-${role.id}`}>
                                            <header className="career-entry-head">
                                                <ExperienceLogo className="career-logo" company={role.company} logo={role.companyLogo} tone={tone} size={52} />
                                                <div className="career-identity">
                                                    <h3 id={`career-company-${role.id}`} className="career-company">{role.company}</h3>
                                                    <p className="career-role">{role.role}</p>
                                                    {(role.period || role.location) && (
                                                        <p className="career-meta">
                                                            {role.period && <span className="career-period">{role.period}</span>}
                                                            {role.location && <span>{role.location}</span>}
                                                        </p>
                                                    )}
                                                </div>
                                                {role.type && <span className="eyebrow eyebrow--chip career-type">{role.type}</span>}
                                            </header>

                                            <div className="career-entry-body">
                                                {role.progressionLabel && <p className="eyebrow career-kicker">{role.progressionLabel}</p>}
                                                {role.chapterTitle && <p className="career-chapter">{role.chapterTitle}</p>}
                                                {summary && <p className="career-summary">{summary}</p>}
                                                {responsibilities.length > 0 && (
                                                    <ul className="career-points">{responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
                                                )}
                                                {highlights.length > 0 && (
                                                    <>
                                                        <p className="eyebrow career-subhead">Highlights</p>
                                                        <ul className="career-points">{highlights.map((item) => <li key={item}>{item}</li>)}</ul>
                                                    </>
                                                )}
                                                <TechTags items={role.techStack} label={`${role.company} tools and practices`} className="career-tools" />
                                                {role.id === 'persistent' && (
                                                    <p className="career-entry-foot">
                                                        <Link className="text-link" href="/projects/email-digital-twin">Explore Persona Mail <ArrowUpRight size={16} aria-hidden="true" /></Link>
                                                    </p>
                                                )}
                                            </div>
                                        </article>
                                    </li>
                                );
                            })}
                        </ol>
                        <div className="career-traveler-rail" aria-hidden="true"><span><ArrowDown size={14} /></span></div>
                    </div>
                </div>

                <div className="career-next">
                    <ArrowDown size={22} aria-hidden="true" />
                    <p>Same curiosity. More to build.</p>
                    <a className="text-link" href="#contact">Let’s talk about what’s next <ArrowUpRight size={16} aria-hidden="true" /></a>
                </div>
            </div>
        </section>
    );
}
