import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, MapPin } from "lucide-react";
import { SignatureFooter } from "@/components/SignatureFooter";
import { ExperienceLogo } from "@/components/ui/ExperienceLogo";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { TechTags } from "@/components/ui/TechTags";
import { getPublicExperience, getPublicProfile, getPublicProjects, type PublicExperience } from "@/lib/cms/publicReads";
import { pageMetadata } from "@/lib/seo";
import type { Project } from "@/src/data/projects";
import { skillCategories } from "@/src/data/skills";
import "@/components/secondary-pages.css";
import "@/components/editorial.css";

// Static at build time; admin CMS changes appear within five minutes (ISR).
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Resume",
  description:
    "Resume overview for Ayush Chougula, AI Systems Engineer focused on agentic AI, RAG systems, voice AI, and full-stack engineering.",
  path: "/resume",
});

const resumeCandidates = [
  { publicPath: "/resume.pdf", filePath: "resume.pdf" },
  { publicPath: "/Ayush_Chougula_Resume.pdf", filePath: "Ayush_Chougula_Resume.pdf" },
  { publicPath: "/Ayush-Chougula-Resume.pdf", filePath: "Ayush-Chougula-Resume.pdf" },
];

const coreStrengths = [
  "Agentic AI workflows",
  "RAG systems",
  "Voice AI agents",
  "Full-stack AI products",
  "Backend/API integrations",
  "AI infrastructure",
];

const logoTones = ["yellow", "lilac", "coral"] as const;

function getResumeAsset() {
  return resumeCandidates.find((candidate) => existsSync(join(process.cwd(), "public", candidate.filePath)));
}

function getExperienceBullets(exp: PublicExperience) {
  const source = exp.impact?.length ? exp.impact : exp.responsibilities;
  return source.slice(0, 2);
}

function getProjectSummary(project: Project) {
  return project.oneLine || project.summary || project.description;
}

/** "Aug 2023 - Jul 2027" -> "Aug 2023 – Jul 2027" (typographic dash only). */
function formatRange(value?: string) {
  return value?.replace(/\s+-\s+/g, " – ");
}

function RowHeading({ number, id, title, note }: { number: string; id: string; title: string; note?: string }) {
  return (
    <div className="resume-row-heading">
      <span className="secondary-row-number" aria-hidden="true">{number}</span>
      <h2 id={id}>{title}</h2>
      {note ? <p>{note}</p> : null}
    </div>
  );
}

