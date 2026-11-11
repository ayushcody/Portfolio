import { projects } from "@/src/data/projects";
import type { Project as SiteProject } from "@/src/data/projectSchema";

// ============================================================================
// LEGACY PROJECT SHAPE - used only by the /admin CMS editor and its Firestore
// normalizer. Public pages read src/data/projects.ts through lib/projects.ts.
// The static items below are derived from that same data, so there is still
// one source of truth. CMS project overrides are no longer read by public pages.
// ============================================================================

export type ProjectStatus = "Live" | "Pilot" | "Working build" | "Prototype" | "Case Study" | "Archived";

export type ProjectLinkSet = {
    live?: string;
    github?: string;
    loom?: string;
    documentation?: string;
    caseStudy?: string;
    demo?: string;
    video?: string;
};

export type ProjectVisuals = {
    thumbnail?: string;
    thumbnailAlt?: string;
    screenshots?: string[];
};

export type Project = {
    id: string;
    title: string;
    shortTitle?: string;
    category: string;
    year?: string;
    status: ProjectStatus;
    featured: boolean;
    showOnHome: boolean;
    archived: boolean;
    hidden?: boolean;
    priority: number;

    summary: string;
    oneLine?: string;
    problem?: string;
    solution?: string;
    myRole?: string;

    techStack: string[];
    tags: string[];

    architectureHighlights: string[];
    features?: string[];
    impact: string[];
    challenges: string[];
    learnings: string[];
    nextSteps?: string[];

    links: ProjectLinkSet;
    visuals?: ProjectVisuals;

    description?: string;
    stack?: string[];
    github?: string;
    live?: string;
};

function toLegacyProject(project: SiteProject): Project {
    const links: ProjectLinkSet = {
        github: project.links.repo,
        live: project.links.demo,
        loom: project.links.video,
    };
    return {
        id: project.slug,
        title: project.title,
        category: project.category,
        year: project.year,
        status: project.status,
        featured: project.featured !== undefined,
        showOnHome: project.featured !== undefined,
        archived: project.status === "Archived",
        hidden: project.hidden,
        priority: project.order,
        summary: project.summary,
        oneLine: project.outcome,
        problem: project.problem,
        solution: project.approach,
        myRole: project.role,
        techStack: project.stack,
        tags: [],
        architectureHighlights: project.architecture.highlights,
        impact: project.results,
        challenges: project.tradeoffs ?? [],
        learnings: project.learnings ?? [],
        nextSteps: project.nextSteps,
        links,
        description: project.summary,
        stack: project.stack,
        github: links.github,
        live: links.live,
    };
}

/** Static projects as the admin editor sees them. */
export const projectsData: Project[] = projects.filter((item) => !item.hidden).map(toLegacyProject);
