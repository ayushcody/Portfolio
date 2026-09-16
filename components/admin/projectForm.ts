import { asNumber, normalizeProject } from "@/lib/cms/normalize";
import type { CmsProject } from "@/lib/cms/types";
import { checkExternalUrl, type UrlKind } from "@/lib/urls";
import { projectsData, type Project, type ProjectLinkSet, type ProjectStatus } from "@/src/data/projects";
import type { FieldErrors } from "./fields";
import { fromCsv, fromLines, SLUG_PATTERN, toCsv, toLines } from "./format";
import type { CmsAdapter } from "./useCmsCollection";

export type ProjectLinkKey = keyof Required<ProjectLinkSet>;

export const PROJECT_LINK_FIELDS: readonly { key: ProjectLinkKey; label: string; kind: UrlKind; placeholder: string }[] = [
  { key: "live", label: "Live site", kind: "any", placeholder: "https://product.example.com" },
  { key: "github", label: "GitHub repository", kind: "github", placeholder: "https://github.com/owner/repo" },
  { key: "loom", label: "Loom walkthrough", kind: "loom", placeholder: "https://www.loom.com/share/…" },
  { key: "documentation", label: "Documentation", kind: "any", placeholder: "https://docs.example.com" },
  { key: "caseStudy", label: "Case study", kind: "any", placeholder: "https://…" },
  { key: "demo", label: "Demo", kind: "any", placeholder: "https://…" },
  { key: "video", label: "Video", kind: "any", placeholder: "https://youtube.com/watch?v=…" },
];

export const PROJECT_STATUS_OPTIONS: readonly { value: ProjectStatus; label: string }[] = [
  { value: "Live", label: "Live" },
  { value: "Prototype", label: "Prototype" },
  { value: "Case Study", label: "Case study" },
  { value: "Archived", label: "Archived" },
];

export const PROJECT_CATEGORY_SUGGESTIONS = [
  "Agentic AI",
  "RAG Systems",
  "Voice AI",
  "AI Infrastructure",
  "Full-Stack Product",
  "Developer Tooling",
  "Labs",
  "Archive",
];

export const PROJECT_LIST_FIELDS = [
  { key: "architectureHighlights", label: "Architecture highlights" },
  { key: "features", label: "Features" },
  { key: "impact", label: "Impact" },
  { key: "challenges", label: "Challenges" },
  { key: "learnings", label: "Learnings" },
  { key: "nextSteps", label: "Next steps" },
] as const;

type ProjectListKey = (typeof PROJECT_LIST_FIELDS)[number]["key"];

/** Form state: lists are kept as raw text (comma or line separated) and parsed on save. */
export type ProjectForm = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  year: string;
  projectStatus: ProjectStatus;
  featured: boolean;
  showOnHome: boolean;
  archived: boolean;
  priority: string;
  summary: string;
  oneLine: string;
  problem: string;
  solution: string;
  myRole: string;
  techStack: string;
  tags: string;
  links: Record<ProjectLinkKey, string>;
  thumbnail: string;
  thumbnailAlt: string;
} & Record<ProjectListKey, string>;

/** The CMS document body for a project (status, hidden and timestamps are added by lib/cms/adminWrites). */
export type ProjectPayload = Omit<CmsProject, "status" | "hidden" | "createdAt" | "updatedAt" | "publishedAt" | "version" | "iconKey" | "theme"> & {
  links: Record<ProjectLinkKey, string>;
  visuals: { thumbnail: string; thumbnailAlt: string };
};

const emptyLinks = (): Record<ProjectLinkKey, string> => ({
  live: "",
  github: "",
  loom: "",
  documentation: "",
  caseStudy: "",
  demo: "",
  video: "",
});

export function blankProjectForm(priority: number): ProjectForm {
  return {
    id: "",
    title: "",
    shortTitle: "",
    category: "",
    year: String(new Date().getFullYear()),
    projectStatus: "Prototype",
    featured: false,
    showOnHome: false,
    archived: false,
    priority: String(priority),
    summary: "",
    oneLine: "",
    problem: "",
    solution: "",
    myRole: "",
    techStack: "",
    tags: "",
    architectureHighlights: "",
    features: "",
    impact: "",
    challenges: "",
    learnings: "",
    nextSteps: "",
    links: emptyLinks(),
    thumbnail: "",
    thumbnailAlt: "",
  };
}

export function projectToForm(project: Project): ProjectForm {
  const links = emptyLinks();
  for (const { key } of PROJECT_LINK_FIELDS) {
    links[key] = project.links?.[key] ?? "";
  }
  // Legacy top-level fields on older content.
  if (!links.github && project.github) links.github = project.github;
  if (!links.live && project.live) links.live = project.live;

  return {
    id: project.id,
    title: project.title ?? "",
    shortTitle: project.shortTitle ?? "",
    category: project.category ?? "",
    year: project.year ?? "",
    projectStatus: project.status ?? "Case Study",
    featured: Boolean(project.featured),
    showOnHome: Boolean(project.showOnHome),
    archived: Boolean(project.archived),
    priority: String(project.priority ?? 0),
    summary: project.summary ?? "",
    oneLine: project.oneLine ?? "",
    problem: project.problem ?? "",
    solution: project.solution ?? "",
    myRole: project.myRole ?? "",
    techStack: toCsv(project.techStack),
    tags: toCsv(project.tags),
    architectureHighlights: toLines(project.architectureHighlights),
    features: toLines(project.features),
    impact: toLines(project.impact),
    challenges: toLines(project.challenges),
    learnings: toLines(project.learnings),
    nextSteps: toLines(project.nextSteps),
    links,
    thumbnail: project.visuals?.thumbnail ?? "",
    thumbnailAlt: project.visuals?.thumbnailAlt ?? "",
  };
}

