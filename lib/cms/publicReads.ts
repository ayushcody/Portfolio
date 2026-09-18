import type { Achievement } from "@/src/data/achievements";
import type { ExperienceItem } from "@/src/data/experience";
import type { SystemEntry } from "@/src/data/interests";
import type { Profile } from "@/src/data/profile";
import type { Project } from "@/src/data/projects";
import type { SkillCategory } from "@/src/data/skills";
import { cmsFallbacks } from "./fallbacks";
import { CMS_PATHS } from "./paths";
import { readCmsCollection, readCmsDocument, readMergedCmsCollection } from "./firestore";
import {
  asNumber,
  normalizeAchievements,
  normalizeExperienceItem,
  normalizeInterests,
  normalizeProfile,
  normalizeProject,
  normalizeSkills,
} from "./normalize";
import type { CmsReadResult } from "./types";

export async function getPublicProfile(): Promise<CmsReadResult<Profile>> {
  return readCmsDocument(CMS_PATHS.profilePublished, cmsFallbacks.profile, normalizeProfile);
}

const byPriority = (items: Project[]) => [...items].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

/** Static projects merged with published CMS overrides, sorted by priority (ascending). */
export async function getPublicProjects(): Promise<CmsReadResult<Project[]>> {
  return readMergedCmsCollection<Project>(
    CMS_PATHS.projects,
    [...cmsFallbacks.projects],
    (record, base) => normalizeProject(record, base),
    byPriority,
  );
}

export async function getPublicProject(id: string): Promise<Project | undefined> {
  const { data } = await getPublicProjects();
  return data.find((project) => project.id === id);
}

export type PublicExperience = ExperienceItem & { order?: number };

/** Static experience merged with published CMS overrides, newest first (by order, then source order). */
export async function getPublicExperience(): Promise<CmsReadResult<PublicExperience[]>> {
  const fallback: PublicExperience[] = cmsFallbacks.experience.map((item, index) => ({ ...item, order: index }));
  return readMergedCmsCollection<PublicExperience>(
    CMS_PATHS.experience,
    fallback,
    (record, base) => {
      const item = normalizeExperienceItem(record, base);
      return item ? { ...item, order: asNumber(record.order, base?.order ?? Number.MAX_SAFE_INTEGER) } : null;
    },
    (items) => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  );
}

export async function getPublicSkills(): Promise<CmsReadResult<SkillCategory[]>> {
  return readCmsCollection(CMS_PATHS.skills, [...cmsFallbacks.skills], normalizeSkills);
}

export async function getPublicAchievements(): Promise<CmsReadResult<Achievement[]>> {
  return readCmsCollection(CMS_PATHS.achievements, [...cmsFallbacks.achievements], normalizeAchievements);
}

export async function getPublicInterests(): Promise<CmsReadResult<SystemEntry[]>> {
  return readCmsCollection(CMS_PATHS.interests, [...cmsFallbacks.interests], normalizeInterests);
}
