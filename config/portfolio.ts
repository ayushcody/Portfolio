import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "../lib/seo";
import { profile, type ProfileLink } from "../src/data/profile";

export type SiteConfig = {
    name: string;
    url: string;
    defaultTitle: string;
    defaultDescription: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        email?: string;
    };
    nav: ProfileLink[];
    resumePath?: string;
};

export const siteConfig: SiteConfig = {
    // SEO identity lives in lib/seo.ts (single source; override the domain with NEXT_PUBLIC_SITE_URL).
    name: SITE_NAME,
    url: SITE_URL,
    defaultTitle: SITE_TITLE,
    defaultDescription: SITE_DESCRIPTION,
    socialLinks: {
        github: profile.links.github,
        linkedin: profile.links.linkedin,
        email: profile.links.email,
    },
    nav: [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "Skills", href: "/skills" },
        { label: "Resume", href: profile.resumePath },
        { label: "Contact", href: "/#contact" },
    ],
    resumePath: profile.resumePath,
};

export * from "../src/data/profile";
export * from "../src/data/experience";
export * from "../src/data/projects";
export * from "../src/data/skills";
export * from "../src/data/achievements";
export * from "../src/data/interests";
