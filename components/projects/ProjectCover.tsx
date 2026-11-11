import Image from 'next/image';
import type { ProjectWithMedia } from '@/src/data/projectSchema';
import { getProjectCoverImage } from '@/lib/projects';
import { cn } from '@/lib/utils';
import { FlowCover } from '@/components/projects/FlowDiagram';

type CoverProject = Pick<ProjectWithMedia, 'slug' | 'title' | 'category' | 'architecture' | 'media'>;

type ProjectCoverProps = {
    project: CoverProject;
    /** `sizes` for the responsive image; must match the rendered width of the 16:10 frame. */
    sizes: string;
    /** `eager`: first row, fetched early at high priority. `priority`: also preloaded (the page's largest image). */
    loading?: 'lazy' | 'eager' | 'priority';
    className?: string;
};

/**
 * A project's 16:10 cover. In order of preference: the real cover (1600×1000), the first screenshot
 * cropped from the top, or the architecture flow drawn as a diagram. New covers swap in with no code change.
 */
export function ProjectCover({ project, sizes, loading = 'lazy', className }: ProjectCoverProps) {
    const image = getProjectCoverImage(project);

    if (!image) return <FlowCover project={project} className={cn('project-cover', className)} />;

    return (
        <div className={cn('project-cover project-cover--image', image.isPlaceholder && 'project-cover--shot', className)}>
            <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={sizes}
                {...(loading === 'priority'
                    ? { preload: true, loading: 'eager' as const, fetchPriority: 'high' as const }
                    : loading === 'eager'
                      ? { loading: 'eager' as const, fetchPriority: 'high' as const }
                      : { loading })}
            />
        </div>
    );
}
