import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Asterisk, BookOpen, Braces, Check, FileText, GitBranch, Github, Mail, Scale, Search, Send, Sparkles } from 'lucide-react';
import { projectsData, type Project } from '@/src/data/projects';
import { skillCategories } from '@/src/data/skills';
import type { Profile } from '@/src/data/profile';
import type { BlogPost } from '@/lib/markdown';

const projectNotes: Record<string, string> = {
    'email-digital-twin': 'Email drafts that sound a little more like you.',
    andhakaanun: 'Two sides of an argument. Grounded in Indian law.',
    dsakarle: 'Making algorithms click, one visual step at a time.',
    'research-saathi': 'A research companion that connects the dots.',
};

function ProjectVisual({ project, index }: { project: Project; index: number }) {
    return (
        <div className={`project-visual project-visual-${index % 4}`} aria-label={`${project.title} workflow illustration`} role="img">
            <div className="visual-caption"><span>{project.category}</span><span>{project.status}</span></div>
            {index % 4 === 0 ? <div className="email-diagram"><div className="diagram-sheet"><Mail size={25} /><span>Your writing style</span><div className="diagram-lines"><i /><i /><i /></div></div><ArrowRight className="diagram-arrow" /><div className="diagram-sheet draft-sheet"><Sparkles size={25} /><span>A draft that fits.</span><div className="diagram-lines"><i /><i /><i /></div><span className="diagram-check"><Check size={12} /> Ready to review</span></div></div> : null}
            {index % 4 === 1 ? <div className="law-diagram"><Scale size={52} strokeWidth={1.5} /><div className="law-branches"><span>Prosecution</span><span>Defense</span></div><div className="law-source"><BookOpen size={15} /> Shared context. Cited sources.</div></div> : null}
            {index % 4 === 2 ? <div className="algorithm-diagram"><div className="algorithm-bars">{[36, 60, 46, 82, 100, 118].map((height, i) => <span key={i} style={{ height }} className={i > 3 ? 'is-sorted' : ''}>{[2, 4, 3, 6, 8, 9][i]}</span>)}</div><div className="algorithm-caption"><Braces size={17} /><span>Understand the why.</span><span className="diagram-play"><ArrowRight size={15} /></span></div></div> : null}
            {index % 4 === 3 ? <div className="research-diagram"><div className="research-input"><Search size={17} /> One good question</div><div className="research-agents"><span><FileText size={21} /> Retrieve</span><span><GitBranch size={21} /> Reason</span><span><Check size={21} /> Verify</span></div><div className="research-output">A connected answer <ArrowUpRight size={17} /></div></div> : null}
        </div>
    );
}

export function SelectedWork({ projects: allProjects = projectsData }: { projects?: Project[] }) {
    const projects = allProjects.filter(project => project.featured && project.showOnHome && !project.archived).slice(0, 4);
    return (
        <section id="projects" className="portfolio-section portfolio-wrap" aria-labelledby="work-heading">
            <div className="section-heading"><div><h2 id="work-heading">Ideas, made real<span className="accent-period">.</span></h2><p>A few things I’ve built. The thinking behind them, too.</p></div><Link className="text-link" href="/projects">All projects <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
            <div className="selected-work-grid">{projects.map((project, index) => <article className="work-card" key={project.id}>
                <Link href={`/projects/${project.id}`} tabIndex={-1} aria-hidden="true" className="project-art-link"><ProjectVisual project={project} index={index} /></Link>
                <div className="work-card-content"><div className="work-title"><h3><Link href={`/projects/${project.id}`}>{project.title}</Link></h3><ArrowUpRight size={26} aria-hidden="true" /></div><p>{projectNotes[project.id] || project.oneLine || project.summary}</p><p className="work-contribution">{project.myRole}</p><ul className="work-technologies" aria-label="Technologies">{project.techStack.slice(0, 4).map(tech => <li key={tech}>{tech}</li>)}</ul><div className="work-card-links"><Link href={`/projects/${project.id}`} className="text-link" aria-label={`Explore ${project.title}`}>Explore the build <ArrowRight size={17} aria-hidden="true" /></Link>{project.links.github ? <a href={project.links.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source on GitHub`}><Github size={19} aria-hidden="true" /></a> : null}</div></div>
            </article>)}</div>
        </section>
    );
}

const process = [
    ['Start with the person.', 'What are they trying to do? I define the useful outcome, the constraints, and the ways things could go wrong.'],
    ['Make the system make sense.', 'I map the data, service boundaries, model responsibilities, and fallback paths before connecting the pieces.'],
    ['Build the whole path.', 'Interface, APIs, auth, retrieval, and storage. I like making the parts work together as one product.'],
    ['Try to break it. Then improve it.', 'Weak inputs, uncertain answers, latency, and regressions all belong in the evaluation loop.'],
    ['Ship, listen, repeat.', 'Start with a useful version, observe real behavior, and let what I learn shape the next iteration.'],
];

export function WorkingStyle() {
    return <section id="approach" className="approach-section"><div className="portfolio-wrap approach-layout"><div className="approach-intro"><Asterisk size={58} strokeWidth={1.5} aria-hidden="true" /><h2>Curious by default.<br />Thoughtful by design.</h2><p>I like the space between “what if?” and “it works.” Here’s how I get from one to the other.</p><Link className="text-link" href="/about">Get to know me <ArrowUpRight size={18} aria-hidden="true" /></Link></div><ol className="process-list">{process.map(([title, description], index) => <li key={title}><span className="process-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div></section>;
}

export function Toolkit({ profile }: { profile: Profile }) {
    return <section id="skills" className="portfolio-section portfolio-wrap toolkit-layout"><div><h2>A practical toolkit<span className="accent-period">.</span></h2><p className="section-description">The right tool for the problem, with room to keep learning.</p><Link href="/skills" className="text-link">Explore all skills <ArrowUpRight size={18} aria-hidden="true" /></Link><div className="learning-note"><Sparkles size={23} aria-hidden="true" /><div><strong>Currently curious about</strong><p>{profile.currentFocus.slice(0, 3).join(', ')}.</p></div></div></div><div className="toolkit-rows">{skillCategories.filter(category => ['AI/LLM Systems', 'Voice AI', 'Backend', 'Frontend'].includes(category.name)).map(category => <div key={category.name}><h3>{category.name}</h3><p>{category.skills.join(' / ')}</p></div>)}</div></section>;
}

export function WritingNote({ posts }: { posts: BlogPost[] }) {
    const post = posts[0];
    if (!post) return null;
    return <section id="blog" className="portfolio-wrap writing-section" aria-labelledby="writing-heading"><div className="writing-heading"><BookOpen size={28} aria-hidden="true" /><h2 id="writing-heading">Notes from the process.</h2></div><Link className="writing-link" href={`/blog/${post.slug}`}><div><span className="writing-meta">{post.readingTime} <span>·</span> {post.date}</span><h3>{post.title}</h3><p>{post.description}</p></div><ArrowUpRight size={32} aria-hidden="true" /></Link></section>;
}

export function ContactInvitation({ profile }: { profile: Profile }) {
    return <section id="contact" className="contact-invitation"><div className="portfolio-wrap"><div><h2>Good things start<br />with a conversation<span>.</span></h2><p>{profile.availability}</p><a href={`mailto:${profile.email}`} className="brutal-button">Let’s talk <Send size={18} aria-hidden="true" /></a><Link href="/about#contact" className="text-link">More ways to connect <ArrowUpRight size={17} aria-hidden="true" /></Link></div><Asterisk className="contact-asterisk" aria-hidden="true" /></div></section>;
}
