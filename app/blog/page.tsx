import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SignatureFooter } from '@/components/SignatureFooter';
import { TechTags } from '@/components/ui/TechTags';
import { formatPostDate, getBlogPosts } from '@/lib/markdown';
import { pageMetadata } from '@/lib/seo';
import '@/components/secondary-pages.css';
import '@/components/editorial.css';

export const metadata = pageMetadata({
    title: 'Writing',
    description: 'Notes on building AI systems, developer tools, and credible engineering portfolios.',
    path: '/blog',
});

export default function BlogIndex() {
    const posts = getBlogPosts();

    return (
        <main className="secondary-page editorial-page">
            <div className="secondary-shell">
                <header className="secondary-intro">
                    <Link href="/" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back home</Link>
                    <h1>Notes from the <span className="secondary-highlight secondary-highlight-lilac">process.</span></h1>
                    <p className="secondary-lead">Notes on building AI systems, developer tools, and credible engineering portfolios.</p>
                </header>

                <section aria-labelledby="posts-heading">
                    <div className="secondary-section-heading">
                        <h2 id="posts-heading">
                            All writing <span className="secondary-count">{String(posts.length).padStart(2, '0')}</span>
                        </h2>
                        {posts.length > 0 ? <p>Newest first.</p> : null}
                    </div>

                    {posts.length === 0 ? (
                        <p className="state-note post-empty">
                            <span>
                                <strong>No posts published yet.</strong> In the meantime, the <Link href="/projects">project case studies</Link> cover how things were built.
                            </span>
                        </p>
                    ) : (
                        <ol className="post-list">
                            {posts.map((post, index) => (
                                <li className="post-row" key={post.slug}>
                                    <span className="secondary-row-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                                    <article>
                                        <p className="post-meta">
                                            {post.date ? (
                                                <>
                                                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                                                    <span aria-hidden="true">·</span>
                                                </>
                                            ) : null}
                                            <span>{post.readingTime}</span>
                                        </p>
                                        <h3>
                                            <Link href={`/blog/${post.slug}`} className="post-row-link">{post.title}</Link>
                                        </h3>
                                        {post.description ? <p className="post-row-description">{post.description}</p> : null}
                                        <TechTags items={post.tags} label="Post tags" />
                                    </article>
                                    <ArrowUpRight className="post-row-arrow" size={32} aria-hidden="true" />
                                </li>
                            ))}
                        </ol>
                    )}
                </section>

                <aside className="secondary-closing editorial-closing" aria-labelledby="blog-closing">
                    <h2 id="blog-closing">Rather see it built?</h2>
                    <Link href="/projects" className="brutal-button">Explore my work <ArrowUpRight size={18} aria-hidden="true" /></Link>
                </aside>
            </div>
            <SignatureFooter />
        </main>
    );
}
