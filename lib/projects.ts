import { projects } from "@/src/data/projects";
import { projectMedia } from "@/src/data/projectMedia";
import type { Capability, ProjectWithMedia } from "@/src/data/projectSchema";

/** Every visible project with its media, in /projects order. */
export function getProjects(): ProjectWithMedia[] {
    return projects
        .filter((project) => !project.hidden)
        .map((project) => ({ ...project, media: projectMedia[project.slug] ?? { gallery: [] } }))
        .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): ProjectWithMedia | undefined {
    return getProjects().find((project) => project.slug === slug);
}

/** The homepage set, in featured position order. */
export function getFeaturedProjects(): ProjectWithMedia[] {
    return getProjects()
        .filter((project) => project.featured !== undefined && project.status !== "Archived")
        .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
}

export function getProjectsWithCapability(capability: Capability): ProjectWithMedia[] {
    return getProjects().filter((project) => project.capabilities.includes(capability) && project.status !== "Archived");
}

export const projectHref = (slug: string) => `/projects/${encodeURIComponent(slug)}`;
