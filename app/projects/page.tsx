import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { categorySlug, getCategoryCounts, getProjectsForIndex } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { SignatureFooter } from "@/components/SignatureFooter";
import "@/components/secondary-pages.css";
import "@/components/projects.css";

export const metadata = pageMetadata({
  title: "Projects",
  description: "Explore Ayush Chougula's AI projects, developer tools, and experiments, with architecture and implementation notes.",
  path: "/projects",
});

// Three columns from 1100px, two from 700px, one below (see .pgrid in projects.css).
const CARD_SIZES = "(min-width: 1240px) 370px, (min-width: 1100px) calc((100vw - 160px) / 3), (min-width: 700px) calc((100vw - 96px) / 2), calc(100vw - 40px)";

export default function ProjectsPage() {
  const projects = getProjectsForIndex();
  const categories = getCategoryCounts(projects).map(({ category, count }) => ({ id: categorySlug(category), label: category, count }));

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
          <p className="secondary-lead">Voice agents, RAG and document AI, agentic workflows, and the products around them. Each card opens a case study with the architecture and what it does.</p>
        </header>

        {projects.length > 0 ? (
          <section className="projects-index" aria-label="All projects">
            <ProjectFilter categories={categories} total={projects.length}>
              {projects.map((project, index) => (
                <li key={project.slug} data-category={categorySlug(project.category)} style={{ "--vt": `pcard-${project.slug}` } as CSSProperties}>
                  <ProjectCard project={project} sizes={CARD_SIZES} eager={index < 3} headingLevel={2} />
                </li>
              ))}
            </ProjectFilter>
          </section>
        ) : (
          <div className="state-note projects-empty" role="status">
            <div>
              <p><strong>No projects to show just yet.</strong></p>
              <p>Case studies are being updated. <Link href="/about#contact">Get in touch</Link> if you&apos;d like to hear about recent work.</p>
            </div>
          </div>
        )}

        <aside className="secondary-closing">
          <h2>Have a good problem?</h2>
          <Link href="/about#contact" className="secondary-button">Let&apos;s talk <ArrowUpRight size={20} aria-hidden="true" /></Link>
        </aside>
      </div>
      <SignatureFooter />
    </main>
  );
}
