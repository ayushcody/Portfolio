'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Asterisk, MapPin } from 'lucide-react';
import { profile as fallbackProfile, type Profile } from '@/src/data/profile';

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

/** The working loop, said plainly. The last step is the one that counts, so it carries the weight. */
const MOTTO = ['Build it.', 'Break it.', 'Build it again.'];
const MOTTO_LAST = 'Ship it.';

export default function Hero({ profile = fallbackProfile }: { profile?: Profile }) {
    const [photoFailed, setPhotoFailed] = useState(false);
    const photoSrc = photoFailed ? '/profile.png' : profile.profilePhoto || '/profile.png';
    const traits = profile.traits ?? [];

    return (
        <section id="home" className="portfolio-hero" aria-labelledby="hero-heading">
            <div className="portfolio-wrap hero-layout">
                <div className="hero-copy">
                    <h1 id="hero-heading" className="hero-title">
                        <span className="hero-name">{profile.fullName}</span>
                        <span className="visually-hidden">, </span>
                        <span className="hero-role"><span className="hero-highlight">{profile.role}</span></span>
                    </h1>
                    <p className="hero-place"><MapPin size={14} aria-hidden="true" /> {profile.locationShort || profile.location}</p>

                    <p className="hero-motto">
                        {MOTTO.map((step) => <span key={step}>{step} </span>)}
                        <strong>{MOTTO_LAST}</strong>
                    </p>

                    {traits.length > 0 ? (
                        <ul className="hero-stack" aria-label="How I work">
                            {traits.map((trait) => <li key={trait}>{trait}</li>)}
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

            <div className="discipline-band" aria-hidden="true">
                {/* Two identical sets let the band loop seamlessly. The motto above carries the same words for assistive tech. */}
                <div className="discipline-track">
                    {[0, 1].map((copy) => (
                        <p className="discipline-set" key={copy}>
                            {[...MOTTO, MOTTO_LAST].map((item) => (
                                <Fragment key={item}><span>{item.replace(/\.$/, '')}</span><Asterisk /></Fragment>
                            ))}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
