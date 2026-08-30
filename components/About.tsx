import Link from "next/link";
import { BrainCircuit, Cpu, Layers3, ServerCog } from "lucide-react";
import { profile } from "@/src/data/profile";
import { cn } from "@/lib/utils";

type AboutProps = {
    variant?: "preview" | "full";
};

const focusCards = [
    {
        title: "Systems Thinking",
        icon: Layers3,
        copy: "I think in workflows, data flow, reliability paths, and edge cases, especially when AI behavior has to fit into real products.",
    },
    {
        title: "Product Engineering",
        icon: Cpu,
        copy: "I prefer building usable end-to-end products with APIs, auth, state, deployment constraints, and clear user outcomes.",
    },
    {
        title: "AI Infrastructure",
        icon: ServerCog,
        copy: "I work across providers, prompts, pipelines, model integrations, validation, and performance constraints behind AI systems.",
    },
];

function AvatarCard() {
    const hasPhoto = Boolean(profile.profilePhoto);

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28),0_0_40px_rgba(0,229,255,0.08)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.14),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(110,91,255,0.16),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="relative z-10">
                <div
                    className="mb-6 flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] text-6xl font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    role={hasPhoto ? "img" : undefined}
                    aria-label={hasPhoto ? `${profile.fullName} profile image` : undefined}
                >
                    {hasPhoto ? (
                        <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${profile.profilePhoto})` }}
                        />
                    ) : (
                        <span aria-label={`${profile.initials}, initials for ${profile.fullName}`}>
                            {profile.initials}
                        </span>
                    )}
                </div>

                <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-cyan">
                    <BrainCircuit className="h-4 w-4" aria-hidden="true" />
                    {profile.role}
                </div>
                <p className="text-sm leading-relaxed text-muted">
                    {profile.locationShort}
                    {profile.timezone ? ` · ${profile.timezone}` : ""}
                </p>
            </div>
        </div>
    );
}

export default function About({ variant = "preview" }: AboutProps) {
    const isFull = variant === "full";
    const education = profile.education;
    const HeadingTag: "h1" | "h2" = isFull ? "h1" : "h2";

    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className={cn(
                "relative z-10 w-full scroll-mt-28 overflow-hidden px-6 md:px-12",
                isFull ? "pb-12 pt-12" : "py-20 md:py-24"
            )}
        >
            <div className="pointer-events-none absolute left-0 top-24 -z-10 h-72 w-72 rounded-full bg-purple/10 blur-[110px]" />
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                <AvatarCard />

                <div>
                    <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-purple/20 bg-purple/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-purple">
                        About
                    </div>

                    <HeadingTag id="about-heading" className="text-4xl font-black tracking-tight text-white md:text-5xl">
                        {isFull ? "About Ayush" : "About me"}
                    </HeadingTag>

                    <div className="mt-5 space-y-4 text-base leading-relaxed text-muted md:text-lg">
                        <p>
                            I&apos;m {profile.fullName}, a {profile.role}
                            {education?.degree && education?.institution
                                ? ` and ${education.degree} student at ${education.institution}`
                                : ""}
                            . I focus on building practical AI systems across agentic workflows, RAG pipelines, voice AI, AI infrastructure, and full-stack AI products.
                        </p>

                        <p>
                            {profile.longBio}
                        </p>

                        {isFull ? (
                            <p>
                                My engineering style is product-first: I care about clean architecture, reliable integrations, useful interfaces, and the constraints that show up after a demo starts behaving like a real product.
                            </p>
                        ) : null}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2" aria-label="Current focus areas">
                        {profile.currentFocus.map((focus) => (
                            <span key={focus} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/80 sm:text-sm">
                                {focus}
                            </span>
                        ))}
                    </div>

                    <div className="mt-7 grid gap-4 md:grid-cols-3">
                        {focusCards.map((card) => (
                            <article key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-cyan/10 text-cyan">
                                    <card.icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <h3 className="text-base font-black text-white">{card.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">{card.copy}</p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/projects"
                            className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-black text-background transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                        >
                            See Projects
                        </Link>
                        <Link
                            href={isFull ? "#contact" : "/about#contact"}
                            className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-black text-white transition hover:border-cyan/30 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                        >
                            Contact Me
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
