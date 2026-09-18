import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SignatureFooter } from '@/components/SignatureFooter';
import { TechTags } from '@/components/ui/TechTags';
import { profile } from '@/config/portfolio';
import { formatPostDate, getBlogPostBySlug, getBlogPosts } from '@/lib/markdown';
import { pageMetadata } from '@/lib/seo';
import '@/components/secondary-pages.css';
import '@/components/editorial.css';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return getBlogPosts().map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return { title: 'Post not found', robots: { index: false, follow: false } };
    }

    return pageMetadata({
        title: post.title,
        description: post.description,
        path: `/blog/${slug}`,
        type: 'article',
    });
}

/** react-markdown passes the hast `node` to custom components; keep it off the DOM. */
function domProps<T extends { node?: unknown }>(props: T): Omit<T, 'node'> {
    const rest = { ...props };
    delete rest.node;
    return rest;
}

/*
 * Markdown safety: no rehype-raw and `skipHtml` is set, so raw HTML in a post is dropped rather than
 * injected; react-markdown's default urlTransform strips non-http(s)/mailto URLs from links and images.
 */
const markdownComponents: Components = {
    // The page title is the only h1; a markdown h1 becomes a section heading.
    h1: (props) => <h2 {...domProps(props)} />,
    a: (props) => {
        const { href = '', ...rest } = domProps(props);
        const isExternal = /^https?:\/\//i.test(href);
        return <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} {...rest} />;
    },
    // Wide code and tables scroll inside their own frame; tabIndex keeps that scroll reachable by keyboard.
    pre: (props) => <pre tabIndex={0} {...domProps(props)} />,
    table: (props) => (
        <div className="prose-table" tabIndex={0}>
            <table {...domProps(props)} />
        </div>
    ),
};

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const posts = getBlogPosts();
    const index = posts.findIndex((item) => item.slug === slug);
    const post = index >= 0 ? posts[index] : getBlogPostBySlug(slug);

    if (!post) notFound();

    // Posts are sorted newest first.
    const newer = index > 0 ? posts[index - 1] : undefined;
    const older = index >= 0 ? posts[index + 1] : undefined;

    return (
        <main className="secondary-page editorial-page">
            <div className="secondary-shell">
                <article aria-labelledby="article-title">
                    <header className="secondary-intro">
                        <Link href="/blog" className="secondary-back"><ArrowLeft size={16} aria-hidden="true" /> Back to writing</Link>
                        <p className="post-meta article-meta">
                            {post.date ? (
                                <>
                                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                                    <span aria-hidden="true">·</span>
                                </>
                            ) : null}
                            <span>{post.readingTime}</span>
                        </p>
                        <h1 id="article-title" className="article-title">{post.title}</h1>
                        {post.description ? <p className="secondary-lead">{post.description}</p> : null}
                    </header>

                    <div className="article-layout">
                        <aside className="article-aside" aria-label="About this post">
                            <div className="article-author">
                                <span className="logo-mark logo-mark--placeholder logo-mark--yellow" style={{ '--logo-size': '44px' } as React.CSSProperties} aria-hidden="true">
                                    {profile.initials}
                                </span>
                                <div>
                                    <strong>{profile.fullName}</strong>
                                    <span>{profile.headline}</span>
                                </div>
                            </div>
                            {post.tags.length > 0 ? (
                                <div>
                                    <span className="editorial-label">Filed under</span>
                                    <TechTags items={post.tags} label="Post tags" />
                                </div>
                            ) : null}
                        </aside>

                        <div className="article-body prose">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents} skipHtml>
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>

                {newer || older ? (
                    <nav className="article-pager" aria-label="More writing">
                        {newer ? (
                            <Link href={`/blog/${newer.slug}`} className="ink-card ink-card--interactive article-pager-link">
                                <span className="editorial-label"><ArrowLeft size={14} aria-hidden="true" /> Newer post</span>
                                <strong>{newer.title}</strong>
                            </Link>
                        ) : null}
                        {older ? (
                            <Link href={`/blog/${older.slug}`} className="ink-card ink-card--interactive article-pager-link article-pager-link--next">
                                <span className="editorial-label">Older post <ArrowRight size={14} aria-hidden="true" /></span>
                                <strong>{older.title}</strong>
                            </Link>
                        ) : null}
                    </nav>
                ) : null}

                <aside className="secondary-closing editorial-closing" aria-labelledby="article-closing">
                    <div>
                        <h2 id="article-closing">Thanks for reading.</h2>
                        <p className="editorial-closing-copy">The project case studies show the same thinking in practice.</p>
                    </div>
                    <div className="editorial-actions">
                        <Link href="/projects" className="brutal-button">Explore my work <ArrowUpRight size={18} aria-hidden="true" /></Link>
                        <Link href="/blog" className="brutal-button brutal-button--secondary">All writing <ArrowRight size={17} aria-hidden="true" /></Link>
                    </div>
                </aside>
            </div>
            <SignatureFooter />
        </main>
    );
}
