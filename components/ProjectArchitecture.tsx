import { Bot, Database, PanelsTopLeft, Rocket, Server, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getProjectSystemLayers, type ArchitectureSource, type ProjectLayer } from '@/lib/projectArchitecture';
import { cn } from '@/lib/utils';
import '@/components/projects.css';

const layerIcons: Record<ProjectLayer['key'], LucideIcon> = {
    interface: PanelsTopLeft,
    trust: ShieldCheck,
    services: Server,
    data: Database,
    models: Bot,
    delivery: Rocket,
};

type ProjectArchitectureProps = {
    project: ArchitectureSource;
    /**
     * Highlights to list under the flow. Defaults to `project.architectureHighlights`;
     * pass a filtered list when the page already printed some of them elsewhere.
     */
    highlights?: string[];
    className?: string;
};

/** Paper-system map of the layers a project touches, with its architecture highlights. */
export default function ProjectArchitecture({ project, highlights, className }: ProjectArchitectureProps) {
    const layers = getProjectSystemLayers(project);
    const notes = (highlights ?? project.architectureHighlights ?? []).filter(Boolean).slice(0, 6);

    if (layers.length === 0 && notes.length === 0) return null;

    return (
        <figure className={cn('arch-map', className)}>
            <figcaption className="arch-map-caption">
                <span>System map</span>
                {layers.length > 0 ? (
                    <span className="arch-map-count">
                        {layers.length} {layers.length === 1 ? 'layer' : 'layers'}
                    </span>
                ) : null}
            </figcaption>

            {layers.length > 0 ? (
                <ol className="arch-flow" aria-label={`${project.title} system layers, in order`}>
                    {layers.map((layer, index) => {
                        const Icon = layerIcons[layer.key];
                        return (
                            <li key={layer.key} className={cn('arch-layer', `arch-layer--${layer.tone}`)}>
                                <span className="arch-layer-step" aria-hidden="true">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <Icon className="arch-layer-icon" size={18} strokeWidth={2} aria-hidden="true" />
                                <span className="arch-layer-label">{layer.label}</span>
                            </li>
                        );
                    })}
                </ol>
            ) : null}

            {notes.length > 0 ? (
                <ul className="arch-notes" aria-label="Architecture highlights">
                    {notes.map((note) => (
                        <li key={note}>{note}</li>
                    ))}
                </ul>
            ) : null}
        </figure>
    );
}
