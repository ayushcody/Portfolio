import type { Achievement } from "@/src/data/achievements";
import type { ExperienceItem } from "@/src/data/experience";
import type { Project, ProjectLinkSet, ProjectVisuals } from "@/src/data/projects";
import type { Profile } from "@/src/data/profile";
import type { SkillCategory } from "@/src/data/skills";
import type { SystemEntry } from "@/src/data/interests";

export type CmsStatus = "draft" | "published" | "archived";

export type CmsTimestamp = string | number | null;

export type CmsMeta = {
  id: string;
  status: CmsStatus;
  order: number;
  featured?: boolean;
  hidden?: boolean;
  createdAt?: CmsTimestamp;
  updatedAt?: CmsTimestamp;
  publishedAt?: CmsTimestamp;
  version?: number;
};

export type CmsPublishState<T> = {
  draft?: T;
  published?: T;
};

export type CmsReadResult<T> = {
  data: T;
  source: "firestore" | "fallback";
  error?: string;
};

export type CmsWriteResult = {
  ok: boolean;
  error?: string;
  id?: string;
  warning?: string;
};

export type CmsLinkSet = {
  github?: string;
  linkedin?: string;
  email?: string;
  resume?: string;
  portfolio?: string;
  live?: string;
  demo?: string;
  caseStudy?: string;
  video?: string;
  loom?: string;
  documentation?: string;
};

export type CmsEducation = {
  degree?: string;
  institution?: string;
  status?: string;
  cgpa?: string;
  location?: string;
};

export type CmsTheme = {
  color?: string;
  bg?: string;
};

export type CmsProfile = CmsMeta &
  Pick<
    Profile,
    | "fullName"
    | "initials"
    | "headline"
    | "role"
    | "shortBio"
    | "longBio"
    | "location"
    | "timezone"
    | "email"
    | "availability"
    | "preferredRoles"
    | "currentFocus"
    | "engineeringStyle"
    | "education"
    | "ctas"
    | "credibility"
    | "profilePhoto"
  > & {
    links: CmsLinkSet;
  };

export type CmsNavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type CmsSiteSettings = CmsMeta & {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  nav: CmsNavItem[];
  socialLinks: CmsLinkSet;
  resumePath?: string;
  seoKeywords: string[];
};

export type CmsProject = CmsMeta &
  Pick<
    Project,
    | "title"
    | "shortTitle"
    | "category"
    | "year"
    | "showOnHome"
    | "archived"
    | "summary"
    | "oneLine"
    | "problem"
    | "solution"
    | "myRole"
    | "techStack"
    | "tags"
    | "architectureHighlights"
    | "features"
    | "impact"
    | "challenges"
    | "learnings"
    | "nextSteps"
  > & {
    projectStatus: Project["status"];
    priority: number;
    links: ProjectLinkSet;
    visuals?: ProjectVisuals;
    iconKey?: string;
    theme?: CmsTheme;
  };

export type CmsExperience = CmsMeta &
  Pick<
    ExperienceItem,
    | "company"
    | "companyLogo"
    | "chapterTitle"
    | "progressionLabel"
    | "role"
    | "period"
    | "type"
    | "location"
    | "shortSummary"
    | "responsibilities"
    | "impact"
    | "techStack"
  >;

export type CmsSkillCategory = CmsMeta &
  Pick<SkillCategory, "name" | "summary" | "skills" | "useCases"> & {
    iconKey?: string;
    theme?: CmsTheme;
  };

export type CmsAchievement = CmsMeta &
  Pick<
    Achievement,
    "title" | "date" | "year" | "type" | "context" | "outcome" | "proofUrl"
  > & {
    proofLabel?: string;
    image?: string;
    imageAlt?: string;
  };

export type CmsInterest = CmsMeta &
  Pick<SystemEntry, "title" | "desc" | "category"> & {
    iconKey?: string;
    theme?: CmsTheme;
  };

export type CmsBlogPost = CmsMeta & {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
  published: boolean;
};

export type CmsCollectionName =
  | "profile"
  | "siteSettings"
  | "projects"
  | "experience"
  | "skills"
  | "achievements"
  | "interests"
  | "blogPosts";
