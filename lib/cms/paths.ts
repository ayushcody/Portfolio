import type { CmsCollectionName } from "./types";

export const CMS_ROOT = "cms";

export const CMS_PATHS = {
  profileDraft: "cms/profile/states/draft",
  profilePublished: "cms/profile/states/published",
  siteSettingsDraft: "cms/siteSettings/states/draft",
  siteSettingsPublished: "cms/siteSettings/states/published",
  projects: "cms/projects/items",
  experience: "cms/experience/items",
  skills: "cms/skills/items",
  achievements: "cms/achievements/items",
  interests: "cms/interests/items",
  blogPosts: "cms/blogPosts/items",
  versions: "cms/versions/items",
} as const;

const itemCollections: Record<CmsCollectionName, string> = {
  profile: "cms/profile/states",
  siteSettings: "cms/siteSettings/states",
  projects: CMS_PATHS.projects,
  experience: CMS_PATHS.experience,
  skills: CMS_PATHS.skills,
  achievements: CMS_PATHS.achievements,
  interests: CMS_PATHS.interests,
  blogPosts: CMS_PATHS.blogPosts,
};

export function cmsItemPath(collection: CmsCollectionName, id: string): string {
  return `${itemCollections[collection]}/${encodeURIComponent(id)}`;
}

export function cmsSingletonPath(type: "profile" | "siteSettings", state: "draft" | "published"): string {
  if (type === "profile") {
    return state === "draft" ? CMS_PATHS.profileDraft : CMS_PATHS.profilePublished;
  }

  return state === "draft" ? CMS_PATHS.siteSettingsDraft : CMS_PATHS.siteSettingsPublished;
}
