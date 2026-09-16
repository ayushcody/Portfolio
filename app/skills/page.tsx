import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { skillCategories } from "@/src/data/skills";
import { SignatureFooter } from "@/components/SignatureFooter";
import { pageMetadata } from "@/lib/seo";
import "@/components/secondary-pages.css";

export const metadata = pageMetadata({
  title: "Skills",
  description: "Ayush Chougula's practical toolkit for AI systems, backend engineering, frontend development, retrieval, cloud, voice AI, and security.",
  path: "/skills",
});

const workflows = [
  { title: "Ground an AI answer.", copy: "Ingest documents, build a retrieval path, pass useful context to the model, then evaluate the result.", project: "See AndhaKaanun", href: "/projects/andhakaanun" },
  { title: "Connect the whole product.", copy: "Bring the interface, APIs, auth, data, and AI provider together in one usable flow.", project: "See Email Digital Twin", href: "/projects/email-digital-twin" },
  { title: "Make the next version better.", copy: "Compare prompts, check structured outputs, and catch regressions before they become product behavior.", project: "See LLM Evaluation Framework", href: "/projects/llm-evaluation-framework" },
];

export default function SkillsPage() {
  return (
    <main className="secondary-page">
      <div className="secondary-shell">
        <header className="secondary-intro">
          <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
          <h1>The tools.<br />The <span className="secondary-highlight secondary-highlight-coral">thinking.</span></h1>
          <p className="secondary-lead">A practical toolkit for taking an AI idea from interface to infrastructure.</p>
        </header>

        <section className="secondary-skills-index" aria-label="Skills grouped by how I use them">
          {skillCategories.map((category, index) => (
            <article className="secondary-skill-row" key={category.name}>
              <div className="secondary-skill-heading">
                <span className="secondary-row-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h2>{category.name}</h2>
                <p>{category.summary}</p>
              </div>
              <div className="secondary-skill-content">
                <ul className="secondary-tool-list" aria-label={`${category.name} tools`}>
                  {category.skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
                <p className="secondary-note-label">What I use them for</p>
                <ul className="secondary-use-cases">
                  {category.useCases.map((useCase) => <li key={useCase}><ArrowRight size={15} aria-hidden="true" />{useCase}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="secondary-workflows" aria-labelledby="workflows-heading">
          <div className="secondary-section-heading">
            <h2 id="workflows-heading">Better together.</h2>
            <p>Here&apos;s what those tools look like in practice.</p>
          </div>
          <div className="secondary-workflow-grid">
            {workflows.map((workflow, index) => (
              <article key={workflow.title}>
                <span className="secondary-workflow-number" aria-hidden="true">0{index + 1}</span>
                <h3>{workflow.title}</h3>
                <p>{workflow.copy}</p>
                <Link href={workflow.href} className="secondary-text-link">{workflow.project}<ArrowUpRight size={18} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>

        <aside className="secondary-closing">
          <h2>See the thinking in action.</h2>
          <Link href="/projects" className="secondary-button">Explore my work <ArrowUpRight size={20} aria-hidden="true" /></Link>
        </aside>
      </div>
      <SignatureFooter />
    </main>
  );
}
