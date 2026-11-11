import { ArrowRight } from 'lucide-react';
import type { Project } from '@/src/data/projectSchema';
import { cn } from '@/lib/utils';
import { projectTone, toneClass } from '@/components/projects/tone';

type FlowProject = Pick<Project, 'slug' | 'title' | 'category' | 'architecture'>;

const pad = (value: number) => String(value).padStart(2, '0');
const stagesOf = (project: FlowProject) => project.architecture.flow.map((stage) => stage.trim()).filter(Boolean);

/**
 * 16:10 stand-in cover for a project without screenshots: the real stages of its system,
 * pinned to a blueprint board. Exposed to assistive tech as one image with the flow as its label.
 */
export function FlowCover({ project, className }: { project: FlowProject; className?: string }) {
    const stages = stagesOf(project);
    const label = stages.length > 0 ? `${project.title} architecture: ${stages.join(', then ')}.` : `${project.title}`;

    return (
        <div className={cn('flow-cover', toneClass[projectTone(project)], className)} role="img" aria-label={label}>
            <div className="flow-cover-board">
                <p className="flow-cover-head">
                    <span>System flow</span>
                    <span>{pad(stages.length)} stages</span>
                </p>
                <ol className="flow-cover-steps">
                    {stages.map((stage, index) => (
                        <li key={stage}>
                            <span className="flow-cover-chip">
                                <span className="flow-cover-n">{index + 1}</span>
                                {stage}
                            </span>
                            {index < stages.length - 1 ? <ArrowRight className="flow-cover-arrow" strokeWidth={2.5} /> : null}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

/** The architecture flow on a case study: an ordered list drawn as a pipeline (horizontal when there is room). */
export function FlowDiagram({ project, className }: { project: FlowProject; className?: string }) {
    const stages = stagesOf(project);
    if (stages.length === 0) return null;

    return (
        <figure className={cn('flow-map', className)}>
            <figcaption className="flow-map-caption">
                <span>How a request moves through {project.title}</span>
                <span className="flow-map-count">{stages.length} stages</span>
            </figcaption>
            <ol className="flow-map-steps" aria-label={`${project.title} architecture, in order`}>
                {stages.map((stage, index) => (
                    <li key={stage} className={`flow-map-step flow-map-step--${index % 4}`}>
                        <span className="flow-map-n" aria-hidden="true">{pad(index + 1)}</span>
                        <span className="flow-map-label">{stage}</span>
                    </li>
                ))}
            </ol>
        </figure>
    );
}
