import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SignatureFooter } from '@/components/SignatureFooter';
import { PostIndex } from '@/components/blog/PostIndex';
import { formatPostDate, getBlogPosts, type BlogPostSummary } from '@/lib/markdown';
import { pageMetadata } from '@/lib/seo';
import '@/components/secondary-pages.css';
import '@/components/editorial.css';

const DESCRIPTION = 'Plain-English writing on GenAI, RAG, agents and MCP, plus build notes from the projects I ship.';

export const metadata = pageMetadata({
    title: 'Blog',
    description: DESCRIPTION,
    path: '/blog',
});

const FEATURED_TONES = ['tone-yellow', 'tone-lilac', 'tone-coral'];

export default function BlogIndex() {
    // The client-side index only needs summaries; keep post bodies out of the page payload.
    const posts: BlogPostSummary[] = getBlogPosts().map((post) => {
        const summary: Partial<typeof post> = { ...post };
        delete summary.content;
        return summary as BlogPostSummary;
    });
    const featured = posts.filter((post) => post.featured).slice(0, 3);

    return (
        <main className="secondary-page editorial-page">
            <div className="secondary-shell">
                <header className="secondary-intro">
                    <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
                    <h1>Notes from the <span className="secondary-highlight secondary-highlight-lilac">process.</span></h1>
                    <p className="secondary-lead">{DESCRIPTION} Fewer buzzwords, more diagrams, and the occasional meme when a point needs one.</p>
                </header>

                {posts.length === 0 ? (
                    <p className="state-note post-empty">
                        <span>
                            <strong>No posts published yet.</strong> In the meantime, the <Link href="/projects">project case studies</Link> cover how things were built.
                        </span>
                    </p>
                ) : (
                    <>
                        {featured.length > 0 ? (
                            <section className="post-featured" aria-labelledby="featured-heading">
                                <div className="secondary-section-heading">
                                    <h2 id="featured-heading">Start here</h2>
                                    <p>Three posts that show how I think and write.</p>
                                </div>
                                <ul className="post-featured-grid">
                                    {featured.map((post, index) => (
                                        <li key={post.slug}>
                                            <Link href={`/blog/${post.slug}`} className={`ink-card ink-card--interactive post-featured-card ${FEATURED_TONES[index % FEATURED_TONES.length]}`}>
                                                <span className="post-featured-meta">
                                                    <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingTime}
                                                </span>
                                                <strong>{post.title}</strong>
                                                <span className="post-featured-description">{post.description}</span>
                                                <span className="post-featured-cta">Read <ArrowUpRight size={16} aria-hidden="true" /></span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ) : null}

                        <section aria-labelledby="posts-heading" className="post-archive">
                            <div className="secondary-section-heading">
                                <h2 id="posts-heading">
                                    All writing <span className="secondary-count">{String(posts.length).padStart(2, '0')}</span>
                                </h2>
                                <p>Newest first. Filter by topic.</p>
                            </div>
                            <PostIndex posts={posts} />
                        </section>
                    </>
                )}

                <aside className="secondary-closing editorial-closing" aria-labelledby="blog-closing">
                    <h2 id="blog-closing">Rather see it built?</h2>
                    <Link href="/projects" className="brutal-button">Explore my work <ArrowUpRight size={18} aria-hidden="true" /></Link>
                </aside>
            </div>
            <SignatureFooter />
        </main>
    );
}