export default async function ResumePage() {
  const resumeAsset = getResumeAsset();
  const [profileResult, experienceResult, projectsResult] = await Promise.all([
    getPublicProfile(),
    getPublicExperience(),
    getPublicProjects(),
  ]);
  const profile = profileResult.data;
  // Same selection as before: featured roles (newest first), featured non-archived projects by priority.
  const featuredExperience = experienceResult.data.filter((item) => item.featured).slice(0, 3);
  const featuredProjects = projectsResult.data.filter((project) => project.featured && !project.archived).slice(0, 3);
  const education = profile.education;
  const location = [profile.location, profile.timezone].filter(Boolean).join(" · ");

  return (
    <main className="secondary-page editorial-page">
      <div className="secondary-shell">
        <header className="secondary-intro resume-intro">
          <div>
            <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
            <h1>Resume, <span className="secondary-highlight resume-title-nowrap">at a glance.</span></h1>
            <p className="secondary-lead">A concise overview of my AI systems, full-stack engineering, and applied AI work.</p>
          </div>

          <section className="ink-card resume-file" aria-labelledby="resume-file-heading">
            <span className="eyebrow eyebrow--chip">Resume file</span>
            {resumeAsset ? (
              <>
                <h2 id="resume-file-heading">PDF resume is available.</h2>
                <p>Open it in the browser or download a copy directly.</p>
                <div className="editorial-actions">
                  <a href={resumeAsset.publicPath} className="brutal-button">
                    Open resume <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                  <a href={resumeAsset.publicPath} download className="brutal-button brutal-button--secondary">
                    Download resume <Download size={17} aria-hidden="true" />
                  </a>
                </div>
              </>
            ) : (
              <>
                <h2 id="resume-file-heading">Resume PDF is not uploaded yet.</h2>
                <p className="state-note">
                  <span>
                    Add it to <code>/public</code> and update the resume path in profile data. Until then, this page provides a structured resume overview without broken download links.
                  </span>
                </p>
              </>
            )}
          </section>
        </header>

        <div className="resume-sheet">
          <section className="resume-row" aria-labelledby="resume-snapshot">
            <RowHeading number="01" id="resume-snapshot" title="Hiring snapshot" />
            <div className="resume-row-content">
              <h3 className="resume-role">{profile.role}</h3>
              {profile.availability ? <p className="resume-body">{profile.availability}</p> : null}
              <dl className="resume-facts">
                {profile.preferredRoles.length ? (
                  <div>
                    <dt>Preferred roles</dt>
                    <dd><TechTags items={profile.preferredRoles} label="Preferred roles" className="tag-list--strong" /></dd>
                  </div>
                ) : null}
                {location ? (
                  <div>
                    <dt>Location</dt>
                    <dd className="resume-location"><MapPin size={16} aria-hidden="true" />{location}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </section>

          <section className="resume-row" aria-labelledby="resume-strengths">
            <RowHeading number="02" id="resume-strengths" title="Key strengths" note="Technical focus." />
            <div className="resume-row-content">
              <TechTags items={coreStrengths} label="Key strengths" className="tag-list--strong tag-list--large resume-strengths" />
            </div>
          </section>

          {featuredExperience.length ? (
            <section className="resume-row" aria-labelledby="resume-experience">
              <RowHeading number="03" id="resume-experience" title="Experience highlights" note="Most recent roles first." />
              <div className="resume-row-content">
                <ol className="resume-jobs">
                  {featuredExperience.map((exp, index) => (
                    <li className="resume-job" key={exp.id ?? `${exp.company}-${exp.period}`}>
                      <ExperienceLogo company={exp.company} logo={exp.companyLogo} size={52} tone={logoTones[index % logoTones.length]} />
                      <div>
                        <div className="resume-job-head">
                          <div>
                            <h3>{exp.company}</h3>
                            <p className="resume-job-role">{exp.role}</p>
                          </div>
                          <p className="resume-job-period">{exp.period}</p>
                        </div>
                        <ul className="resume-bullets">
                          {getExperienceBullets(exp).map((bullet) => <li key={bullet}>{bullet}</li>)}
                        </ul>
                        <TechTags items={exp.techStack} max={5} label={`${exp.company} technologies`} />
                      </div>
                    </li>
                  ))}
                </ol>
                <Link href="/#experience" className="secondary-text-link">
                  See the full journey <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </section>
          ) : null}

          {featuredProjects.length ? (
            <section className="resume-row" aria-labelledby="resume-projects">
              <RowHeading number="04" id="resume-projects" title="Project highlights" note="Featured builds, with case studies." />
              <div className="resume-row-content">
                <ul className="resume-projects">
                  {featuredProjects.map((project) => (
                    <li className="resume-project" key={project.id}>
                      <div>
                        <p className="secondary-meta">{project.category}</p>
                        <h3><Link href={`/projects/${project.id}`}>{project.title}</Link></h3>
                      </div>
                      <div>
                        <p className="resume-project-summary">{getProjectSummary(project)}</p>
                        <div className="resume-project-actions">
                          <Link href={`/projects/${project.id}`} className="secondary-text-link" aria-label={`Read the ${project.title} case study`}>
                            Read case study <ArrowRight size={17} aria-hidden="true" />
                          </Link>
                          <ProjectLinks project={project} variant="compact" max={3} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/projects" className="secondary-text-link">
                  All projects <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </section>
          ) : null}

          {education?.institution ? (
            <section className="resume-row" aria-labelledby="resume-education">
              <RowHeading number="05" id="resume-education" title="Education" />
              <div className="resume-row-content">
                <div className="ink-card tone-lilac resume-education">
                  <h3>{education.institution}</h3>
                  {education.degree ? <p>{education.degree}</p> : null}
                  {education.cgpa ? <p>CGPA {education.cgpa}</p> : null}
                  <p className="secondary-meta">
                    {formatRange(education.status)}
                    {education.status && education.location ? <span aria-hidden="true">/</span> : null}
                    {education.location}
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          <section className="resume-row" aria-labelledby="resume-skills">
            <RowHeading number="06" id="resume-skills" title="Skills summary" note="Grouped capabilities." />
            <div className="resume-row-content">
              <ul className="resume-skills">
                {skillCategories.map((skill) => (
                  <li key={skill.name}>
                    <h3>{skill.name}</h3>
                    <TechTags items={skill.skills} max={4} label={`${skill.name} tools`} />
                  </li>
                ))}
              </ul>
              <Link href="/skills" className="secondary-text-link">
                See the full toolkit <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>

        <aside className="secondary-closing editorial-closing" aria-labelledby="resume-closing">
          <div>
            <h2 id="resume-closing">Want to go deeper?</h2>
            <p className="editorial-closing-copy">
              Review the case studies or reach out directly for internship, full-stack, backend, or applied AI opportunities.
            </p>
          </div>
          <div className="editorial-actions">
            <Link href="/#contact" className="brutal-button">Contact me <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link href="/projects" className="brutal-button brutal-button--secondary">View projects <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>
      <SignatureFooter />
    </main>
  );
}