export function withProjectOrder(form: ProjectForm, order: number): ProjectForm {
  return { ...form, priority: String(order) };
}

export function validateProjectForm(form: ProjectForm, context: { isNew: boolean; takenIds: ReadonlySet<string> }): FieldErrors {
  const errors: FieldErrors = {};
  const id = form.id.trim();

  if (!id) errors.id = "Add an ID. It becomes the page URL: /projects/your-id.";
  else if (!SLUG_PATTERN.test(id)) errors.id = "Use lowercase letters, numbers and single hyphens (for example my-project).";
  else if (context.isNew && context.takenIds.has(id)) errors.id = "A project with this ID already exists. Choose another ID or edit that project.";

  if (!form.title.trim()) errors.title = "Add a title.";
  if (!form.summary.trim()) errors.summary = "Add a summary. It is shown on cards and the case study.";

  const priority = form.priority.trim();
  if (!priority) errors.priority = "Add a position number (1 is shown first).";
  else if (!Number.isInteger(Number(priority)) || Number(priority) < 0) errors.priority = "Use a whole number, 0 or higher.";

  for (const { key, kind } of PROJECT_LINK_FIELDS) {
    const check = checkExternalUrl(form.links[key], kind);
    if (!check.ok) errors[`links.${key}`] = check.error;
  }

  const thumbnail = checkExternalUrl(form.thumbnail, "image");
  if (!thumbnail.ok) errors.thumbnail = thumbnail.error;
  if (form.thumbnail.trim() && thumbnail.ok && !form.thumbnailAlt.trim()) {
    errors.thumbnailAlt = "Describe the image for screen readers.";
  }

  return errors;
}

/** Builds the CMS payload. Every link key is written (empty string = removed) so static links can be removed. */
export function projectFormToPayload(form: ProjectForm): ProjectPayload {
  const links = emptyLinks();
  for (const { key, kind } of PROJECT_LINK_FIELDS) {
    const check = checkExternalUrl(form.links[key], kind);
    links[key] = check.ok ? (check.value ?? "") : "";
  }
  const thumbnail = checkExternalUrl(form.thumbnail, "image");
  const priority = Math.max(0, Math.round(asNumber(form.priority, 0)));

  return {
    id: form.id.trim(),
    order: priority,
    priority,
    featured: form.featured,
    title: form.title.trim(),
    shortTitle: form.shortTitle.trim(),
    category: form.category.trim(),
    year: form.year.trim(),
    projectStatus: form.projectStatus,
    showOnHome: form.showOnHome,
    archived: form.archived,
    summary: form.summary.trim(),
    oneLine: form.oneLine.trim(),
    problem: form.problem.trim(),
    solution: form.solution.trim(),
    myRole: form.myRole.trim(),
    techStack: fromCsv(form.techStack),
    tags: fromCsv(form.tags),
    architectureHighlights: fromLines(form.architectureHighlights),
    features: fromLines(form.features),
    impact: fromLines(form.impact),
    challenges: fromLines(form.challenges),
    learnings: fromLines(form.learnings),
    nextSteps: fromLines(form.nextSteps),
    links,
    visuals: {
      thumbnail: thumbnail.ok ? (thumbnail.value ?? "") : "",
      thumbnailAlt: form.thumbnailAlt.trim(),
    },
  };
}

function blankProject(id: string): Project {
  return {
    id,
    title: "",
    category: "",
    status: "Prototype",
    featured: false,
    showOnHome: false,
    archived: false,
    priority: Number.MAX_SAFE_INTEGER,
    summary: "",
    techStack: [],
    tags: [],
    architectureHighlights: [],
    impact: [],
    challenges: [],
    learnings: [],
    links: {},
  };
}

export const projectAdapter: CmsAdapter<Project> = {
  collection: "projects",
  staticItems: projectsData,
  idOf: (project) => project.id,
  titleOf: (project) => project.title,
  subtitleOf: (project) => [project.category, project.status, project.year].filter(Boolean).join(" · "),
  merge: (doc, base, id) => {
    const fallback = base ?? blankProject(id);
    if (!doc) return fallback;
    const merged = normalizeProject({ ...doc, id }, fallback) ?? fallback;
    // normalizeProject titles CMS-only docs without a title "Untitled Project"; keep the form honest.
    if (!base && !(typeof doc.title === "string" && doc.title.trim())) merged.title = "";
    return merged;
  },
  orderOf: (project) => project.priority ?? Number.MAX_SAFE_INTEGER,
};

/** Projects are shown by ascending priority, starting at 1. */
export const projectSequence = (index: number) => index + 1;
