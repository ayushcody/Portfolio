import { cmsItemPath, cmsSingletonPath } from "./paths";
import {
  cmsWriteTimestamps,
  readExistingCmsDocument,
  writeCmsDocument,
  writeVersionSnapshot,
} from "./firestore";
import type { CmsCollectionName, CmsWriteResult } from "./types";

type SingletonType = "profile" | "siteSettings";
type ItemCollection = Exclude<CmsCollectionName, "profile" | "siteSettings">;

function asId(id: string) {
  return id.trim();
}

async function writeCmsData(
  path: string,
  mode: "draft" | "published" | "archived",
  data: unknown,
  id?: string,
): Promise<CmsWriteResult> {
  try {
    const existing = await readExistingCmsDocument(path);
    const timestamps = cmsWriteTimestamps(mode === "published" ? "published" : "draft", existing);

    return await writeCmsDocument(path, {
      ...(typeof data === "object" && data !== null ? data : { value: data }),
      id: id ?? path.split("/").at(-1),
      status: mode,
      hidden: mode === "archived" ? true : undefined,
      archived: mode === "archived" ? true : undefined,
      ...timestamps,
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "CMS write failed.",
    };
  }
}

export async function saveSingletonDraft<T>(
  type: SingletonType,
  data: T,
): Promise<CmsWriteResult> {
  return writeCmsData(cmsSingletonPath(type, "draft"), "draft", data, type);
}

export async function publishSingleton<T>(
  type: SingletonType,
  data: T,
): Promise<CmsWriteResult> {
  const path = cmsSingletonPath(type, "published");
  const result = await writeCmsData(path, "published", data, type);
  if (result.ok) {
    const snapshot = await writeVersionSnapshot(type, type, data);
    if (!snapshot.ok) {
      return {
        ...result,
        warning: snapshot.error || "Published, but version snapshot failed.",
      };
    }
  }
  return result;
}

export async function saveItemDraft<T>(
  collection: ItemCollection,
  id: string,
  data: T,
): Promise<CmsWriteResult> {
  const itemId = asId(id);
  if (!itemId) return { ok: false, error: "CMS item id is required." };

  return writeCmsData(cmsItemPath(collection, itemId), "draft", data, itemId);
}

export async function publishItem<T>(
  collection: ItemCollection,
  id: string,
  data: T,
): Promise<CmsWriteResult> {
  const itemId = asId(id);
  if (!itemId) return { ok: false, error: "CMS item id is required." };

  const result = await writeCmsData(cmsItemPath(collection, itemId), "published", data, itemId);
  if (result.ok) {
    const snapshot = await writeVersionSnapshot(collection, itemId, data);
    if (!snapshot.ok) {
      return {
        ...result,
        warning: snapshot.error || "Published, but version snapshot failed.",
      };
    }
  }
  return result;
}

export async function archiveItem(
  collection: ItemCollection,
  id: string,
): Promise<CmsWriteResult> {
  const itemId = asId(id);
  if (!itemId) return { ok: false, error: "CMS item id is required." };

  return writeCmsData(cmsItemPath(collection, itemId), "archived", {}, itemId);
}
