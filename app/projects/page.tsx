import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { projectsData, type Project } from "@/src/data/projects";
import { SignatureFooter } from "@/components/SignatureFooter";
import "@/components/secondary-pages.css";

export const metadata = {
  title: "Projects",
  description: "Explore Ayush Chougula's AI systems, full-stack products, developer tools, and experiments, with architecture and implementation notes.",
};

const aiCategories = new Set(["Agentic AI", "RAG Systems", "Voice AI", "AI Infrastructure"]);
const isArchived = (project: Project) => project.archived || project.status === "Archived";
const sortProjects = (projects: Project[]) => [...projects].sort((a, b) => a.priority - b.priority);

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article className="secondary-project-row">
      <span className="secondary-row-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className="secondary-project-name">
        <p className="secondary-meta">{project.category} <span aria-hidden="true">/</span> {project.status}</p>
        <h3><Link href={`/projects/${project.id}`}>{project.title}</Link></h3>
        <p className="secondary-project-stack">{project.techStack.slice(0, 4).join(" · ")}</p>
      </div>
      <div className="secondary-project-description">
        <p>{project.summary}</p>
        <div className="secondary-row-links">
          <Link href={`/projects/${project.id}`} className="secondary-text-link" aria-label={`Explore ${project.title}`}>
            Explore the build <ArrowRight size={17} aria-hidden="true" />
          </Link>
          {project.links.github ? (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="secondary-source-link" aria-label={`${project.title} source on GitHub`}>
              Source <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : null}
          {project.links.live ? (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="secondary-source-link" aria-label={`Open ${project.title}`}>
              Live <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProjectGroup({ id, title, description, projects, offset = 0 }: {
  id: string; title: string; description: string; projects: Project[]; offset?: number;
}) {
  if (!projects.length) return null;
  return (
    <section id={id} className="secondary-project-group" aria-labelledby={`${id}-heading`}>
      <div className="secondary-section-heading">
        <h2 id={`${id}-heading`}>{title} <span className="secondary-count">{String(projects.length).padStart(2, "0")}</span></h2>
        <p>{description}</p>
      </div>
      <div className="secondary-project-list">
        {projects.map((project, index) => <ProjectRow key={project.id} project={project} index={offset + index} />)}
      </div>
    </section>
  );
}

function ProjectArchive({ title, projects, offset }: { title: string; projects: Project[]; offset: number }) {
  if (!projects.length) return null;
  return (
    <details className="secondary-archive">
      <summary>
        <span>{title} <span className="secondary-count">{String(projects.length).padStart(2, "0")}</span></span>
        <Plus className="secondary-disclosure-icon" size={28} aria-hidden="true" />
      </summary>
      <div className="secondary-project-list">
        {projects.map((project, index) => <ProjectRow key={project.id} project={project} index={offset + index} />)}
      </div>
    </details>
  );
}

export default function ProjectsPage() {
  const current = projectsData.filter((project) => !isArchived(project));
  const selected = sortProjects(current.filter((project) => project.showOnHome));
  const remaining = current.filter((project) => !project.showOnHome);
  const systems = sortProjects(remaining.filter((project) => aiCategories.has(project.category)));
  const products = sortProjects(remaining.filter((project) => !aiCategories.has(project.category) && project.category !== "Labs"));
  const labs = sortProjects(remaining.filter((project) => project.category === "Labs"));
  const archived = sortProjects(projectsData.filter(isArchived));

  return (
    <main className="secondary-page">
      <div className="secondary-shell">
        <header className="secondary-intro secondary-project-intro">
          <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
          <div className="secondary-title-row">
            <h1>Things I&apos;ve <span className="secondary-highlight">built.</span></h1>
            <div className="secondary-project-total"><strong>{projectsData.length}</strong><span>projects & counting</span></div>
          </div>
          <p className="secondary-lead">AI that does something useful. Products that connect the dots. A few experiments along the way.</p>
          <nav className="secondary-jump-links" aria-label="Project categories">
            <a href="#selected-builds">Selected builds <ArrowRight size={15} aria-hidden="true" /></a>
            <a href="#ai-systems">AI systems <ArrowRight size={15} aria-hidden="true" /></a>
            <a href="#products-tools">Products & tools <ArrowRight size={15} aria-hidden="true" /></a>
          </nav>
        </header>

        <ProjectGroup id="selected-builds" title="Start here." description="Four builds that show how I connect AI, architecture, and a useful interface." projects={selected} />
        <ProjectGroup id="ai-systems" title="Under the hood." description="Evaluation, security workflows, and the infrastructure behind AI products." projects={systems} offset={selected.length} />
        <ProjectGroup id="products-tools" title="Made to be used." description="Learning products and small tools for everyday engineering." projects={products} offset={selected.length + systems.length} />
        <ProjectArchive title="The lab notebook" projects={labs} offset={selected.length + systems.length + products.length} />
        <ProjectArchive title="From the archive" projects={archived} offset={current.length} />

        <aside className="secondary-closing">
          <h2>Have a good problem?</h2>
          <Link href="/about#contact" className="secondary-button">Let&apos;s talk <ArrowUpRight size={20} aria-hidden="true" /></Link>
        </aside>
      </div>
      <SignatureFooter />
    </main>
  );
}
