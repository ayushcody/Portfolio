import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ArrowRight, Briefcase, Download, FileText, MapPin, Sparkles } from "lucide-react";
import { experiencesData, profile, projectsData, skillsData } from "@/config/portfolio";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Resume",
  description:
    "Resume overview for Ayush Chougula, AI Systems Engineer focused on agentic AI, RAG systems, voice AI, and full-stack engineering.",
};

const resumeCandidates = [
  { publicPath: "/resume.pdf", filePath: "resume.pdf" },
  { publicPath: "/Ayush_Chougula_Resume.pdf", filePath: "Ayush_Chougula_Resume.pdf" },
  { publicPath: "/Ayush-Chougula-Resume.pdf", filePath: "Ayush-Chougula-Resume.pdf" },
];

const coreStrengths = [
  "Agentic AI workflows",
  "RAG systems",
  "Voice AI agents",
  "Full-stack AI products",
  "Backend/API integrations",
  "AI infrastructure",
];

function getResumeAsset() {
  return resumeCandidates.find((candidate) => existsSync(join(process.cwd(), "public", candidate.filePath)));
}

function getExperienceBullets(exp: (typeof experiencesData)[number]) {
  const source = exp.impact?.length ? exp.impact : exp.responsibilities;
  return source.slice(0, 2);
}

function getProjectSummary(project: (typeof projectsData)[number]) {
  return project.oneLine || project.summary || project.description;
}

export default function ResumePage() {
  const resumeAsset = getResumeAsset();
  const featuredExperience = experiencesData.filter((item) => item.featured).slice(0, 3);
  const featuredProjects = [...projectsData]
    .filter((project) => project.featured && !project.archived)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  return (
    <main className="min-h-screen selection:bg-cyan/30 selection:text-white">
      <section className="relative z-10 px-6 pb-12 pt-32 md:px-12">
        <div className="pointer-events-none absolute left-0 top-24 -z-10 h-72 w-72 rounded-full bg-cyan/10 blur-[110px]" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Resume
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">Resume</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
            A concise overview of my AI systems, full-stack engineering, and applied AI work.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:px-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-orange">Hiring snapshot</p>
            <h2 className="text-3xl font-black text-white">{profile.role}</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{profile.availability}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-black text-white">Preferred roles</p>
                <div className="flex flex-wrap gap-2">
                  {profile.preferredRoles.map((role) => (
                    <span key={role} className="rounded-full border border-white/10 bg-surface px-3 py-1.5 text-xs font-bold text-muted">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-black text-white">Location</p>
                <p className="flex items-center gap-2 text-sm font-semibold text-muted">
                  <MapPin className="h-4 w-4 text-orange" aria-hidden="true" />
                  {[profile.location, profile.timezone].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-cyan">Resume file</p>
            {resumeAsset ? (
              <>
                <h2 className="text-2xl font-black text-white">PDF resume is available.</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Open it in the browser or download a copy directly.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={resumeAsset.publicPath}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-background transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Open Resume
                  </a>
                  <a
                    href={resumeAsset.publicPath}
                    download
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download Resume
                  </a>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-white">Resume PDF is not uploaded yet.</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Add it to <span className="font-mono text-white">/public</span> and update the resume path in profile data. Until then, this page provides a structured resume overview without broken download links.
                </p>
              </>
            )}
          </div>
        </div>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-cyan">Key strengths</p>
          <h2 className="text-3xl font-black text-white">Technical focus</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {coreStrengths.map((strength) => (
              <span key={strength} className="rounded-full border border-white/10 bg-surface px-3 py-1.5 text-sm font-bold text-muted">
                {strength}
              </span>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-purple" aria-hidden="true" />
            <h2 className="text-3xl font-black tracking-tight text-white">Experience highlights</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredExperience.map((exp) => (
              <article key={exp.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5">
                <p className="text-sm font-black text-white">{exp.role}</p>
                <p className="mt-1 text-sm font-bold text-cyan">{exp.company}</p>
                <p className="mt-2 text-xs font-semibold text-muted">{exp.period}</p>
                <ul className="mt-4 space-y-2">
                  {getExperienceBullets(exp).map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {exp.techStack.slice(0, 5).map((tech) => (
                    <span key={tech} className="rounded-full border border-white/10 bg-surface px-2.5 py-1 text-[11px] font-bold text-muted">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-orange" aria-hidden="true" />
            <h2 className="text-3xl font-black tracking-tight text-white">Project highlights</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article key={project.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5">
                <span className={cn("rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em]", project.bg, project.color)}>
                  {project.category}
                </span>
                <h3 className="mt-4 text-xl font-black text-white">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{getProjectSummary(project)}</p>
                <Link
                  href={`/projects/${project.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                >
                  Read case study
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-purple">Skills summary</p>
          <h2 className="text-3xl font-black text-white">Grouped capabilities</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skillsData.map((skill) => (
              <div key={skill.name} className="rounded-2xl border border-white/10 bg-surface/70 p-4">
                <p className="text-sm font-black text-white">{skill.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skill.skills.slice(0, 4).map((tool) => (
                    <span key={tool} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold text-muted">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-purple/15 via-cyan/10 to-orange/10 p-6 md:flex md:items-center md:justify-between md:gap-6 md:p-8">
          <div>
            <h2 className="text-2xl font-black text-white">Want to go deeper?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Review the case studies or reach out directly for internship, full-stack, backend, or applied AI opportunities.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0">
            <Link href="/#contact" className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-background transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto">
              Contact Me
            </Link>
            <Link href="/projects" className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto">
              View Projects
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
