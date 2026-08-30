import { ExternalLink, Trophy } from 'lucide-react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';
import { cn } from '@/lib/utils';

import { achievementsData } from '@/config/portfolio';

export default function Achievements() {
    const featuredAchievements = achievementsData.filter((item) => item.featured).slice(0, 4);
    const visibleAchievements = featuredAchievements.length > 0 ? featuredAchievements : achievementsData.slice(0, 4);

    return (
        <section id="achievements" className="relative z-10 w-full overflow-hidden px-6 py-20 md:px-12 md:py-24">
            <div className="pointer-events-none absolute left-0 top-24 -z-10 h-72 w-72 rounded-full bg-orange/12 blur-[120px]" />
            <div className="pointer-events-none absolute right-0 bottom-20 -z-10 h-64 w-64 rounded-full bg-pink/8 blur-[110px]" />
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange/20 bg-orange/10">
                            <Trophy className="h-5 w-5 text-orange" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-orange">Awards & Recognition</p>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">Credible signals, kept concise.</h2>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
                        Hackathon and recognition highlights that support the engineering story without overstating the work.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visibleAchievements.map((item) => (
                        <SkeuomorphicCard key={item.id} className="relative flex h-full flex-col overflow-hidden p-5">
                            <div className={cn("pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full blur-[56px] opacity-25", item.bg.replace('/10', '/100'))} />
                            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-orange/45 to-pink/35" />
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10", item.bg, item.color)}>
                                    <item.icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div className="flex flex-wrap justify-end gap-2">
                                    {item.type ? (
                                        <span className={cn("rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em]", item.bg, item.color)}>
                                            {item.type}
                                        </span>
                                    ) : null}
                                    {item.date || item.year ? (
                                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-muted">
                                            {item.date || item.year}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <p className={cn("mb-2 text-sm font-black uppercase tracking-[0.18em]", item.color)}>
                                {item.title}
                            </p>
                            <h3 className="text-2xl font-black leading-tight text-white">{item.event}</h3>

                            <p className="mt-4 text-sm leading-relaxed text-muted">{item.context}</p>

                            {item.outcome ? (
                                <div className="mt-5 rounded-2xl border border-cyan/15 bg-gradient-to-r from-cyan/[0.045] to-purple/[0.035] p-4">
                                    <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-cyan">Outcome</p>
                                    <p className="text-sm font-semibold leading-relaxed text-white/85">{item.outcome}</p>
                                </div>
                            ) : null}

                            {item.proofUrl ? (
                                <a
                                    href={item.proofUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-black text-cyan transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                                    aria-label={`Open proof for ${item.event}`}
                                >
                                    View proof
                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                </a>
                            ) : null}
                        </SkeuomorphicCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
