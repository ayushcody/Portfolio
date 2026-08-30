'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

const roles = [
    'AI Engineer',
    'GenAI Engineer',
    'ML Engineer',
    'Data Scientist',
    'Full-Stack Developer',
    'Cloud Engineer',
];

const proofCards = [
    {
        title: 'I can own AI product systems',
        body: 'RAG pipelines, agentic workflows, LLM evaluation, prompt iteration, and full-stack interfaces that make AI usable.',
        icon: Sparkles,
        accent: 'text-cyan bg-cyan/10 border-cyan/20',
    },
    {
        title: 'I can ship across the stack',
        body: 'React, Next.js, Node/FastAPI, Firebase, PostgreSQL, auth, deployment, and production-style fallbacks.',
        icon: Layers3,
        accent: 'text-purple bg-purple/10 border-purple/20',
    },
    {
        title: 'I care about reliability',
        body: 'Security-aware development, API validation, eval loops, citation grounding, and measurable project outcomes.',
        icon: ShieldCheck,
        accent: 'text-orange bg-orange/10 border-orange/20',
    },
];

const evidence = [
    '11 documented projects with case-study style breakdowns',
    'Hackathon-winning cybersecurity build',
    'Real APIs and integrations: Gmail OAuth, Judge0, Firebase, Pinecone, Groq',
    'Breadth across AI, data science, full-stack, cloud, and security',
];

export function HiringPitch() {
    return (
        <section id="about" className="relative z-10 scroll-mt-28 px-6 py-16 md:px-12">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_22px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                    <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="relative border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-purple/5 to-orange/10" />
                            <div className="relative z-10">
                                <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-cyan">
                                    About
                                </p>
                                <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                                    I build useful AI and full-stack systems from idea to deployed product.
                                </h2>
                                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                                    I am strongest where AI, product engineering, and pragmatic execution meet. Give me a problem, and I can reason through the data, model, backend, frontend, deployment, and reliability constraints.
                                </p>

                                <div className="mt-7 flex flex-wrap gap-2">
                                    {roles.map((role) => (
                                        <span key={role} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-white/80">
                                            {role}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href="/#projects"
                                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-background transition hover:scale-[1.02]"
                                >
                                    Review proof of work
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid gap-4 md:grid-cols-3">
                                {proofCards.map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <div key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${card.accent}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-base font-black text-white">{card.title}</h3>
                                            <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                                <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-orange">
                                    Evidence signals
                                </p>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {evidence.map((item) => (
                                        <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
