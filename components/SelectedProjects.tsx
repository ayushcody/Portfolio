'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import FadeIn from './FadeIn';

// Mock Data
const projects = [
    {
        id: 1,
        title: "E-Commerce Checkout Redesign",
        role: "Lead Designer",
        timeline: "3 months • 2024",
        problem: "Checkout had 68% abandonment rate due to complexity.",
        process: [
            "Heatmap analysis of user friction",
            "Simplified form fields (12 → 5)",
            "A/B tested trust badges",
        ],
        impact: "Abandonment ↓ to 41% • Revenue ↑ 23%",
        imageGradient: "from-blue-100 to-blue-50", // Placeholder gradient
        link: "#case-study-1",
    },
    {
        id: 2,
        title: "SaaS Dashboard System",
        role: "Product Designer",
        timeline: "6 months • 2023",
        problem: "Users struggled to visualize complex data sets.",
        process: [
            "Interviewed 15 power users",
            "Created modular widget system",
            "Implemented dark mode support",
        ],
        impact: "User retention ↑ 15% • Support tickets ↓ 40%",
        imageGradient: "from-amber-100 to-amber-50",
        link: "#case-study-2",
    },
    {
        id: 3,
        title: "Mobile Banking App",
        role: "UX Researcher & Designer",
        timeline: "4 months • 2023",
        problem: "Low engagement with savings features.",
        process: [
            "Gamified savings goals",
            "Simplified transfer flow",
            "Prototyped 3 distinct visual directions",
        ],
        impact: "Savings account creation ↑ 50%",
        imageGradient: "from-gray-100 to-gray-50",
        link: "#case-study-3",
    },
];

export default function SelectedProjects() {
    return (
        <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <FadeIn>
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected Work</h2>
                    <div className="h-1 w-24 bg-accent-2" />
                </div>
            </FadeIn>

            <div className="space-y-24">
                {projects.map((project, index) => (
                    <FadeIn key={project.id} delay={index * 0.1}>
                        <div className="group grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            {/* Project Image Area (Placeholder) */}
                            <Link
                                href={project.link}
                                className={cn(
                                    "col-span-1 lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden relative block shadow-sm hover:shadow-md transition-all duration-500",
                                    `bg-gradient-to-br ${project.imageGradient}`
                                )}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5">
                                    <span className="bg-white px-4 py-2 rounded-full text-foreground text-sm font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        View Case Study <ArrowUpRight size={16} />
                                    </span>
                                </div>
                                {/* Actual Image would go here */}
                                {/* <Image src={...} alt={project.title} fill className="object-cover" /> */}
                            </Link>

                            {/* Project Details */}
                            <div className="col-span-1 lg:col-span-7 space-y-8">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold group-hover:text-accent-1 transition-colors">
                                        <Link href={project.link}>{project.title}</Link>
                                    </h3>
                                    <p className="text-muted text-sm uppercase tracking-wide mt-2 font-medium">
                                        {project.role} • {project.timeline}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-muted/20">
                                    {/* Problem */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Problem</h4>
                                        <p className="text-sm leading-relaxed">
                                            {project.problem}
                                        </p>
                                    </div>

                                    {/* Process */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Process</h4>
                                        <ul className="space-y-2">
                                            {project.process.map((step, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2">
                                                    <span className="text-accent-1 opacity-70 mt-1">→</span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Impact */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Impact</h4>
                                        <p className="text-sm font-bold text-accent-2 block leading-relaxed">
                                            {project.impact}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
