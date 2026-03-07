import { Component, Terminal, Lightbulb, Box, Rocket, Users } from 'lucide-react';
import FadeIn from './FadeIn';

const skills = [
    // ... (keeping skills detailed same)
    {
        category: "Design Systems",
        icon: Component,
        items: ["Figma", "Design Tokens", "Accessibility (A11y)", "Documentation"]
    },
    {
        category: "Frontend Dev",
        icon: Terminal,
        items: ["React / Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"]
    },
    {
        category: "Strategy",
        icon: Lightbulb,
        items: ["Workshops", "User Research", "Information Architecture", "Jobs-to-be-Done"]
    },
    {
        category: "Tools",
        icon: Box,
        items: ["Framer", "Webflow", "VS Code", "Notion", "Linear"]
    },
    {
        category: "Shipping",
        icon: Rocket,
        items: ["Git / GitHub", "CI/CD Basics", "Vercel", "Analytics"]
    },
    {
        category: "Soft Skills",
        icon: Users,
        items: ["Mentoring", "Technical Writing", "Stakeholder Management", "Public Speaking"]
    }
];

export default function Skills() {
    return (
        <section id="skills" className="py-24 px-6 md:px-12 bg-white border-y border-muted/10">
            <div className="max-w-7xl mx-auto">
                <FadeIn>
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Tools</h2>
                        <p className="text-muted max-w-2xl text-lg">
                            I bridge the gap between design and engineering. My toolkit is built for speed, scalability, and clarity.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((skill, index) => (
                        <FadeIn key={skill.category} delay={index * 0.1}>
                            <div
                                className="p-6 border border-muted/20 rounded-xl hover:border-accent-1/50 hover:shadow-lg transition-all duration-300 group bg-background"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-muted/5 rounded-lg text-accent-1 group-hover:bg-accent-1 group-hover:text-white transition-colors duration-300">
                                        <skill.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold font-display">{skill.category}</h3>
                                </div>

                                <ul className="grid grid-cols-2 gap-2">
                                    {skill.items.map((item) => (
                                        <li key={item} className="text-sm text-muted font-medium flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-accent-2/60" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
