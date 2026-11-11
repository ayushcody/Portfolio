import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { getSkillGroups, projectHref } from "@/lib/projects";
import { SignatureFooter } from "@/components/SignatureFooter";
import { pageMetadata } from "@/lib/seo";
import "@/components/secondary-pages.css";

export const metadata = pageMetadata({
  title: "Skills",
  description: "Ayush Chougula's toolkit, grouped by what he uses it for: voice agents, agentic workflows, RAG, LLM evaluation, document AI, local inference and full-stack product, each linked to the projects that prove it.",
  path: "/skills",
});

export default function SkillsPage() {
  const groups = getSkillGroups();

  return (
    <main className="secondary-page">
      <div className="secondary-shell">
        <header className="secondary-intro">
          <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
          <h1>The tools.<br />The <span className="secondary-highlight secondary-highlight-coral">proof.</span></h1>
          <p className="secondary-lead">Grouped by what I use them for. Every tool here appears in a project or a role, and each group links to the builds that show it.</p>
          <nav className="secondary-jump-links skills-jump" aria-label="Skill groups">
            {groups.map((group) => (
              <a key={group.id} href={`#${group.id}`}>{group.name} <ArrowRight size={15} aria-hidden="true" /></a>
            ))}
          </nav>
        </header>

        <div className="skill-groups">
          {groups.map((group, index) => (
            <section key={group.id} id={group.id} className={`skill-group skill-group--${index % 4}`} aria-labelledby={`${group.id}-heading`}>
              <div className="skill-group-head">
                <h2 id={`${group.id}-heading`}>{group.name}</h2>
                <p>{group.use}</p>
              </div>
              <div className="skill-group-body">
                <ul className="skill-tools" aria-label={`${group.name} tools`}>
                  {group.tools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>

                {group.projects.length > 0 || group.roles.length > 0 ? (
                  <div className="skill-proof">
                    <h3 className="skill-proof-title">Where it shows</h3>
                    <ul className="skill-proof-list">
                      {group.roles.map((role) => (
                        <li key={role.id}>
                          <Link href={`/#career-${role.id}`} className="skill-proof-link skill-proof-link--role">
                            <BriefcaseBusiness size={16} aria-hidden="true" />
                            <span><strong>{role.company}</strong><span className="skill-proof-kind">At work</span></span>
                            <ArrowUpRight size={16} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                      {group.projects.map((project) => (
                        <li key={project.slug}>
                          <Link href={projectHref(project.slug)} className="skill-proof-link">
                            <span className="skill-proof-dot" aria-hidden="true" />
                            <span><strong>{project.title}</strong><span className="skill-proof-kind">{project.category}</span></span>
                            <ArrowUpRight size={16} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <aside className="secondary-closing">
          <h2>See the thinking in action.</h2>
          <Link href="/projects" className="secondary-button">Explore my work <ArrowUpRight size={20} aria-hidden="true" /></Link>
        </aside>
      </div>
      <SignatureFooter />
    </main>
  );
}
