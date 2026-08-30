import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { projectsData, type ProjectEntry } from "@/config/portfolio";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Projects",
  description:
    "A curated collection of AI systems, RAG pipelines, voice agents, developer tools, and full-stack products designed and built by Ayush Chougula.",
};

const aiCategories = new Set(["Agentic AI", "RAG Systems", "Voice AI", "AI Infrastructure"]);
const productCategories = new Set(["Full-Stack Product", "Developer Tooling"]);

type ProjectGroup = {
  title: string;
  eyebrow: string;
  description: string;
  projects: ProjectEntry[];
  muted?: boolean;
};

function getYearValue(project: ProjectEntry) {
  const year = Number(project.year);
  return Number.isFinite(year) ? year : 0;
}

function sortProjects(projects: ProjectEntry[]) {
  return [...projects].sort((a, b) => {
    const priorityA = a.priority ?? Number.MAX_SAFE_INTEGER;
    const priorityB = b.priority ?? Number.MAX_SAFE_INTEGER;

    if (priorityA !== priorityB) return priorityA - priorityB;

    const yearDiff = getYearValue(b) - getYearValue(a);
    if (yearDiff !== 0) return yearDiff;

    return a.title.localeCompare(b.title);
  });
}

function getSummary(project: ProjectEntry) {
  return project.oneLine || project.summary || project.description;
}

function getTechStack(project: ProjectEntry) {
  return project.techStack ?? project.stack ?? project.tech ?? [];
}

function getGithub(project: ProjectEntry) {
  return project.links?.github || project.github;
}

function getLive(project: ProjectEntry) {
  return project.links?.live || project.live;
}

function isArchived(project: ProjectEntry) {
  return project.archived === true || project.status === "Archived";
}

function ProjectCard({ project, muted = false }: { project: ProjectEntry; muted?: boolean }) {
  const techStack = getTechStack(project).slice(0, 5);
  const github = getGithub(project);
  const live = getLive(project);
  const preview = project.problem || project.solution;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:-translate-y-1 hover:border-white/20",
        muted ? "opacity-75 hover:opacity-100" : ""
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em]", project.bg, project.color)}>
          {project.category}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/70">
          {isArchived(project) ? "Archived" : project.status}
        </span>
        {project.year ? (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-muted">
            {project.year}
          </span>
        ) : null}
      </div>

      <h3 className="text-2xl font-black leading-tight text-white">{project.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{getSummary(project)}</p>

      {preview ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-surface/70 p-4">
          <p className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-cyan">
            Preview
          </p>
          <p className="text-sm leading-relaxed text-muted">{preview}</p>
        </div>
      ) : null}

      {techStack.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-surface px-2.5 py-1 text-[11px] font-bold text-muted">
              {tech}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:flex-wrap">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-background transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
          aria-label={`Read ${project.title} case study`}
        >
          Read Case Study
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        {github ? (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:border-purple/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
            aria-label={`View ${project.title} source code on GitHub`}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        ) : null}

        {live ? (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:border-cyan/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
            aria-label={`Open ${project.title} live demo`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Live Demo
          </a>
        ) : null}
      </div>
    </article>
  );
}

function ProjectSection({ group }: { group: ProjectGroup }) {
  if (group.projects.length === 0) return null;

  return (
    <section className="scroll-mt-28">
      <div className="mb-6">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-cyan">{group.eyebrow}</p>
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{group.title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">{group.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {group.projects.map((project) => (
          <ProjectCard key={project.id} project={project} muted={group.muted} />
        ))}
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  const featured = sortProjects(
    projectsData.filter((project) => project.featured === true && !isArchived(project))
  );

  const featuredIds = new Set(featured.map((project) => project.id));

  const aiSystems = sortProjects(
    projectsData.filter((project) => aiCategories.has(project.category) && !isArchived(project) && !featuredIds.has(project.id))
  );

  const productWork = sortProjects(
    projectsData.filter((project) => productCategories.has(project.category) && !isArchived(project) && !featuredIds.has(project.id))
  );

  const labs = sortProjects(
    projectsData.filter((project) => {
      if (featuredIds.has(project.id) || isArchived(project)) return false;
      return project.category === "Labs" || project.status === "Prototype";
    })
  );

  const archive = sortProjects(projectsData.filter((project) => isArchived(project)));

  const groups: ProjectGroup[] = [
    {
      title: "Featured",
      eyebrow: "Start here",
      description:
        "The strongest and most relevant work for AI systems, full-stack engineering, backend, and infrastructure roles.",
      projects: featured,
    },
    {
      title: "AI Systems",
      eyebrow: "Agentic AI, RAG, and infrastructure",
      description:
        "Projects centered on retrieval, LLM workflows, evaluation, AI infrastructure, and system design.",
      projects: aiSystems,
    },
    {
      title: "Full-Stack / Product",
      eyebrow: "Product engineering",
      description:
        "End-to-end products and developer tools with real interfaces, APIs, auth, state, and deployment concerns.",
      projects: productWork,
    },
    {
      title: "Labs / Experiments",
      eyebrow: "Exploration",
      description:
        "Focused prototypes and learning-oriented projects that explore ML, forecasting, tooling, or product ideas.",
      projects: labs,
    },
    {
      title: "Archive",
      eyebrow: "Older work",
      description:
        "Older or less-current projects kept available for completeness and case-study continuity.",
      projects: archive,
      muted: true,
    },
  ];

  return (
    <main className="min-h-screen selection:bg-cyan/30 selection:text-white">
      <section className="relative z-10 px-6 pb-12 pt-32 md:px-12">
        <div className="pointer-events-none absolute left-0 top-24 -z-10 h-72 w-72 rounded-full bg-cyan/10 blur-[110px]" />
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-cyan">Project index</p>
          <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">Projects</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
            A curated collection of AI systems, RAG pipelines, voice agents, developer tools, and full-stack products I&apos;ve designed and built.
          </p>
          <p className="mt-4 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold leading-relaxed text-muted">
            Featured work is prioritized for relevance to AI systems, full-stack engineering, and infrastructure roles.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 md:px-12">
        {groups.map((group) => (
          <ProjectSection key={group.title} group={group} />
        ))}
      </div>
    </main>
  );
}
