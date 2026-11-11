import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/src/data/projectSchema';
import { projectHref } from '@/lib/projects';
import { getProjectLinks } from '@/lib/projectLinks';
import { TechTags } from '@/components/ui/TechTags';
import '@/components/projects.css';

type RowProject = Pick<Project, 'slug' | 'title' | 'category' | 'status' | 'outcome' | 'stack' | 'links' | 'year'>;

/**
 * One editorial row on /projects: number, name + stack, summary + links.
 * External links use the shared order and labels from lib/projectLinks, and only appear when present.
 */
export function ProjectRow({ project, index }: { project: RowProject; index: number }) {
    const href = projectHref(project.slug);
    const links = getProjectLinks(project);
    const summary = project.outcome;

    return (
        <article className="project-row" aria-labelledby={`project-row-${project.slug}`}>
            <span className="project-row-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div className="project-row-name">
                <p className="project-row-meta">
                    <span>{project.category}</span>
                    <span aria-hidden="true">/</span>
                    <span>{project.status}</span>
                    {project.year ? (
                        <>
                            <span aria-hidden="true">/</span>
                            <span>{project.year}</span>
                        </>
                    ) : null}
                </p>
                <h3 id={`project-row-${project.slug}`}>
                    <Link href={href}>{project.title}</Link>
                </h3>
                <TechTags items={project.stack} max={4} label={`${project.title} technologies`} className="project-row-tags" />
            </div>
            <div className="project-row-description">
                {summary ? <p className="project-row-summary">{summary}</p> : null}
                <ul className="project-row-links" aria-label={`${project.title} links`}>
                    <li>
                        <Link href={href} className="text-link text-link--primary" aria-label={`Explore the ${project.title} build`}>
                            Explore the build <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                    </li>
                    {links.map((link) => (
                        <li key={link.kind}>
                            <a href={link.href} {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} aria-label={link.ariaLabel} className="text-link text-link--quiet">
                                {link.label} <ArrowUpRight size={16} aria-hidden="true" />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
}
