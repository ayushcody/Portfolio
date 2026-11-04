'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TechTags } from '@/components/ui/TechTags';
import { formatPostDate, type BlogPostSummary } from '@/lib/postFormat';
import { tagLabel } from '@/lib/tagLabels';

/** Topic filter plus a year-grouped list. Every post renders on the server; the filter only hides rows. */
export function PostIndex({ posts }: { posts: BlogPostSummary[] }) {
    const [topic, setTopic] = useState<string | null>(null);

    // Topics shared by at least two posts, most used first.
    const topics = useMemo(() => {
        const counts = new Map<string, number>();
        posts.forEach((post) => post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
        return [...counts.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
    }, [posts]);

    const visible = topic ? posts.filter((post) => post.tags.includes(topic)) : posts;
    const years = [...new Set(visible.map((post) => post.date.slice(0, 4)))];

    return (
        <>
            {topics.length > 0 ? (
                <div className="post-topics" role="group" aria-label="Filter posts by topic">
                    <button type="button" className="post-topic" aria-pressed={topic === null} onClick={() => setTopic(null)}>
                        All <span>{posts.length}</span>
                    </button>
                    {topics.map((tag) => (
                        <button key={tag} type="button" className="post-topic" aria-pressed={topic === tag} onClick={() => setTopic(topic === tag ? null : tag)}>
                            {tagLabel(tag)}
                        </button>
                    ))}
                </div>
            ) : null}

            <p className="sr-only" aria-live="polite">{topic ? `${visible.length} posts about ${tagLabel(topic)}` : `${visible.length} posts`}</p>

            {years.map((year) => (
                <section key={year} className="post-year" aria-labelledby={`year-${year}`}>
                    <h3 id={`year-${year}`} className="post-year-label">{year}</h3>
                    <ol className="post-list">
                        {visible.filter((post) => post.date.startsWith(year)).map((post, index) => (
                            <li className="post-row" key={post.slug}>
                                <span className="secondary-row-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                                <article>
                                    <p className="post-meta">
                                        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                                        <span aria-hidden="true">·</span>
                                        <span>{post.readingTime}</span>
                                    </p>
                                    <h4>
                                        <Link href={`/blog/${post.slug}`} className="post-row-link">{post.title}</Link>
                                    </h4>
                                    {post.description ? <p className="post-row-description">{post.description}</p> : null}
                                    <TechTags items={post.tags.map(tagLabel)} label="Post tags" />
                                </article>
                                <ArrowUpRight className="post-row-arrow" size={32} aria-hidden="true" />
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </>
    );
}
