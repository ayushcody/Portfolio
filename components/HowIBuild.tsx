import {
    Boxes,
    CheckCircle2,
    GitBranch,
    Rocket,
    ScanSearch,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
    {
        label: 'Frame the behavior',
        description: 'Define the user outcome, constraints, failure cases, and what a useful answer looks like.',
        icon: ScanSearch,
        tone: 'text-cyan border-cyan/30 bg-cyan/10',
        line: 'from-cyan to-purple',
    },
    {
        label: 'Design the system',
        description: 'Map data flow, service boundaries, model responsibilities, and fallback paths before implementation.',
        icon: GitBranch,
        tone: 'text-purple border-purple/30 bg-purple/10',
        line: 'from-purple to-pink',
    },
    {
        label: 'Build the core',
        description: 'Connect the interface, APIs, retrieval, tools, storage, and model layer into one working path.',
        icon: Boxes,
        tone: 'text-pink border-pink/30 bg-pink/10',
        line: 'from-pink to-orange',
    },
    {
        label: 'Evaluate the edges',
        description: 'Test structured outputs, weak inputs, regressions, latency, and the cases where AI behavior drifts.',
        icon: CheckCircle2,
        tone: 'text-orange border-orange/30 bg-orange/10',
        line: 'from-orange to-lime',
    },
    {
        label: 'Ship and learn',
        description: 'Deploy the smallest credible version, observe real behavior, and turn findings into the next iteration.',
        icon: Rocket,
        tone: 'text-lime border-lime/30 bg-lime/10',
        line: '',
    },
];

export default function HowIBuild() {
    return (
        <section aria-labelledby="how-i-build-heading" className="relative z-10 w-full overflow-hidden px-6 py-20 md:px-12 md:py-24">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/10 blur-[120px]" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-12 max-w-3xl">
                    <p className="text-sm font-black uppercase tracking-widest text-pink">How I build</p>
                    <h2 id="how-i-build-heading" className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                        From ambiguous idea to evaluated system.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
                        My process keeps product behavior, system design, and AI reliability in the same engineering loop.
                    </p>
                </div>

                <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
                    <div className="absolute bottom-7 left-6 top-7 w-px bg-white/10 md:bottom-auto md:left-[10%] md:right-[10%] md:top-6 md:h-px md:w-auto" aria-hidden="true" />

                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <li key={step.label} className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-4 md:block">
                                {step.line ? (
                                    <div
                                        className={cn(
                                            'pointer-events-none absolute left-6 top-12 h-[calc(100%+2rem)] w-px bg-gradient-to-b md:left-1/2 md:top-6 md:h-px md:w-[calc(100%+1rem)]',
                                            step.line
                                        )}
                                        aria-hidden="true"
                                    />
                                ) : null}

                                <div className={cn('relative z-10 flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_0_0_7px_rgba(13,13,15,0.9)] md:mx-auto', step.tone)}>
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </div>

                                <div className="min-w-0 pt-1 md:mt-6 md:pt-0 md:text-center">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">0{index + 1}</p>
                                    <h3 className="mt-2 text-lg font-black leading-tight text-white">{step.label}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
