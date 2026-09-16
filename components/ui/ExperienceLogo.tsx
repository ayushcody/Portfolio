"use client";

import { useState } from "react";
import { initialsFrom, safeUrl } from "@/lib/urls";
import { cn } from "@/lib/utils";

type ExperienceLogoProps = {
  company: string;
  logo?: string;
  /** Rendered square size in px (the box never changes size, logo or not). */
  size?: number;
  /** Accent for the initials placeholder. */
  tone?: "yellow" | "lilac" | "coral" | "sage" | "paper";
  className?: string;
};

/**
 * Fixed-size company mark. Shows the logo (contained, never stretched) when one is set and loads;
 * otherwise a styled initials block, so a missing or broken logo never leaves a broken image.
 * The initials block is decorative: the company name is always rendered next to it.
 */
export function ExperienceLogo({ company, logo, size = 56, tone = "paper", className }: ExperienceLogoProps) {
  const src = safeUrl(logo);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span
      className={cn("logo-mark", !showImage && `logo-mark--placeholder logo-mark--${tone}`, className)}
      style={{ "--logo-size": `${size}px` } as React.CSSProperties}
      aria-hidden={showImage ? undefined : true}
    >
      {showImage ? (
        // Plain img: logos may be SVG or remote Storage URLs; the box reserves the space so nothing shifts.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${company} logo`}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <span aria-hidden="true">{initialsFrom(company)}</span>
      )}
    </span>
  );
}
