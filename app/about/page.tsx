import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Contact from "@/components/Contact";
import { SignatureFooter } from "@/components/SignatureFooter";
import { profile } from "@/src/data/profile";
import "@/components/secondary-pages.css";

export const metadata = {
  title: "About",
  description: "Meet Ayush Chougula, an AI Systems Engineer in Pune. Explore his approach, education, current focus, and ways to work together.",
};

const principles = [
  { title: "Start with the person.", copy: "I work backward from the user outcome: what should this make easier, and what does a useful result look like?" },
  { title: "Think through the whole system.", copy: "Interfaces, APIs, authentication, data flow, and deployment all belong in the same conversation." },
  { title: "Care about the messy edges.", copy: "Weak inputs, uncertain answers, latency, and fallback paths matter. I use evaluation and regression checks to make behavior easier to trust." },
];

export default function AboutPage() {
  const isRemotePhoto = /^https?:\/\//.test(profile.profilePhoto);

  return (
    <main className="secondary-page">
      <div className="secondary-shell">
        <header className="secondary-intro">
          <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
          <div className="secondary-about-layout">
            <div>
              <h1>Hi, I&apos;m <span className="secondary-highlight secondary-highlight-lilac">Ayush.</span></h1>
              <p className="secondary-lead">I like turning a useful idea into a system people can actually use.</p>
              <div className="secondary-bio">
                <p>I&apos;m {profile.fullName}, an {profile.role} based in {profile.locationShort}. I build across agentic workflows, RAG pipelines, voice AI, and full-stack products.</p>
                <p>At Quensulting AI LLP, I build voice agents and automation with Retell, Vapi, n8n, and FastAPI. Before that, I worked on agentic workflows and LLM evaluation at Persistent Systems.</p>
                <p>I balance my Computer Science degree at MIT ADT University with internships and freelance client work. I care about explainable engineering decisions, grounded AI outputs, and fallback paths that hold up when a dependency fails.</p>
              </div>
              <a href="#contact" className="secondary-button">Say hello <ArrowUpRight size={20} aria-hidden="true" /></a>
            </div>
            <figure className="secondary-portrait">
              <div className="secondary-portrait-image">
                <Image src={profile.profilePhoto} alt="Ayush Chougula" fill sizes="(min-width: 900px) 400px, (min-width: 600px) 420px, 90vw" className="secondary-photo" priority loading="eager" fetchPriority="high" unoptimized={isRemotePhoto} />
              </div>
              <figcaption><strong>Ayush Chougula</strong><span>Pune, India ↗</span></figcaption>
            </figure>
          </div>
        </header>

        <section className="secondary-principles" aria-labelledby="principles-heading">
          <div className="secondary-section-heading">
            <h2 id="principles-heading">How I think.</h2>
            <p>A few things I bring to every build.</p>
          </div>
          <div className="secondary-principle-list">
            {principles.map((principle, index) => (
              <article key={principle.title}>
                <span className="secondary-row-number" aria-hidden="true">0{index + 1}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="secondary-about-notes" aria-label="Education and current interests">
          <div className="secondary-education">
            <span className="secondary-note-label">Still learning. Always building.</span>
            <h2>{profile.education?.institution}</h2>
            <p>{profile.education?.degree}</p>
            <p>CGPA: {profile.education?.cgpa} · Graduating July 2027</p>
            <p className="secondary-meta">{profile.education?.status} <span aria-hidden="true">/</span> {profile.education?.location}</p>
          </div>
          <div className="secondary-current-focus">
            <h2>Currently curious about</h2>
            <ul>{profile.currentFocus.map((focus) => <li key={focus}>{focus}<ArrowUpRight size={18} aria-hidden="true" /></li>)}</ul>
          </div>
        </section>

        <section className="secondary-principles" aria-labelledby="certifications-heading">
          <div className="secondary-section-heading"><h2 id="certifications-heading">Learning beyond the build.</h2><p>Courses that support the practical work.</p></div>
          <div className="secondary-principle-list">
            {[
              ['AI for Everyone', 'DeepLearning.AI', 'Feb 2025'],
              ['Programming in Python', 'Meta', 'Feb 2025'],
              ['AWS Cloud Practitioner Cloud Quest', 'Amazon Web Services', 'Jan 2024'],
              ['Computational Thinking for Problem Solving', 'Penn Engineering', 'Dec 2023'],
            ].map(([title, provider, date], index) => <article key={title}><span className="secondary-row-number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{provider} · {date}</p></article>)}
          </div>
        </section>

        <section className="secondary-opportunities" aria-labelledby="opportunities-heading">
          <h2 id="opportunities-heading">A good next chapter.</h2>
          <div>
            <p>{profile.availability}</p>
            <ul>{profile.preferredRoles.map((role) => <li key={role}>{role}</li>)}</ul>
            <Link href={profile.resumePath} className="secondary-text-link">Take a look at my resume <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>
      </div>

      <div className="secondary-contact"><Contact /></div>
      <SignatureFooter />
    </main>
  );
}
