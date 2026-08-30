import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import { CMS_PATHS } from "./paths";
import type { CmsReadResult, CmsWriteResult } from "./types";

type JsonRecord = Record<string, unknown>;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Firestore operation failed.";
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeForFirestore(value: unknown): unknown {
  if (value === undefined || typeof value === "function" || typeof value === "symbol") {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined);
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, sanitizeForFirestore(item)] as const)
        .filter(([, item]) => item !== undefined),
    );
  }

  return value;
}

function assertCmsDb(): NonNullable<typeof db> | null {
  if (!isFirebaseConfigured || !db) return null;
  return db;
}

export function fallbackReadResult<T>(data: T, error?: string): CmsReadResult<T> {
  return {
    data,
    source: "fallback",
    error,
  };
}

export async function readCmsDocument<T>(
  path: string,
  fallback: T,
  normalize: (data: unknown, fallback: T) => T,
): Promise<CmsReadResult<T>> {
  const database = assertCmsDb();
  if (!database) return fallbackReadResult(fallback);

  try {
    const snapshot = await getDoc(doc(database, path));
    if (!snapshot.exists()) return fallbackReadResult(fallback);

    return {
      data: normalize({ id: snapshot.id, ...snapshot.data() }, fallback),
      source: "firestore",
    };
  } catch (error) {
    return fallbackReadResult(fallback, getErrorMessage(error));
  }
}

export async function readCmsCollection<T>(
  path: string,
  fallback: T[],
  normalize: (data: unknown, fallback: T[]) => T[],
): Promise<CmsReadResult<T[]>> {
  const database = assertCmsDb();
  if (!database) return fallbackReadResult(fallback);

  try {
    const snapshot = await getDocs(collection(database, path));
    const published = snapshot.docs
      .map((item): JsonRecord => ({ id: item.id, ...item.data() }))
      .filter((item) => item.status === "published" && item.hidden !== true);

    if (published.length === 0) return fallbackReadResult(fallback);

    return {
      data: normalize(sortCmsRecords(published), fallback),
      source: "firestore",
    };
  } catch (error) {
    return fallbackReadResult(fallback, getErrorMessage(error));
  }
}

export async function writeCmsDocument(path: string, data: unknown): Promise<CmsWriteResult> {
  const database = assertCmsDb();
  if (!database) {
    return {
      ok: false,
      error: "Firebase is not configured.",
    };
  }

  try {
    const sanitized = sanitizeForFirestore(data);
    if (!isRecord(sanitized)) {
      return {
        ok: false,
        error: "CMS data must be a JSON-safe object.",
      };
    }

    await setDoc(doc(database, path), sanitized, { merge: true });

    return {
      ok: true,
      id: path.split("/").at(-1),
    };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(error),
    };
  }
}

export async function readExistingCmsDocument(path: string): Promise<DocumentData | null> {
  const database = assertCmsDb();
  if (!database) return null;

  const snapshot = await getDoc(doc(database, path));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function writeVersionSnapshot(contentType: string, contentId: string, data: unknown): Promise<CmsWriteResult> {
  const id = `${Date.now()}-${contentType}-${contentId}`.replace(/[^a-zA-Z0-9_-]/g, "-");

  return writeCmsDocument(`${CMS_PATHS.versions}/${id}`, {
    contentType,
    contentId,
    publishedAt: new Date().toISOString(),
    data,
  });
}

export function cmsWriteTimestamps(mode: "draft" | "published", existing?: DocumentData | null) {
  const version = typeof existing?.version === "number" ? existing.version + 1 : 1;
  const now = new Date().toISOString();

  return {
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    publishedAt: mode === "published" ? now : existing?.publishedAt ?? null,
    version,
  };
}

export function sortCmsRecords<T extends JsonRecord>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
    const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;

    const priorityA = typeof a.priority === "number" ? a.priority : Number.MAX_SAFE_INTEGER;
    const priorityB = typeof b.priority === "number" ? b.priority : Number.MAX_SAFE_INTEGER;
    if (priorityA !== priorityB) return priorityA - priorityB;

    const labelA = String(a.title || a.name || a.company || a.id || "");
    const labelB = String(b.title || b.name || b.company || b.id || "");
    return labelA.localeCompare(labelB);
  });
}
