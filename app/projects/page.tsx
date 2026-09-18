import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/src/data/projects";
import { getPublicProjects } from "@/lib/cms/publicReads";
import { pageMetadata } from "@/lib/seo";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { SignatureFooter } from "@/components/SignatureFooter";
import "@/components/secondary-pages.css";
import "@/components/projects.css";

// Static at build time; CMS changes appear within five minutes (ISR).
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Projects",
  description: "Explore Ayush Chougula's AI systems, full-stack products, developer tools, and experiments, with architecture and implementation notes.",
  path: "/projects",
});

const aiCategories = new Set(["Agentic AI", "RAG Systems", "Voice AI", "AI Infrastructure"]);
const isArchived = (project: Project) => project.archived || project.status === "Archived";
const byPriority = (projects: Project[]) => [...projects].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
const pad = (value: number) => String(value).padStart(2, "0");
const numberWords = ["", "One", "Two", "Three", "Four", "Five", "Six"];
// Keeps "Four builds that show…" accurate when the CMS changes how many projects are on the homepage.
const selectedDescription = (count: number) =>
  count === 1
    ? "One build that shows how I connect AI, architecture, and a useful interface."
    : `${numberWords[count] ?? count} builds that show how I connect AI, architecture, and a useful interface.`;

type Group = { id: string; title: string; jumpLabel: string; description: string; projects: Project[] };

function ProjectGroup({ group, offset }: { group: Group; offset: number }) {
  return (
    <section id={group.id} className="secondary-project-group" aria-labelledby={`${group.id}-heading`}>
      <div className="secondary-section-heading">
        <h2 id={`${group.id}-heading`}>
          {group.title} <span className="secondary-count"><span className="visually-hidden">(</span>{pad(group.projects.length)}<span className="visually-hidden"> projects)</span></span>
        </h2>
        <p>{group.description}</p>
      </div>
      <div className="secondary-project-list">
        {group.projects.map((project, index) => <ProjectRow key={project.id} project={project} index={offset + index} />)}
      </div>
    </section>
  );
}

function ProjectArchive({ title, projects, offset }: { title: string; projects: Project[]; offset: number }) {
  if (!projects.length) return null;
  return (
    <details className="secondary-archive">
      <summary>
        <span>{title} <span className="secondary-count"><span className="visually-hidden">(</span>{pad(projects.length)}<span className="visually-hidden"> projects)</span></span></span>
        <Plus className="secondary-disclosure-icon" size={28} aria-hidden="true" />
      </summary>
      <div className="secondary-project-list">
        {projects.map((project, index) => <ProjectRow key={project.id} project={project} index={offset + index} />)}
      </div>
    </details>
  );
}

export default async function ProjectsPage() {
  const { data: projects } = await getPublicProjects();

  const current = projects.filter((project) => !isArchived(project));
  const selected = byPriority(current.filter((project) => project.showOnHome));
  const remaining = current.filter((project) => !project.showOnHome);
  const systems = byPriority(remaining.filter((project) => aiCategories.has(project.category)));
  const products = byPriority(remaining.filter((project) => !aiCategories.has(project.category) && project.category !== "Labs"));
  const labs = byPriority(remaining.filter((project) => project.category === "Labs"));
  const archived = byPriority(projects.filter(isArchived));

  // Empty groups are left out entirely (with their jump link), so the page never shows an empty shelf.
  const groups: Group[] = [
    { id: "selected-builds", title: "Start here.", jumpLabel: "Selected builds", description: selectedDescription(selected.length), projects: selected },
    { id: "ai-systems", title: "Under the hood.", jumpLabel: "AI systems", description: "Evaluation, security workflows, and the infrastructure behind AI products.", projects: systems },
    { id: "products-tools", title: "Made to be used.", jumpLabel: "Products & tools", description: "Learning products and small tools for everyday engineering.", projects: products },
  ].filter((group) => group.projects.length > 0);

  // Row numbers run continuously across groups, the lab notebook and the archive.
  const offsets = groups.map((_, index) => groups.slice(0, index).reduce((sum, group) => sum + group.projects.length, 0));
  const labsOffset = groups.reduce((sum, group) => sum + group.projects.length, 0);
  const archiveOffset = labsOffset + labs.length;

  return (
    <main className="secondary-page">
      <div className="secondary-shell">
        <header className="secondary-intro secondary-project-intro">
          <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
          <div className="secondary-title-row">
            <h1>Things I&apos;ve <span className="secondary-highlight">built.</span></h1>
            {projects.length > 0 ? (
              <div className="secondary-project-total"><strong>{projects.length}</strong><span>projects & counting</span></div>
            ) : null}
          </div>
          <p className="secondary-lead">AI that does something useful. Products that connect the dots. A few experiments along the way.</p>
          {groups.length > 1 ? (
            <nav className="secondary-jump-links" aria-label="Project categories">
              {groups.map((group) => (
                <a key={group.id} href={`#${group.id}`}>{group.jumpLabel} <ArrowRight size={15} aria-hidden="true" /></a>
              ))}
            </nav>
          ) : null}
        </header>

        {groups.map((group, index) => <ProjectGroup key={group.id} group={group} offset={offsets[index]} />)}

        {projects.length === 0 ? (
          <div className="state-note projects-empty" role="status">
            <div>
              <p><strong>No projects to show just yet.</strong></p>
              <p>Case studies are being updated. <Link href="/about#contact">Get in touch</Link> if you&apos;d like to hear about recent work.</p>
            </div>
          </div>
        ) : null}

        <ProjectArchive title="The lab notebook" projects={labs} offset={labsOffset} />
        <ProjectArchive title="From the archive" projects={archived} offset={archiveOffset} />

        <aside className="secondary-closing">
          <h2>Have a good problem?</h2>
          <Link href="/about#contact" className="secondary-button">Let&apos;s talk <ArrowUpRight size={20} aria-hidden="true" /></Link>
        </aside>
      </div>
      <SignatureFooter />
    </main>
  );
}
