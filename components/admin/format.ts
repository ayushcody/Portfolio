// Small, dependency-free helpers shared by the admin editors.

/** Lower-case, hyphenated id. Used for slugs and CMS document ids. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Lenient version for typing into an id field: keeps a trailing hyphen so "my-" can become "my-app". */
export function slugifyWhileTyping(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function toCsv(items: readonly string[] | undefined) {
  return (items ?? []).join(", ");
}

export function fromCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toLines(items: readonly string[] | undefined) {
  return (items ?? []).join("\n");
}

export function fromLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function plural(count: number, noun: string, pluralNoun = `${noun}s`) {
  return `${count} ${count === 1 ? noun : pluralNoun}`;
}

/** Turns Firebase / network errors into something an admin can act on. */
export function friendlyError(error: unknown, fallback = "Something went wrong.") {
  const raw = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code: unknown }).code) : "";
  const text = `${code} ${raw}`.toLowerCase();

  if (!raw && !code) return fallback;
  if (text.includes("permission") || text.includes("unauthorized") || text.includes("unauthenticated")) {
    return "Firebase rejected the request (permission denied). Check that you are signed in as the admin and that the rules in docs/firebase-admin-setup.md are deployed.";
  }
  if (text.includes("not configured")) {
    return "Firebase is not configured for this environment. Add the NEXT_PUBLIC_FIREBASE_* variables and restart.";
  }
  if (text.includes("network") || text.includes("offline") || text.includes("unavailable") || text.includes("failed to fetch")) {
    return "Network problem: Firebase could not be reached. Check your connection and try again.";
  }
  if (text.includes("quota") || text.includes("resource-exhausted")) {
    return "Firebase quota exceeded. Try again later.";
  }
  return raw || fallback;
}

/** Friendly Firebase Auth sign-in errors. */
export function signInError(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code: unknown }).code) : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes, then try again.";
    case "auth/user-disabled":
      return "This account has been disabled in Firebase Authentication.";
    case "auth/network-request-failed":
      return "Network problem: Firebase could not be reached.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled for this Firebase project.";
    default:
      return friendlyError(error, "Sign-in failed.");
  }
}
