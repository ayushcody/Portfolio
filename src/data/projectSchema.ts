// ============================================================================
// PROJECT SCHEMA - the contract shared by project data, media and every page.
// Content lives in src/data/projects.ts; images live in public/projects/<slug>/
// and reach pages through the generated src/data/projectMedia.ts.
// ============================================================================

/** Ordered as the filter chips appear on /projects. */
export const PROJECT_CATEGORIES = [
    "Voice AI",
    "Agentic AI",
    "RAG & Retrieval",
    "Document AI",
    "Full-Stack Product",
    "Developer Tooling",
    "Security",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * Live          publicly deployed or published; `links.demo` or `links.package` opens it.
 * Pilot         in use by a limited group of real users.
 * Working build runs end to end from its source; not deployed publicly.
 * Archived      no longer maintained; kept for the record.
 */
export const PROJECT_STATUSES = ["Live", "Pilot", "Working build", "Archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** How the project came about, when that is part of the story. Shown beside the status. */
export const PROJECT_ORIGINS = ["Freelance", "Hackathon", "Take-home", "Challenge entry"] as const;
export type ProjectOrigin = (typeof PROJECT_ORIGINS)[number];

/** What a project proves. Skill groups on /skills link to the projects that carry their capability. */
export const CAPABILITIES = {
    "voice-agents": "Voice agents",
    "agentic-workflows": "Agentic workflows",
    rag: "RAG & retrieval",
    "llm-evaluation": "LLM evaluation & verification",
    "document-ai": "Document AI",
    "local-inference": "Local inference",
    "full-stack": "Full-stack product",
} as const;
export type Capability = keyof typeof CAPABILITIES;

/** A number with provenance. Never invented: `source` says where it can be checked. */
export type ProjectMetric = {
    /** "3.7×", "0.28 s", "25+" */
    value: string;
    /** "faster speech generation at 4-bit" */
    label: string;
    /** "MLX benchmark scripts, Oct 2026 (see /blog/mlx)", "README, verified 8 Nov 2026" */
    source: string;
};

/** Every link is optional; a missing link is never rendered. */
export type ProjectLinks = {
    /** Public source code only. Private repositories are left out. */
    repo?: string;
    /** Deployed product that loads for a visitor. */
    demo?: string;
    /** Published package page (npm, PyPI) that the author owns. */
    package?: string;
    /** Walkthrough video (Loom, YouTube). */
    video?: string;
    /** Internal write-up, e.g. "/blog/mlx". */
    writeup?: string;
};

export type Project = {
    /** URL id: /projects/<slug>. Stable once published. */
    slug: string;
    title: string;
    /** Card line, at most ~110 characters: what it does or what it achieved. */
    outcome: string;
    category: ProjectCategory;
    capabilities: Capability[];
    status: ProjectStatus;
    /** Only when evidenced: freelance client work, a hackathon, a take-home assignment, a challenge entry. */
    origin?: ProjectOrigin;
    /** "1st place, Black Pearl Cybersecurity Hackathon" */
    recognition?: string;
    year: string;
    /** What Ayush did: "Solo build" or "Team of 4; built the scoring service". */
    role: string;
    /** Most important first; cards show the first four. */
    stack: string[];
    /** Empty unless supplied by Ayush or provable from a source. */
    metrics: ProjectMetric[];
    links: ProjectLinks;
    /** Position in the homepage featured set; omitted when not featured. */
    featured?: 1 | 2 | 3 | 4;
    /** Order on /projects (ascending). */
    order: number;
    /** Left out of the site entirely. */
    hidden?: boolean;

    // Case study copy, in page order.
    /** What it is and who it is for, 2–3 sentences. */
    summary: string;
    problem: string;
    approach: string;
    architecture: {
        overview: string;
        /** 3–6 stages a request passes through, named after real components in the code. Drawn as a diagram. */
        flow: string[];
        highlights: string[];
    };
    /** Concrete results; numbers belong in `metrics`. */
    results: string[];
    tradeoffs?: string[];
    learnings?: string[];
    nextSteps?: string[];
};

// ---------------------------------------------------------------------------
// Media (generated from public/projects/<slug>/media.json by `npm run media`)
// ---------------------------------------------------------------------------

export type ProjectImage = {
    /** Root-relative path, e.g. /projects/auralis/cover.webp */
    src: string;
    alt: string;
    caption?: string;
    width: number;
    height: number;
};

/** A short real recording (a call, a session), played on the case study and linked from the card. */
export type ProjectClip = {
    /** Root-relative MP4 (H.264 + AAC, 720p), e.g. /projects/vakya/call.mp4 */
    src: string;
    /** Poster frame (WebP) with the clip's pixel size. */
    poster: string;
    width: number;
    height: number;
    /** Short name, e.g. "A real call". */
    label: string;
    /** "0:34" */
    duration: string;
    /** What happens in the clip, and how it was cut. */
    caption: string;
    /** Text of what is said, for people who can't play or hear it. */
    transcript?: { speaker: string; text: string }[];
};

export type ProjectMediaSet = {
    /** 16:10, 1600×1000 WebP. Absent when the project has no real interface to show. */
    cover?: ProjectImage;
    /** Ordered gallery, each 1600 px wide WebP with a caption. */
    gallery: ProjectImage[];
    clip?: ProjectClip;
    /** Why there is no cover, when there is none (e.g. "Backend service; code lives in a teammate's repository"). */
    noVisualReason?: string;
};

/** What pages render: the project plus its media. */
export type ProjectWithMedia = Project & { media: ProjectMediaSet };
