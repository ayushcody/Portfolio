'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Asterisk } from 'lucide-react';
import { experiencesData, type ExperienceItem } from '@/src/data/experience';
import './experience.css';

export default function Experience({ experiences = experiencesData }: { experiences?: ExperienceItem[] }) {
    // Data is newest-first; the journey reads oldest-first.
    const journey = [...experiences].reverse().map((role, index) => ({ ...role, id: role.id || `role-${index}` }));
    const trackRef = useRef<HTMLOListElement>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = track.getBoundingClientRect();
            const position = Math.max(0, Math.min(rect.height, window.innerHeight * .48 - rect.top));
            track.style.setProperty('--journey-progress', String(reduced.matches ? 1 : position / Math.max(rect.height, 1)));
            track.style.setProperty('--journey-position', `${position}px`);
            let current = 0;
            Array.from(track.children).forEach((entry, index) => {
                if (entry.getBoundingClientRect().top <= window.innerHeight * .48) current = index;
            });
            setActive(previous => previous === current ? previous : current);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        const observer = new ResizeObserver(schedule);
        observer.observe(track);
        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        reduced.addEventListener('change', schedule);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            reduced.removeEventListener('change', schedule);
        };
    }, []);

    return (
        <section id="experience" className="career-section" aria-labelledby="experience-heading">
            <div className="portfolio-wrap">
                <div className="career-heading">
                    <h2 id="experience-heading">Built along<br />the way<span className="accent-period">.</span></h2>
                    <div><p>From finding weak points to building systems that speak. Five roles, each adding something to how I work.</p><span className="career-range">2024 <ArrowUpRight size={18} aria-hidden="true" /> Present</span></div>
                </div>
                <div className="career-layout">
                    <aside className="career-guide" aria-label="Experience chapters">
                        <div className="career-counter" aria-hidden="true"><span>{String(active + 1).padStart(2, '0')}</span><small>/ {String(journey.length).padStart(2, '0')}</small><Asterisk size={36} /></div>
                        <p className="career-guide-title">A little more range.<br />With every chapter.</p>
                        <nav aria-label="Jump to a role">
                            {journey.map((role, index) => <a key={role.id} href={`#career-${role.id}`} aria-current={index === active ? 'step' : undefined}><span className="career-guide-index">{String(index + 1).padStart(2, '0')}</span><span>{role.progressionLabel || role.company}</span><ArrowUpRight size={16} aria-hidden="true" /></a>)}
                        </nav>
                        <Link href="/resume" className="text-link">View résumé <ArrowUpRight size={16} aria-hidden="true" /></Link>
                    </aside>
                    <div className="career-track-shell">
                    <ol ref={trackRef} className="career-track">
                        {journey.map((role, index) => <li id={`career-${role.id}`} className={`career-stop career-tone-${index}`} data-active={index === active} key={role.id}>
                            <span className="career-node" aria-hidden="true">0{index + 1}</span>
                            <article className="career-entry" aria-labelledby={`career-title-${role.id}`}>
                                <div className="career-entry-top"><span>{role.period}</span><span>{role.type}</span></div>
                                <h3 id={`career-title-${role.id}`}>{role.chapterTitle || role.role}</h3>
                                <p className="career-company">{role.company}</p>
                                <p className="career-role">{role.role}<span>{role.location}</span></p>
                                <p className="career-summary">{role.shortSummary}</p>
                                <ul className="career-contributions">{role.responsibilities.map(item => <li key={item}>{item}</li>)}</ul>
                                <div className="career-tools" aria-label="Tools and practices">{role.techStack.map(tool => <span key={tool}>{tool}</span>)}</div>
                                {role.id === 'persistent' && <Link className="text-link career-proof" href="/projects/email-digital-twin">Explore Persona Mail <ArrowUpRight size={16} aria-hidden="true" /></Link>}
                            </article>
                        </li>)}
                    </ol>
                    <div className="career-traveler-rail" aria-hidden="true"><span><ArrowDown size={14} /></span></div>
                    </div>
                </div>
                <div className="career-next"><ArrowDown size={22} aria-hidden="true" /><p>Same curiosity. More to build.</p><a className="text-link" href="#contact">Let’s talk about what’s next <ArrowUpRight size={16} aria-hidden="true" /></a></div>
            </div>
        </section>
    );
}
