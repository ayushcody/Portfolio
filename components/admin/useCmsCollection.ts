"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { archiveItem, deleteItem, listItems, publishItem, saveItemDraft, type ItemCollection } from "@/lib/cms/adminWrites";
import type { CmsWriteResult } from "@/lib/cms/types";
import { friendlyError } from "./format";

export type CmsRecord = Record<string, unknown>;

/** Where the admin reads and writes CMS items. Defaults to Firestore; previews can pass an in-memory source. */
export type CmsDataSource = {
  list: (collection: ItemCollection) => Promise<CmsRecord[]>;
  saveDraft: (collection: ItemCollection, id: string, data: unknown) => Promise<CmsWriteResult>;
  publish: (collection: ItemCollection, id: string, data: unknown) => Promise<CmsWriteResult>;
  archive: (collection: ItemCollection, id: string) => Promise<CmsWriteResult>;
  remove: (collection: ItemCollection, id: string) => Promise<CmsWriteResult>;
};

export const firestoreDataSource: CmsDataSource = {
  list: listItems,
  saveDraft: saveItemDraft,
  publish: publishItem,
  archive: archiveItem,
  remove: deleteItem,
};

/**
 * How a row relates to the public site (mirrors lib/cms/firestore readMergedCmsCollection):
 * - static:   only in src/data, shown as-is.
 * - override: published CMS doc replacing a static item.
 * - cms-only: published CMS doc with no static counterpart.
 * - draft:    CMS draft; the public site ignores it (static version, if any, stays live).
 * - archived: archived/hidden CMS doc; the id is removed from the public site.
 */
export type CmsRowState = "static" | "override" | "cms-only" | "draft" | "archived";

export type CmsRow<T> = {
  id: string;
  state: CmsRowState;
  hasStatic: boolean;
  doc?: CmsRecord;
  /** Static item merged with the CMS doc: what the editor loads. */
  item: T;
  title: string;
  subtitle: string;
  order: number;
};

export type CmsAdapter<T> = {
  collection: ItemCollection;
  staticItems: readonly T[];
  idOf: (item: T) => string;
  titleOf: (item: T) => string;
  subtitleOf: (item: T) => string;
  /** Merge a CMS doc over its static base (or a blank item for CMS-only docs). */
  merge: (doc: CmsRecord | undefined, base: T | undefined, id: string) => T;
  /** Position used for sorting and reordering. */
  orderOf: (item: T, doc: CmsRecord | undefined, staticIndex: number | undefined) => number;
};

export function rowStateOf(doc: CmsRecord | undefined, hasStatic: boolean): CmsRowState {
  if (!doc) return "static";
  if (doc.status === "archived" || doc.hidden === true) return "archived";
  if (doc.status === "published") return hasStatic ? "override" : "cms-only";
  return "draft";
}

export function buildRows<T>(adapter: CmsAdapter<T>, docs: CmsRecord[]): CmsRow<T>[] {
  const docsById = new Map(docs.map((doc) => [String(doc.id), doc]));
  const rows: CmsRow<T>[] = [];
  const staticIds = new Set<string>();

  adapter.staticItems.forEach((base, index) => {
    const id = adapter.idOf(base);
    if (!id || staticIds.has(id)) return;
    staticIds.add(id);
    const doc = docsById.get(id);
    const item = doc ? adapter.merge(doc, base, id) : base;
    rows.push({
      id,
      state: rowStateOf(doc, true),
      hasStatic: true,
      doc,
      item,
      title: adapter.titleOf(item) || id,
      subtitle: adapter.subtitleOf(item),
      order: adapter.orderOf(item, doc, index),
    });
  });

  for (const doc of docs) {
    const id = String(doc.id ?? "");
    if (!id || staticIds.has(id)) continue;
    const item = adapter.merge(doc, undefined, id);
    rows.push({
      id,
      state: rowStateOf(doc, false),
      hasStatic: false,
      doc,
      item,
      title: adapter.titleOf(item) || id,
      subtitle: adapter.subtitleOf(item),
      order: adapter.orderOf(item, doc, undefined),
    });
  }

  // Visible items in public order first; archived items last.
  return rows.sort((a, b) => {
    const archivedA = a.state === "archived" ? 1 : 0;
    const archivedB = b.state === "archived" ? 1 : 0;
    if (archivedA !== archivedB) return archivedA - archivedB;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

export type LoadState = "loading" | "ready" | "error";

/** Static items merged with every CMS doc (drafts included) for one collection. */
export function useCmsCollection<T>(adapter: CmsAdapter<T>, source: CmsDataSource) {
  const [docs, setDocs] = useState<CmsRecord[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let active = true;
    source
      .list(adapter.collection)
      .then((next) => {
        if (!active) return;
        setDocs(next);
        setError(null);
        setState("ready");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(friendlyError(loadError, "Could not load CMS content."));
        setState("error");
      });
    return () => {
      active = false;
    };
  }, [adapter.collection, source, requestId]);

  /** Re-fetch. `quiet` keeps the current rows on screen while refreshing (after a save). */
  const reload = useCallback((quiet = false) => {
    if (!quiet) setState("loading");
    setRequestId((value) => value + 1);
  }, []);

  const rows = useMemo(() => buildRows(adapter, docs), [adapter, docs]);

  return { rows, state, error, reload };
}
