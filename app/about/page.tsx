import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Asterisk, GraduationCap, MapPin, Sparkles } from "lucide-react";
import Contact from "@/components/Contact";
import { SignatureFooter } from "@/components/SignatureFooter";
import { ExperienceLogo } from "@/components/ui/ExperienceLogo";
import { TechTags } from "@/components/ui/TechTags";
import { getPublicExperience, getPublicProfile, getPublicProjects } from "@/lib/cms/publicReads";
import { pageMetadata } from "@/lib/seo";
import { profile as staticProfile } from "@/src/data/profile";
import { skillCategories } from "@/src/data/skills";
import "@/components/about.css";

// Static at build time; admin CMS changes appear within five minutes (ISR).
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "About",
  description: "Meet Ayush Chougula, an AI Systems Engineer in Pune. Explore his approach, education, current focus, and ways to work together.",
  path: "/about",
});

const principles = [
  { title: "Start with the person.", copy: "I work backward from the user outcome: what should this make easier, and what does a useful result look like?" },
  { title: "Think through the whole system.", copy: "Interfaces, APIs, authentication, data flow, and deployment all belong in the same conversation." },
  { title: "Care about the messy edges.", copy: "Weak inputs, uncertain answers, latency, and fallback paths matter. I use evaluation and regression checks to make behavior easier to trust." },
];

const certifications = [
  { title: "AI for Everyone", provider: "DeepLearning.AI", date: "Feb 2025" },
  { title: "Programming in Python", provider: "Meta", date: "Feb 2025" },
  { title: "AWS Cloud Practitioner Cloud Quest", provider: "Amazon Web Services", date: "Jan 2024" },
  { title: "Computational Thinking for Problem Solving", provider: "Penn Engineering", date: "Dec 2023" },
];

