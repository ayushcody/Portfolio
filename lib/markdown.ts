import fs from 'fs';
import path from 'path';

// Note: simple frontmatter parser for zero-dependency blog
export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    content: string;
}

const blogsDirectory = path.join(process.cwd(), 'content/blog');

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

                // Basic custom frontmatter parser
                const parts = fileContents.split('---');
                if (parts.length < 3) {
                    return null;
                }

                const frontmatter = parts[1];
                const content = parts.slice(2).join('---').trim();

                const getMatch = (regex: RegExp) => {
                    const match = frontmatter.match(regex);
                    return match ? match[1].trim() : '';
                };

                const title = getMatch(/title:\s*['"]?(.*?)['"]?\n/);
                const date = getMatch(/date:\s*['"]?(.*?)['"]?\n/);
                const description = getMatch(/description:\s*['"]?(.*?)['"]?\n/);
                const tagsRaw = getMatch(/tags:\s*\[(.*?)\]/);
                const tags = tagsRaw ? tagsRaw.split(',').map(t => t.replace(/['"]/g, '').trim()) : [];

                return {
                    slug,
                    title,
                    date,
                    description,
                    tags,
                    content
                };
            })
            .filter(Boolean) as BlogPost[];

        // Sort posts by date
        return allBlogsData.sort((a, b) => {
            if (a.date < b.date) {
                return 1;
            } else {
                return -1;
            }
        });
    } catch (e) {
        console.error("Error reading blog posts", e);
        return [];
    }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
    const posts = getBlogPosts();
    return posts.find(post => post.slug === slug) || null;
}
