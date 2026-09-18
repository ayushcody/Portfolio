import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Check, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/config/portfolio';
import { pageMetadata } from '@/lib/seo';
import '@/components/secondary-pages.css';
import '@/components/editorial.css';

// A standalone link card: not in the navigation or sitemap, so it stays out of search results.
export const metadata: Metadata = {
    ...pageMetadata({ title: 'Launch', description: profile.shortBio, path: '/launch' }),
    robots: { index: false, follow: false },
};

const signals = [
    'High-agency builder',
    'Debugs under pressure',
    'Ships real systems',
    'Learns fast',
];

export default function LaunchPage() {
    return (
        <main className="secondary-page editorial-page launch-page">
            <div className="launch-stack">
                <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Return to home</Link>

                <section className="ink-card launch-card" aria-labelledby="launch-title">
                    <div className="launch-card-top">
                        <span className="launch-monogram" aria-hidden="true">{profile.initials}</span>
                        <span className="eyebrow eyebrow--chip" style={{ '--chip-color': 'var(--sage)' } as React.CSSProperties}>Mission complete</span>
                    </div>

                    <h1 id="launch-title">You reached the end of the system.</h1>
                    <p className="launch-bio">{profile.shortBio}</p>

                    <ul className="launch-signals" aria-label="Candidate signals">
                        {signals.map((signal) => (
                            <li key={signal}><Check size={16} strokeWidth={2.5} aria-hidden="true" />{signal}</li>
                        ))}
                    </ul>

                    <ul className="launch-links" aria-label={`Contact ${profile.fullName}`}>
                        <li>
                            <a href={`mailto:${profile.email}`} className="brutal-button">
                                <span><Mail size={18} aria-hidden="true" /> Let&apos;s talk</span>
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </a>
                        </li>
                        <li>
                            <Link href={profile.resumePath} className="brutal-button brutal-button--secondary">
                                <span><FileText size={18} aria-hidden="true" /> Resume</span>
                                <ArrowRight size={18} aria-hidden="true" />
                            </Link>
                        </li>
                        <li>
                            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="brutal-button brutal-button--secondary" aria-label="LinkedIn (opens in a new tab)">
                                <span><Linkedin size={18} aria-hidden="true" /> LinkedIn</span>
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </a>
                        </li>
                        <li>
                            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="brutal-button brutal-button--secondary" aria-label="GitHub (opens in a new tab)">
                                <span><Github size={18} aria-hidden="true" /> GitHub</span>
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </a>
                        </li>
                    </ul>
                </section>

                <Asterisk className="launch-asterisk" aria-hidden="true" />
            </div>
        </main>
    );
}
