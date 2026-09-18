import Image from 'next/image';
import type { Project } from '@/src/data/projects';
import { isHttpUrl, safeUrl } from '@/lib/urls';
import { ProjectDiagram, projectTone } from '@/components/projects/ProjectDiagram';
import '@/components/projects.css';

type MediaProject = Pick<Project, 'id' | 'title' | 'category' | 'status' | 'techStack'> & Partial<Pick<Project, 'shortTitle' | 'visuals'>>;

// Remote images (Firebase Storage, etc.) are served as-is so they never depend on next.config remotePatterns.
const isRemote = (src: string) => isHttpUrl(src);

/**
 * Case study hero: the project's own image when it has one (16:10), otherwise a flat colored
 * illustration in the homepage project-visual vocabulary.
 */
export function ProjectHeroMedia({ project }: { project: MediaProject }) {
    const src = safeUrl(project.visuals?.thumbnail);

    if (src) {
        return (
            <figure className="case-media">
                <div className="media-frame">
                    <Image
                        src={src}
                        alt={project.visuals?.thumbnailAlt?.trim() || `Preview of ${project.title}`}
                        fill
                        preload
                        loading="eager"
                        fetchPriority="high"
                        sizes="(min-width: 900px) 470px, (min-width: 600px) 560px, calc(100vw - 40px)"
                        unoptimized={isRemote(src)}
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
                    <span>{project.shortTitle || project.title}</span>
                    <span>{project.category}</span>
                </div>
                <ProjectDiagram project={project} />
            </div>
        </figure>
    );
}

/** Screenshot gallery; every frame is 16:10 and lazy-loaded. Renders nothing without valid images. */
export function ProjectGallery({ project }: { project: MediaProject }) {
    const images = (project.visuals?.screenshots ?? []).map((item) => safeUrl(item)).filter((item): item is string => Boolean(item));
    if (images.length === 0) return null;

    return (
        <ul className="case-gallery">
            {images.map((src, index) => (
                <li key={`${src}-${index}`}>
                    <div className="media-frame">
                        <Image
                            src={src}
                            alt={`${project.title} screenshot ${index + 1}`}
                            fill
                            loading="lazy"
                            sizes={images.length === 1 ? '(min-width: 1100px) 780px, calc(100vw - 40px)' : '(min-width: 1100px) 380px, (min-width: 700px) 45vw, calc(100vw - 40px)'}
                            unoptimized={isRemote(src)}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export function hasGallery(project: MediaProject) {
    return (project.visuals?.screenshots ?? []).some((item) => Boolean(safeUrl(item)));
}
