import { BlogPost } from '@/lib/markdown';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';

interface LatestPostsProps {
    posts: BlogPost[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
    if (posts.length === 0) return null;

    const latest = posts[0];

    return (
        <section id="blog" className="relative z-10 w-full overflow-hidden px-6 py-16 md:px-12">
            <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-purple/10 blur-[90px]" />
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-purple" aria-hidden="true" />
                            <p className="text-sm font-bold uppercase tracking-widest text-purple">Latest writing</p>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">Latest writing</h2>
                    </div>

                    <Link
                        href="/blog"
                        className="inline-flex w-fit items-center gap-2 text-sm font-black text-muted transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                    >
                        Read more
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>

                <article className="relative overflow-hidden rounded-[1.5rem] border border-purple/20 bg-gradient-to-br from-purple/[0.08] via-white/[0.035] to-cyan/[0.055] p-6">
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-purple/60 to-cyan/50" />
                    <div className="mb-4 flex flex-wrap gap-3 text-sm font-semibold text-muted">
                        {latest.date ? (
                            <span className="inline-flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-cyan" aria-hidden="true" />
                                {latest.date}
                            </span>
                        ) : null}
                        <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange" aria-hidden="true" />
                            {latest.readingTime}
                        </span>
                    </div>
                    <h3 className="text-2xl font-black text-white">
                        <Link href={`/blog/${latest.slug}`} className="transition hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan">
                            {latest.title}
                        </Link>
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{latest.description}</p>
                </article>
            </div>
        </section>
    );
}
