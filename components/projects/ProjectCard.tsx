import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Asterisk } from 'lucide-react';
import type { ProjectWithMedia } from '@/src/data/projectSchema';
import { projectHref } from '@/lib/projects';
import { getProjectLinks } from '@/lib/projectLinks';
import { cn } from '@/lib/utils';
import { TechTags } from '@/components/ui/TechTags';
import { ProjectCover } from '@/components/projects/ProjectCover';
import { statusSlug } from '@/components/projects/tone';
import '@/components/projects.css';

export type CardProject = Pick<
    ProjectWithMedia,
    'slug' | 'title' | 'outcome' | 'category' | 'status' | 'origin' | 'recognition' | 'stack' | 'links' | 'media' | 'architecture'
>;

type ProjectCardProps = {
    project: CardProject;
    /** `sizes` for the cover image at this card's width. */
    sizes: string;
    headingLevel?: 2 | 3;
    /** Cards in the first screen load their cover eagerly. */
    eager?: boolean;
    className?: string;
};

/**
 * The one project card (homepage, /projects, related projects on a case study).
 * The title link stretches over the whole card, so the card is one keyboard stop; the demo, video and
 * code links sit above that layer as their own stops. Nothing is hidden behind hover.
 */
export function ProjectCard({ project, sizes, headingLevel = 3, eager = false, className }: ProjectCardProps) {
    const href = projectHref(project.slug);
    const links = getProjectLinks(project);
    const Heading = headingLevel === 2 ? 'h2' : 'h3';
    const titleId = `pcard-${project.slug}`;

    return (
        <article className={cn('pcard', className)} aria-labelledby={titleId}>
            <div className="pcard-media">
                <ProjectCover project={project} sizes={sizes} loading={eager ? 'eager' : 'lazy'} />
            </div>

            <div className="pcard-body">
                <Heading id={titleId} className="pcard-title">
                    <Link href={href} className="pcard-link">{project.title}</Link>
                </Heading>
                <p className="pcard-outcome">{project.outcome}</p>
                {project.recognition ? (
                    <p className="pcard-recognition"><Asterisk size={15} strokeWidth={2.5} aria-hidden="true" />{project.recognition}</p>
                ) : null}
                <TechTags items={project.stack} max={4} label={`${project.title} stack`} className="pcard-tags" />

                {/* Positioned over the cover's top edge; listed after the title so it is read after it. */}
                <p className="pcard-meta">
                    <span className="pcard-category"><span className="visually-hidden">Category: </span>{project.category}</span>
                    <span className={`pcard-status pcard-status--${statusSlug(project.status)}`}><span className="visually-hidden">Status: </span>{project.status}{project.origin ? <> · {project.origin}</> : null}</span>
                </p>

                <div className="pcard-foot">
                    <span className="pcard-cta" aria-hidden="true">Case study <ArrowRight size={16} strokeWidth={2.25} /></span>
                    {links.length > 0 ? (
                        <ul className="pcard-links" aria-label={`${project.title} links`}>
                            {links.map((link) => (
                                <li key={link.kind}>
                                    <a href={link.href} {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label={link.ariaLabel}>
                                        {/* The "Live" status sticker sits on the cover, so the card can say "Demo" and keep its links on one line. */}
                                        {link.kind === 'demo' ? 'Demo' : link.label}
                                        {link.external ? <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" /> : <ArrowRight size={14} strokeWidth={2.25} aria-hidden="true" />}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
