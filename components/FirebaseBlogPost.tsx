"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Loader2, Tag } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { SkeuomorphicCard } from "@/components/ui/SkeuomorphicCard";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { blogPostFromDoc, type AdminBlogPost } from "@/lib/firebase/content";

export function FirebaseBlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<AdminBlogPost | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return;
    }

    let cancelled = false;

    async function loadPost() {
      const snapshot = await getDoc(doc(db!, "blogPosts", slug));
      if (!cancelled && snapshot.exists()) {
        const nextPost = blogPostFromDoc(snapshot.data(), snapshot.id);
        setPost(nextPost.published ? nextPost : null);
      }
      if (!cancelled) setLoading(false);
    }

    void loadPost().catch(() => setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <main className="min-h-screen relative selection:bg-purple/30 selection:text-white pb-24">
      <article className="pt-32 px-6 md:px-12 max-w-4xl mx-auto relative z-10 w-full">
        <Link href="/blog" className="mb-12 inline-flex items-center text-sm font-bold text-muted transition-colors hover:text-cyan group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Notes
        </Link>

        {loading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/50 p-6 text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-cyan" />
            Loading post...
          </div>
        ) : !post ? (
          <div className="rounded-2xl border border-orange/20 bg-orange/10 p-8">
            <h1 className="text-3xl font-bold">Post not found</h1>
            <p className="mt-3 text-muted">No static or published Firebase post exists for this slug.</p>
          </div>
        ) : (
          <>
            <div className="mb-16">
              <h1 className="mb-8 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              <div className="flex w-fit flex-wrap items-center gap-6 rounded-xl border border-white/5 bg-surface/50 p-4 text-sm font-medium text-muted backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan" />
                  {post.date}
                </div>
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                    <Tag className="h-4 w-4 text-purple" />
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <SkeuomorphicCard hover={false} className="p-8 md:p-12 prose prose-invert prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </SkeuomorphicCard>
          </>
        )}
      </article>
    </main>
  );
}
