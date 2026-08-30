import { siteConfig } from "@/config/portfolio";
import { achievementsData } from "@/src/data/achievements";
import { experiencesData } from "@/src/data/experience";
import { systemsData } from "@/src/data/interests";
import { profile, profileLinks } from "@/src/data/profile";
import { projectsData } from "@/src/data/projects";
import { skillCategories, skillsData } from "@/src/data/skills";

export const cmsFallbacks = {
  profile,
  profileLinks,
  projects: projectsData,
  experience: experiencesData,
  skills: skillCategories,
  skillClusters: skillsData,
  achievements: achievementsData,
  interests: systemsData,
  siteConfig,
} as const;
