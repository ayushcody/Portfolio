import { cache, type CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Asterisk } from "lucide-react";
import type { ProjectWithMedia } from "@/src/data/projectSchema";
import { getProjects, projectHref } from "@/lib/projects";
import { getProjectLinks } from "@/lib/projectLinks";
import { pageMetadata } from "@/lib/seo";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { TechTags } from "@/components/ui/TechTags";
import { SignatureFooter } from "@/components/SignatureFooter";
import { CaseList, CaseStudyIndex, CaseStudySection, type CaseSectionEntry } from "@/components/projects/CaseStudySection";
import { FlowDiagram } from "@/components/projects/FlowDiagram";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { projectTone, statusSlug, toneClass, toneColor } from "@/components/projects/tone";
import "@/components/secondary-pages.css";
import "@/components/projects.css";

// Every project page is generated at build time from src/data/projects.ts.
export const dynamicParams = false;

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

type CaseProject = ProjectWithMedia;

const loadProjects = cache(async (): Promise<CaseProject[]> => getProjects());

const isListed = (project: CaseProject) => project.status !== "Archived";
const clean = (value?: string) => value?.trim() || "";

const RELATED_SIZES = "(min-width: 1240px) 370px, (min-width: 1100px) calc((100vw - 160px) / 3), (min-width: 700px) calc((100vw - 96px) / 2), calc(100vw - 40px)";

/**
 * Tracks what the page has already printed so adjacent blocks never repeat the same sentence
 * (e.g. a summary that restates the outcome, or a highlight that restates a result).
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

  // Header
  const lede = once.text(project.outcome);
  const summary = once.text(project.summary);
  const role = once.text(project.role);

  // Body, in reading order
  const problem = once.text(project.problem);
  const approach = once.text(project.approach);
  const overview = once.text(project.architecture.overview);
  const highlights = once.list(project.architecture.highlights);
  const hasFlow = project.architecture.flow.some((stage) => stage.trim());
  const stack = project.stack.filter(Boolean);
  const metrics = project.metrics.filter((metric) => clean(metric.value) && clean(metric.label));
  const results = once.list(project.results);
  const tradeoffs = once.list(project.tradeoffs);
  const learnings = once.list(project.learnings);
  const nextSteps = once.list(project.nextSteps);

  const candidates: (CaseSectionEntry | false)[] = [
    Boolean(problem) && {
      id: "problem",
      title: "The problem",
      content: <p className="case-copy case-copy--large">{problem}</p>,
    },
    Boolean(approach) && {
      id: "approach",
      title: "The approach",
      content: <p className="case-copy case-copy--large">{approach}</p>,
    },
    Boolean(overview || hasFlow || highlights.length || stack.length) && {
      id: "architecture",
      title: "Architecture",
      content: (
        <>
          {overview ? <p className="case-copy">{overview}</p> : null}
          <FlowDiagram project={project} />
          {highlights.length ? (
            <>
              <h3 className="case-subhead">Design decisions</h3>
              <CaseList items={highlights} tone="lilac" />
            </>
          ) : null}
          {stack.length ? (
            <>
              <h3 className="case-subhead">Stack</h3>
              <TechTags items={stack} label={`${project.title} stack`} className="tag-list--strong case-tags" />
            </>
          ) : null}
        </>
      ),
    },
    Boolean(metrics.length || results.length) && {
      id: "results",
      title: "Results",
      content: (
        <>
          {metrics.length ? (
            <dl className="case-metrics">
              {metrics.map((metric) => (
                <div key={`${metric.value}-${metric.label}`} className="case-metric">
                  <dt>{metric.label}</dt>
                  <dd className="case-metric-value">{metric.value}</dd>
                  {clean(metric.source) ? <dd className="case-metric-source"><span className="visually-hidden">Source: </span>{metric.source}</dd> : null}
                </div>
              ))}
            </dl>
          ) : null}
          <CaseList items={results} tone="sage" />
        </>
      ),
    },
    tradeoffs.length > 0 && {
      id: "tradeoffs",
      title: "Trade-offs",
      content: <CaseList items={tradeoffs} tone="coral" />,
    },
    learnings.length > 0 && {
      id: "learnings",
      title: "What I learned",
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
                <span className="eyebrow eyebrow--chip" style={{ "--chip-color": toneColor[tone] } as CSSProperties}>
                  <span className="visually-hidden">Category: </span>
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
              {project.recognition ? (
                <p className="case-recognition"><Asterisk size={18} strokeWidth={2.5} aria-hidden="true" />{project.recognition}</p>
              ) : null}
              {summary ? <p className="case-summary">{summary}</p> : null}
              {role ? (
                <p className="case-role"><strong>My role.</strong> {role}</p>
              ) : null}
              <ProjectLinks project={project} variant="full" className="case-hero-links" />
            </div>
            <figure className="case-cover">
              <ProjectCover project={project} loading="priority" sizes="(min-width: 1100px) 500px, (min-width: 700px) 600px, calc(100vw - 40px)" />
            </figure>
          </div>
        </header>

        {shots.length > 0 ? (
          <ProjectShowcase title={project.title} shots={shots} />
        ) : project.media.noVisualReason ? (
          <p className="state-note case-no-visual"><span><strong>No screenshots.</strong> {project.media.noVisualReason}</span></p>
        ) : null}

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
              <p>External links open in a new tab.</p>
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
                <ul className="pgrid case-related">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <ProjectCard project={item} sizes={RELATED_SIZES} />
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
