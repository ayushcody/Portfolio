import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/*
 * A hand-drawn underline. It draws itself in, then "boils" for a moment like a hand-drawn
 * cartoon line (three slightly different strokes shown in turn), and boils again on hover or
 * keyboard focus. With reduced motion it is a still line. Styles: app/primitives.css (.scribble).
 */

// Three takes of the same scribble: a long wave with a shorter return stroke under it.
const TAKES = [
    'M3 9 C 38 1, 74 16, 112 7 S 172 2, 197 11 M 22 15 C 64 10, 116 20, 168 13',
    'M2 12 C 36 18, 70 2, 110 12 S 168 17, 198 5 M 26 18 C 66 14, 112 10, 172 17',
    'M4 6 C 40 6, 78 15, 114 5 S 176 12, 196 13 M 18 13 C 60 19, 120 12, 166 18',
];

export function Scribble({ children, color = 'var(--coral)', className }: { children: ReactNode; color?: string; className?: string }) {
    return (
        <span className={cn('scribble', className)} style={{ '--scribble': color } as CSSProperties}>
            {children}
            <svg className="scribble-line" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                {TAKES.map((d, i) => (
                    <path key={i} className={`scribble-take scribble-take--${i + 1}`} d={d} pathLength={1} />
                ))}
            </svg>
        </span>
    );
}
