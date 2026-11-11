'use client';

import { useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

type FilterCategory = { id: string; label: string; count: number };

type ProjectFilterProps = {
    categories: FilterCategory[];
    total: number;
    /** Server-rendered grid items: `<li data-category={id} style={{ '--vt': 'pcard-<slug>' }}>`. */
    children: ReactNode;
};

const ALL = 'all';

function describe(active: string, categories: FilterCategory[], total: number) {
    if (active === ALL) return `Showing all ${total} projects, featured first.`;
    const category = categories.find((entry) => entry.id === active);
    if (!category) return `Showing all ${total} projects, featured first.`;
    return `Showing ${category.count} ${category.label} ${category.count === 1 ? 'project' : 'projects'}.`;
}

/**
 * Category filter for /projects. The cards are rendered on the server and every one is visible
 * without JavaScript; the filter only adds a `data-filter` on the grid, which CSS turns into hidden items.
 * Where the browser supports view transitions (and motion is welcome), the grid re-flows smoothly.
 */
export function ProjectFilter({ categories, total, children }: ProjectFilterProps) {
    const [active, setActive] = useState(ALL);
    const gridRef = useRef<HTMLUListElement>(null);

    const select = (id: string) => {
        if (id === active) return;
        const grid = gridRef.current;
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!grid || calm || typeof document.startViewTransition !== 'function') {
            setActive(id);
            return;
        }
        grid.dataset.animating = 'true';
        const transition = document.startViewTransition(() => {
            flushSync(() => setActive(id));
        });
        void transition.finished.finally(() => {
            delete grid.dataset.animating;
        });
    };

    // One rule per category; ids are slugs of the fixed PROJECT_CATEGORIES list.
    const rules = categories.map(({ id }) => `.pgrid[data-filter="${id}"]>li:not([data-category="${id}"]){display:none}`).join('');

    const options = [{ id: ALL, label: 'All', count: total }, ...categories];

    return (
        <>
            <div className="pfilter">
                <div className="pfilter-chips" role="group" aria-label="Filter projects by category">
                    {options.map((option) => (
                        <button key={option.id} type="button" className="pfilter-chip" aria-pressed={active === option.id} onClick={() => select(option.id)}>
                            {option.label}
                            <span className="pfilter-count" aria-hidden="true">{option.count}</span>
                            <span className="visually-hidden">, {option.count} {option.count === 1 ? 'project' : 'projects'}</span>
                        </button>
                    ))}
                </div>
                <p className="pfilter-status" aria-live="polite">{describe(active, categories, total)}</p>
            </div>
            <style>{rules}</style>
            <ul ref={gridRef} className="pgrid" data-filter={active}>
                {children}
            </ul>
        </>
    );
}
