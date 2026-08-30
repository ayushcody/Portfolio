'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowRight,
    Code2,
    ExternalLink,
    Github,
    Layers3,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';
import ProjectArchitecture from './ProjectArchitecture';
import { cn } from '@/lib/utils';

import { projectsData, type ProjectEntry } from '@/config/portfolio';

const filters = [
    { label: 'All', match: 'all' },
    { label: 'Agentic AI', match: 'agentic' },
    { label: 'RAG', match: 'rag' },
    { label: 'Full Stack', match: 'full' },
    { label: 'Tools', match: 'tool' },
    { label: 'Labs', match: 'lab' },
];

type SelectedProjectsProps = {
    mode?: 'preview' | 'full';
};

function getYearValue(project: ProjectEntry) {
    const year = Number(project.year);
    return Number.isFinite(year) ? year : 0;
}

function sortProjects(projects: ProjectEntry[]) {
    return [...projects].sort((a, b) => {
        const priorityA = a.priority ?? Number.MAX_SAFE_INTEGER;
        const priorityB = b.priority ?? Number.MAX_SAFE_INTEGER;

        if (priorityA !== priorityB) return priorityA - priorityB;
        return getYearValue(b) - getYearValue(a);
    });
}

function getSummary(project: ProjectEntry) {
    return project.oneLine || project.summary || project.description;
}

function getTechStack(project: ProjectEntry) {
    return project.techStack ?? project.stack ?? project.tech ?? [];
}

function getGithub(project: ProjectEntry) {
    return project.links?.github || project.github;
}

function getLive(project: ProjectEntry) {
    return project.links?.live || project.live;
}

function getDemo(project: ProjectEntry) {
    return project.links?.demo;
}

function getInitials(title: string) {
    return title
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join('')
        .slice(0, 3)
        .toUpperCase();
}

function matchesFilter(project: ProjectEntry, activeFilter: string) {
    if (activeFilter === 'all') return true;

    const haystack = [
        project.title,
        project.category,
        project.summary,
        project.description,
        ...(project.tags ?? []),
        ...getTechStack(project),
    ]
        .join(' ')
        .toLowerCase();

    if (activeFilter === 'agentic') return haystack.includes('agent') || haystack.includes('llm');
    if (activeFilter === 'rag') return haystack.includes('rag') || haystack.includes('retrieval') || haystack.includes('vector');
    if (activeFilter === 'full') return haystack.includes('full') || haystack.includes('react') || haystack.includes('next');
    if (activeFilter === 'tool') return haystack.includes('tool') || haystack.includes('cli') || haystack.includes('developer');
    if (activeFilter === 'lab') return haystack.includes('lab') || haystack.includes('forecast') || haystack.includes('yolo');

    return true;
}

function ProjectPlaceholder({ project }: { project: ProjectEntry }) {
    return (
        <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface-hover p-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(0,229,255,0.18),transparent_32%),radial-gradient(circle_at_78%_70%,rgba(110,91,255,0.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(255,122,24,0.14),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(255,255,255,0.13)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.13)_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative z-10 flex min-h-32 flex-col justify-between">
                <div className="flex items-center justify-between gap-3">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em]", project.bg, project.color)}>
                        {project.category}
                    </span>
                    <Layers3 className={cn("h-5 w-5", project.color)} aria-hidden="true" />
                </div>
                <div>
                    <p className="text-4xl font-black tracking-tight text-white/90">{getInitials(project.title)}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                        Case study
                    </p>
                </div>
            </div>
        </div>
    );
}

