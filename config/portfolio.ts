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
    name: `${profile.fullName} Portfolio`,
    url: "https://ayushchougula.in",
    defaultTitle: `${profile.fullName} | ${profile.headline}`,
    defaultDescription:
        "Hiring-focused portfolio for Ayush Chougula, an AI systems engineer building agentic workflows, RAG pipelines, voice AI, AI infrastructure, and full-stack AI products.",
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
