import type { Achievement } from "@/src/data/achievements";
import type { ExperienceItem } from "@/src/data/experience";
import type { Project, ProjectLinkSet, ProjectStatus, ProjectVisuals } from "@/src/data/projects";
import type { Profile } from "@/src/data/profile";
import type { SkillCategory } from "@/src/data/skills";
import type { SystemEntry } from "@/src/data/interests";

type UnknownRecord = Record<string, unknown>;

const projectStatuses: ProjectStatus[] = ["Live", "Prototype", "Case Study", "Archived"];

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRecordValue(record: UnknownRecord, key: string): unknown {
  return record[key];
}

function normalizeStatus(value: unknown, fallback: ProjectStatus): ProjectStatus {
  const status = asString(value, fallback);
  return projectStatuses.includes(status as ProjectStatus) ? (status as ProjectStatus) : fallback;
}

function normalizeLinks(value: unknown, fallback: ProjectLinkSet = {}): ProjectLinkSet {
  const source = isRecord(value) ? value : {};

  return {
    github: cleanOptionalUrl(source.github) ?? fallback.github,
    live: cleanOptionalUrl(source.live) ?? fallback.live,
    demo: cleanOptionalUrl(source.demo) ?? fallback.demo,
    caseStudy: cleanOptionalUrl(source.caseStudy) ?? fallback.caseStudy,
    video: cleanOptionalUrl(source.video) ?? fallback.video,
  };
}

function normalizeVisuals(value: unknown, fallback?: ProjectVisuals): ProjectVisuals | undefined {
  if (!isRecord(value)) return fallback;

  const thumbnail = cleanOptionalUrl(value.thumbnail) ?? fallback?.thumbnail;
  const screenshots = asStringArray(value.screenshots)
    .map((item) => cleanOptionalUrl(item))
    .filter((item): item is string => Boolean(item));

  if (!thumbnail && screenshots.length === 0 && !fallback) return undefined;

  return {
    thumbnail,
    screenshots: screenshots.length > 0 ? screenshots : fallback?.screenshots,
  };
}

