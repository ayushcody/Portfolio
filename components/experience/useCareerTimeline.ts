'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Reading line as a fraction of the viewport height; the sticky traveler sits on the same line (48vh in CSS). */
const READING_LINE = 0.48;

/**
 * Drives the experience timeline with at most one layout read per animation frame:
 * - scroll/resize listeners exist only while the track is on screen (IntersectionObserver gate);
 * - each frame reads the track rect once, then writes `--journey-progress` (only when it changed)
 *   and the active chapter (only when it changed);
 * - stop offsets are cached and re-read only after the track resizes;
 * - with reduced motion the axis stays complete; the active chapter still follows the reader.
 *
 * Stops are the track's direct children, in order. Deriving the active stop from offsets (rather than an
 * IntersectionObserver band) stays correct after jumps that skip past the reading line in one frame.
 */
export function useCareerTimeline(trackRef: RefObject<HTMLOListElement | null>, stopKey: string) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const stops = Array.from(track.children) as HTMLElement[];
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        let frame = 0;
        let offsets: number[] = [];
        let offsetsStale = true;
        let writtenProgress = -1;
        let currentStop = -1;
        let onScreen = false;
        let listening = false;

        const measure = () => {
            frame = 0;
            // Reads (layout is clean at the start of the frame).
            if (offsetsStale) {
                offsets = stops.map((stop) => stop.offsetTop); // offsetParent is the positioned track
                offsetsStale = false;
            }
            const { top, height } = track.getBoundingClientRect();
            const reading = window.innerHeight * READING_LINE - top;

            // Writes.
            let next = 0;
            for (let index = 0; index < offsets.length; index += 1) {
                if (offsets[index] <= reading) next = index;
            }
            if (next !== currentStop) {
                currentStop = next;
                setActive(next);
            }
            const progress = reducedMotion.matches ? 1 : Math.round(Math.min(1, Math.max(0, reading / Math.max(height, 1))) * 1000) / 1000;
            if (progress !== writtenProgress) {
                writtenProgress = progress;
                track.style.setProperty('--journey-progress', String(progress));
            }
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };
        const setListening = (on: boolean) => {
            if (on === listening) return;
            listening = on;
            if (on) {
                window.addEventListener('scroll', schedule, { passive: true });
                window.addEventListener('resize', schedule, { passive: true });
            } else {
                window.removeEventListener('scroll', schedule);
                window.removeEventListener('resize', schedule);
            }
        };

        const visibility = new IntersectionObserver((entries) => {
            onScreen = entries[entries.length - 1].isIntersecting;
            setListening(onScreen);
            // Entering or leaving also measures once, so the state is exact at either edge.
            schedule();
        });
        visibility.observe(track);
        const resize = new ResizeObserver(() => {
            offsetsStale = true;
            schedule();
        });
        resize.observe(track);
        reducedMotion.addEventListener('change', schedule);

        return () => {
            cancelAnimationFrame(frame);
            visibility.disconnect();
            resize.disconnect();
            setListening(false);
            reducedMotion.removeEventListener('change', schedule);
        };
    }, [trackRef, stopKey]);

    return active;
}
