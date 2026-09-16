import { asNumber, normalizeExperienceItem } from "@/lib/cms/normalize";
import type { CmsExperience } from "@/lib/cms/types";
import { checkExternalUrl } from "@/lib/urls";
import { experiencesData, type ExperienceItem } from "@/src/data/experience";
import type { FieldErrors } from "./fields";
import { fromCsv, fromLines, SLUG_PATTERN, toCsv, toLines } from "./format";
import type { CmsAdapter } from "./useCmsCollection";

/** Experience row item: order is the timeline position (0 = newest, shown first). */
export type AdminExperience = ExperienceItem & { id: string; order: number };

export type ExperienceForm = {
  id: string;
  company: string;
  companyLogo: string;
  chapterTitle: string;
  progressionLabel: string;
  role: string;
  period: string;
  type: string;
  location: string;
  shortSummary: string;
  responsibilities: string;
  impact: string;
  techStack: string;
  featured: boolean;
  order: string;
};

export type ExperiencePayload = Omit<CmsExperience, "status" | "hidden" | "createdAt" | "updatedAt" | "publishedAt" | "version"> & {
  /** Always written; "" removes a static logo. */
  companyLogo: string;
};

export function blankExperienceForm(order: number): ExperienceForm {
  return {
    id: "",
    company: "",
    companyLogo: "",
    chapterTitle: "",
    progressionLabel: "",
    role: "",
    period: "",
    type: "",
    location: "",
    shortSummary: "",
    responsibilities: "",
    impact: "",
    techStack: "",
    featured: false,
    order: String(order),
  };
}

export function experienceToForm(item: AdminExperience): ExperienceForm {
  return {
    id: item.id,
    company: item.company ?? "",
    companyLogo: item.companyLogo ?? "",
    chapterTitle: item.chapterTitle ?? "",
    progressionLabel: item.progressionLabel ?? "",
    role: item.role ?? "",
    period: item.period ?? "",
    type: item.type ?? "",
    location: item.location ?? "",
    shortSummary: item.shortSummary ?? "",
    responsibilities: toLines(item.responsibilities),
    impact: toLines(item.impact),
    techStack: toCsv(item.techStack),
    featured: Boolean(item.featured),
    order: String(Number.isFinite(item.order) && item.order < Number.MAX_SAFE_INTEGER ? item.order : 0),
  };
}

export function withExperienceOrder(form: ExperienceForm, order: number): ExperienceForm {
  return { ...form, order: String(order) };
}

export function validateExperienceForm(form: ExperienceForm, context: { isNew: boolean; takenIds: ReadonlySet<string> }): FieldErrors {
  const errors: FieldErrors = {};
  const id = form.id.trim();

  if (!id) errors.id = "Add an ID, for example the company name in lowercase.";
  else if (!SLUG_PATTERN.test(id)) errors.id = "Use lowercase letters, numbers and single hyphens.";
  else if (context.isNew && context.takenIds.has(id)) errors.id = "An experience entry with this ID already exists.";

  if (!form.company.trim()) errors.company = "Add the company name.";
  if (!form.role.trim()) errors.role = "Add the role or job title.";
  if (!form.period.trim()) errors.period = "Add the period, for example May 2026 – Present.";

  const order = form.order.trim();
  if (!order) errors.order = "Add a position (0 is the newest, shown first).";
  else if (!Number.isInteger(Number(order)) || Number(order) < 0) errors.order = "Use a whole number, 0 or higher.";

  const logo = checkExternalUrl(form.companyLogo, "image");
  if (!logo.ok) errors.companyLogo = logo.error;

  return errors;
}

export function experienceFormToPayload(form: ExperienceForm): ExperiencePayload {
  const logo = checkExternalUrl(form.companyLogo, "image");
  return {
    id: form.id.trim(),
    order: Math.max(0, Math.round(asNumber(form.order, 0))),
    featured: form.featured,
    company: form.company.trim(),
    companyLogo: logo.ok ? (logo.value ?? "") : "",
    chapterTitle: form.chapterTitle.trim(),
    progressionLabel: form.progressionLabel.trim(),
    role: form.role.trim(),
    period: form.period.trim(),
    type: form.type.trim(),
    location: form.location.trim(),
    shortSummary: form.shortSummary.trim(),
    responsibilities: fromLines(form.responsibilities),
    impact: fromLines(form.impact),
    techStack: fromCsv(form.techStack),
  };
}

const staticExperience: AdminExperience[] = experiencesData.map((item, index) => ({ ...item, order: index }));

function blankExperience(id: string): AdminExperience {
  return {
    id,
    company: "",
    role: "",
    period: "",
    shortSummary: "",
    responsibilities: [],
    impact: [],
    techStack: [],
    featured: false,
    order: Number.MAX_SAFE_INTEGER,
  };
}

function partialExperience(doc: Record<string, unknown>, fallback: AdminExperience): AdminExperience {
  const text = (key: string, current: string | undefined) => (typeof doc[key] === "string" ? String(doc[key]) : current);
  const list = (key: string, current: string[]) =>
    Array.isArray(doc[key]) ? (doc[key] as unknown[]).filter((entry): entry is string => typeof entry === "string") : current;

  return {
    ...fallback,
    company: text("company", fallback.company) ?? "",
    companyLogo: text("companyLogo", fallback.companyLogo),
    chapterTitle: text("chapterTitle", fallback.chapterTitle),
    progressionLabel: text("progressionLabel", fallback.progressionLabel),
    role: text("role", fallback.role) ?? "",
    period: text("period", fallback.period) ?? "",
    type: text("type", fallback.type),
    location: text("location", fallback.location),
    shortSummary: text("shortSummary", fallback.shortSummary) ?? "",
    responsibilities: list("responsibilities", fallback.responsibilities),
    impact: list("impact", fallback.impact),
    techStack: list("techStack", fallback.techStack),
    featured: typeof doc.featured === "boolean" ? doc.featured : fallback.featured,
  };
}

export const experienceAdapter: CmsAdapter<AdminExperience> = {
  collection: "experience",
  staticItems: staticExperience,
  idOf: (item) => item.id,
  titleOf: (item) => item.company,
  subtitleOf: (item) => [item.role, item.period].filter(Boolean).join(" · "),
  merge: (doc, base, id) => {
    const fallback = base ?? blankExperience(id);
    if (!doc) return fallback;
    const normalized = normalizeExperienceItem({ ...doc, id }, fallback);
    // normalizeExperienceItem returns the base untouched when company or role is missing;
    // incomplete CMS-only docs should still open in the editor with whatever they contain.
    const merged = normalized && normalized !== fallback ? normalized : partialExperience(doc, fallback);
    return { ...merged, id, order: asNumber(doc.order, fallback.order) };
  },
  orderOf: (item) => item.order,
};

/** Experience positions start at 0 (newest), matching the static array index. */
export const experienceSequence = (index: number) => index;
