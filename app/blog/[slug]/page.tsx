import { getBlogPostBySlug, getBlogPosts } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { SkeuomorphicCard } from '@/components/ui/SkeuomorphicCard';
import { cn } from '@/lib/utils';

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
) {
    const p = await params;
    const post = getBlogPostBySlug(p.slug);
    if (!post) {
        return { title: 'Post Not Found' };
    }
    return {
        title: `${post.title} | Ayush Chougula`,
        description: post.description,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const p = await params;
    const post = getBlogPostBySlug(p.slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen relative selection:bg-purple/30 selection:text-white pb-24">
            <Navbar />

            <article className="pt-32 px-6 md:px-12 max-w-4xl mx-auto relative z-10 w-full">
                <Link href="/blog" className="inline-flex items-center text-sm font-bold text-muted hover:text-cyan transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Notes
                </Link>

                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted font-medium bg-surface/50 border border-white/5 p-4 rounded-xl backdrop-blur-sm w-fit">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan" />
                            {post.date}
                        </div>
                        {post.tags.length > 0 && (
                            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                                <Tag className="w-4 h-4 text-purple" />
                                <div className="flex gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <SkeuomorphicCard hover={false} className="p-8 md:p-12 prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-12 mb-6 text-white" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-10 mb-5 text-white border-b border-white/10 pb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-8 mb-4 text-white" {...props} />,
                            p: ({ node, ...props }) => <p className="leading-relaxed text-muted mb-6" {...props} />,
                            a: ({ node, ...props }) => <a className="text-cyan hover:text-purple transition-colors underline underline-offset-4" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-muted" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted" {...props} />,
                            li: ({ node, ...props }) => <li className="marker:text-purple" {...props} />,
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-purple pl-6 py-2 my-8 italic bg-white/5 rounded-r-xl text-white/80" {...props} />
                            ),
                            code: ({ node, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '')
                                const isInline = !match;
                                return isInline ? (
                                    <code className="bg-surface border border-white/10 px-1.5 py-0.5 rounded-md text-orange font-mono text-[0.9em]" {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <div className="relative my-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                        <div className="flex items-center px-4 py-2 bg-surface-hover border-b border-white/10">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                            </div>
                                            <span className="ml-4 text-xs font-mono text-muted uppercase tracking-wider">{match?.[1]}</span>
                                        </div>
                                        <pre className="p-6 overflow-x-auto bg-black/80 font-mono text-sm leading-relaxed text-white">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    </div>
                                )
                            }
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </SkeuomorphicCard>
            </article>
        </main>
    );
}
