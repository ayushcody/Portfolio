'use client';

import { useEffect } from 'react';
import { animate, inView, scroll, stagger, type AnimationPlaybackControls } from 'motion';

/*
 * Motion for the home page (motion.dev, vanilla API). Sections stay server-rendered and readable
 * without JavaScript; this component only enhances them after hydration:
 * - blocks below the fold rise into view, in sequence, the first time they are scrolled to
 *   (project cards also un-crop from the top, like a print being laid down);
 * - the focus band scrolls as a marquee that speeds up, and reverses, with page scroll;
 * - the portrait tilts toward the pointer;
 * - the decorative asterisks turn with scroll;
 * - the footer name draws its outline when it comes into view.
 * The hero entrance is plain CSS (portfolio.css) and never hides text, so it never waits for this bundle.
 * Nothing runs when the visitor prefers reduced motion.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const RISE = 'translateY(28px)';

/** [container, children]: the children reveal in sequence once the container enters the viewport. */
const REVEAL_GROUPS: Array<[string, string]> = [
    ['#projects .section-heading', ':scope > *'],
    ['.selected-work-grid', ':scope > li'],
    ['.work-footnote', ':scope > *'],
    ['.career-heading', ':scope > *'],
    ['.achievement-heading-row', ':scope > *'],
    ['.achievement-gallery', '.achievement-card'],
    ['.writing-section', ':scope > .writing-heading, :scope > .writing-link, :scope > .writing-all'],
    ['.toolkit-layout > div:first-child', ':scope > *'],
    ['.toolkit-rows', ':scope > *'],
    ['.contact-invitation .portfolio-wrap > div:first-child', ':scope > *'],
];

/** Decorative glyphs that turn with scroll: [selector, start angle, end angle]. */
const SCROLL_SPINS: Array<[string, number, number]> = [
    ['.contact-asterisk', 10, 190],
];

function isOnScreen(element: Element) {
    const box = element.getBoundingClientRect();
    return box.top < window.innerHeight && box.bottom > 0;
}

function clearInline(elements: HTMLElement[], properties: string[]) {
    for (const element of elements) for (const property of properties) element.style.removeProperty(property);
}

/** Once an animation ends, hand the listed properties back to CSS (after motion commits its final values). */
function releaseWhenDone(animation: AnimationPlaybackControls, elements: HTMLElement[], properties: string[]) {
    void animation.finished.then(() => requestAnimationFrame(() => clearInline(elements, properties)));
}

function setupReveals(cleanups: Array<() => void>) {
    for (const [containerSelector, childSelector] of REVEAL_GROUPS) {
        for (const container of document.querySelectorAll<HTMLElement>(containerSelector)) {
            // Already visible at load (reload mid-page, anchor links): leave it alone rather than hide it.
            if (isOnScreen(container)) continue;
            const children = Array.from(container.querySelectorAll<HTMLElement>(childSelector));
            if (children.length === 0) continue;

            for (const child of children) {
                child.style.opacity = '0';
                child.style.transform = RISE;
            }

            const stop = inView(container, () => {
                // Transforms go back to CSS afterwards so hover effects on cards keep working.
                releaseWhenDone(animate(children, { opacity: [0, 1], transform: [RISE, 'translateY(0px)'] }, { duration: 0.75, ease: EASE, delay: stagger(0.08) }), children, ['opacity', 'transform']);

                for (const period of container.querySelectorAll<HTMLElement>('.accent-period')) {
                    releaseWhenDone(animate(period, { transform: ['scale(0)', 'scale(1)'] }, { type: 'spring', stiffness: 420, damping: 14, delay: 0.35 }), [period], ['transform']);
                }
                // Project covers un-crop from the top as their card arrives.
                const covers = Array.from(container.querySelectorAll<HTMLElement>('.pcard-media'));
                covers.forEach((cover, index) => {
                    releaseWhenDone(animate(cover, { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] }, { duration: 0.9, ease: EASE, delay: 0.12 + index * 0.08 }), [cover], ['clip-path']);
                });
                return undefined;
            }, { margin: '0px 0px -12% 0px' });
            cleanups.push(() => {
                stop();
                clearInline(children, ['opacity', 'transform']);
            });
        }
    }
}

