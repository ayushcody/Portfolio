import { BrainCircuit, Code2, FileText, Rocket, Send } from 'lucide-react';
import { profile, projectsData } from '@/config/portfolio';
import { cn } from '@/lib/utils';

const signals = [
    {
        label: 'AI Systems',
        caption: 'Agentic workflows, RAG, and voice AI',
        icon: BrainCircuit,
        tone: 'text-cyan bg-cyan/10 border-cyan/25',
        glow: 'from-cyan/18',
    },
    {
        label: 'Full-Stack Builder',
        caption: 'Frontend, backend, APIs, and deployment',
        icon: Code2,
        tone: 'text-purple bg-purple/10 border-purple/25',
        glow: 'from-purple/18',
    },
    {
        label: `${projectsData.length}+ documented builds`,
        caption: 'Case studies with architecture and tradeoffs',
        icon: FileText,
        tone: 'text-orange bg-orange/10 border-orange/25',
        glow: 'from-orange/18',
    },
    {
        label: 'Applied AI Focus',
        caption: 'Practical systems over toy demos',
        icon: Rocket,
        tone: 'text-pink bg-pink/10 border-pink/25',
        glow: 'from-pink/18',
    },
    {
        label: 'Open to Roles',
        caption: profile.preferredRoles.slice(0, 2).join(' · '),
        icon: Send,
        tone: 'text-lime bg-lime/10 border-lime/25',
        glow: 'from-lime/18',
    },
];

export function CredibilityStrip() {
    return (
        <section aria-label="Credibility signals" className="relative z-10 px-6 pb-14 md:px-12">
            <div className="mx-auto grid max-w-7xl gap-3 rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-cyan/5 via-surface/65 to-orange/5 p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-5">
                {signals.map((signal) => {
                    const Icon = signal.icon;
                    return (
                        <article key={signal.label} className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.035] p-4">
                            <div className={cn("absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent opacity-80", signal.glow)} />
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                            <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl border", signal.tone)}>
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <h2 className="text-base font-black leading-tight text-white">{signal.label}</h2>
                            <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">{signal.caption}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
