import About from "@/components/About";
import Contact from "@/components/Contact";
import { profile } from "@/src/data/profile";

export const metadata = {
    title: "About",
    description:
        "About Ayush Chougula, an AI Systems Engineer building agentic AI, RAG, voice AI, and full-stack AI products.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen selection:bg-cyan/30 selection:text-white">
            <div className="pt-24 md:pt-28">
                <About variant="full" />

                <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:px-12 lg:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
                        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-cyan">Current focus</p>
                        <h2 className="text-2xl font-black text-white">What I&apos;m building toward</h2>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {profile.currentFocus.map((focus) => (
                                <span key={focus} className="rounded-full border border-white/10 bg-surface px-3 py-1.5 text-sm font-bold text-muted">
                                    {focus}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
                        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-orange">Looking for</p>
                        <h2 className="text-2xl font-black text-white">Engineering opportunities</h2>
                        <ul className="mt-5 space-y-3">
                            {profile.preferredRoles.map((role) => (
                                <li key={role} className="flex gap-3 text-sm font-semibold leading-relaxed text-muted">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" aria-hidden="true" />
                                    {role}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <Contact />
            </div>
        </main>
    );
}
