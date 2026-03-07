'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';

const experiences = [
    {
        id: "persistent",
        company: "Persistent Systems",
        role: "GenAI Intern",
        period: "2024 — Present",
        details: "Built RAG pipelines and integrated LLM workflows for enterprise scale applications. Enhanced inference speeds and reduced latency.",
    },
    {
        id: "syniris",
        company: "Syniris Technologies",
        role: "Web Development Intern",
        period: "2023 — 2024",
        details: "Developed full-stack web applications using React and Node.js. Improved core application performance by 40%.",
    },
    {
        id: "nexus",
        company: "Nexus",
        role: "Web Dev Intern (Project Lead)",
        period: "2022 — 2023",
        details: "Led a team of developers to build and deploy complex full-stack solutions. Established CI/CD pipelines and coding standards.",
    },
    {
        id: "acs",
        company: "Association for Cyber Security",
        role: "DevSec Intern",
        period: "2022",
        details: "Conducted security audits and implemented secure coding practices across internal tools.",
    }
];

export default function Experience() {
    const [expandedId, setExpandedId] = useState<string | null>(experiences[0].id);

    return (
        <section id="experience" className="py-24 px-6 md:px-12 relative z-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="text-cyan w-6 h-6" />
                        <h2 className="text-sm font-bold tracking-widest text-cyan uppercase">Career Timeline</h2>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Experience</h3>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[350px]">
                    {experiences.map((exp, index) => {
                        const isExpanded = expandedId === exp.id;
                        return (
                            <motion.div
                                key={exp.id}
                                layout
                                onClick={() => setExpandedId(exp.id)}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={cn(
                                    "relative cursor-pointer group flex-shrink-0",
                                    isExpanded ? "lg:flex-[2.5] flex-auto" : "lg:flex-1 flex-auto"
                                )}
                            >
                                <SkeuomorphicCard
                                    className="h-full flex flex-col justify-start overflow-hidden"
                                    hover={!isExpanded}
                                >
                                    {/* Timeline line visual effect */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <motion.div layout className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <motion.span layout className="text-xs font-bold font-mono text-cyan bg-cyan/10 px-3 py-1 rounded-full border border-cyan/20">
                                                {exp.period}
                                            </motion.span>
                                            {!isExpanded && (
                                                <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                                                    <ChevronRight className="w-4 h-4 text-muted" />
                                                </div>
                                            )}
                                        </div>

                                        <motion.h4 layout className="text-xl md:text-2xl font-bold mb-2 text-white">
                                            {exp.company}
                                        </motion.h4>
                                        <motion.p layout className="text-purple font-medium text-sm md:text-base">
                                            {exp.role}
                                        </motion.p>
                                    </motion.div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-6 text-muted text-sm md:text-base leading-relaxed border-t border-white/10 pt-4"
                                            >
                                                {exp.details}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </SkeuomorphicCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
