import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CaseSectionEntry = {
    id: string;
    title: string;
    content: ReactNode;
};

/** Numbered case study section: "01 Overview". */
export function CaseStudySection({ id, number, title, children }: { id: string; number: number; title: string; children: ReactNode }) {
    const label = String(number).padStart(2, '0');
    return (
        <section id={id} className="case-section" aria-labelledby={`${id}-heading`}>
            <div className="case-section-head">
                <span className="case-section-number" aria-hidden="true">{label}</span>
                <h2 id={`${id}-heading`}>{title}</h2>
            </div>
            <div className="case-section-body">{children}</div>
        </section>
    );
}

/** Plain anchor list of the sections that actually rendered. */
export function CaseStudyIndex({ sections }: { sections: Pick<CaseSectionEntry, 'id' | 'title'>[] }) {
    return (
        <nav className="case-index" aria-label="On this page">
            <p className="case-index-title">On this page</p>
            <ol>
                {sections.map((section, index) => (
                    <li key={section.id}>
                        <a href={`#${section.id}`}>
                            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            {section.title}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

type ListTone = 'yellow' | 'lilac' | 'coral' | 'sage';

export function CaseList({ items, tone = 'yellow', grid = false, label }: { items: string[]; tone?: ListTone; grid?: boolean; label?: string }) {
    if (items.length === 0) return null;
    return (
        <ul className={cn('case-list', tone !== 'yellow' && `case-list--${tone}`, grid && items.length > 2 && 'case-list--grid')} aria-label={label}>
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    );
}
