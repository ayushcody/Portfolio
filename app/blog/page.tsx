import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SignatureFooter } from '@/components/SignatureFooter';
import { PostIndex } from '@/components/blog/PostIndex';
import { getBlogPosts, type BlogPostSummary } from '@/lib/markdown';
import { pageMetadata } from '@/lib/seo';
import '@/components/secondary-pages.css';
import '@/components/editorial.css';

const DESCRIPTION = 'What I keep learning about GenAI, RAG, agents and MCP, and notes from the things I build.';

export const metadata = pageMetadata({
    title: 'Blog',
    description: DESCRIPTION,
    path: '/blog',
});

export default function BlogIndex() {
    // The client-side index only needs summaries; keep post bodies out of the page payload.
    const posts: BlogPostSummary[] = getBlogPosts().map((post) => {
        const summary: Partial<typeof post> = { ...post };
        delete summary.content;
        return summary as BlogPostSummary;
    });

    return (
        <main className="secondary-page editorial-page">
            <div className="secondary-shell">
                <header className="secondary-intro">
                    <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
                    <h1>Notes from the <span className="secondary-highlight secondary-highlight-lilac">process.</span></h1>
                    <p className="secondary-lead">{DESCRIPTION} I write when something finally clicks, or when something breaks in an interesting way.</p>
                </header>

                {posts.length === 0 ? (
                    <p className="state-note post-empty">
                        <span>
                            <strong>No posts published yet.</strong> In the meantime, the <Link href="/projects">project case studies</Link> cover how things were built.
                        </span>
                    </p>
                ) : (
                        <section aria-labelledby="posts-heading" className="post-archive">
                            <div className="secondary-section-heading">
                                <h2 id="posts-heading">
                                    All writing <span className="secondary-count">{String(posts.length).padStart(2, '0')}</span>
                                </h2>
                                <p>Newest first. Filter by topic.</p>
                            </div>
                            <PostIndex posts={posts} />
                        </section>
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
