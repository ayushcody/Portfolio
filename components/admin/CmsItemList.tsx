"use client";

import { useState, type ReactNode, type RefObject } from "react";
import { Archive, ArchiveRestore, ArrowDown, ArrowUp, ExternalLink, Inbox, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CmsRow, CmsRowState, LoadState } from "./useCmsCollection";

export const ROW_STATE_LABEL: Record<CmsRowState, string> = {
  static: "Static only",
  override: "Published override",
  "cms-only": "CMS only",
  draft: "Draft",
  archived: "Archived",
};

const ROW_STATE_COUNT: Record<CmsRowState, [string, string]> = {
  static: ["static only", "static only"],
  override: ["published override", "published overrides"],
  "cms-only": ["CMS only", "CMS only"],
  draft: ["draft", "drafts"],
  archived: ["archived", "archived"],
};

export function rowStateHint(row: Pick<CmsRow<unknown>, "state" | "hasStatic">) {
  switch (row.state) {
    case "static":
      return "From src/data, live";
    case "override":
      return "CMS version live";
    case "cms-only":
      return "Published, live";
    case "draft":
      return row.hasStatic ? "Not public; static version live" : "Not on the site";
    case "archived":
      return "Hidden from the site";
  }
}

export function StateBadge({ state }: { state: CmsRowState }) {
  return <span className={`adm-badge adm-badge--${state}`}>{ROW_STATE_LABEL[state]}</span>;
}

type CmsItemListProps<T> = {
  headingId: string;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  noun: string;
  nounPlural: string;
  rows: CmsRow<T>[];
  loadState: LoadState;
  loadError: string | null;
  onRetry: () => void;
  selectedId: string | null;
  /** Row currently being written (shows a spinner). */
  busyId: string | null;
  /** True while any list operation runs: actions are announced as unavailable instead of being removed from the tab order. */
  locked: boolean;
  orderLabel: (row: CmsRow<T>) => string;
  previewHref?: (row: CmsRow<T>) => string | undefined;
  onCreate: () => void;
  onEdit: (row: CmsRow<T>) => void;
  onMove: (row: CmsRow<T>, direction: -1 | 1) => void;
  onArchive: (row: CmsRow<T>) => void;
  onRestore: (row: CmsRow<T>) => void;
  onDelete: (row: CmsRow<T>) => void;
};

function ActionButton({
  label,
  icon,
  onClick,
  unavailable,
  reason,
  tone,
  iconOnly,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  unavailable?: boolean;
  reason?: string;
  tone?: "danger";
  iconOnly?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn("adm-btn adm-btn--row", iconOnly && "adm-btn--icon", tone === "danger" && "adm-btn--danger-text")}
      aria-disabled={unavailable || undefined}
      aria-label={iconOnly ? label : undefined}
      title={unavailable && reason ? reason : iconOnly ? label : undefined}
      onClick={() => {
        if (!unavailable) onClick();
      }}
    >
      {icon}
      {iconOnly ? null : <span>{label}</span>}
    </button>
  );
}

