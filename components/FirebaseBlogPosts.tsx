"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Radio, Tag } from "lucide-react";
import { SkeuomorphicCard } from "@/components/ui/SkeuomorphicCard";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { listBlogPosts, type AdminBlogPost } from "@/lib/firebase/content";

export function FirebaseBlogPosts() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let cancelled = false;

    async function loadPosts() {
      try {
        const remotePosts = await listBlogPosts(true);
        if (!cancelled) setPosts(remotePosts);
      } catch {
        if (!cancelled) setPosts([]);
      }
    }

    void loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!posts.length) return null;

  return (
    <div className="mt-10 space-y-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange">
        <Radio className="h-4 w-4" />
        Live from admin
      </div>

      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
          <SkeuomorphicCard className="h-full flex flex-col p-8 transition-all">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-cyan" />
                {post.date}
              </div>
              {post.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-purple" />
                  <div className="flex gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h2 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-cyan md:text-3xl">
              {post.title}
            </h2>

            <p className="mb-6 leading-relaxed text-muted">{post.description}</p>

            <div className="mt-auto flex items-center bg-gradient-to-r from-white to-muted bg-clip-text text-sm font-bold text-transparent transition-all duration-300 group-hover:from-cyan group-hover:to-purple">
              Read Article <ArrowRight className="ml-2 h-4 w-4 text-cyan transition-transform group-hover:translate-x-1" />
            </div>
          </SkeuomorphicCard>
        </Link>
      ))}
    </div>
  );
}
