import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/src/data/projects";
import { getPublicProjects } from "@/lib/cms/publicReads";
import { getProjectLinks } from "@/lib/projectLinks";
import { getProjectSystemLayers } from "@/lib/projectArchitecture";
import { pageMetadata } from "@/lib/seo";
import ProjectArchitecture from "@/components/ProjectArchitecture";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { TechTags } from "@/components/ui/TechTags";
import { SignatureFooter } from "@/components/SignatureFooter";
import { CaseList, CaseStudyIndex, CaseStudySection, type CaseSectionEntry } from "@/components/projects/CaseStudySection";
import { projectTone, type VisualTone } from "@/components/projects/ProjectDiagram";
import { ProjectGallery, ProjectHeroMedia, hasGallery } from "@/components/projects/ProjectMedia";
import "@/components/secondary-pages.css";
import "@/components/projects.css";

// Static at build time; CMS edits appear within five minutes. CMS-only projects render on demand.
export const revalidate = 300;

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

/** Static data may still carry the legacy `architecture` / `proofPoint` notes; CMS projects may not. */
type CaseProject = Project & { architecture?: string; proofPoint?: string };

// One read per request, shared by generateMetadata and the page.
const loadProjects = cache(async (): Promise<CaseProject[]> => (await getPublicProjects()).data);

const toneClass: Record<VisualTone, string> = { 0: "tone-lilac", 1: "tone-coral", 2: "tone-sage", 3: "tone-yellow" };
const chipColor: Record<VisualTone, string> = { 0: "var(--lilac)", 1: "var(--coral)", 2: "var(--sage)", 3: "var(--yellow)" };

const isListed = (project: Project) => !project.archived && project.status !== "Archived";
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

/** proofPoint lines that only restate the stack ("FastAPI · Celery") add nothing next to the tags. */
function meaningfulProofPoint(project: CaseProject) {
  const proof = clean(project.proofPoint);
  if (!proof) return "";
  const stack = new Set(project.techStack.map((item) => item.toLowerCase()));
  const parts = proof.split(/\s*[·|]\s*/).filter(Boolean);
  return parts.every((part) => stack.has(part.toLowerCase())) ? "" : proof;
}

function nextProject(projects: CaseProject[], current: CaseProject) {
  const ring = projects.filter((item) => isListed(item) || item.id === current.id);
  if (ring.length < 2) return undefined;
  const index = ring.findIndex((item) => item.id === current.id);
  return ring[(index + 1) % ring.length];
}

function relatedProjects(projects: CaseProject[], current: CaseProject, exclude: Set<string>) {
  const terms = new Set([...current.techStack, ...current.tags].map((item) => item.toLowerCase()));
  return projects
    .filter((item) => isListed(item) && !exclude.has(item.id))
    .map((item) => {
      const shared = [...item.techStack, ...item.tags].filter((term) => terms.has(term.toLowerCase())).length;
      const score = (item.category === current.category ? 4 : 0) + Math.min(shared, 3) + (item.featured ? 0.5 : 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.priority - b.item.priority)
    .slice(0, 3)
    .map(({ item }) => item);
}

export async function generateStaticParams() {
  const projects = await loadProjects();
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = (await loadProjects()).find((item) => item.id === id);

  if (!project) {
    return { title: "Project not found", robots: { index: false, follow: true } };
  }

  return pageMetadata({
    title: project.title,
    description: clean(project.summary) || clean(project.oneLine) || clean(project.description) || `${project.title}, a ${project.category} project by Ayush Chougula.`,
    path: `/projects/${project.id}`,
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projects = await loadProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) notFound();

  const tone = projectTone(project);
  const hasLinks = getProjectLinks(project).length > 0;
  const once = createDeduper();

  // Hero
  const lede = once.text(project.oneLine) || once.text(project.summary) || once.text(project.description);

  // 01 Overview
  const overviewSummary = once.text(project.summary);
  const problem = once.text(project.problem);

  // 02 What I built
  const role = once.text(project.myRole);
  const features = once.list(project.features);

  // 03 System
  const solution = once.text(project.solution);
  const architecture = once.text(project.architecture);
  const highlights = once.list(project.architectureHighlights);
  // ProjectArchitecture renders nothing when it finds no layers and gets no highlights.
  const hasMap = highlights.length > 0 || getProjectSystemLayers(project).length > 0;

  // 04 Technology
  const stack = project.techStack.filter(Boolean);
  const stackKeys = new Set(stack.map((item) => item.toLowerCase()));
  const themes = project.tags.filter((tag) => tag && !stackKeys.has(tag.toLowerCase()));

  // 05+ Reflection
  const challenges = once.list(project.challenges);
  const proofPoint = once.text(meaningfulProofPoint(project));
  const impact = once.list(project.impact);
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
          <ProjectArchitecture project={project} highlights={highlights} />
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
    hasGallery(project) && {
      id: "gallery",
      title: "Gallery",
      content: <ProjectGallery project={project} />,
    },
  ];
  const sections = candidates.filter((section): section is CaseSectionEntry => Boolean(section));

  const next = nextProject(projects, project);
  const related = relatedProjects(projects, project, new Set([project.id, next?.id ?? ""]));

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
              <Link href={`/projects/${next.id}`} className={`case-next ink-card ink-card--interactive ${toneClass[projectTone(next)]}`}>
                <span className="case-next-label">Next project</span>
                <h2 className="case-next-title">{next.title}</h2>
                {clean(next.oneLine) || clean(next.summary) ? <span className="case-next-copy">{clean(next.oneLine) || clean(next.summary)}</span> : null}
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
                    <li key={item.id}>
                      <Link href={`/projects/${item.id}`} className="case-related-card ink-card ink-card--interactive">
                        <div className={`case-related-strip ${toneClass[projectTone(item)]}`}>
                          <span>{item.category}</span>
                          <span>{item.status}</span>
                        </div>
                        <div className="case-related-body">
                          <h3>{item.title}</h3>
                          {clean(item.oneLine) || clean(item.summary) ? <p>{clean(item.oneLine) || clean(item.summary)}</p> : null}
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
