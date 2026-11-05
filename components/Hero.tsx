'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk, MapPin } from 'lucide-react';
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

const FOCUS = ['Applied AI', 'Agents & RAG', 'Voice AI', 'LLM evaluation', 'Always learning'];

export default function Hero({ profile = fallbackProfile }: { profile?: Profile }) {
    const [photoFailed, setPhotoFailed] = useState(false);
    const photoSrc = photoFailed ? '/profile.png' : profile.profilePhoto || '/profile.png';

    return (
        <section id="home" className="portfolio-hero" aria-labelledby="hero-heading">
            <div className="portfolio-wrap hero-layout">
                <div className="hero-copy">
                    <h1 id="hero-heading"><span className="hero-hello">Hey, I’m</span><span>{profile.fullName.split(' ')[0]}<Asterisk className="hero-asterisk" aria-hidden="true" /></span><span className="hero-surname">{profile.fullName.split(' ').slice(1).join(' ')}<span className="hero-period">.</span></span></h1>
                    <p className="hero-role">{profile.headline} <span>/</span> Agents, RAG &amp; voice AI</p>
                    <p className="hero-description">I build AI that does useful work — from grounded answers to voice agents that connect with real business workflows. Computer Science at MIT ADT, graduating in 2027.</p>
                    <div className="hero-actions">
                        <Link href="#projects" className="brutal-button">Explore my work <ArrowDownRight size={20} aria-hidden="true" /></Link>
                        <Link href={profile.links.resume || '/resume'} className="text-link">Take a look at my résumé <ArrowUpRight size={17} aria-hidden="true" /></Link>
                    </div>
                    <p className="hero-location"><MapPin size={14} aria-hidden="true" /> {profile.locationShort || profile.location} <span>·</span> Building voice AI at Quensulting.</p>
                </div>
                <div className="hero-photo-area">
                    <figure className="hero-print">
                        <div className="hero-photo"><Image src={photoSrc} alt={`${profile.fullName}, in a suit and glasses, standing in a warmly lit library`} fill preload loading="eager" fetchPriority="high" unoptimized={!canOptimize(photoSrc)} sizes="(max-width: 650px) 76vw, (max-width: 1000px) 40vw, 360px" onError={() => setPhotoFailed(true)} /></div>
                        <figcaption><span>Engineer. Curious human.</span><ArrowUpRight size={22} aria-hidden="true" /></figcaption>
                    </figure>
                    <a className="hero-availability" href="#contact" aria-label={profile.availability || 'Open to opportunities'}><span aria-hidden="true" /> Open to opportunities <ArrowUpRight size={15} aria-hidden="true" /></a>
                    <div className="hero-note" aria-hidden="true">A face to the code.<ArrowDownRight size={28} /></div>
                </div>
            </div>
            <div className="hero-bottom portfolio-wrap"><span>Useful systems. Thoughtful details.</span><a href="#projects">A little more about what I do <ArrowDown size={16} aria-hidden="true" /></a></div>
            <div className="discipline-band">
                {/* Two identical sets let the band loop seamlessly; the copy is hidden from assistive tech. */}
                <div className="discipline-track">
                    {[0, 1].map((copy) => (
                        <p className="discipline-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                            {copy === 0 ? <span className="sr-only">Engineering focus: {FOCUS.join(', ')}.</span> : null}
                            {FOCUS.map((item) => (
                                <Fragment key={item}><span aria-hidden="true">{item}</span><Asterisk aria-hidden="true" /></Fragment>
                            ))}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
