'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Download, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { profile } from '@/config/portfolio';

export default function LaunchPage() {
    const signals = [
        "High-agency builder",
        "Debugs under pressure",
        "Ships real systems",
        "Learns fast"
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-accent-2 selection:text-white">
            
            {/* Cosmic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple/20 rounded-full blur-[100px]" />
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(255,165,0,0.15)] text-center"
            >
                {/* Profile Avatar */}
                <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-surface-hover text-4xl font-black text-muted shadow-[0_0_30px_rgba(110,91,255,0.3)]">
                    {profile.initials}
                </div>

                <div className="inline-block px-4 py-1.5 rounded-full border border-orange/30 bg-orange/10 text-orange font-mono text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(255,165,0,0.3)]">
                    Mission Complete
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    You reached the end of the system.
                </h1>

                <p className="text-xl text-muted font-light leading-relaxed mb-10 max-w-lg mx-auto">
                    {profile.shortBio}
                </p>

                {/* Candidate Signals */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                    {signals.map((signal, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="flex items-center justify-center gap-2 text-sm font-bold text-white/80 bg-white/5 border border-white/10 rounded-full py-2 px-4"
                        >
                            <CheckCircle2 className="w-4 h-4 text-cyan" />
                            {signal}
                        </motion.div>
                    ))}
                </div>

                <hr className="border-white/10 mb-8" />

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <a 
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-background rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        <Mail className="w-5 h-5" /> Let&apos;s Talk
                    </a>
                    <Link 
                        href={profile.resumePath}
                        className="flex items-center gap-2 px-6 py-3 bg-surface border border-white/10 text-white rounded-full font-bold hover:bg-white/5 transition-colors"
                    >
                        <Download className="w-5 h-5 text-orange" /> Resume
                    </Link>
                    <a 
                        href={profile.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-12 h-12 bg-surface border border-white/10 text-muted hover:text-cyan rounded-full flex items-center justify-center transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="w-12 h-12 bg-surface border border-white/10 text-muted hover:text-purple rounded-full flex items-center justify-center transition-colors"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </motion.div>

            <Link href="/" className="fixed top-8 left-8 text-sm font-bold text-muted hover:text-white transition-colors flex items-center gap-2 z-20">
                ← Return to Home
            </Link>
        </div>
    );
}
