"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { achievementsData } from "@/config/portfolio";
import type { AchievementEntry } from "@/src/data/achievements";
import "./achievements.css";

const numberLabel = (value: number) => String(value).padStart(2, "0");

function AchievementCard({ item, index }: { item: AchievementEntry; index: number }) {
    const [imageFailed, setImageFailed] = useState(false);
    const Icon = item.icon;

    return (
        <li className={`achievement-card achievement-card-${index % 4}`}>
            <article aria-labelledby={`achievement-title-${item.id}`}>
                <div className="achievement-artwork">
                    {item.image && !imageFailed ? (
                        // A regular image also supports locally added photos without a remote-host allowlist.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            className="achievement-photo"
                            src={item.image}
                            alt={item.imageAlt}
                            width={1600}
                            height={1000}
                            loading="lazy"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <div className="achievement-poster" aria-hidden="true">
                            <span className="achievement-poster-overline">A LITTLE MILESTONE</span>
                            <div className="achievement-poster-award">
                                <Icon strokeWidth={1.6} />
                                <span>{item.title}</span>
                            </div>
                            <span className="achievement-poster-footnote">{item.proofLabel}</span>
                            <Sparkles className="achievement-poster-spark" strokeWidth={1.5} />
                        </div>
                    )}
                    <span className="achievement-number" aria-hidden="true">{numberLabel(index + 1)}</span>
                </div>
                <div className="achievement-caption">
                    <div className="achievement-meta">
                        <span>{item.title}</span>
                        <span>{item.date || item.year}</span>
                    </div>
                    <h3 id={`achievement-title-${item.id}`}>{item.event}</h3>
                    <p>{item.context}</p>
                    {item.outcome ? <p className="achievement-outcome">{item.outcome}</p> : null}
                    {item.proofUrl ? (
                        <a className="achievement-proof" href={item.proofUrl} target="_blank" rel="noopener noreferrer">
                            View recognition
                            <ArrowUpRight size={17} aria-hidden="true" />
                            <span className="achievement-sr-only"> for {item.event} (opens in a new tab)</span>
                        </a>
                    ) : null}
                </div>
            </article>
        </li>
    );
}

export default function Achievements() {
    const galleryRef = useRef<HTMLUListElement>(null);
    const [viewport, setViewport] = useState({ first: 1, last: 1, atStart: true, atEnd: false });

    useEffect(() => {
        const gallery = galleryRef.current;
        if (!gallery) return;

        let animationFrame = 0;
        const measure = () => {
            const bounds = gallery.getBoundingClientRect();
            const cards = Array.from(gallery.children);
            const visible = cards.flatMap((card, index) => {
                const cardBounds = card.getBoundingClientRect();
                const overlap = Math.min(cardBounds.right, bounds.right) - Math.max(cardBounds.left, bounds.left);
                return overlap > cardBounds.width / 2 ? [index + 1] : [];
            });
            const next = {
                first: visible[0] ?? 1,
                last: visible[visible.length - 1] ?? 1,
                atStart: gallery.scrollLeft <= 2,
                atEnd: gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2,
            };
            setViewport((previous) => (
                previous.first === next.first && previous.last === next.last
                && previous.atStart === next.atStart && previous.atEnd === next.atEnd
                    ? previous : next
            ));
        };
        const scheduleMeasure = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(measure);
        };
        gallery.addEventListener("scroll", scheduleMeasure, { passive: true });
        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(gallery);
        scheduleMeasure();

        return () => {
            cancelAnimationFrame(animationFrame);
            observer.disconnect();
            gallery.removeEventListener("scroll", scheduleMeasure);
        };
    }, []);

    const move = (direction: "previous" | "next" | "first" | "last") => {
        const gallery = galleryRef.current;
        if (!gallery) return;
        const cards = Array.from(gallery.children);
        const stride = cards.length > 1
            ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left
            : gallery.clientWidth;
        const left = direction === "first" ? 0
            : direction === "last" ? gallery.scrollWidth
                : gallery.scrollLeft + (direction === "next" ? stride : -stride);

        gallery.scrollTo({
            left,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        if (event.target !== event.currentTarget) return;
        const directions: Record<string, Parameters<typeof move>[0]> = {
            ArrowLeft: "previous", ArrowRight: "next", Home: "first", End: "last",
        };
        const direction = directions[event.key];
        if (direction) {
            event.preventDefault();
            move(direction);
        }
    };

    return (
        <section id="achievements" className="achievement-section" aria-labelledby="achievement-heading">
            <div className="achievement-inner">
                <div className="achievement-heading-row">
                    <div>
                        <h2 id="achievement-heading">A few proud moments.</h2>
                        <p className="achievement-intro">Long builds, good teams, and a few wins along the way.</p>
                    </div>
                    <div className="achievement-controls">
                        <span className="achievement-count" aria-live="polite" aria-atomic="true">
                            <span className="achievement-sr-only">Showing achievements </span>
                            {numberLabel(viewport.first)}
                            {viewport.last !== viewport.first ? `–${numberLabel(viewport.last)}` : ""}
                            <span className="achievement-count-total"> / {numberLabel(achievementsData.length)}</span>
                        </span>
                        <button type="button" onClick={() => move("previous")} disabled={viewport.atStart}
                            aria-label="Previous achievements" aria-controls="achievement-gallery">
                            <ArrowLeft size={21} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => move("next")} disabled={viewport.atEnd}
                            aria-label="Next achievements" aria-controls="achievement-gallery">
                            <ArrowRight size={21} aria-hidden="true" />
                        </button>
                    </div>
                </div>
                <p id="achievement-instructions" className="achievement-sr-only">
                    Swipe or use the previous and next buttons to browse. When this gallery is focused, use the left
                    and right arrow keys, Home for the first achievement, or End for the last.
                </p>
                <ul id="achievement-gallery" className="achievement-gallery" ref={galleryRef} tabIndex={0}
                    aria-label="Awards and recognition" aria-describedby="achievement-instructions" onKeyDown={handleKeyDown}>
                    {achievementsData.map((item, index) => <AchievementCard key={item.id} item={item} index={index} />)}
                </ul>
                <p className="achievement-browse-hint">A little more to the right <ArrowRight size={16} aria-hidden="true" /></p>
            </div>
        </section>
    );
}
