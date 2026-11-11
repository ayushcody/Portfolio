import type { Project } from '@/src/data/projectSchema';

/** A project's accent block: 0 lilac, 1 coral, 2 sage, 3 yellow. Stable wherever the project appears. */
export type VisualTone = 0 | 1 | 2 | 3;

const toneByCategory: Record<string, VisualTone> = {
    'Voice AI': 0,
    'Agentic AI': 3,
    'RAG & Retrieval': 1,
    'Document AI': 2,
    'Full-Stack Product': 1,
    'Developer Tooling': 3,
    Security: 2,
};

export function projectTone(project: Pick<Project, 'slug' | 'category'>): VisualTone {
    const known = toneByCategory[project.category];
    if (known !== undefined) return known;
    let hash = 0;
    for (const char of project.slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return (hash % 4) as VisualTone;
}

export const toneClass: Record<VisualTone, string> = { 0: 'tone-lilac', 1: 'tone-coral', 2: 'tone-sage', 3: 'tone-yellow' };
export const toneColor: Record<VisualTone, string> = { 0: 'var(--lilac)', 1: 'var(--coral)', 2: 'var(--sage)', 3: 'var(--yellow)' };

export const statusSlug = (status: string) => status.toLowerCase().replace(/\s+/g, '-');
