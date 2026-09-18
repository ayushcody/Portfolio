// URL validation shared by the admin console (write time) and the CMS normalizers (read time).
// Only http(s) URLs and root-relative paths are ever rendered, so a malformed or
// `javascript:` value stored in Firestore can never reach an href or src.

export type UrlCheck =
  | { ok: true; value: string | undefined }
  | { ok: false; error: string };

export type UrlKind = "any" | "github" | "loom" | "image";

const HOSTNAME = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

function hasValidHost(url: URL) {
  return url.hostname === "localhost" || HOSTNAME.test(url.hostname);
}

/** True for absolute http(s) URLs with a real hostname. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && hasValidHost(url) && !url.username && !url.password;
  } catch {
    return false;
  }
}

/** True for same-origin paths such as `/profile.png` (but not protocol-relative `//host`). */
export function isRootRelativePath(value: string): boolean {
  return /^\/(?!\/)[^\s\\]*$/.test(value);
}

/** Read-time guard: returns the value only if it is safe to use as an href/src. */
export function safeUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return isHttpUrl(trimmed) || isRootRelativePath(trimmed) ? trimmed : undefined;
}

/**
 * Write-time validation used by the admin console.
 * - Empty input is valid and means "no link".
 * - A bare domain such as `example.com/path` or `www.example.com` is normalized to https.
 * - Words without a domain (`hello`), markdown (`[x](y)`), whitespace and non-http schemes are rejected.
 */
export function checkExternalUrl(input: string | undefined, kind: UrlKind = "any"): UrlCheck {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: true, value: undefined };

  if (kind === "image" && isRootRelativePath(raw)) return { ok: true, value: raw };

  if (/\s/.test(raw) || /[[\]<>"'`]/.test(raw)) {
    return { ok: false, error: "Paste a plain URL without spaces, brackets or quotes." };
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  if (hasScheme && !/^https?:\/\//i.test(raw)) {
    return { ok: false, error: "Only http:// and https:// links are allowed." };
  }

  const candidate = hasScheme ? raw : `https://${raw.replace(/^\/\//, "")}`;
  if (!isHttpUrl(candidate)) {
    return { ok: false, error: "Enter a full URL, for example https://example.com." };
  }

  const url = new URL(candidate);
  const host = url.hostname.replace(/^www\./, "");

  if (kind === "github") {
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    if (host !== "github.com" || !owner) {
      return { ok: false, error: "Use a GitHub link such as https://github.com/owner/repo." };
    }
    if (!repo && owner) {
      // A profile link is allowed, but a repository link is expected for projects.
      return { ok: true, value: `https://github.com/${owner}` };
    }
  }

  if (kind === "loom") {
    if (host !== "loom.com" || !/^\/(share|embed)\/[a-z0-9]+/i.test(url.pathname)) {
      return { ok: false, error: "Use a Loom share link such as https://www.loom.com/share/…" };
    }
  }

  if (url.protocol === "http:" && url.hostname !== "localhost") {
    url.protocol = "https:";
  }

  return { ok: true, value: url.toString() };
}

const NAME_NOISE = /^(llp|llc|ltd|inc|pvt|private|limited|co|corp|ai|for|of|and|the|at|in)$/i;

/**
 * Monogram for logo placeholders: "Association for Cyber Security" -> "AC",
 * "Persistent Systems Inc." -> "PS", "Quensulting AI LLP" -> "Q" (legal suffixes and "AI" are skipped).
 */
export function initialsFrom(name: string, max = 2): string {
  const words = name.split(/[\s\-_/&.,]+/).filter(Boolean);
  const meaningful = words.filter((word) => !NAME_NOISE.test(word));
  const letters = (meaningful.length ? meaningful : words).map((word) => word[0]).join("");
  return (letters || name.slice(0, 1)).slice(0, max).toUpperCase();
}
