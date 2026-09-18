import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/cms/publicReads";
import { getBlogPosts } from "@/lib/markdown";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

// Same cadence as the CMS-backed pages, so published projects appear without a redeploy.
export const revalidate = 300;

type Entry = MetadataRoute.Sitemap[number];

// Public pages only: /admin and /launch are intentionally left out.
const staticRoutes: Array<{ path: string; changeFrequency: Entry["changeFrequency"]; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/resume", changeFrequency: "monthly", priority: 0.8 },
  { path: "/skills", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

function parseDate(value: string): Date | undefined {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? date : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: projects } = await getPublicProjects();
  const posts = getBlogPosts();
  const latestPost = posts.map((post) => parseDate(post.date)).find(Boolean);

  // Static pages carry no lastModified: a build timestamp would claim changes that never happened.
  const pages: MetadataRoute.Sitemap = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    // The homepage canonical renders without a trailing slash; match it.
    url: path === "/" ? SITE_URL : absoluteUrl(path),
    changeFrequency,
    priority,
    ...(path === "/blog" && latestPost ? { lastModified: latestPost } : {}),
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${encodeURIComponent(project.id)}`),
    changeFrequency: "monthly",
    priority: project.archived || project.status === "Archived" ? 0.4 : 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModified = parseDate(post.date);
    return {
      url: absoluteUrl(`/blog/${encodeURIComponent(post.slug)}`),
      changeFrequency: "yearly",
      priority: 0.6,
      ...(lastModified ? { lastModified } : {}),
    };
  });

  return [...pages, ...projectPages, ...postPages];
}
