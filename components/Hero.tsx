'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Download, TerminalSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 max-w-7xl mx-auto overflow-hidden" id="home">
            <div className="relative z-10 space-y-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tighter leading-[1.1] bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/60 pb-2">
                        Ayush Chougula
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-cyan tracking-tight font-mono">
                        AI Systems Engineer
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 text-sm md:text-base font-semibold text-purple bg-purple/10 w-fit px-4 py-2 rounded-full border border-purple/20">
                        <TerminalSquare className="w-5 h-5 text-purple" />
                        <span>LLM Infrastructure • Agentic AI • RAG Systems</span>
                    </div>

                    <p className="text-lg md:text-xl lg:text-2xl text-muted font-light leading-relaxed max-w-3xl">
                        "I build production-grade AI systems — from agentic workflows to RAG pipelines and voice AI. I enjoy turning complex research ideas into working products."
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex flex-wrap items-center gap-4 pt-6"
                >
                    <Link
                        href="#projects"
                        className={cn(
                            "group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-background bg-white overflow-hidden",
                            "hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                        )}
                    >
                        <span className="relative z-10">View Projects</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-cyan/20 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>

                    <Link
                        href="#interests"
                        className={cn(
                            "group inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white bg-surface-hover border border-white/10",
                            "hover:bg-surface hover:border-white/20 hover:scale-[1.02] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_16px_rgba(0,0,0,0.4)]"
                        )}
                    >
                        Explore Systems
                    </Link>

                    <Link
                        href="/resume"
                        className={cn(
                            "group inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-orange bg-orange/10 border border-orange/20",
                            "hover:bg-orange/20 hover:border-orange/30 hover:scale-[1.02] transition-all duration-300"
                        )}
                    >
                        <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        Download Resume
                    </Link>
                </motion.div>
            </div>

            {/* Soft background glow behind hero text */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-purple/10 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
