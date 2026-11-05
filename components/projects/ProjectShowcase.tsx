'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import type { ProjectShot } from '@/src/data/projectShots';

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Screenshots at the top of a case study: the first one large, the rest in a grid, each with a
 * caption that says what the screen shows. Any screenshot opens full size in a dialog with
 * previous/next (arrow keys work too).
 */
export function ProjectShowcase({ title, shots }: { title: string; shots: ProjectShot[] }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState<number | null>(null);
    const [lead, ...rest] = shots;

    const show = useCallback((index: number) => {
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
        const onClose = () => setOpen(null);
        dialog.addEventListener('keydown', onKey);
        dialog.addEventListener('close', onClose);
        return () => {
            dialog.removeEventListener('keydown', onKey);
            dialog.removeEventListener('close', onClose);
        };
    }, [step]);

    if (!lead) return null;
    const current = open === null ? null : shots[open];

    const tile = (shot: ProjectShot, index: number, isLead: boolean) => (
        <figure className={isLead ? 'shot shot--lead' : 'shot'} key={shot.src}>
            <button type="button" className="shot-frame" onClick={() => show(index)} aria-label={`View screenshot ${index + 1} of ${shots.length} full size: ${shot.alt}`}>
                <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    loading={isLead ? 'eager' : 'lazy'}
                    sizes={isLead ? '(min-width: 1240px) 1160px, calc(100vw - 40px)' : '(min-width: 1240px) 570px, (min-width: 700px) 46vw, calc(100vw - 40px)'}
                />
                <span className="shot-zoom" aria-hidden="true"><Maximize2 size={16} /></span>
            </button>
            <figcaption>
                <span className="shot-index" aria-hidden="true">{pad(index + 1)}</span>
                <span>{shot.caption}</span>
            </figcaption>
        </figure>
    );

    return (
        <section className="case-showcase" aria-labelledby="case-showcase-heading">
            <div className="case-showcase-head">
                <h2 id="case-showcase-heading">A look inside</h2>
                <p>{shots.length} {shots.length === 1 ? 'screen' : 'screens'} from the real build. Select any to see it full size.</p>
            </div>
            {tile(lead, 0, true)}
            {rest.length > 0 ? <div className="shot-grid">{rest.map((shot, index) => tile(shot, index + 1, false))}</div> : null}

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
                        <p className="shot-dialog-caption">{current.caption}</p>
                    </div>
                ) : null}
            </dialog>
        </section>
    );
}
