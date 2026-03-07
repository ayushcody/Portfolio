import { Mail, Github, Linkedin, FileText, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import FadeIn from './FadeIn';

export default function Contact() {
    return (
        <section id="contact" className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center border-t border-muted/10">
            <FadeIn>
                <div className="space-y-8">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                        Let's build something great.
                    </h2>

                    <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto leading-relaxed">
                        I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 pt-8">
                        <Link
                            href="mailto:hello@ayush.design"
                            className="inline-flex items-center gap-3 bg-accent-1 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-accent-1/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent-1/25"
                        >
                            <Mail size={20} />
                            Say Hello
                        </Link>

                        <Link
                            href="https://linkedin.com/in/ayush"
                            target="_blank"
                            className="inline-flex items-center gap-3 bg-white text-foreground border border-muted/20 px-8 py-4 rounded-full text-lg font-medium hover:border-accent-1 hover:text-accent-1 transition-all duration-300"
                        >
                            <Linkedin size={20} />
                            LinkedIn
                        </Link>

                        <Link
                            href="https://github.com/ayush"
                            target="_blank"
                            className="inline-flex items-center gap-3 bg-white text-foreground border border-muted/20 px-8 py-4 rounded-full text-lg font-medium hover:border-accent-1 hover:text-accent-1 transition-all duration-300"
                        >
                            <Github size={20} />
                            GitHub
                        </Link>

                        <Link
                            href="/resume.pdf"
                            target="_blank"
                            className="inline-flex items-center gap-3 bg-white text-foreground border border-muted/20 px-8 py-4 rounded-full text-lg font-medium hover:border-accent-1 hover:text-accent-1 transition-all duration-300 group"
                        >
                            <FileText size={20} />
                            Resume
                            <ArrowUpRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        </Link>
                    </div>

                    <div className="pt-24 pb-8 text-muted text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>© {new Date().getFullYear()} Ayush Chougula. All rights reserved.</p>
                        <p>Designed in Figma, built with Next.js & Tailwind.</p>
                    </div>
                </div>
            </FadeIn>
        </section>
    );
}
