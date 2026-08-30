'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Link2, Target } from 'lucide-react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';
import { cn } from '@/lib/utils';
import { projectsData, skillsData } from '@/config/portfolio';
import TechIconWall from './TechIconWall';

type SkillsProps = {
    variant?: 'preview' | 'full';
    showStackWall?: boolean;
};

function SkillCard({
    skill,
    compact = false,
    selected,
    onSelect,
}: {
    skill: (typeof skillsData)[number];
    compact?: boolean;
    selected: boolean;
    onSelect: () => void;
}) {
    const Icon = skill.icon;
    const tools = skill.skills ?? skill.technologies ?? [];
    const useCases = skill.useCases ?? [];

    return (
        <SkeuomorphicCard
            className={cn(
                'group relative flex h-full flex-col overflow-hidden p-5 transition duration-200',
                selected ? 'border-cyan/30 bg-cyan/[0.035] shadow-[0_0_36px_rgba(0,229,255,0.08)]' : 'hover:border-white/20'
            )}
        >
            <div className={cn("pointer-events-none absolute -right-20 -top-20 h-36 w-36 rounded-full blur-[52px] opacity-25 transition-opacity duration-300 group-hover:opacity-35", skill.bg.replace('/10', '/100'))} />
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="relative z-10 mb-4 flex items-center gap-4">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10", skill.bg, skill.color)}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-black text-white">{skill.name ?? skill.category}</h3>
            </div>

            <p className="relative z-10 text-sm leading-relaxed text-muted">
                {skill.summary ?? skill.description}
            </p>

            <button
                type="button"
                onClick={onSelect}
                aria-pressed={selected}
                aria-label={`${selected ? 'Showing' : 'Show'} ${skill.name} project proof`}
                className={cn(
                    'relative z-10 mt-5 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan',
                    selected
                        ? 'border-cyan/30 bg-cyan/10 text-cyan'
                        : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-purple/30 hover:text-white'
                )}
            >
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                {selected ? 'Showing project proof' : 'Show project proof'}
            </button>

            {!compact && useCases.length > 0 ? (
                <div className="relative z-10 mt-5">
                    <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan">Use cases</p>
                    <ul className="space-y-2">
                        {useCases.slice(0, 4).map((useCase) => (
                            <li key={useCase} className="flex gap-2 text-sm leading-relaxed text-muted">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                                {useCase}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {tools.length > 0 ? (
                <div className="relative z-10 mt-auto flex flex-wrap gap-2 border-t border-white/10 pt-5">
                    {tools.slice(0, compact ? 6 : 8).map((tool) => (
                        <span key={tool} className={cn("rounded-full border px-2.5 py-1 text-[11px] font-bold", skill.bg, skill.color, "border-white/10")}>
                            {tool}
                        </span>
                    ))}
                </div>
            ) : null}
        </SkeuomorphicCard>
    );
}

export default function Skills({ variant = 'preview', showStackWall = false }: SkillsProps) {
    const isFull = variant === 'full';
    const visibleSkills = isFull ? skillsData : skillsData.filter((skill) => skill.featured).slice(0, 6);
    const [selectedSkillName, setSelectedSkillName] = useState(visibleSkills[0]?.name ?? '');
    const selectedSkill = visibleSkills.find((skill) => skill.name === selectedSkillName) ?? visibleSkills[0];

    const relatedProjects = useMemo(() => {
        if (!selectedSkill) return [];

        const skillTerms = [
            selectedSkill.name,
            ...(selectedSkill.skills ?? []),
            ...(selectedSkill.useCases ?? []),
        ]
            .map((term) => term.toLowerCase())
            .filter((term) => term.length > 2);

        return projectsData
            .filter((project) => project.archived !== true)
            .map((project) => {
                const haystack = [
                    project.title,
                    project.category,
                    project.summary,
                    project.description,
                    ...(project.techStack ?? []),
                    ...(project.tech ?? []),
                    ...(project.tags ?? []),
                    ...(project.architectureHighlights ?? []),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                const score = skillTerms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
                const categoryBoost =
                    selectedSkill.name === 'Voice AI' && project.category === 'Voice AI'
                        ? 3
                        : selectedSkill.name === 'AI/LLM Systems' && ['Agentic AI', 'RAG Systems', 'AI Infrastructure'].includes(project.category)
                            ? 2
                            : 0;

                return { project, score: score + categoryBoost };
            })
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score || (a.project.priority ?? 99) - (b.project.priority ?? 99))
            .slice(0, 3)
            .map(({ project }) => project);
    }, [selectedSkill]);

    return (
        <section id="skills" className="relative z-10 w-full scroll-mt-28 overflow-hidden bg-gradient-to-b from-background via-purple/[0.025] to-background px-6 py-20 md:px-12 md:py-24">
            <div className="pointer-events-none absolute left-8 top-32 -z-10 h-48 w-48 rounded-full bg-purple/12 blur-[80px]" />
            <div className="pointer-events-none absolute right-8 bottom-32 -z-10 h-56 w-56 rounded-full bg-cyan/8 blur-[90px]" />
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/10">
                            <Target className="h-5 w-5 text-cyan" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-cyan">
                            {isFull ? 'Engineering skill map' : 'Technical Skill Map'}
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                                {isFull ? 'Grouped by how I build' : 'Technical Skill Map'}
                            </h2>
                            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
                                A practical stack for building AI products: LLM workflows, APIs, frontend systems, vector search, voice AI, and deployment.
                            </p>
                        </div>
                        {!isFull ? (
                            <Link
                                href="/skills"
                                className="inline-flex w-fit items-center gap-2 rounded-full border border-purple/20 bg-gradient-to-r from-purple to-cyan px-5 py-3 text-sm font-black text-white transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                            >
                                Explore full skill map
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visibleSkills.map((skill) => (
                        <SkillCard
                            key={skill.name ?? skill.category}
                            skill={skill}
                            compact={!isFull}
                            selected={selectedSkill?.name === skill.name}
                            onSelect={() => setSelectedSkillName(skill.name)}
                        />
                    ))}
                </div>

                {selectedSkill ? (
                    <div className="mt-8 border-y border-white/10 bg-gradient-to-r from-cyan/[0.045] via-purple/[0.045] to-orange/[0.035] py-6">
                        <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan">Applied in real builds</p>
                                <h3 className="mt-2 text-2xl font-black text-white">{selectedSkill.name}</h3>
                            </div>
                            <p className="max-w-xl text-sm leading-relaxed text-muted">
                                Projects matched from documented technologies, tags, categories, and architecture highlights.
                            </p>
                        </div>

                        {relatedProjects.length > 0 ? (
                            <div className="mt-5 grid gap-3 md:grid-cols-3">
                                {relatedProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="group flex min-w-0 items-center justify-between gap-4 border-l-2 border-purple/35 bg-white/[0.035] p-4 transition hover:border-cyan hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-black text-white">{project.title}</span>
                                            <span className="mt-1 block text-xs font-bold text-muted">{project.category}</span>
                                        </span>
                                        <ArrowRight className="h-4 w-4 shrink-0 text-cyan transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-5 text-sm font-semibold text-muted">No documented project match yet.</p>
                        )}
                    </div>
                ) : null}

                {isFull && showStackWall ? (
                    <div className="mt-12">
                        <TechIconWall />
                    </div>
                ) : null}
            </div>
        </section>
    );
}
