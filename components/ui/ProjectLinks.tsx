import { ArrowUpRight, BookText, FileText, Github, Globe, PlayCircle, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getProjectLinks, type ProjectLinkKind } from "@/lib/projectLinks";
import type { Project } from "@/src/data/projects";
import { cn } from "@/lib/utils";

const icons: Record<ProjectLinkKind, LucideIcon> = {
  live: Globe,
  github: Github,
  loom: PlayCircle,
  documentation: BookText,
  caseStudy: FileText,
  demo: Globe,
  video: Video,
};

type ProjectLinksProps = {
  project: Pick<Project, "title" | "links"> & { github?: string; live?: string };
  /**
   * `full`: primary brutal button for the live product + text links (case study pages).
   * `compact`: square icon buttons (cards and rows).
   */
  variant?: "full" | "compact";
  className?: string;
  /** Limit for compact rows. */
  max?: number;
};

/** Renders only the links a project has. Returns null when there are none, so no empty row is left behind. */
export function ProjectLinks({ project, variant = "full", className, max }: ProjectLinksProps) {
  const links = getProjectLinks(project).slice(0, max);
  if (links.length === 0) return null;

  if (variant === "compact") {
    return (
      <ul className={cn("project-links project-links--compact", className)} aria-label={`${project.title} links`}>
        {links.map((link) => {
          const Icon = icons[link.kind];
          return (
            <li key={link.kind}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel} title={link.label} className="icon-button">
                <Icon size={18} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={cn("project-links", className)} aria-label={`${project.title} links`}>
      {links.map((link) => {
        const Icon = icons[link.kind];
        return (
          <li key={link.kind}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className={link.primary ? "brutal-button" : "brutal-button brutal-button--secondary"}
            >
              {link.primary ? null : <Icon size={17} aria-hidden="true" />}
              {link.label}
              <ArrowUpRight size={link.primary ? 19 : 16} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