/** The item list shared by the Projects and Experience editors. */
export function CmsItemList<T>({
  headingId,
  headingRef,
  noun,
  nounPlural,
  rows,
  loadState,
  loadError,
  onRetry,
  selectedId,
  busyId,
  locked,
  orderLabel,
  previewHref,
  onCreate,
  onEdit,
  onMove,
  onArchive,
  onRestore,
  onDelete,
}: CmsItemListProps<T>) {
  const [filter, setFilter] = useState("");
  const query = filter.trim().toLowerCase();
  const visibleRows = query
    ? rows.filter((row) => `${row.title} ${row.id} ${row.subtitle}`.toLowerCase().includes(query))
    : rows;
  const activeRows = rows.filter((row) => row.state !== "archived");
  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.state] = (acc[row.state] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="adm-list" aria-labelledby={headingId} aria-busy={loadState === "loading" || undefined}>
      <div className="adm-list__head">
        <h3 id={headingId} ref={headingRef} tabIndex={-1} className="adm-list__title">
          All {nounPlural}
          {loadState === "ready" ? <span className="adm-count">{rows.length}</span> : null}
        </h3>
        <button type="button" className="adm-btn" onClick={onCreate}>
          <Plus size={15} aria-hidden="true" />
          New {noun}
        </button>
      </div>

      {loadState === "ready" && rows.length > 0 ? (
        <div className="adm-list__tools">
          <label htmlFor={`${headingId}-filter`} className="visually-hidden">
            Filter {nounPlural}
          </label>
          <input
            id={`${headingId}-filter`}
            type="search"
            className="adm-input adm-input--compact"
            placeholder={`Filter ${nounPlural} by name or ID`}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <p className="adm-list__summary">
            {(Object.keys(ROW_STATE_COUNT) as CmsRowState[])
              .filter((state) => counts[state])
              .map((state) => `${counts[state]} ${ROW_STATE_COUNT[state][counts[state] === 1 ? 0 : 1]}`)
              .join(" · ")}
          </p>
        </div>
      ) : null}

      {loadState === "loading" ? (
        <div className="adm-list__placeholder" role="status">
          <Loader2 size={18} className="adm-spin" aria-hidden="true" />
          Loading {nounPlural}…
        </div>
      ) : null}

      {loadState === "error" ? (
        <div className="state-note state-note--error adm-list__placeholder">
          <div>
            <strong>Could not load {nounPlural}.</strong>
            <p>{loadError}</p>
            <button type="button" className="adm-btn adm-mt-2" onClick={onRetry}>
              <RefreshCw size={15} aria-hidden="true" />
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {loadState === "ready" && rows.length === 0 ? (
        <div className="state-note adm-list__placeholder">
          <Inbox size={18} aria-hidden="true" />
          <div>
            <strong>No {nounPlural} yet.</strong>
            <p>Create the first {noun} to add it to the site.</p>
          </div>
        </div>
      ) : null}

      {loadState === "ready" && rows.length > 0 && visibleRows.length === 0 ? (
        <p className="adm-list__placeholder adm-muted">No {nounPlural} match “{filter}”.</p>
      ) : null}

      {loadState === "ready" && visibleRows.length > 0 ? (
        <ol className="adm-rows">
          {visibleRows.map((row) => {
            const activeIndex = activeRows.indexOf(row);
            const archived = row.state === "archived";
            const isBusy = busyId === row.id;
            const preview = previewHref?.(row);
            const moveReason = locked
              ? "Wait for the current change to finish"
              : query
                ? "Clear the filter to reorder"
                : archived
                  ? "Archived items are not ordered"
                  : undefined;
            const canMoveUp = !moveReason && activeIndex > 0;
            const canMoveDown = !moveReason && activeIndex >= 0 && activeIndex < activeRows.length - 1;

            return (
              <li key={row.id} className={cn("adm-row", selectedId === row.id && "is-selected", archived && "is-archived")} aria-current={selectedId === row.id || undefined}>
                <div className="adm-row__main">
                  <span className="adm-row__order">
                    <span className="visually-hidden">{archived ? "Not ordered" : "Position "}</span>
                    <span aria-hidden={archived || undefined}>{archived ? "–" : orderLabel(row)}</span>
                  </span>
                  <div className="adm-row__text">
                    <p className="adm-row__title">
                      {row.title}
                      {isBusy ? <Loader2 size={14} className="adm-spin" role="img" aria-label="Saving" /> : null}
                    </p>
                    <p className="adm-row__meta">
                      <code className="adm-code">{row.id}</code>
                      {row.subtitle ? <span> · {row.subtitle}</span> : null}
                    </p>
                    <p className="adm-row__state">
                      <StateBadge state={row.state} />
                      <span className="adm-muted">{rowStateHint(row)}</span>
                    </p>
                  </div>
                </div>
                <div className="adm-row__actions" role="group" aria-label={`Actions for ${row.title}`}>
                  <ActionButton label="Edit" icon={<Pencil size={14} aria-hidden="true" />} onClick={() => onEdit(row)} />
                  <ActionButton
                    label={`Move ${row.title} up`}
                    iconOnly
                    icon={<ArrowUp size={15} aria-hidden="true" />}
                    unavailable={!canMoveUp}
                    reason={moveReason ?? "Already first"}
                    onClick={() => onMove(row, -1)}
                  />
                  <ActionButton
                    label={`Move ${row.title} down`}
                    iconOnly
                    icon={<ArrowDown size={15} aria-hidden="true" />}
                    unavailable={!canMoveDown}
                    reason={moveReason ?? "Already last"}
                    onClick={() => onMove(row, 1)}
                  />
                  {preview ? (
                    <a
                      className="adm-btn adm-btn--row adm-btn--icon"
                      href={preview}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Preview ${row.title} on the public site (opens in a new tab)`}
                      title="Preview the public page (shows published content)"
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  ) : null}
                  <span className="adm-row__spacer" aria-hidden="true" />
                  {archived ? (
                    <ActionButton
                      label="Restore"
                      icon={<ArchiveRestore size={14} aria-hidden="true" />}
                      unavailable={locked}
                      reason="Wait for the current change to finish"
                      onClick={() => onRestore(row)}
                    />
                  ) : (
                    <ActionButton
                      label="Archive"
                      icon={<Archive size={14} aria-hidden="true" />}
                      unavailable={locked}
                      reason="Wait for the current change to finish"
                      onClick={() => onArchive(row)}
                    />
                  )}
                  {row.doc ? (
                    <ActionButton
                      label={`Delete CMS version of ${row.title}`}
                      iconOnly
                      tone="danger"
                      icon={<Trash2 size={15} aria-hidden="true" />}
                      unavailable={locked}
                      reason="Wait for the current change to finish"
                      onClick={() => onDelete(row)}
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}
