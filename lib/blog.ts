import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const contentDir = path.join(process.cwd(), 'content', 'blog');

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const files = fs.readdirSync(contentDir);
  const posts = files
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => {
      const fullPath = path.join(contentDir, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        content,
      };
    })
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

  return posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPathMd = path.join(contentDir, `${slug}.md`);
    const fullPathMdx = path.join(contentDir, `${slug}.mdx`);
    
    let fullPath = null;
    if (fs.existsSync(fullPathMd)) fullPath = fullPathMd;
    else if (fs.existsSync(fullPathMdx)) fullPath = fullPathMdx;
    
    if (!fullPath) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      content,
    };
  } catch {
    return null;
  }
}