const toolCategories = ["AI/LLM Systems", "Voice AI", "Backend", "Frontend", "Data/Vector Search"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Feb 2025" -> { month: "Feb", year: "2025", iso: "2025-02" } */
function parseMonthYear(value?: string) {
  const match = value?.trim().match(/^([A-Za-z]{3})[A-Za-z]*\.?\s+(\d{4})$/);
  if (!match) return undefined;
  const index = MONTHS.findIndex((month) => month.toLowerCase() === match[1].toLowerCase());
  if (index < 0) return undefined;
  return { month: MONTHS[index], monthName: MONTH_NAMES[index], year: match[2], iso: `${match[2]}-${String(index + 1).padStart(2, "0")}` };
}

/** "Aug 2023 - Jul 2027" -> display range with an en dash, plus the graduation month. */
function parseEducationTimeline(status?: string) {
  if (!status) return { range: undefined, graduation: undefined };
  const parts = status.split(/\s+[-–—]\s+/);
  return { range: parts.join(" – "), graduation: parseMonthYear(parts[parts.length - 1]) };
}

export default async function AboutPage() {
  const [profileResult, experienceResult, projectsResult] = await Promise.all([
    getPublicProfile(),
    getPublicExperience(),
    getPublicProjects(),
  ]);
  const profile = profileResult.data;
  const experience = experienceResult.data;
  const projects = projectsResult.data;

  const firstName = profile.firstName || profile.fullName.split(" ")[0];
  const photoSrc = profile.profilePhoto || "/profile.png";
  const isRemotePhoto = /^https?:\/\//.test(photoSrc);
  const currentRole = experience.find((item) => /present/i.test(item.period));

  const education = profile.education;
  const cgpa = education?.cgpa ?? staticProfile.education?.cgpa;
  const [cgpaScore, cgpaScale] = (cgpa ?? "").split("/").map((part) => part.trim());
  const { range: educationRange, graduation } = parseEducationTimeline(education?.status);

  const stats = [
    { value: String(projects.length), label: "projects & counting", tone: "coral" },
    { value: String(experience.length), label: "roles so far", tone: "yellow" },
    cgpaScore ? { value: cgpaScore, label: cgpaScale ? `CGPA out of ${cgpaScale}` : "CGPA", tone: "lilac" } : null,
    graduation ? { value: graduation.year, label: "graduating class", tone: "lilac" } : null,
  ].filter((stat): stat is { value: string; label: string; tone: string } => Boolean(stat));

  const tools = toolCategories
    .map((name) => skillCategories.find((category) => category.name === name))
    .filter((category): category is (typeof skillCategories)[number] => Boolean(category));

  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-heading">
        <div className="portfolio-wrap">
          <Link href="/" className="about-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
          <div className="about-hero__grid">
            <div className="about-hero__copy">
              <h1 id="about-heading">Hi, I’m <mark className="about-mark">{firstName}.</mark></h1>
              <p className="about-lead">I like turning a useful idea into a system people can actually use.</p>
              <div className="about-bio">
                <p>I’m {profile.fullName}, an {profile.role} based in {profile.locationShort}. I build across agentic workflows, RAG pipelines, voice AI, and full-stack products.</p>
                <p>At Quensulting AI LLP, I build voice agents and automation with Retell, Vapi, n8n, and FastAPI. Before that, I worked on agentic workflows and LLM evaluation at Persistent Systems.</p>
                <p>I balance my Computer Science degree at MIT ADT University with internships and freelance client work. I care about explainable engineering decisions, grounded AI outputs, and fallback paths that hold up when a dependency fails.</p>
              </div>
              <div className="about-actions">
                <a href="#contact" className="brutal-button">Say hello <ArrowDownRight size={20} aria-hidden="true" /></a>
                <Link href="/projects" className="text-link">Explore my work <ArrowUpRight size={17} aria-hidden="true" /></Link>
              </div>
            </div>

            <div className="about-portrait">
              <figure className="about-print">
                <div className="about-print__photo">
                  <Image
                    src={photoSrc}
                    alt={`Portrait of ${profile.fullName}`}
                    fill
                    sizes="(min-width: 1000px) 360px, (min-width: 700px) 38vw, 76vw"
                    priority
                    loading="eager"
                    fetchPriority="high"
                    unoptimized={isRemotePhoto}
                  />
                </div>
                <figcaption>
                  <strong>{profile.fullName}</strong>
                  <span><MapPin size={14} aria-hidden="true" /> {profile.locationShort}</span>
                </figcaption>
              </figure>
              {currentRole ? (
                <p className="about-sticker"><span className="about-sticker__dot" aria-hidden="true" /> Now at {currentRole.company}</p>
              ) : null}
            </div>
          </div>

          {stats.length ? (
            <dl className="about-stats" aria-label="At a glance">
              {stats.map((stat) => (
                <div key={stat.label} className={`about-stat about-stat--${stat.tone}`}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <section className="about-band" aria-labelledby="principles-heading">
        <div className="portfolio-wrap">
          <div className="about-heading">
            <h2 id="principles-heading">How I think<span className="accent-period">.</span></h2>
            <p>A few things I bring to every build.</p>
          </div>
          <ol className="about-principles reveal">
            {principles.map((principle, index) => (
              <li key={principle.title} className="about-principle">
                <span className="about-principle__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-section" aria-label="Education and current interests">
        <div className="portfolio-wrap about-split">
          {education?.institution ? (
            <article className="ink-card tone-lilac about-education reveal" aria-labelledby="education-heading">
              <p className="about-card-label"><GraduationCap size={18} aria-hidden="true" /> Still learning. Always building.</p>
              <h2 id="education-heading">{education.institution}</h2>
              {education.degree ? <p className="about-education__degree">{education.degree}</p> : null}
              <dl className="about-education__facts">
                {cgpa ? <div><dt>CGPA</dt><dd>{cgpa}</dd></div> : null}
                {educationRange ? <div><dt>Timeline</dt><dd>{educationRange}</dd></div> : null}
                {education.location ? <div><dt>Location</dt><dd>{education.location}</dd></div> : null}
              </dl>
              {graduation ? <p className="about-education__stamp">Graduating {graduation.monthName} {graduation.year}</p> : null}
            </article>
          ) : null}

          {profile.currentFocus.length ? (
            <aside className="about-curious reveal" aria-labelledby="curious-heading">
              <div className="ink-card tone-sage about-curious__note">
                <Sparkles size={24} aria-hidden="true" />
                <h2 id="curious-heading">Currently curious about</h2>
                <ul>
                  {profile.currentFocus.map((focus) => <li key={focus}>{focus}</li>)}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>
      </section>

      <section className="about-band" aria-labelledby="certifications-heading">
        <div className="portfolio-wrap">
          <div className="about-heading">
            <h2 id="certifications-heading">Learning beyond the build<span className="accent-period">.</span></h2>
            <p>Courses that support the practical work.</p>
          </div>
          <ol className="about-certs reveal">
            {certifications.map((certification) => {
              const date = parseMonthYear(certification.date);
              return (
                <li key={certification.title} className="about-cert">
                  <span className="about-cert__stub">
                    {date ? (
                      <time dateTime={date.iso}><span>{date.month}</span> <span>{date.year}</span></time>
                    ) : (
                      <span>{certification.date}</span>
                    )}
                  </span>
                  <div className="about-cert__body">
                    <h3>{certification.title}</h3>
                    <p><span className="visually-hidden">Offered by </span>{certification.provider}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="about-section" aria-label="Tools and experience">
        <div className="portfolio-wrap about-split about-split--even">
          <div className="about-tools reveal">
            <h2 id="tools-heading">Tools I reach for<span className="accent-period">.</span></h2>
            <ul className="about-tools__rows" aria-labelledby="tools-heading">
              {tools.map((category) => (
                <li key={category.name}>
                  <h3>{category.name}</h3>
                  <TechTags items={category.skills} max={5} label={`${category.name} tools`} />
                </li>
              ))}
            </ul>
            <Link href="/skills" className="text-link">Explore all skills <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>

          {experience.length ? (
            <div className="ink-card about-experience reveal">
              <div className="tone-block tone-yellow about-experience__head">
                <h2 id="experience-heading">Where I’ve worked.</h2>
                <span className="about-experience__count">{String(experience.length).padStart(2, "0")} roles</span>
              </div>
              <ol className="about-experience__list" aria-labelledby="experience-heading">
                {experience.map((item) => {
                  const isCurrent = /present/i.test(item.period);
                  return (
                    <li key={item.id ?? `${item.company}-${item.period}`}>
                      <ExperienceLogo company={item.company} logo={item.companyLogo} size={44} tone="yellow" />
                      <div className="about-experience__text">
                        <h3>{item.company}</h3>
                        <p>{item.role}</p>
                      </div>
                      <p className="about-experience__period">
                        {isCurrent ? <span className="about-experience__now">Now</span> : null}
                        {item.period}
                      </p>
                    </li>
                  );
                })}
              </ol>
              <div className="about-experience__foot">
                <Link href="/#experience" className="text-link">See the full journey <ArrowUpRight size={17} aria-hidden="true" /></Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {profile.engineeringStyle.length ? (
        <section className="about-section about-philosophy" aria-labelledby="philosophy-heading">
          <div className="portfolio-wrap">
            <div className="ink-card about-philosophy__card reveal">
              <div className="about-philosophy__intro">
                <Asterisk size={48} strokeWidth={1.75} aria-hidden="true" />
                <h2 id="philosophy-heading">How I like to build<span className="accent-period">.</span></h2>
                <p>The defaults I bring to a new project, whatever the stack.</p>
              </div>
              <ul className="about-philosophy__list">
                {profile.engineeringStyle.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section className="tone-block tone-lilac about-next" aria-labelledby="next-heading">
        <div className="portfolio-wrap about-next__grid">
          <div>
            <h2 id="next-heading">A good next chapter.</h2>
            {profile.availability ? <p className="about-next__lead">{profile.availability}</p> : null}
            <div className="about-actions">
              <a href="#contact" className="brutal-button">Say hello <ArrowDownRight size={20} aria-hidden="true" /></a>
              <Link href={profile.resumePath} className="text-link">Take a look at my resume <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
          {profile.preferredRoles.length ? (
            <div className="about-next__roles">
              <h3 id="roles-heading">Roles I’m looking for</h3>
              <ul aria-labelledby="roles-heading">
                {profile.preferredRoles.map((role) => <li key={role}>{role}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <Contact profile={profile} />
      <SignatureFooter />
    </main>
  );
}
