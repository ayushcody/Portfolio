import FadeIn from './FadeIn';

export default function Experience() {
    const experiences = [
        // ... (data items)
        {
            company: "Stealth Startup",
            role: "Senior Product Designer",
            period: "2023 — Present",
            achievements: [
                "Led design system migration reducing dev time by 30%",
                "Shipped MVP of core product in 3 months",
            ],
            current: true,
        },
        {
            company: "Tech Giant Co.",
            role: "Product Designer",
            period: "2021 — 2023",
            achievements: [
                "Designed feature used by 2M+ daily active users",
                "Mentored 3 junior designers",
            ],
            current: false,
        },
        {
            company: "Digital Agency",
            role: "UI/UX Designer",
            period: "2019 — 2021",
            achievements: [
                "Delivered 15+ client projects across fintech and healthcare",
                "Established accessibility standards for the studio",
            ],
            current: false,
        },
    ];

    return (
        <section id="experience" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <FadeIn>
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
                    <div className="h-1 w-24 bg-accent-2" />
                </div>
            </FadeIn>

            <div className="relative border-l-2 border-muted/20 ml-3 md:ml-6 space-y-12 pl-8 md:pl-12">
                {experiences.map((exp, index) => (
                    <FadeIn key={index} delay={index * 0.1}>
                        <div className="relative group">
                            {/* Timeline Dot */}
                            <span
                                className={`absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full border-4 border-background transition-colors duration-300 ${exp.current ? 'bg-accent-2' : 'bg-muted/40 group-hover:bg-accent-1'
                                    }`}
                            />

                            <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 ${exp.current
                                ? 'bg-white border-accent-2 shadow-lg ring-1 ring-accent-2/20'
                                : 'bg-white border-muted/20 hover:border-accent-1/50 hover:shadow-md'
                                }`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">{exp.company}</h3>
                                        <p className={`text-lg font-medium ${exp.current ? 'text-accent-2' : 'text-muted'}`}>
                                            {exp.role}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-wider text-muted py-1 px-3 bg-muted/10 rounded-full self-start md:self-auto">
                                        {exp.period}
                                    </span>
                                </div>

                                <ul className="space-y-2">
                                    {exp.achievements.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-base text-foreground/80">
                                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-1 opacity-60" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
