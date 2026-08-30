import { getBlogPosts } from '@/lib/markdown';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

export const metadata = {
    title: 'Writing',
    description: 'Notes on building AI systems, developer tools, and credible engineering portfolios.',
};

export default function BlogIndex() {
    const posts = getBlogPosts();

    return (
        <main className="min-h-screen selection:bg-purple/30 selection:text-white">
            <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32 md:px-12">
                <div className="mb-12">
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-purple">Writing</p>
                    <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">Writing</h1>
                    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
                        Notes on building AI systems, developer tools, and credible engineering portfolios.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.035] p-8 text-muted">
                        No posts published yet.
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {posts.map((post) => (
                            <article key={post.slug} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 transition hover:border-white/20">
                                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted">
                                    {post.date ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-cyan" aria-hidden="true" />
                                            {post.date}
                                        </span>
                                    ) : null}
                                    <span className="inline-flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-orange" aria-hidden="true" />
                                        {post.readingTime}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-black text-white md:text-3xl">
                                    <Link href={`/blog/${post.slug}`} className="transition hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">{post.description}</p>

                                {post.tags.length > 0 ? (
                                    <div className="mt-5 flex flex-wrap gap-2" aria-label="Post tags">
                                        {post.tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-surface px-3 py-1 text-xs font-bold text-muted">
                                                <Tag className="h-3.5 w-3.5 text-purple" aria-hidden="true" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}

                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-cyan transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                                    aria-label={`Read ${post.title}`}
                                >
                                    Read post
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
