'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import type { ProjectImage } from '@/src/data/projectSchema';

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Screenshots near the top of a case study, in a two-column grid (the first spans both columns when
 * the count is odd), each with a caption that says what the screen shows. Any screenshot opens full
 * size in a dialog with previous/next (arrow keys work too); closing returns focus to the screenshot.
 */
export function ProjectShowcase({ title, shots }: { title: string; shots: ProjectImage[] }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState<number | null>(null);

    const triggerRef = useRef<HTMLElement | null>(null);

    const show = useCallback((index: number) => {
        triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setOpen(index);
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);
    const step = useCallback((delta: number) => setOpen((current) => (current === null ? current : (current + delta + shots.length) % shots.length)), [shots.length]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') step(1);
            if (event.key === 'ArrowLeft') step(-1);
        };
        const onClose = () => {
            setOpen(null);
            triggerRef.current?.focus();
        };
        dialog.addEventListener('keydown', onKey);
        dialog.addEventListener('close', onClose);
        return () => {
            dialog.removeEventListener('keydown', onKey);
            dialog.removeEventListener('close', onClose);
        };
    }, [step]);

    if (shots.length === 0) return null;
    const current = open === null ? null : shots[open];

    // The first shot spans the grid when the count is odd, so it is the large one.
    const wide = (index: number) => index === 0 && shots.length % 2 === 1;

    const tile = (shot: ProjectImage, index: number) => (
        <figure className={wide(index) ? 'shot shot--lead' : 'shot'} key={shot.src}>
            <button type="button" className="shot-frame" onClick={() => show(index)} aria-label={`View screenshot ${index + 1} of ${shots.length} full size: ${shot.alt}`}>
                <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    sizes={wide(index) ? '(min-width: 1240px) 1160px, calc(100vw - 40px)' : '(min-width: 1240px) 566px, (min-width: 700px) calc(50vw - 62px), calc(100vw - 40px)'}
                />
                <span className="shot-zoom" aria-hidden="true"><Maximize2 size={16} /></span>
            </button>
            <figcaption>
                <span className="shot-index" aria-hidden="true">{pad(index + 1)}</span>
                <span>{shot.caption ?? shot.alt}</span>
            </figcaption>
        </figure>
    );

    return (
        <section className="case-showcase" aria-labelledby="case-showcase-heading">
            <div className="case-showcase-head">
                <h2 id="case-showcase-heading">A look inside</h2>
                <p>{shots.length} {shots.length === 1 ? 'screen' : 'screens'} from the real build. Select one to see it full size.</p>
            </div>
            <div className="shot-grid">{shots.map((shot, index) => tile(shot, index))}</div>

            <dialog ref={dialogRef} className="shot-dialog" aria-label={`${title} screenshots`} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
                {current ? (
                    <div className="shot-dialog-inner">
                        <div className="shot-dialog-bar">
                            <span className="shot-dialog-count">{pad((open ?? 0) + 1)} / {pad(shots.length)}</span>
                            <div className="shot-dialog-actions">
                                {shots.length > 1 ? (
                                    <>
                                        <button type="button" onClick={() => step(-1)} aria-label="Previous screenshot"><ArrowLeft size={18} aria-hidden="true" /></button>
                                        <button type="button" onClick={() => step(1)} aria-label="Next screenshot"><ArrowRight size={18} aria-hidden="true" /></button>
                                    </>
                                ) : null}
                                <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" autoFocus><X size={18} aria-hidden="true" /></button>
                            </div>
                        </div>
                        <div className="shot-dialog-image">
                            <Image src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="100vw" />
                        </div>
                        <p className="shot-dialog-caption">{current.caption ?? current.alt}</p>
                    </div>
                ) : null}
            </dialog>
        </section>
    );
}
