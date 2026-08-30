import { ArrowDown, ArrowRight, Network } from 'lucide-react';
import type { ProjectEntry } from '@/config/portfolio';
import { getProjectSystemLayers } from '@/lib/projectArchitecture';
import { cn } from '@/lib/utils';

type ProjectArchitectureProps = {
    project: ProjectEntry;
    compact?: boolean;
};

export default function ProjectArchitecture({ project, compact = false }: ProjectArchitectureProps) {
    const layers = getProjectSystemLayers(project);
    const highlights = (project.architectureHighlights ?? []).slice(0, compact ? 2 : 4);

    if (layers.length === 0 && highlights.length === 0) return null;

    return (
        <div
            className={cn(
                'relative overflow-hidden border border-white/10 bg-gradient-to-br from-cyan/[0.045] via-purple/[0.045] to-orange/[0.035]',
                compact ? 'rounded-2xl p-3' : 'rounded-[1.5rem] p-5 md:p-6'
            )}
        >
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-purple/50" />

            <div className="flex items-center justify-between gap-3">
                <p className={cn('flex items-center gap-2 font-black uppercase text-white/55', compact ? 'text-[10px] tracking-[0.18em]' : 'text-xs tracking-[0.22em]')}>
                    <Network className={cn('text-cyan', compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} aria-hidden="true" />
                    Architecture flow
                </p>
                <span className="font-mono text-[10px] font-bold text-white/35">{layers.length} layers</span>
            </div>

            {layers.length > 0 ? (
                <div className={cn('mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center', compact ? 'sm:gap-1.5' : 'sm:gap-2')} aria-label={`${project.title} architecture flow`}>
                    {layers.map((layer, index) => (
                        <div key={layer.label} className="contents">
                            <div className={cn('flex min-w-0 flex-1 items-center gap-2 rounded-xl border font-black', layer.tone, compact ? 'px-2.5 py-2 text-[10px]' : 'px-3 py-3 text-xs')}>
                                <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', layer.dot)} aria-hidden="true" />
                                <span className="truncate">{compact ? layer.shortLabel : layer.label}</span>
                            </div>

                            {index < layers.length - 1 ? (
                                <>
                                    <ArrowDown className="mx-auto h-3.5 w-3.5 shrink-0 text-white/25 sm:hidden" aria-hidden="true" />
                                    <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-white/25 sm:block" aria-hidden="true" />
                                </>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : null}

            {!compact && highlights.length > 0 ? (
                <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-2">
                    {highlights.map((highlight) => (
                        <div key={highlight} className="flex gap-3 text-sm leading-relaxed text-muted">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-cyan to-purple" aria-hidden="true" />
                            <span>{highlight}</span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
