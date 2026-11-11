'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Asterisk, MapPin } from 'lucide-react';
import { profile as fallbackProfile, type Profile } from '@/src/data/profile';
import { experiencesData, type ExperienceItem } from '@/src/data/experience';

// Hosts allowed by images.remotePatterns in next.config.ts; anything else is served as-is.
const OPTIMIZABLE_HOSTS = new Set(['firebasestorage.googleapis.com', 'storage.googleapis.com']);

/** Local files and allow-listed CMS uploads go through the image optimizer (the local portrait is 1.8 MB). */
function canOptimize(src: string) {
    if (src.startsWith('/')) return true;
    try {
        const url = new URL(src);
        return url.protocol === 'https:' && OPTIMIZABLE_HOSTS.has(url.hostname);
    } catch {
        return false;
    }
}

const MONTHS: Record<string, string> = { jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June', jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December' };

/** "Aug 2023 - Jul 2027" -> "July 2027" */
function graduationOf(status?: string) {
    const end = status?.split(/\s+[-–—]\s+/).pop()?.trim();
    const match = end?.match(/^([A-Za-z]{3})[A-Za-z]*\.?\s+(\d{4})$/);
    if (!match) return end || undefined;
    return `${MONTHS[match[1].toLowerCase()] ?? match[1]} ${match[2]}`;
}

const isCurrent = (role: Pick<ExperienceItem, 'period'>) => /\b(present|current|now)\b/i.test(role.period);

export type HeroSpecialty = { label: string; href: string };
type HeroRole = Pick<ExperienceItem, 'company' | 'role' | 'period' | 'techStack'>;

type HeroProps = {
    profile?: Profile;
    /** Newest first; the hero shows the current role as "Now" and the one before it as "Before". */
    experience?: HeroRole[];
    specialties?: HeroSpecialty[];
};

export default function Hero({ profile = fallbackProfile, experience = experiencesData, specialties = [] }: HeroProps) {
    const [photoFailed, setPhotoFailed] = useState(false);
    const photoSrc = photoFailed ? '/profile.png' : profile.profilePhoto || '/profile.png';

    const nowIndex = Math.max(experience.findIndex(isCurrent), 0);
    const now = experience[nowIndex];
    const before = experience[nowIndex + 1];
    const graduation = graduationOf(profile.education?.status);
    const institution = profile.education?.institution;

    return (
        <section id="home" className="portfolio-hero" aria-labelledby="hero-heading">
            <div className="portfolio-wrap hero-layout">
                <div className="hero-copy">
                    <h1 id="hero-heading" className="hero-title">
                        <span className="hero-id">
                            <span className="hero-name">{profile.fullName}</span>
                            <span className="visually-hidden">, </span>
                            <span className="hero-role-tag">{profile.role}</span>
                            <span className="visually-hidden">. </span>
                            <span className="hero-place" aria-hidden="true"><MapPin size={13} /> {profile.locationShort || profile.location}</span>
                        </span>
                        <span className="hero-headline">
                            I build AI that <span className="hero-mark hero-mark--1">answers calls</span>, <span className="hero-mark hero-mark--2">cites its sources</span> and <span className="hero-mark hero-mark--3">checks its own work</span>.
                        </span>
                    </h1>

                    {specialties.length > 0 ? (
                        <ul className="hero-specialties" aria-label="Specialties">
                            {specialties.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href}>{item.label}<ArrowUpRight size={14} strokeWidth={2.4} aria-hidden="true" /></Link>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <div className="hero-actions">
                        <Link href="#projects" className="brutal-button">See the work <ArrowDownRight size={20} aria-hidden="true" /></Link>
                        <Link href={profile.links.resume || '/resume'} className="text-link">Read my résumé <ArrowUpRight size={17} aria-hidden="true" /></Link>
                    </div>
                </div>

                <div className="hero-photo-area">
                    <figure className="hero-print">
                        <div className="hero-photo"><Image src={photoSrc} alt={`${profile.fullName}, in a suit and glasses, standing in a warmly lit library`} fill loading="eager" unoptimized={!canOptimize(photoSrc)} sizes="(max-width: 700px) 96px, (max-width: 1000px) 34vw, 320px" onError={() => setPhotoFailed(true)} /></div>
                        <figcaption><span>Engineer. Curious human.</span><ArrowUpRight size={22} aria-hidden="true" /></figcaption>
                    </figure>
                    <div className="hero-note" aria-hidden="true">A face to the code.<ArrowDownRight size={28} /></div>
                </div>
            </div>

            <div className="portfolio-wrap">
                <dl className="hero-ledger" aria-label="Where I am now">
                    {now ? (
                        <div className="hero-ledger-cell hero-ledger-cell--now">
                            <dt><span className="hero-ledger-tag"><span className="hero-live" aria-hidden="true" />Now</span><span className="hero-ledger-when">{now.period}</span></dt>
                            <dd>
                                <strong>{now.company}</strong>
                                <span className="hero-ledger-role">{now.role}</span>
                                {now.techStack.length ? <span className="hero-ledger-tools">{now.techStack.slice(0, 5).join(' · ')}</span> : null}
                            </dd>
                        </div>
                    ) : null}
                    {before ? (
                        <div className="hero-ledger-cell hero-ledger-cell--before">
                            <dt><span className="hero-ledger-tag">Before</span><span className="hero-ledger-when">{before.period}</span></dt>
                            <dd>
                                <strong>{before.company}</strong>
                                <span className="hero-ledger-role">{before.role}</span>
                                {before.techStack.length ? <span className="hero-ledger-tools">{before.techStack.slice(0, 4).join(' · ')}</span> : null}
                            </dd>
                        </div>
                    ) : null}
                    <div className="hero-ledger-cell hero-ledger-cell--open">
                        <dt><span className="hero-ledger-tag">Open to work</span>{graduation ? <span className="hero-ledger-when">Class of {graduation.split(' ').pop()}</span> : null}</dt>
                        <dd>
                            <strong>{graduation ? `Graduating ${graduation}` : institution}</strong>
                            {graduation && institution ? <span className="hero-ledger-role">{institution}</span> : null}
                            {profile.availability ? <span className="hero-ledger-tools">{profile.availability}</span> : null}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="discipline-band" aria-hidden="true">
                {/* Two identical sets let the band loop seamlessly. The specialties above carry the same words for assistive tech. */}
                <div className="discipline-track">
                    {[0, 1].map((copy) => (
                        <p className="discipline-set" key={copy}>
                            {[...specialties.map((item) => item.label), 'Always learning'].map((item) => (
                                <Fragment key={item}><span>{item}</span><Asterisk /></Fragment>
                            ))}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
