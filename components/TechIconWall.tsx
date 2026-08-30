import { Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';
import { skillsData } from '@/config/portfolio';

const techStyles = [
    'text-cyan border-cyan/20 bg-cyan/10',
    'text-purple border-purple/20 bg-purple/10',
    'text-orange border-orange/20 bg-orange/10',
    'text-white border-white/15 bg-white/[0.06]',
];

const techInitials: Record<string, string> = {
    FAISS: 'AI',
    'Azure OpenAI': 'Az',
    'GitHub Actions': 'GA',
    'Firebase Auth': 'Fb',
    'Tailwind CSS': 'Tw',
    'Scikit-learn': 'Sk',
    'Hugging Face': 'HF',
    'Next.js': 'Nx',
    'Node.js': 'Nd',
    TypeScript: 'TS',
    PostgreSQL: 'Pg',
    'Voice agents': 'VA',
    'Conversation design': 'CD',
    'Prompt routing': 'PR',
    'Validation flows': 'VF',
};

function getInitials(tech: string) {
    if (techInitials[tech]) return techInitials[tech];
    const words = tech.replace('.', ' ').split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2);
    return words.map((word) => word[0]).join('').slice(0, 3);
}

export default function TechIconWall() {
    const technologies = Array.from(new Set(skillsData.flatMap((skill) => skill.skills ?? skill.technologies)));

    return (
        <section className="rounded-[1.5rem] border border-white/10 bg-surface/55 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.07),0_16px_42px_rgba(0,0,0,0.2)] md:p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-orange/20 bg-orange/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange">
                        <Boxes className="h-4 w-4" aria-hidden="true" />
                        Technology constellation
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">Tools behind the systems</h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-muted">
                    Static, lightweight, and grouped from the skill model. No external logo fetches or continuous animation.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {technologies.map((tech, index) => (
                    <div
                        key={tech}
                        className={cn(
                            "flex min-h-24 flex-col items-center justify-center rounded-2xl border p-3 text-center transition hover:border-white/25",
                            techStyles[index % techStyles.length]
                        )}
                    >
                        <span className="text-2xl font-black uppercase tracking-normal">{getInitials(tech)}</span>
                        <span className="mt-2 max-w-full text-xs font-bold leading-tight text-white/75">
                            {tech}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
