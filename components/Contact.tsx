'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';
import { cn } from '@/lib/utils';

export default function Contact() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        // Simulate API call
        setTimeout(() => setFormState('success'), 1500);
    };

    return (
        <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16 text-center"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Mail className="text-purple w-6 h-6" />
                    <h2 className="text-sm font-bold tracking-widest text-purple uppercase">Get In Touch</h2>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Let's build something.</h3>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Contact Links */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <SkeuomorphicCard className="h-full flex flex-col justify-center gap-6 p-8">
                        <div>
                            <h4 className="text-2xl font-bold mb-2">Connect</h4>
                            <p className="text-muted leading-relaxed mb-8">
                                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Link href="mailto:ayushchougula@gmail.com" className="group flex items-center gap-4 p-4 rounded-xl bg-surface-hover border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all">
                                <div className="w-12 h-12 bg-purple/10 rounded-full flex items-center justify-center border border-purple/20 group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5 text-purple" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted font-medium">Email</p>
                                    <p className="text-white font-bold">ayushchougula@gmail.com</p>
                                </div>
                            </Link>

                            <Link href="https://linkedin.com/in/ayushchougula" target="_blank" className="group flex items-center gap-4 p-4 rounded-xl bg-surface-hover border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all">
                                <div className="w-12 h-12 bg-cyan/10 rounded-full flex items-center justify-center border border-cyan/20 group-hover:scale-110 transition-transform">
                                    <Linkedin className="w-5 h-5 text-cyan" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted font-medium">LinkedIn</p>
                                    <p className="text-white font-bold">in/ayushchougula</p>
                                </div>
                            </Link>

                            <Link href="https://github.com/ayushcody" target="_blank" className="group flex items-center gap-4 p-4 rounded-xl bg-surface-hover border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all">
                                <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center border border-orange/20 group-hover:scale-110 transition-transform">
                                    <Github className="w-5 h-5 text-orange" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted font-medium">GitHub</p>
                                    <p className="text-white font-bold">ayushcody</p>
                                </div>
                            </Link>
                        </div>
                    </SkeuomorphicCard>
                </motion.div>

                {/* Animated Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <SkeuomorphicCard className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h4 className="text-2xl font-bold mb-6">Send a Message</h4>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    className="w-full bg-surface-hover border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    placeholder="Your Email"
                                    className="w-full bg-surface-hover border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted pointer-events-none" />
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Your Message..."
                                    className="w-full bg-surface-hover border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formState !== 'idle'}
                                className={cn(
                                    "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-300",
                                    formState === 'idle'
                                        ? "bg-white text-background hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                        : formState === 'submitting'
                                            ? "bg-purple text-white opacity-80 cursor-wait"
                                            : "bg-green-500 text-white"
                                )}
                            >
                                {formState === 'idle' && (
                                    <>
                                        Send Message <Send className="w-5 h-5" />
                                    </>
                                )}
                                {formState === 'submitting' && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                )}
                                {formState === 'success' && "Message Sent!"}
                            </button>
                        </form>
                    </SkeuomorphicCard>
                </motion.div>
            </div>

            <div className="mt-24 text-center text-muted text-sm font-medium">
                <p>© {new Date().getFullYear()} Ayush Chougula. All rights reserved.</p>
                <p className="mt-2">Engineered with Next.js, Framer Motion & Tailwind.</p>
            </div>
        </section>
    );
}
