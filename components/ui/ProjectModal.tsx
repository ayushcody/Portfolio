'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Github } from 'lucide-react';
import { SkeuomorphicCard } from './SkeuomorphicCard';
import { useEffect } from 'react';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && project && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-4xl max-h-[90vh] pointer-events-auto"
                        >
                            <SkeuomorphicCard hover={false} className="h-full flex flex-col p-0 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                {/* Header Area */}
                                <div className="relative h-48 md:h-64 bg-surface-hover flex items-center justify-center border-b border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple/20 to-cyan/20 opacity-40 mix-blend-overlay" />
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                                    <project.icon className="w-20 h-20 text-white/50 relative z-10 drop-shadow-2xl" />

                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors z-20"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-16rem)] custom-scrollbar">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                        <div>
                                            <h3 className="text-3xl font-bold text-white mb-3">{project.title}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech.map((t: string) => (
                                                    <span key={t} className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-white/5 border border-white/10 text-muted">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            {project.github && (
                                                <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-sm font-bold text-white">
                                                    <Github className="w-4 h-4" /> Code
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-orange mb-2">The Problem</h4>
                                                <p className="text-muted leading-relaxed">{project.problem}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-cyan mb-2">Architecture</h4>
                                                <p className="text-muted leading-relaxed">{project.architecture}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-purple mb-3">System Highlights</h4>
                                            <ul className="space-y-3">
                                                {project.highlights.map((h: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3 text-muted">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple flex-shrink-0" />
                                                        <span className="leading-relaxed">{h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </SkeuomorphicCard>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
