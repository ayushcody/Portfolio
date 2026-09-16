import type { Project, ProjectLinkSet } from "@/src/data/projects";
import { safeUrl } from "@/lib/urls";

export type ProjectLinkKind = "live" | "github" | "loom" | "documentation" | "caseStudy" | "demo" | "video";

export type ProjectLink = {
  kind: ProjectLinkKind;
  label: string;
  href: string;
  /** Accessible name, e.g. "DocuMind source on GitHub (opens in a new tab)". */
  ariaLabel: string;
  primary: boolean;
};

// Order is the visual hierarchy: the deployed product first, then source, walkthrough and docs.
const LINK_ORDER: { kind: ProjectLinkKind; label: string; describe: (title: string) => string }[] = [
  { kind: "live", label: "View live", describe: (title) => `Open the live ${title}` },
  { kind: "github", label: "GitHub", describe: (title) => `${title} source on GitHub` },
  { kind: "loom", label: "Loom walkthrough", describe: (title) => `Watch the ${title} walkthrough on Loom` },
  { kind: "documentation", label: "Docs", describe: (title) => `Read the ${title} documentation` },
  { kind: "caseStudy", label: "Case study", describe: (title) => `Read the ${title} case study` },
  { kind: "demo", label: "Demo", describe: (title) => `Open the ${title} demo` },
  { kind: "video", label: "Video", describe: (title) => `Watch the ${title} video` },
];

/**
 * Normalized, de-duplicated list of the links a project actually has.
 * Empty or unsafe values are dropped, so callers can render the list as-is
 * and skip the whole row when it is empty.
 */
export function getProjectLinks(project: Pick<Project, "title" | "links"> & { github?: string; live?: string }): ProjectLink[] {
  const source: ProjectLinkSet = {
    ...project.links,
    github: project.links?.github || project.github,
    live: project.links?.live || project.live,
  };
  const seen = new Set<string>();
  const links: ProjectLink[] = [];

  for (const { kind, label, describe } of LINK_ORDER) {
    const href = safeUrl(source[kind]);
    if (!href || seen.has(href)) continue;
    seen.add(href);
    links.push({ kind, label, href, ariaLabel: `${describe(project.title)} (opens in a new tab)`, primary: false });
  }

  // The first link becomes the primary action only when it is a deployed product.
  if (links[0]?.kind === "live") links[0].primary = true;
  return links;
}
