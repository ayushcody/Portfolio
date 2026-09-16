import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    readingTime: string;
    content: string;
}

const blogsDirectory = path.join(process.cwd(), 'content/blog');

function estimateReadingTime(content: string) {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return `${minutes} min read`;
}

function readText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

export function getBlogPosts(): BlogPost[] {
    try {
        if (!fs.existsSync(blogsDirectory)) return [];

        const fileNames = fs.readdirSync(blogsDirectory);
        const allBlogsData = fileNames
            .filter(fileName => fileName.endsWith('.md'))
            .map(fileName => {
                const slug = fileName.replace(/\.md$/, '');
                const fullPath = path.join(blogsDirectory, fileName);
                const fileContents = fs.readFileSync(fullPath, 'utf8');

                try {
                    const { data, content: body } = matter(fileContents);
                    if (Object.keys(data).length === 0) return null;

                    const content = body.trim();
                    const date = data.date instanceof Date
                        ? data.date.toISOString().slice(0, 10)
                        : readText(data.date);
                    const tags = Array.isArray(data.tags)
                        ? data.tags.map(readText).filter(Boolean)
                        : [];

                    return {
                        slug,
                        title: readText(data.title),
                        date,
                        description: readText(data.description) || readText(data.excerpt),
                        tags,
                        readingTime: estimateReadingTime(content),
                        content,
                    };
                } catch (error) {
                    console.error(`Error parsing blog post ${fileName}`, error);
                    return null;
                }
            })
            .filter((post): post is BlogPost => post !== null);

        // Sort posts by date
        return allBlogsData.sort((a, b) => b.date.localeCompare(a.date));
    } catch (e) {
        console.error("Error reading blog posts", e);
        return [];
    }
}

/** "2026-06-01" -> "1 Jun 2026". Returns the raw value when it is not an ISO calendar date. */
export function formatPostDate(date: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return date;
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parsed);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
    const posts = getBlogPosts();
    return posts.find(post => post.slug === slug) || null;
}
