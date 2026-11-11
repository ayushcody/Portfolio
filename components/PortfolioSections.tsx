import Link from 'next/link';
import { ArrowUpRight, Asterisk, BookOpen, Send, Sparkles } from 'lucide-react';
import type { ProjectWithMedia } from '@/src/data/projectSchema';
import { getFeaturedProjects, getProjects, getSkillGroups } from '@/lib/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import type { Profile } from '@/src/data/profile';
import type { BlogPost } from '@/lib/markdown';
import { formatPostDate } from '@/lib/postFormat';

// Two columns inside the 1160px wrap from 700px, one below.
const CARD_SIZES = '(min-width: 1256px) 564px, (min-width: 700px) calc(50vw - 80px), calc(100vw - 40px)';

export function SelectedWork({ projects = getFeaturedProjects() }: { projects?: ProjectWithMedia[] }) {
    const total = getProjects().length;
    return (
        <section id="projects" className="portfolio-section portfolio-wrap" aria-labelledby="work-heading">
            <div className="section-heading">
                <div>
                    <h2 id="work-heading">Ideas, made real<span className="accent-period">.</span></h2>
                    <p>The builds I’d show you first. Each one opens into a case study: the problem, the architecture, and what it does.</p>
                </div>
                <Link className="text-link" href="/projects">All {total} projects <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
            <ul className="pgrid pgrid--two selected-work-grid">
                {projects.map((project) => (
                    <li key={project.slug}><ProjectCard project={project} sizes={CARD_SIZES} /></li>
                ))}
            </ul>
            <p className="work-footnote">
                <Asterisk size={22} aria-hidden="true" />
                <span>Curious how I get from “what if?” to “it works”?</span>
                <Link href="/about" className="text-link">How I approach a build <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </p>
        </section>
    );
}

export function Toolkit({ profile }: { profile: Profile }) {
    const groups = getSkillGroups().filter((group) => group.specialty);
    return (
        <section id="skills" className="portfolio-section portfolio-wrap toolkit-layout" aria-labelledby="toolkit-heading">
            <div>
                <h2 id="toolkit-heading">A practical toolkit<span className="accent-period">.</span></h2>
                <p className="section-description">Grouped by what I use it for, and linked to the projects that prove it.</p>
                <Link href="/skills" className="text-link">Explore all skills <ArrowUpRight size={18} aria-hidden="true" /></Link>
                <div className="learning-note"><Sparkles size={23} aria-hidden="true" /><div><strong>Currently curious about</strong><p>{profile.currentFocus.slice(0, 3).join(', ')}.</p></div></div>
            </div>
            <div className="toolkit-rows">
                {groups.map((group) => (
                    <div key={group.id}>
                        <h3><Link href={`/skills#${group.id}`}>{group.name}</Link></h3>
                        <p>{group.tools.slice(0, 7).join(' / ')}</p>
                        {group.projects.length > 0 ? (
                            <p className="toolkit-proof">Proven in {group.projects.slice(0, 3).map((project) => project.title).join(', ')}{group.projects.length > 3 ? ` and ${group.projects.length - 3} more` : ''}.</p>
                        ) : null}
                    </div>
                ))}
            </div>
        </section>
    );
}

export function WritingNote({ posts }: { posts: BlogPost[] }) {
    const latest = posts.slice(0, 3);
    if (latest.length === 0) return null;
    return <section id="blog" className="portfolio-wrap writing-section" aria-labelledby="writing-heading"><div className="writing-heading"><BookOpen size={28} aria-hidden="true" /><h2 id="writing-heading">Notes from the process.</h2></div>{latest.map(post => <Link key={post.slug} className="writing-link" href={`/blog/${post.slug}`}><div><span className="writing-meta">{post.readingTime} <span>·</span> {formatPostDate(post.date)}</span><h3>{post.title}</h3><p>{post.description}</p></div><ArrowUpRight size={32} aria-hidden="true" /></Link>)}<Link href="/blog" className="text-link writing-all">Read all my blogs <ArrowUpRight size={18} aria-hidden="true" /></Link></section>;
}

export function ContactInvitation({ profile }: { profile: Profile }) {
    return <section id="contact" className="contact-invitation"><div className="portfolio-wrap"><div><h2>Good things start<br />with a conversation<span>.</span></h2><p>{profile.availability}</p><a href={`mailto:${profile.email}`} className="brutal-button">Let’s talk <Send size={18} aria-hidden="true" /></a><Link href="/about#contact" className="text-link">More ways to connect <ArrowUpRight size={17} aria-hidden="true" /></Link></div><Asterisk className="contact-asterisk" aria-hidden="true" /></div></section>;
}
