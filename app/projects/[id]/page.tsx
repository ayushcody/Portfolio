import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github, PlayCircle } from "lucide-react";
import { SkeuomorphicCard } from "@/components/ui/SkeuomorphicCard";
import ProjectArchitecture from "@/components/ProjectArchitecture";
import { projectsData, type ProjectEntry } from "@/config/portfolio";
import { cn } from "@/lib/utils";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

type ExternalLinkItem = {
  label: string;
  href: string;
  icon: typeof ExternalLink;
  ariaLabel: string;
};

function getProject(id: string) {
  return projectsData.find((item) => item.id === id);
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

function getDemo(project: ProjectEntry) {
  return project.links?.demo;
}

function getVideo(project: ProjectEntry) {
  return project.links?.video;
}

function getInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function getExternalLinks(project: ProjectEntry): ExternalLinkItem[] {
  const links: ExternalLinkItem[] = [];
  const github = getGithub(project);
  const live = getLive(project);
  const demo = getDemo(project);
  const video = getVideo(project);

  if (github) {
    links.push({
      label: "GitHub",
      href: github,
      icon: Github,
      ariaLabel: `Open ${project.title} source code on GitHub`,
    });
  }

  if (live) {
    links.push({
      label: "Live Demo",
      href: live,
      icon: ExternalLink,
      ariaLabel: `Open ${project.title} live demo`,
    });
  }

  if (demo) {
    links.push({
      label: "Demo",
      href: demo,
      icon: ExternalLink,
      ariaLabel: `Open ${project.title} demo`,
    });
  }

  if (video) {
    links.push({
      label: "Video",
      href: video,
      icon: PlayCircle,
      ariaLabel: `Watch ${project.title} video`,
    });
  }

  return links;
}

function ProjectVisual({ project }: { project: ProjectEntry }) {
  const thumbnail = project.visuals?.thumbnail;
  const screenshots = project.visuals?.screenshots ?? [];
  const image = thumbnail || screenshots[0];

  if (image) {
    return (
      <div
        className="min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-surface bg-cover bg-center shadow-[0_24px_80px_rgba(0,0,0,0.32)]"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-label={`${project.title} project visual`}
      />
    );
  }

  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-surface/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_20%,rgba(0,229,255,0.17),transparent_32%),radial-gradient(circle_at_78%_72%,rgba(110,91,255,0.18),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 flex min-h-[280px] flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className={cn("rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em]", project.bg, project.color)}>
            {project.category}
          </span>
          <project.icon className={cn("h-7 w-7", project.color)} aria-hidden="true" />
        </div>

        <div>
          <p className="text-6xl font-black tracking-tight text-white/90 md:text-7xl">
            {project.shortTitle ? getInitials(project.shortTitle) : getInitials(project.title)}
          </p>
          <p className="mt-4 max-w-md text-lg font-bold leading-relaxed text-white">
            {project.shortTitle || project.title}
          </p>
          <p className="mt-2 text-sm font-semibold text-muted">
            Case study visual placeholder
          </p>
        </div>
      </div>
    </div>
  );
}

function MetaChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/75", className)}>
      {children}
    </span>
  );
}

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-28">
      {eyebrow ? (
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-cyan">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function BulletList({ items, accent = "bg-cyan" }: { items: string[]; accent?: string }) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-relaxed text-muted">
          <span className={cn("mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full", accent)} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RelatedProjects({ project }: { project: ProjectEntry }) {
  const related = projectsData
    .filter((item) => item.id !== project.id)
    .sort((a, b) => {
      const sameCategoryA = a.category === project.category ? 0 : 1;
      const sameCategoryB = b.category === project.category ? 0 : 1;
      if (sameCategoryA !== sameCategoryB) return sameCategoryA - sameCategoryB;

      const featuredA = a.featured ? 0 : 1;
      const featuredB = b.featured ? 0 : 1;
      if (featuredA !== featuredB) return featuredA - featuredB;

      return (a.priority ?? Number.MAX_SAFE_INTEGER) - (b.priority ?? Number.MAX_SAFE_INTEGER);
    })
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-white/10 pt-12">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-purple">Keep exploring</p>
          <h2 className="text-3xl font-black tracking-tight text-white">Related projects</h2>
        </div>
        <Link
          href="/projects"
          className="inline-flex w-fit items-center gap-2 text-sm font-black text-muted transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
        >
          View all projects
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {related.map((item) => (
          <Link
            key={item.id}
            href={`/projects/${item.id}`}
            className="group rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            aria-label={`Read ${item.title} case study`}
          >
            <p className={cn("mb-3 text-xs font-black uppercase tracking-[0.18em]", item.color)}>{item.category}</p>
            <h3 className="text-lg font-black text-white group-hover:text-cyan">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{getSummary(item)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return projectsData.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const description = getSummary(project);

  return {
    title: project.title,
    description,
    openGraph: {
      title: `${project.title} | Ayush Chougula`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Ayush Chougula`,
      description,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) notFound();

  const summary = getSummary(project);
  const techStack = getTechStack(project);
  const externalLinks = getExternalLinks(project);
  const overviewCards = [
    {
      title: "Problem",
      body: project.problem || summary,
    },
    {
      title: "My Role",
      body:
        project.myRole ||
        "Designed and built core parts of the system across product, engineering, and AI integration.",
    },
    {
      title: "Solution",
      body: project.solution || summary,
    },
  ];

  return (
    <main className="min-h-screen selection:bg-cyan/30 selection:text-white">
      <article className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12">
        <Link
          href="/projects"
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to all projects
        </Link>

        <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <MetaChip className={cn("border-transparent", project.bg, project.color)}>
                {project.category}
              </MetaChip>
              <MetaChip>{project.status}</MetaChip>
              {project.year ? <MetaChip>{project.year}</MetaChip> : null}
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
              {project.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
              {summary}
            </p>

            {techStack.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-2" aria-label="Project technology stack">
                {techStack.slice(0, 10).map((tech) => (
                  <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-muted">
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}

            {externalLinks.length > 0 ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {externalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:border-cyan/35 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:w-auto"
                  >
                    <link.icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <ProjectVisual project={project} />
        </header>

        <section className="mt-12" aria-label={`${project.title} architecture preview`}>
          <ProjectArchitecture project={project} />
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-4">
          {overviewCards.map((card) => (
            <SkeuomorphicCard key={card.title} className="p-5">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan">{card.title}</p>
              <p className="text-sm leading-relaxed text-muted">{card.body}</p>
            </SkeuomorphicCard>
          ))}

          <SkeuomorphicCard className="p-5">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-cyan">Stack</p>
            <div className="flex flex-wrap gap-2">
              {techStack.slice(0, 10).map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold text-muted">
                  {tech}
                </span>
              ))}
            </div>
          </SkeuomorphicCard>
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,760px)_minmax(280px,1fr)] lg:items-start">
          <div className="space-y-14">
            <Section title="Problem" eyebrow="Case study">
              <p className="text-lg leading-relaxed text-muted">{project.problem || summary}</p>
              {project.proofPoint ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-orange">Proof signal</p>
                  <p className="text-sm font-bold leading-relaxed text-white/85">{project.proofPoint}</p>
                </div>
              ) : null}
            </Section>

            <Section title="My Role">
              <p className="text-lg leading-relaxed text-muted">
                {project.myRole ||
                  "Designed and built core parts of the system across product, engineering, and AI integration."}
              </p>

              {project.features && project.features.length > 0 ? (
                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-black text-white">Core product work</h3>
                  <BulletList items={project.features} accent="bg-purple" />
                </div>
              ) : null}
            </Section>

            <Section title="Solution">
              <p className="text-lg leading-relaxed text-muted">{project.solution || summary}</p>

              {project.architecture ? (
                <p className="mt-5 text-base leading-relaxed text-muted">{project.architecture}</p>
              ) : null}
            </Section>

            {project.architectureHighlights && project.architectureHighlights.length > 0 ? (
              <Section title="Architecture Highlights">
                <div className="grid gap-4 md:grid-cols-2">
                  {project.architectureHighlights.map((highlight) => (
                    <div key={highlight} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-sm leading-relaxed text-muted">{highlight}</p>
                    </div>
                  ))}
                </div>
              </Section>
            ) : null}

            {project.challenges && project.challenges.length > 0 ? (
              <Section title="Challenges and Tradeoffs">
                <BulletList items={project.challenges} accent="bg-orange" />
              </Section>
            ) : null}

            {project.impact && project.impact.length > 0 ? (
              <Section title="Impact / Outcome">
                <BulletList items={project.impact} accent="bg-cyan" />
              </Section>
            ) : null}

            {project.learnings && project.learnings.length > 0 ? (
              <Section title="Learnings">
                <BulletList items={project.learnings} accent="bg-purple" />
              </Section>
            ) : null}

            {project.nextSteps && project.nextSteps.length > 0 ? (
              <Section title="Next Steps">
                <BulletList items={project.nextSteps} accent="bg-white" />
              </Section>
            ) : null}
          </div>

          <aside className="sticky top-28 hidden space-y-4 lg:block">
            <SkeuomorphicCard className="p-5">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-cyan">Case study map</p>
              <ul aria-label={`${project.title} case study sections`} className="grid gap-2 text-sm font-bold text-muted">
                {["Problem", "My Role", "Solution", "Architecture", "Impact", "Learnings"].map((item) => (
                  <li key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </SkeuomorphicCard>

            <SkeuomorphicCard className="p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-orange">Status</p>
              <p className="text-lg font-black text-white">{project.status}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{project.category}</p>
            </SkeuomorphicCard>
          </aside>
        </div>

        <div className="mt-16">
          <RelatedProjects project={project} />
        </div>
      </article>
    </main>
  );
}
