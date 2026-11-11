import Image from 'next/image';
import type { ProjectWithMedia } from '@/src/data/projectSchema';
import { ProjectDiagram, projectTone } from '@/components/projects/ProjectDiagram';
import '@/components/projects.css';

type MediaProject = Pick<ProjectWithMedia, 'slug' | 'title' | 'category' | 'stack' | 'media'>;

/**
 * Case study hero: the project's cover screenshot (16:10) when it has one, otherwise a flat
 * colored illustration in the homepage project-visual vocabulary.
 */
export function ProjectHeroMedia({ project }: { project: MediaProject }) {
    const cover = project.media.cover;

    if (cover) {
        return (
            <figure className="case-media">
                <div className="media-frame">
                    <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        preload
                        loading="eager"
                        fetchPriority="high"
                        sizes="(min-width: 900px) 470px, (min-width: 600px) 560px, calc(100vw - 40px)"
                    />
                </div>
            </figure>
        );
    }

    return (
        <figure className="case-media">
            <div
                className={`project-visual project-visual-${projectTone(project)} case-cover`}
                role="img"
                aria-label={`${project.title} illustration`}
            >
                <div className="visual-caption">
                    <span>{project.title}</span>
                    <span>{project.category}</span>
                </div>
                <ProjectDiagram project={project} />
            </div>
        </figure>
    );
}