function ProjectCard({ project, index }: { project: ProjectEntry; index: number }) {
    const prefersReducedMotion = useReducedMotion();
    const Icon = project.icon ?? Code2;
    const summary = getSummary(project);
    const techStack = getTechStack(project).slice(0, 5);
    const impact = (project.impact ?? []).slice(0, 3);
    const github = getGithub(project);
    const live = getLive(project);
    const demo = getDemo(project);

    const card = (
        <SkeuomorphicCard className="group relative flex h-full flex-col overflow-hidden p-4 transition duration-200 hover:-translate-y-1 hover:border-cyan/25 md:p-5">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan/55 to-purple/45 opacity-0 transition group-hover:opacity-100" />
            <ProjectPlaceholder project={project} />

            <div className="mt-5 flex flex-1 flex-col">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em]", project.bg, project.color)}>
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {project.category}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/70">
                        {project.status}
                    </span>
                    {project.year ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-muted">
                            {project.year}
                        </span>
                    ) : null}
                </div>

                <h3 className="text-2xl font-black leading-tight text-white">
                    {project.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                    {summary}
                </p>

                <div className="mt-5">
                    <ProjectArchitecture project={project} compact />
                </div>

                <div className="mt-5 grid gap-3">
                    {project.problem ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                            <p className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-cyan">Problem</p>
                            <p className="text-sm leading-relaxed text-muted">{project.problem}</p>
                        </div>
                    ) : null}

                    {project.solution ? (
                        <div className="rounded-2xl border border-purple/15 bg-purple/[0.045] p-3">
                            <p className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-purple">Built</p>
                            <p className="text-sm leading-relaxed text-muted">{project.solution}</p>
                        </div>
                    ) : null}
                </div>

                {impact.length > 0 ? (
                    <div className="mt-5">
                        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-orange">Why it matters</p>
                        <ul className="space-y-2">
                            {impact.map((item) => (
                                <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" aria-hidden="true" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {techStack.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                            <span key={tech} className="rounded-full border border-white/10 bg-surface px-2.5 py-1 text-[11px] font-bold text-muted">
                                {tech}
                            </span>
                        ))}
                    </div>
                ) : null}

                <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
                    <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-purple px-4 py-2.5 text-sm font-black text-white transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                        aria-label={`Read ${project.title} case study`}
                    >
                        Read Case Study
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    {github ? (
                        <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:border-purple/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                            aria-label={`View ${project.title} source code on GitHub`}
                        >
                            <Github className="h-4 w-4" aria-hidden="true" />
                            GitHub
                        </a>
                    ) : null}

                    {live ? (
                        <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:border-cyan/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                            aria-label={`Open ${project.title} live demo`}
                        >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            Live Demo
                        </a>
                    ) : null}

                    {demo ? (
                        <a
                            href={demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:border-cyan/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                            aria-label={`Open ${project.title} demo`}
                        >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            Demo
                        </a>
                    ) : null}
                </div>
            </div>
        </SkeuomorphicCard>
    );

    if (prefersReducedMotion) {
        return <div className="h-full">{card}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
            className="h-full"
        >
            {card}
        </motion.div>
    );
}

export default function SelectedProjects({ mode = 'preview' }: SelectedProjectsProps) {
    const [activeFilter, setActiveFilter] = useState('all');
    const isPreview = mode === 'preview';

    const visibleProjects = useMemo(() => {
        const baseProjects = isPreview
            ? projectsData.filter((project) => project.featured === true && project.showOnHome === true && project.archived !== true)
            : projectsData.filter((project) => project.archived !== true);

        const filtered = isPreview
            ? baseProjects
            : baseProjects.filter((project) => matchesFilter(project, activeFilter));

        return sortProjects(filtered).slice(0, isPreview ? 6 : filtered.length);
    }, [activeFilter, isPreview]);

    return (
        <section id="projects" className="relative z-10 w-full scroll-mt-28 overflow-hidden px-6 py-20 md:px-12 md:py-24">
            <div className="pointer-events-none absolute left-0 top-24 -z-10 h-72 w-72 rounded-full bg-cyan/12 blur-[110px]" />
            <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-72 w-72 rounded-full bg-purple/12 blur-[120px]" />
            <div className="pointer-events-none absolute left-1/3 bottom-20 -z-10 h-64 w-64 rounded-full bg-orange/8 blur-[110px]" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10">
                            <Code2 className="h-5 w-5 text-cyan" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-cyan">
                            {isPreview ? 'Featured AI Systems' : 'Selected Engineering Work'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl">
                                {isPreview ? 'Featured Engineering Work' : 'Case-study ready project archive'}
                            </h2>
                            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
                                Curated projects across agentic AI, RAG systems, voice AI, developer tooling, and full-stack product engineering.
                            </p>
                        </div>
                        <div className="w-fit rounded-full border border-orange/20 bg-orange/10 px-4 py-2 text-sm font-bold text-orange">
                            {isPreview ? `${visibleProjects.length} featured` : `${visibleProjects.length} visible`}
                        </div>
                    </div>
                </div>

                {!isPreview ? (
                    <div className="mb-8 flex gap-2 overflow-x-auto rounded-[1.4rem] border border-white/10 bg-gradient-to-r from-cyan/5 via-surface/60 to-purple/5 p-2 backdrop-blur-xl">
                        {filters.map((filter) => (
                            <button
                                key={filter.match}
                                onClick={() => setActiveFilter(filter.match)}
                                className={cn(
                                    "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan",
                                    activeFilter === filter.match
                                        ? "bg-gradient-to-r from-cyan to-purple text-white shadow-[0_0_20px_rgba(0,229,255,0.18)]"
                                        : "text-muted hover:bg-white/10 hover:text-white"
                                )}
                                type="button"
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {visibleProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-gradient-to-r from-cyan via-purple to-orange px-6 py-3.5 text-sm font-black text-white shadow-[0_0_30px_rgba(0,229,255,0.14)] transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                    >
                        View all projects
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