/** The focus band loops forever; scrolling pushes it faster in the scroll direction, then it eases back. */
function setupMarquee(cleanups: Array<() => void>) {
    const track = document.querySelector<HTMLElement>('.discipline-track');
    if (!track) return;
    track.dataset.animated = 'true';

    const loop: AnimationPlaybackControls = animate(track, { transform: ['translateX(0%)', 'translateX(-50%)'] }, { duration: 38, ease: 'linear', repeat: Infinity });
    let target = 1;
    let speed = 1;
    let frame = 0;

    const tick = () => {
        speed += (target - speed) * 0.08;
        target += (Math.sign(target) - target) * 0.04; // drift back to normal speed, keeping the last direction
        loop.speed = speed;
        frame = Math.abs(target - speed) > 0.001 || Math.abs(Math.abs(target) - 1) > 0.001 ? requestAnimationFrame(tick) : 0;
    };

    const stopScroll = scroll((_progress: number, info: { y: { velocity: number } }) => {
        const velocity = info.y.velocity;
        if (Math.abs(velocity) < 20) return;
        const direction = velocity > 0 ? 1 : -1;
        target = direction * Math.min(1 + Math.abs(velocity) / 450, 6);
        if (!frame) frame = requestAnimationFrame(tick);
    });

    cleanups.push(() => {
        stopScroll();
        cancelAnimationFrame(frame);
        loop.stop();
        track.style.removeProperty('transform');
        delete track.dataset.animated;
    });
}

/** The printed portrait leans toward the pointer, like a photo picked up off the desk. */
function setupPortraitTilt(cleanups: Array<() => void>) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const area = document.querySelector<HTMLElement>('.hero-photo-area');
    const print = area?.querySelector<HTMLElement>('.hero-print');
    if (!area || !print) return;

    const spring = { type: 'spring', stiffness: 170, damping: 18 } as const;
    const onMove = (event: PointerEvent) => {
        const box = print.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        animate(print, { '--ry': `${(x * 12).toFixed(2)}deg`, '--rx': `${(-y * 10).toFixed(2)}deg` }, spring);
    };
    const onLeave = () => animate(print, { '--ry': '0deg', '--rx': '0deg' }, spring);

    area.addEventListener('pointermove', onMove);
    area.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
        area.removeEventListener('pointermove', onMove);
        area.removeEventListener('pointerleave', onLeave);
        clearInline([print], ['--rx', '--ry']);
    });
}

function setupScrollSpins(cleanups: Array<() => void>) {
    for (const [selector, from, to] of SCROLL_SPINS) {
        const glyph = document.querySelector<SVGElement>(selector);
        const section = glyph?.closest('section');
        if (!glyph || !section) continue;
        const spin = animate(glyph, { transform: [`rotate(${from}deg)`, `rotate(${to}deg)`] }, { ease: 'linear' });
        const stop = scroll(spin, { target: section, offset: ['start end', 'end start'] });
        cleanups.push(() => {
            stop();
            spin.stop();
            glyph.style.removeProperty('transform');
        });
    }
}

/** The outlined name in the footer traces itself once, the first time it scrolls into view. */
function setupFooterName(cleanups: Array<() => void>) {
    const name = document.querySelector<SVGElement>('.footer-name-effect');
    if (!name || isOnScreen(name)) return;
    name.dataset.draw = 'ready';
    const stop = inView(name, () => {
        name.dataset.draw = 'drawing';
        return undefined;
    }, { amount: 0.4 });
    cleanups.push(() => {
        stop();
        delete name.dataset.draw;
    });
}

export function HomeMotion() {
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        let cleanups: Array<() => void> = [];

        const start = () => {
            if (query.matches) return;
            setupReveals(cleanups);
            setupMarquee(cleanups);
            setupPortraitTilt(cleanups);
            setupScrollSpins(cleanups);
            setupFooterName(cleanups);
        };
        const stopAll = () => {
            for (const cleanup of cleanups) cleanup();
            cleanups = [];
        };
        const onPreferenceChange = () => {
            stopAll();
            start();
        };

        start();
        query.addEventListener('change', onPreferenceChange);
        return () => {
            query.removeEventListener('change', onPreferenceChange);
            stopAll();
        };
    }, []);

    return null;
}
