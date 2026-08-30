import { BrainCircuit, Database, Mic2, PanelsTopLeft } from "lucide-react";
import Skills from "@/components/Skills";

export const metadata = {
  title: "Skills",
  description: "Tools and systems Ayush Chougula uses to build applied AI products.",
};

const workflows = [
  {
    title: "Building RAG pipelines",
    icon: Database,
    copy: "Ingestion, chunking, embeddings, retrieval, grounding, and evaluation loops for document-aware AI systems.",
  },
  {
    title: "Building voice AI agents",
    icon: Mic2,
    copy: "Prompts, call flow, validation, latency constraints, fallback paths, and telephony-style integrations.",
  },
  {
    title: "Building full-stack AI products",
    icon: PanelsTopLeft,
    copy: "UI, APIs, database, auth, AI provider integration, deployment, and operational product constraints.",
  },
];

export default function SkillsPage() {
  return (
    <main className="min-h-screen selection:bg-cyan/30 selection:text-white">
      <section className="relative z-10 px-6 pb-8 pt-32 md:px-12">
        <div className="pointer-events-none absolute left-0 top-24 -z-10 h-72 w-72 rounded-full bg-cyan/10 blur-[110px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan">
            <BrainCircuit className="h-4 w-4" aria-hidden="true" />
            Skills
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">Skills</h1>
          <p className="mt-6 max-w-3xl text-xl font-semibold leading-relaxed text-white/85">
            Tools and systems I use to build applied AI products.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
            Grouped by how I use them, not just by logo.
          </p>
        </div>
      </section>

      <Skills variant="full" showStackWall />

      <section className="relative z-10 px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-orange">Applied workflows</p>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">How I use these skills</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {workflows.map((workflow) => (
              <article key={workflow.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-orange/10 text-orange">
                  <workflow.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-black text-white">{workflow.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{workflow.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
