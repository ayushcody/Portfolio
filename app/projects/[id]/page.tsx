import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ProjectWithMedia } from "@/src/data/projectSchema";
import { getProjects, projectHref } from "@/lib/projects";
import { getProjectLinks } from "@/lib/projectLinks";
import { getProjectSystemLayers } from "@/lib/projectArchitecture";
import { pageMetadata } from "@/lib/seo";
import ProjectArchitecture from "@/components/ProjectArchitecture";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { TechTags } from "@/components/ui/TechTags";
import { SignatureFooter } from "@/components/SignatureFooter";
import { CaseList, CaseStudyIndex, CaseStudySection, type CaseSectionEntry } from "@/components/projects/CaseStudySection";
import { projectTone, type VisualTone } from "@/components/projects/ProjectDiagram";
import { ProjectHeroMedia } from "@/components/projects/ProjectMedia";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import "@/components/secondary-pages.css";
import "@/components/projects.css";

// Every project page is generated at build time from src/data/projects.ts.
export const dynamicParams = false;

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

type CaseProject = ProjectWithMedia;

const loadProjects = cache(async (): Promise<CaseProject[]> => getProjects());

const toneClass: Record<VisualTone, string> = { 0: "tone-lilac", 1: "tone-coral", 2: "tone-sage", 3: "tone-yellow" };
const chipColor: Record<VisualTone, string> = { 0: "var(--lilac)", 1: "var(--coral)", 2: "var(--sage)", 3: "var(--yellow)" };

const isListed = (project: CaseProject) => project.status !== "Archived";
const clean = (value?: string) => value?.trim() || "";
const statusSlug = (status: string) => status.toLowerCase().replace(/\s+/g, "-");

/**
 * Tracks what the page has already printed so adjacent blocks never repeat the same sentence
 * (CMS projects often reuse the summary as the one-liner, or features as highlights and impact).
 */
function createDeduper() {
  const seen = new Set<string>();
  const key = (value: string) => value.toLowerCase().replace(/[\s.]+$/g, "").replace(/\s+/g, " ").trim();
  const text = (value?: string) => {
    const trimmed = clean(value);
    if (!trimmed || seen.has(key(trimmed))) return "";
    seen.add(key(trimmed));
    return trimmed;
  };
  const list = (values?: string[]) => (values ?? []).map((value) => text(value)).filter(Boolean);
  return { text, list };
}

function nextProject(projects: CaseProject[], current: CaseProject) {
  const ring = projects.filter((item) => isListed(item) || item.slug === current.slug);
  if (ring.length < 2) return undefined;
  const index = ring.findIndex((item) => item.slug === current.slug);
  return ring[(index + 1) % ring.length];
}

