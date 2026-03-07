import { getBlogPosts } from '@/lib/markdown';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { SkeuomorphicCard } from '@/components/ui/SkeuomorphicCard';

export const metadata = {
    title: 'Blog | Ayush Chougula',
    description: 'Writing about AI engineering, LLMs, and systems architecture.',
};

export default function BlogIndex() {
    const posts = getBlogPosts();

    return (
        <main className="min-h-screen relative selection:bg-purple/30 selection:text-white pb-24">
            <Navbar />

            <section className="pt-32 px-6 md:px-12 max-w-4xl mx-auto relative z-10 w-full">
                <div className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Engineering Notes</h1>
                    <p className="text-xl text-muted leading-relaxed">
                        Thoughts on building production-grade AI systems, from agentic architectures to fast inference and voice models.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="py-12 border border-white/10 border-dashed rounded-2xl flex items-center justify-center text-muted bg-surface/30">
                        <p>No posts published yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                                <SkeuomorphicCard className="h-full flex flex-col p-8 transition-all">
                                    <div className="flex items-center gap-4 text-sm text-muted font-medium mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-cyan" />
                                            {post.date}
                                        </div>
                                        {post.tags.length > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <Tag className="w-4 h-4 text-purple" />
                                                <div className="flex gap-2">
                                                    {post.tags.slice(0, 2).map(tag => (
                                                        <span key={tag}>{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-cyan transition-colors">
                                        {post.title}
                                    </h2>

                                    <p className="text-muted leading-relaxed mb-6">
                                        {post.description}
                                    </p>

                                    <div className="mt-auto flex items-center text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-muted group-hover:from-cyan group-hover:to-purple transition-all duration-300">
                                        Read Article <ArrowRight className="w-4 h-4 ml-2 text-cyan group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </SkeuomorphicCard>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