function fallbackById<T extends { id?: string }>(items: T[], id: string | undefined, index: number): T | undefined {
  return (id ? items.find((item) => item.id === id) : undefined) ?? items[index];
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function cleanOptionalUrl(value: unknown): string | undefined {
  const url = asString(value);
  if (!url) return undefined;

  return url;
}

export function normalizeProfile(input: unknown, fallback: Profile): Profile {
  if (!isRecord(input)) return fallback;

  const education = isRecord(input.education) ? input.education : fallback.education;
  const links = isRecord(input.links) ? input.links : {};
  const ctas = isRecord(input.ctas) ? input.ctas : {};

  return {
    ...fallback,
    fullName: asString(input.fullName, fallback.fullName),
    initials: asString(input.initials, fallback.initials),
    headline: asString(input.headline, fallback.headline),
    role: asString(input.role, fallback.role),
    shortBio: asString(input.shortBio, fallback.shortBio),
    longBio: asString(input.longBio, fallback.longBio),
    location: asString(input.location, fallback.location),
    timezone: asString(input.timezone, fallback.timezone),
    email: asString(input.email, fallback.email),
    availability: asString(input.availability, fallback.availability),
    preferredRoles: asStringArray(input.preferredRoles).length ? asStringArray(input.preferredRoles) : fallback.preferredRoles,
    currentFocus: asStringArray(input.currentFocus).length ? asStringArray(input.currentFocus) : fallback.currentFocus,
    engineeringStyle: asStringArray(input.engineeringStyle).length ? asStringArray(input.engineeringStyle) : fallback.engineeringStyle,
    education: education
      ? {
          degree: asString(education.degree, fallback.education?.degree),
          institution: asString(education.institution, fallback.education?.institution),
          status: asString(education.status, fallback.education?.status),
          location: asString(education.location, fallback.education?.location),
        }
      : fallback.education,
    links: {
      ...fallback.links,
      github: cleanOptionalUrl(links.github) ?? fallback.links.github,
      linkedin: cleanOptionalUrl(links.linkedin) ?? fallback.links.linkedin,
      email: asString(links.email, fallback.links.email),
      resume: cleanOptionalUrl(links.resume) ?? fallback.links.resume,
      portfolio: cleanOptionalUrl(links.portfolio) ?? fallback.links.portfolio,
    },
    ctas: {
      primary: asString(ctas.primary, fallback.ctas.primary),
      secondary: asString(ctas.secondary, fallback.ctas.secondary),
    },
    credibility: asStringArray(input.credibility).length ? asStringArray(input.credibility) : fallback.credibility,
    name: asString(input.name, fallback.name),
    firstName: asString(input.firstName, fallback.firstName),
    lastName: asString(input.lastName, fallback.lastName),
    title: asString(input.title, fallback.title),
    tagline: asString(input.tagline, fallback.tagline),
    heroDescription: asString(input.heroDescription, fallback.heroDescription),
    contactDescription: asString(input.contactDescription, fallback.contactDescription),
    github: cleanOptionalUrl(input.github) ?? fallback.github,
    githubHandle: asString(input.githubHandle, fallback.githubHandle),
    linkedin: cleanOptionalUrl(input.linkedin) ?? fallback.linkedin,
    linkedinHandle: asString(input.linkedinHandle, fallback.linkedinHandle),
    locationShort: asString(input.locationShort, fallback.locationShort),
    profilePhoto: cleanOptionalUrl(input.profilePhoto) ?? fallback.profilePhoto,
    resumePath: cleanOptionalUrl(input.resumePath) ?? fallback.resumePath,
  };
}

export function normalizeProject(input: unknown, fallback?: Project): Project | null {
  if (!isRecord(input)) return fallback ?? null;

  const id = asString(input.id, fallback?.id);
  if (!id) return fallback ?? null;

  const priority = asNumber(input.priority ?? input.order, fallback?.priority ?? 0);
  const links = normalizeLinks(input.links, fallback?.links);
  const techStack = asStringArray(input.techStack).length
    ? asStringArray(input.techStack)
    : asStringArray(input.tech).length
      ? asStringArray(input.tech)
      : fallback?.techStack ?? [];

  return {
    ...fallback,
    id,
    title: asString(input.title, fallback?.title ?? "Untitled Project"),
    shortTitle: asString(input.shortTitle, fallback?.shortTitle),
    category: asString(input.category, fallback?.category ?? "Labs"),
    year: asString(input.year, fallback?.year),
    status: normalizeStatus(input.projectStatus ?? input.status, fallback?.status ?? "Case Study"),
    featured: asBoolean(input.featured, fallback?.featured ?? false),
    showOnHome: asBoolean(input.showOnHome, fallback?.showOnHome ?? false),
    archived: asBoolean(input.archived, fallback?.archived ?? false),
    priority,
    summary: asString(input.summary, fallback?.summary ?? fallback?.description ?? ""),
    oneLine: asString(input.oneLine, fallback?.oneLine),
    problem: asString(input.problem, fallback?.problem),
    solution: asString(input.solution, fallback?.solution),
    myRole: asString(input.myRole, fallback?.myRole),
    techStack,
    tags: asStringArray(input.tags).length ? asStringArray(input.tags) : fallback?.tags ?? [],
    architectureHighlights: asStringArray(input.architectureHighlights).length
      ? asStringArray(input.architectureHighlights)
      : asStringArray(input.highlights).length
        ? asStringArray(input.highlights)
        : fallback?.architectureHighlights ?? [],
    features: asStringArray(input.features).length ? asStringArray(input.features) : fallback?.features,
    impact: asStringArray(input.impact).length ? asStringArray(input.impact) : fallback?.impact ?? [],
    challenges: asStringArray(input.challenges).length ? asStringArray(input.challenges) : fallback?.challenges ?? [],
    learnings: asStringArray(input.learnings).length ? asStringArray(input.learnings) : fallback?.learnings ?? [],
    nextSteps: asStringArray(input.nextSteps).length ? asStringArray(input.nextSteps) : fallback?.nextSteps,
    links,
    visuals: normalizeVisuals(input.visuals, fallback?.visuals),
    description: asString(input.description, fallback?.description ?? fallback?.summary ?? ""),
    stack: techStack,
    github: links.github,
    live: links.live,
  };
}

export function normalizeProjects(input: unknown, fallback: Project[]): Project[] {
  if (!Array.isArray(input)) return fallback;

  const normalized = input
    .map((item, index) => normalizeProject(item, fallbackById(fallback, isRecord(item) ? asString(getRecordValue(item, "id")) : undefined, index)))
    .filter((item): item is Project => Boolean(item))
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeExperience(input: unknown, fallback: ExperienceItem[]): ExperienceItem[] {
  if (!Array.isArray(input)) return fallback;

  const normalized = input
    .map((item, index): ExperienceItem | null => {
      if (!isRecord(item)) return fallback[index] ?? null;
      const base = fallback[index];
      const company = asString(item.company, base?.company);
      const role = asString(item.role, base?.role);
      if (!company || !role) return base ?? null;

      return {
        ...base,
        company,
        role,
        period: asString(item.period, base?.period ?? ""),
        type: asString(item.type, base?.type),
        location: asString(item.location, base?.location),
        shortSummary: asString(item.shortSummary, base?.shortSummary ?? base?.description ?? ""),
        responsibilities: asStringArray(item.responsibilities).length ? asStringArray(item.responsibilities) : base?.responsibilities ?? [],
        impact: asStringArray(item.impact).length ? asStringArray(item.impact) : base?.impact ?? [],
        techStack: asStringArray(item.techStack).length ? asStringArray(item.techStack) : base?.techStack ?? [],
        featured: asBoolean(item.featured, base?.featured ?? false),
        description: asString(item.description, base?.description),
        bullets: asStringArray(item.bullets).length ? asStringArray(item.bullets) : base?.bullets,
      };
    })
    .filter((item): item is ExperienceItem => Boolean(item));

  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeSkills(input: unknown, fallback: SkillCategory[]): SkillCategory[] {
  if (!Array.isArray(input)) return fallback;

  const normalized = input
    .map((item, index): SkillCategory | null => {
      if (!isRecord(item)) return fallback[index] ?? null;
      const base = fallback[index];
      const name = asString(item.name, base?.name);
      if (!name) return base ?? null;

      return {
        ...base,
        name,
        summary: asString(item.summary, base?.summary ?? ""),
        skills: asStringArray(item.skills).length ? asStringArray(item.skills) : base?.skills ?? [],
        useCases: asStringArray(item.useCases).length ? asStringArray(item.useCases) : base?.useCases ?? [],
        featured: asBoolean(item.featured, base?.featured ?? false),
      };
    })
    .filter((item): item is SkillCategory => Boolean(item));

  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeAchievements(input: unknown, fallback: Achievement[]): Achievement[] {
  if (!Array.isArray(input)) return fallback;

  const normalized = input
    .map((item, index): Achievement | null => {
      if (!isRecord(item)) return fallback[index] ?? null;
      const base = fallback[index];
      const title = asString(item.title, base?.title);
      const context = asString(item.context, base?.context);
      if (!title || !context) return base ?? null;

      return {
        ...base,
        title,
        date: asString(item.date, base?.date),
        year: asString(item.year, base?.year),
        type: asString(item.type, base?.type) as Achievement["type"],
        context,
        outcome: asString(item.outcome, base?.outcome),
        proofUrl: cleanOptionalUrl(item.proofUrl) ?? base?.proofUrl,
        featured: asBoolean(item.featured, base?.featured ?? false),
        description: asString(item.description, base?.description),
      };
    })
    .filter((item): item is Achievement => Boolean(item));

  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeInterests(input: unknown, fallback: SystemEntry[]): SystemEntry[] {
  if (!Array.isArray(input)) return fallback;

  const normalized = input
    .map((item, index): SystemEntry | null => {
      if (!isRecord(item)) return fallback[index] ?? null;
      const base = fallbackById(fallback, asString(item.id), index);
      if (!base) return null;

      return {
        ...base,
        id: asString(item.id, base.id),
        title: asString(item.title, base.title),
        desc: asString(item.desc, base.desc),
        category: asString(item.category, base.category),
        featured: asBoolean(item.featured, base.featured ?? false),
        color: asString(item.color, base.color),
        bg: asString(item.bg, base.bg),
      };
    })
    .filter((item): item is SystemEntry => Boolean(item));

  return normalized.length > 0 ? normalized : fallback;
}
