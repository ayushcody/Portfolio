import { projects } from "@/src/data/projects";
import { projectMedia } from "@/src/data/projectMedia";
import { experiencesData } from "@/src/data/experience";
import { skillGroups, type SkillGroup } from "@/src/data/skills";
import { PROJECT_CATEGORIES, type Capability, type ProjectCategory, type ProjectImage, type ProjectWithMedia } from "@/src/data/projectSchema";

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

// ---------------------------------------------------------------------------
// Index helpers
// ---------------------------------------------------------------------------

/** /projects order: featured builds first (in featured order), then the rest by `order`, archived last. */
export function getProjectsForIndex(): ProjectWithMedia[] {
    const rank = (project: ProjectWithMedia) => (project.status === "Archived" ? 2 : project.featured !== undefined ? 0 : 1);
    return getProjects().sort((a, b) => rank(a) - rank(b) || (a.featured ?? 0) - (b.featured ?? 0) || a.order - b.order);
}

export type CategoryCount = { category: ProjectCategory; count: number };

/** Categories that have at least one project, in PROJECT_CATEGORIES order. */
export function getCategoryCounts(list: Pick<ProjectWithMedia, "category">[] = getProjects()): CategoryCount[] {
    return PROJECT_CATEGORIES.map((category) => ({ category, count: list.filter((project) => project.category === category).length })).filter(
        (entry) => entry.count > 0,
    );
}

/** URL-safe id for a category, e.g. "RAG & Retrieval" -> "rag-retrieval". */
export const categorySlug = (category: string) =>
    category
        .toLowerCase()
        .replace(/&/g, " ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

/**
 * The image that stands for a project: its 16:10 cover, else its first screenshot.
 * Undefined when the project has neither; callers then draw the architecture flow.
 */
export function getProjectCoverImage(project: Pick<ProjectWithMedia, "media">): (ProjectImage & { isPlaceholder: boolean }) | undefined {
    const { cover, gallery } = project.media;
    if (cover) return { ...cover, isPlaceholder: false };
    const first = gallery[0];
    return first ? { ...first, isPlaceholder: true } : undefined;
}

// ---------------------------------------------------------------------------
// Skills, with evidence
// ---------------------------------------------------------------------------

export type SkillGroupWithEvidence = Omit<SkillGroup, "roles"> & {
    /** Only the tools a visible project's stack or an experience entry mentions. */
    tools: string[];
    /** Projects that prove the group's capability. */
    projects: ProjectWithMedia[];
    /** Roles where the work happens on the job. */
    roles: { id: string; company: string }[];
};

function evidenceCorpus(): string[] {
    const stacks = getProjects().flatMap((project) => project.stack);
    const work = experiencesData.flatMap((role) => [...role.techStack, ...role.responsibilities]);
    return [...stacks, ...work].map((entry) => entry.toLowerCase());
}

/** Skill groups with unproven tools removed and their proof attached. Groups left with no tools are dropped. */
export function getSkillGroups(): SkillGroupWithEvidence[] {
    const corpus = evidenceCorpus();
    const evidenced = (tool: string) => corpus.some((entry) => entry.includes(tool.toLowerCase()));

    return skillGroups
        .map((group) => ({
            ...group,
            tools: group.tools.filter(evidenced),
            projects: group.capability ? getProjectsWithCapability(group.capability) : [],
            roles: (group.roles ?? []).flatMap((id) => {
                const role = experiencesData.find((entry) => entry.id === id);
                return role ? [{ id, company: role.company }] : [];
            }),
        }))
        .filter((group) => group.tools.length > 0);
}