function relatedProjects(projects: CaseProject[], current: CaseProject, exclude: Set<string>) {
  const terms = new Set([...current.stack, ...current.capabilities].map((item) => item.toLowerCase()));
  return projects
    .filter((item) => isListed(item) && !exclude.has(item.slug))
    .map((item) => {
      const shared = [...item.stack, ...item.capabilities].filter((term) => terms.has(term.toLowerCase())).length;
      const score = (item.category === current.category ? 4 : 0) + Math.min(shared, 3) + (item.featured ? 0.5 : 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.order - b.item.order)
    .slice(0, 3)
    .map(({ item }) => item);
}

export async function generateStaticParams() {
  const projects = await loadProjects();
  return projects.map((project) => ({ id: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = (await loadProjects()).find((item) => item.slug === id);

  if (!project) {
    return { title: "Project not found", robots: { index: false, follow: true } };
  }

  return pageMetadata({
    title: project.title,
    description: clean(project.summary) || clean(project.outcome) || `${project.title}, a ${project.category} project by Ayush Chougula.`,
    path: projectHref(project.slug),
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projects = await loadProjects();
  const project = projects.find((item) => item.slug === id);

  if (!project) notFound();

  const tone = projectTone(project);
  const shots = project.media.gallery;
  const hasLinks = getProjectLinks(project).length > 0;
  const once = createDeduper();

  // Hero
  const lede = once.text(project.outcome) || once.text(project.summary);

  // 01 Overview
  const overviewSummary = once.text(project.summary);
  const problem = once.text(project.problem);

  // 02 What I built
  const role = once.text(project.role);
  const features: string[] = [];

  // 03 System
  const solution = once.text(project.approach);
  const architecture = once.text(project.architecture.overview);
  const highlights = once.list(project.architecture.highlights);
  // Legacy layer map until the flow diagram replaces it.
  const archSource = { title: project.title, category: project.category, summary: project.summary, techStack: project.stack, architecture: project.architecture.overview, architectureHighlights: project.architecture.highlights };
  // ProjectArchitecture renders nothing when it finds no layers and gets no highlights.
  const hasMap = highlights.length > 0 || getProjectSystemLayers(archSource).length > 0;

  // 04 Technology
  const stack = project.stack.filter(Boolean);
  const themes: string[] = [];

  // 05+ Reflection
  const challenges = once.list(project.tradeoffs);
  const proofPoint = project.metrics.map((metric) => `${metric.value} ${metric.label}`).join(" · ");
  const impact = once.list(project.results);
  const learnings = once.list(project.learnings);
  const nextSteps = once.list(project.nextSteps);

  const candidates: (CaseSectionEntry | false)[] = [
    Boolean(overviewSummary || problem) && {
      id: "overview",
      title: "Overview",
      content: (
        <>
          {overviewSummary ? <p className="case-copy case-copy--large">{overviewSummary}</p> : null}
          {problem ? (
            overviewSummary ? (
              <div className="case-callout tone-note">
                <span className="eyebrow">The problem</span>
                <p>{problem}</p>
              </div>
            ) : (
              <p className="case-copy case-copy--large">{problem}</p>
            )
          ) : null}
        </>
      ),
    },
    Boolean(role || features.length) && {
      id: "what-i-built",
      title: "What I built",
      content: (
        <>
          {role ? <p className="case-copy case-copy--large">{role}</p> : null}
          {features.length ? (
            <>
              {role ? <h3 className="case-subhead">What it does</h3> : null}
              <CaseList items={features} grid label="Features" />
            </>
          ) : null}
        </>
      ),
    },
    Boolean(solution || architecture || hasMap) && {
      id: "system",
      title: "System and architecture",
      content: (
        <>
          {solution ? <p className="case-copy case-copy--large">{solution}</p> : null}
          {architecture ? <p className={solution ? "case-copy case-copy--muted" : "case-copy case-copy--large"}>{architecture}</p> : null}
          <ProjectArchitecture project={archSource} highlights={highlights} />
        </>
      ),
    },
    stack.length > 0 && {
      id: "technology",
      title: "Technology",
      content: (
        <>
          <TechTags items={stack} label={`${project.title} technology stack`} className="tag-list--strong case-tags" />
          {themes.length ? (
            <>
              <h3 className="case-subhead">Themes</h3>
              <TechTags items={themes} label={`${project.title} themes`} />
            </>
          ) : null}
        </>
      ),
    },
    challenges.length > 0 && {
      id: "challenges",
      title: "Challenges and trade-offs",
      content: <CaseList items={challenges} tone="coral" />,
    },
    Boolean(proofPoint || impact.length) && {
      id: "outcome",
      title: "Outcome",
      content: (
        <>
          {proofPoint ? (
            <div className={`case-callout ${toneClass[tone]}`}>
              <span className="eyebrow">At a glance</span>
              <p>{proofPoint}</p>
            </div>
          ) : null}
          <CaseList items={impact} tone="sage" />
        </>
      ),
    },
    learnings.length > 0 && {
      id: "learnings",
      title: "Learnings",
      content: <CaseList items={learnings} tone="lilac" />,
    },
    nextSteps.length > 0 && {
      id: "next-steps",
      title: "Next steps",
      content: <CaseList items={nextSteps} />,
    },
  ];
  const sections = candidates.filter((section): section is CaseSectionEntry => Boolean(section));

  const next = nextProject(projects, project);
  const related = relatedProjects(projects, project, new Set([project.slug, next?.slug ?? ""]));

  return (
    <main className="secondary-page case-study">
      <div className="secondary-shell">
        <header className="case-hero">
          <Link href="/projects" className="secondary-back">
            <ArrowLeft size={16} aria-hidden="true" /> All projects
          </Link>
          <div className="case-hero-grid">
            <div className="case-hero-copy">
              <p className="case-labels">
                <span className="eyebrow eyebrow--chip" style={{ "--chip-color": chipColor[tone] } as React.CSSProperties}>
                  {project.category}
                </span>
                <span className={`case-status case-status--${statusSlug(project.status)}`}>
                  <span className="visually-hidden">Status: </span>
                  {project.status}
                </span>
                {project.year ? (
                  <span>
                    <span className="visually-hidden">Year: </span>
                    {project.year}
                  </span>
                ) : null}
              </p>
              <h1>{project.title}</h1>
              {lede ? <p className="case-lede">{lede}</p> : null}
              <ProjectLinks project={project} variant="full" className="case-hero-links" />
            </div>
            <ProjectHeroMedia project={project} />
          </div>
        </header>

        {shots.length > 0 ? <ProjectShowcase title={project.title} shots={shots} /> : null}

        {sections.length > 0 ? (
          <div className={sections.length > 2 ? "case-body" : "case-body case-body--single"}>
            {sections.length > 2 ? <CaseStudyIndex sections={sections} /> : null}
            <div className="case-sections">
              {sections.map((section, index) => (
                <CaseStudySection key={section.id} id={section.id} number={index + 1} title={section.title}>
                  {section.content}
                </CaseStudySection>
              ))}
            </div>
          </div>
        ) : null}

        {hasLinks ? (
          <section className="case-links-band ink-card" aria-labelledby="case-links-heading">
            <div>
              <h2 id="case-links-heading">See it for yourself.</h2>
              <p>Links open in a new tab.</p>
            </div>
            <ProjectLinks project={project} variant="full" />
          </section>
        ) : null}

        {next || related.length > 0 ? (
          <nav className="case-more" aria-label="More projects">
            {next ? (
              <Link href={projectHref(next.slug)} className={`case-next ink-card ink-card--interactive ${toneClass[projectTone(next)]}`}>
                <span className="case-next-label">Next project</span>
                <h2 className="case-next-title">{next.title}</h2>
                {clean(next.outcome) ? <span className="case-next-copy">{clean(next.outcome)}</span> : null}
                <ArrowUpRight className="case-next-arrow" strokeWidth={2.25} aria-hidden="true" />
              </Link>
            ) : null}

            {related.length > 0 ? (
              <>
                <div className="case-related-head">
                  <h2>More to explore</h2>
                  <Link href="/projects" className="text-link">
                    All projects <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
                <ul className="case-related">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link href={projectHref(item.slug)} className="case-related-card ink-card ink-card--interactive">
                        <div className={`case-related-strip ${toneClass[projectTone(item)]}`}>
                          <span>{item.category}</span>
                          <span>{item.status}</span>
                        </div>
                        <div className="case-related-body">
                          <h3>{item.title}</h3>
                          {clean(item.outcome) ? <p>{clean(item.outcome)}</p> : null}
                          <span className="case-related-cta">
                            Explore the build <ArrowUpRight size={16} aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </nav>
        ) : null}
      </div>
      <SignatureFooter />
    </main>
  );
}
