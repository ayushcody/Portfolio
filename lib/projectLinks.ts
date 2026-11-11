import type { Project, ProjectLinks } from "@/src/data/projectSchema";
import { safeUrl } from "@/lib/urls";

export type ProjectLinkKind = keyof ProjectLinks;

export type ProjectLink = {
  kind: ProjectLinkKind;
  label: string;
  href: string;
  /** Accessible name, e.g. "DocuMind source code on GitHub (opens in a new tab)". */
  ariaLabel: string;
  /** External links open in a new tab; the write-up is an internal page. */
  external: boolean;
  primary: boolean;
};

// Order is the visual hierarchy for a recruiter: try it, watch it, read the code, read the write-up.
const LINK_ORDER: { kind: ProjectLinkKind; label: string; describe: (title: string) => string }[] = [
  { kind: "demo", label: "Live demo", describe: (title) => `Open the live ${title} demo` },
  { kind: "video", label: "Video", describe: (title) => `Watch the ${title} walkthrough video` },
  { kind: "repo", label: "Code", describe: (title) => `${title} source code on GitHub` },
  { kind: "writeup", label: "Write-up", describe: (title) => `Read the ${title} write-up` },
];

/**
 * Normalized, de-duplicated list of the links a project actually has.
 * Empty or unsafe values are dropped, so callers can render the list as-is
 * and skip the whole row when it is empty.
 */
export function getProjectLinks(project: Pick<Project, "title" | "links">): ProjectLink[] {
  const seen = new Set<string>();
  const links: ProjectLink[] = [];

  for (const { kind, label, describe } of LINK_ORDER) {
    const href = safeUrl(project.links?.[kind]);
    if (!href || seen.has(href)) continue;
    seen.add(href);
    const external = !href.startsWith("/");
    links.push({ kind, label, href, external, ariaLabel: external ? `${describe(project.title)} (opens in a new tab)` : describe(project.title), primary: false });
  }

  if (links[0]?.kind === "demo") links[0].primary = true;
  return links;
}
