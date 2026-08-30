import { getBlogPostBySlug, getBlogPosts } from '@/lib/markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

export async function generateStaticParams() {
    return getBlogPosts().map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: `${post.title} | Ayush Chougula`,
            description: post.description,
            type: 'article',
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) notFound();

    return (
        <main className="min-h-screen selection:bg-purple/30 selection:text-white">
            <article className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-12">
                <Link
                    href="/blog"
                    className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Writing
                </Link>

                <header className="mb-10">
                    <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                        {post.title}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted">
                        {post.date ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                                <Calendar className="h-4 w-4 text-cyan" aria-hidden="true" />
                                {post.date}
                            </span>
                        ) : null}
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                            <Clock className="h-4 w-4 text-orange" aria-hidden="true" />
                            {post.readingTime}
                        </span>
                    </div>

                    {post.tags.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2" aria-label="Post tags">
                            {post.tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-surface px-3 py-1 text-xs font-bold text-muted">
                                    <Tag className="h-3.5 w-3.5 text-purple" aria-hidden="true" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </header>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 md:p-10">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ ...props }) => <h2 className="mb-5 mt-10 text-3xl font-black text-white" {...props} />,
                            h2: ({ ...props }) => <h2 className="mb-4 mt-10 border-b border-white/10 pb-3 text-2xl font-black text-white" {...props} />,
                            h3: ({ ...props }) => <h3 className="mb-3 mt-8 text-xl font-black text-white" {...props} />,
                            p: ({ ...props }) => <p className="mb-6 text-base leading-8 text-muted" {...props} />,
                            a: ({ href = '', ...props }) => {
                                const isExternal = href.startsWith('http://') || href.startsWith('https://');
                                return (
                                    <a
                                        href={href}
                                        target={isExternal ? '_blank' : undefined}
                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                        className="text-cyan underline underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                                        {...props}
                                    />
                                );
                            },
                            ul: ({ ...props }) => <ul className="mb-6 list-disc space-y-2 pl-6 text-muted" {...props} />,
                            ol: ({ ...props }) => <ol className="mb-6 list-decimal space-y-2 pl-6 text-muted" {...props} />,
                            li: ({ ...props }) => <li className="leading-7 marker:text-purple" {...props} />,
                            blockquote: ({ ...props }) => (
                                <blockquote className="my-8 rounded-r-xl border-l-4 border-purple bg-white/[0.04] py-2 pl-6 text-white/80" {...props} />
                            ),
                            code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match;
                                return isInline ? (
                                    <code className="rounded-md border border-white/10 bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-orange" {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <pre className="my-8 overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-5 font-mono text-sm leading-relaxed text-white">
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    </pre>
                                );
                            },
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </main>
    );
}
