import type { Achievement } from "@/src/data/achievements";
import type { ExperienceItem } from "@/src/data/experience";
import type { SystemEntry } from "@/src/data/interests";
import type { Profile } from "@/src/data/profile";
import type { Project } from "@/src/data/projects";
import type { SkillCategory } from "@/src/data/skills";
import { cmsFallbacks } from "./fallbacks";
import { CMS_PATHS } from "./paths";
import { readCmsCollection, readCmsDocument } from "./firestore";
import {
  normalizeAchievements,
  normalizeExperience,
  normalizeInterests,
  normalizeProfile,
  normalizeProjects,
  normalizeSkills,
} from "./normalize";
import type { CmsReadResult } from "./types";

export async function getPublicProfile(): Promise<CmsReadResult<Profile>> {
  return readCmsDocument(CMS_PATHS.profilePublished, cmsFallbacks.profile, normalizeProfile);
}

export async function getPublicProjects(): Promise<CmsReadResult<Project[]>> {
  return readCmsCollection(CMS_PATHS.projects, [...cmsFallbacks.projects], normalizeProjects);
}

export async function getPublicExperience(): Promise<CmsReadResult<ExperienceItem[]>> {
  return readCmsCollection(CMS_PATHS.experience, [...cmsFallbacks.experience], normalizeExperience);
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
