"use client";

import { useEffect, useId, useMemo, useRef, useState, type ComponentType } from "react";
import { flushSync } from "react-dom";
import { ExternalLink, Loader2, Save, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CmsItemList, rowStateHint, StateBadge } from "./CmsItemList";
import { useConfirm } from "./ConfirmDialog";
import { focusFirstInvalid, useFieldErrors, type FieldErrorApi, type FieldErrors } from "./fields";
import { friendlyError, plural } from "./format";
import { discardUnsavedUpload, useUploadService } from "./ImageUploader";
import { useNotify } from "./status";
import { useCmsCollection, type CmsAdapter, type CmsDataSource, type CmsRow } from "./useCmsCollection";

export type EditorFieldsProps<F> = {
  form: F;
  update: (patch: Partial<F>) => void;
  isNew: boolean;
  errors: FieldErrorApi;
  /** The last saved form (null for a new item). */
  persisted: F | null;
  idPrefix: string;
  disabled: boolean;
};

export type WorkspaceConfig<T, F> = {
  adapter: CmsAdapter<T>;
  noun: string;
  nounPlural: string;
  idPrefix: string;
  /** Converts a list position (0-based) to the stored order value. */
  sequence: (index: number) => number;
  orderLabel: (order: number) => string;
  previewHref?: (row: CmsRow<T>) => string | undefined;
  toForm: (item: T) => F;
  blankForm: (order: number) => F;
  withOrder: (form: F, order: number) => F;
  validate: (form: F, context: { isNew: boolean; takenIds: ReadonlySet<string> }) => FieldErrors;
  toPayload: (form: F) => { id: string };
  formId: (form: F) => string;
  formTitle: (form: F) => string;
  /** Image URLs held by the form, so unsaved uploads can be cleaned up on cancel. */
  imagesOf?: (form: F) => string[];
  Fields: ComponentType<EditorFieldsProps<F>>;
};

type EditorState<F> = {
  mode: "edit" | "create";
  id: string | null;
  form: F;
  baseline: F;
  key: number;
};

type SaveMode = "draft" | "publish";

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function useUnsavedChangesWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);
}

/**
 * List + editor for a CMS item collection layered over static data (projects, experience).
 * Every write goes through lib/cms/adminWrites (via `source`), so the public merge rules apply.
 */
export function CmsWorkspace<T, F>({ config, source }: { config: WorkspaceConfig<T, F>; source: CmsDataSource }) {
  const { adapter, noun, nounPlural, idPrefix, Fields } = config;
  const notify = useNotify();
  const uploads = useUploadService();
  const [confirm, confirmDialog] = useConfirm();
  const { rows, state: loadState, error: loadError, reload } = useCmsCollection(adapter, source);
  const [editor, setEditor] = useState<EditorState<F> | null>(null);
  const [saving, setSaving] = useState<SaveMode | null>(null);
  const [listBusy, setListBusy] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorHeadingRef = useRef<HTMLHeadingElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const openCount = useRef(0);
  const listHeadingId = useId();
  const editorHeadingId = useId();

  const row = editor?.id ? rows.find((candidate) => candidate.id === editor.id) : undefined;
  const isNew = editor?.mode === "create";
  const takenIds = useMemo(() => new Set(rows.map((candidate) => candidate.id)), [rows]);
  const errors = useMemo(
    () => (editor ? config.validate(editor.form, { isNew: Boolean(isNew), takenIds }) : {}),
    [config, editor, isNew, takenIds],
  );
  const fieldErrors = useFieldErrors(errors);
  const dirty = Boolean(editor && !same(editor.form, editor.baseline));
  const activeRows = rows.filter((candidate) => candidate.state !== "archived");
  useUnsavedChangesWarning(dirty);

  // Move focus to the editor whenever a different item is opened.
  const editorKey = editor?.key;
  useEffect(() => {
    if (editorKey === undefined) return;
    const heading = editorHeadingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    const top = editorRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.6) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      editorRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [editorKey]);

  function discardUploads(current: EditorState<F>) {
    if (!config.imagesOf) return;
    const persisted = new Set(config.imagesOf(current.baseline));
    for (const url of config.imagesOf(current.form)) {
      if (!persisted.has(url)) discardUnsavedUpload(url, undefined, uploads.remove);
    }
  }

  async function confirmDiscard(action: string) {
    if (!editor || !dirty) return true;
    const ok = await confirm({
      title: "Discard unsaved changes?",
      body: (
        <p>
          “{config.formTitle(editor.form) || `This ${noun}`}” has changes that are not saved. {action}
        </p>
      ),
      confirmLabel: "Discard changes",
      cancelLabel: "Keep editing",
      tone: "danger",
    });
    if (ok) discardUploads(editor);
    return ok;
  }

  function open(next: Omit<EditorState<F>, "key">) {
    openCount.current += 1;
    fieldErrors.reset();
    setEditor({ ...next, key: openCount.current });
  }

  async function handleEdit(target: CmsRow<T>) {
    if (editor?.id === target.id && editor.mode === "edit") {
      editorHeadingRef.current?.focus();
      return;
    }
    if (!(await confirmDiscard(`Open “${target.title}” and lose them?`))) return;
    const form = config.toForm(target.item);
    open({ mode: "edit", id: target.id, form, baseline: form });
  }

  async function handleCreate() {
    if (loadState !== "ready") {
      notify("error", `The ${nounPlural} list has not loaded yet, so a new ID cannot be checked for duplicates. Retry loading first.`);
      return;
    }
    if (!(await confirmDiscard(`Start a new ${noun} and lose them?`))) return;
    const form = config.blankForm(config.sequence(activeRows.length));
    open({ mode: "create", id: null, form, baseline: form });
  }

  async function handleClose() {
    if (saving) return;
    if (!(await confirmDiscard("Close the editor and lose them?"))) return;
    setEditor(null);
    fieldErrors.reset();
    listHeadingRef.current?.focus();
  }

  function update(patch: Partial<F>) {
    setEditor((current) => (current ? { ...current, form: { ...current.form, ...patch } } : current));
  }

  async function handleSave(mode: SaveMode) {
    if (!editor || saving) return;
    const count = Object.keys(errors).length;
    if (count > 0) {
      flushSync(() => fieldErrors.revealAll());
      focusFirstInvalid(formRef.current);
      notify("error", `${plural(count, "field")} need${count === 1 ? "s" : ""} attention before this ${noun} can be saved.`);
      return;
    }

    const title = config.formTitle(editor.form) || config.formId(editor.form);
    if (mode === "draft" && row) {
      const warning =
        row.state === "override"
          ? `The site will show the static version of “${title}” until you publish again.`
          : row.state === "cms-only"
            ? `“${title}” will disappear from the site until you publish again.`
            : row.state === "archived" && row.hasStatic
              ? `The static version of “${title}” will be visible on the site again until you publish or archive it.`
              : null;
      if (warning) {
        const ok = await confirm({
          title: "Save as draft?",
          body: (
            <p>
              Drafts replace the published CMS version. {warning}
            </p>
          ),
          confirmLabel: "Save draft",
        });
        if (!ok) return;
      }
    }

    const payload = config.toPayload(editor.form);
    const savedForm = editor.form;
    setSaving(mode);
    try {
      const result =
        mode === "draft"
          ? await source.saveDraft(adapter.collection, payload.id, payload)
          : await source.publish(adapter.collection, payload.id, payload);

      if (!result.ok) {
        notify("error", `Could not ${mode === "draft" ? "save" : "publish"} “${title}”. ${friendlyError(result.error)}`);
        return;
      }

      const hasStatic = row?.hasStatic ?? adapter.staticItems.some((item) => adapter.idOf(item) === payload.id);
      const message =
        mode === "draft"
          ? `Draft saved for “${title}”. ${hasStatic ? "The site keeps showing the static version until you publish." : "Drafts are not shown on the site."}`
          : `Published “${title}”. The public site updates within about 5 minutes.`;
      notify(result.warning ? "info" : "success", result.warning ? `${message} Note: ${result.warning}` : message);
      setEditor((current) =>
        current ? { ...current, mode: "edit", id: payload.id, baseline: savedForm, form: current.form } : current,
      );
      reload(true);
    } catch (saveError) {
      notify("error", `Could not ${mode === "draft" ? "save" : "publish"} “${title}”. ${friendlyError(saveError)}`);
    } finally {
      setSaving(null);
    }
  }

  async function runListAction(target: CmsRow<T>, action: () => Promise<{ ok: boolean; error?: string }>, success: string, failure: string) {
    setListBusy(target.id);
    try {
      const result = await action();
      if (result.ok) notify("success", success);
      else notify("error", `${failure} ${friendlyError(result.error)}`);
      return result.ok;
    } catch (actionError) {
      notify("error", `${failure} ${friendlyError(actionError)}`);
      return false;
    } finally {
      setListBusy(null);
      reload(true);
    }
  }

  async function handleMove(target: CmsRow<T>, direction: -1 | 1) {
    if (listBusy || saving) return;
    const index = activeRows.indexOf(target);
    const swapWith = index + direction;
    if (index < 0 || swapWith < 0 || swapWith >= activeRows.length) return;

    const next = [...activeRows];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    // When positions are already distinct and ascending, the two items just trade values (two writes).
    // Otherwise (duplicates, missing values) every visible item is renumbered sequentially.
    const current = activeRows.map((candidate) => candidate.order);
    const ordered = current.every((value, position) => value < Number.MAX_SAFE_INTEGER && (position === 0 || value > current[position - 1]));
    const changes = next
      .map((candidate, position) => ({ row: candidate, value: ordered ? current[position] : config.sequence(position) }))
      .filter(({ row: candidate, value }) => candidate.order !== value);
    if (changes.length === 0) return;

    const staticRows = changes.filter(({ row: candidate }) => candidate.state === "static");
    const draftRows = changes.filter(({ row: candidate }) => candidate.state === "draft");
    if (staticRows.length > 0 || draftRows.length > 0 || changes.length > 2) {
      const ok = await confirm({
        title: `Move “${target.title}” ${direction < 0 ? "up" : "down"}?`,
        body: (
          <>
            <p>This saves a new position for {plural(changes.length, noun, nounPlural)}:</p>
            <ul className="adm-dialog__list">
              {changes.map(({ row: candidate, value }) => (
                <li key={candidate.id}>
                  {candidate.title}: {config.orderLabel(candidate.order)} → {config.orderLabel(value)}
                </li>
              ))}
            </ul>
            {staticRows.length > 0 ? (
              <p>
                <strong>Static-only items become published CMS overrides</strong> ({staticRows.map(({ row: candidate }) => candidate.title).join(", ")}): their
                current content is copied into the CMS, so later edits to src/data will not show until you delete the CMS version.
              </p>
            ) : null}
            {draftRows.length > 0 ? (
              <p>
                Drafts ({draftRows.map(({ row: candidate }) => candidate.title).join(", ")}) keep their new position but only move on the site once published.
              </p>
            ) : null}
          </>
        ),
        confirmLabel: "Save new order",
      });
      if (!ok) return;
    }

    setListBusy(target.id);
    const failed: string[] = [];
    try {
      for (const { row: candidate, value } of changes) {
        const payload = config.toPayload(config.withOrder(config.toForm(candidate.item), value));
        try {
          const result =
            candidate.state === "draft"
              ? await source.saveDraft(adapter.collection, candidate.id, payload)
              : await source.publish(adapter.collection, candidate.id, payload);
          if (!result.ok) {
            failed.push(`${candidate.title} (${friendlyError(result.error)})`);
            continue;
          }
        } catch (moveError) {
          failed.push(`${candidate.title} (${friendlyError(moveError)})`);
          continue;
        }
        // Keep an open editor in sync so its next save does not undo the move.
        setEditor((current) =>
          current && current.id === candidate.id
            ? { ...current, form: config.withOrder(current.form, value), baseline: config.withOrder(current.baseline, value) }
            : current,
        );
      }
    } finally {
      setListBusy(null);
      reload(true);
    }

    if (failed.length > 0) notify("error", `Some positions were not saved: ${failed.join("; ")}. Reloaded the list.`);
    else notify("success", `Moved “${target.title}” ${direction < 0 ? "up" : "down"}. The public site updates within about 5 minutes.`);
  }

  async function handleArchive(target: CmsRow<T>) {
    if (listBusy || saving) return;
    const ok = await confirm({
      title: `Archive “${target.title}”?`,
      body: (
        <p>
          It will be hidden from the public site{target.hasStatic ? ", including its static version" : ""}. The content stays in the CMS and you can restore it
          from this list.
        </p>
      ),
      confirmLabel: "Archive",
    });
    if (!ok) return;
    await runListAction(
      target,
      () => source.archive(adapter.collection, target.id),
      `Archived “${target.title}”. It disappears from the site within about 5 minutes.`,
      `Could not archive “${target.title}”.`,
    );
  }

  async function handleRestore(target: CmsRow<T>) {
    if (listBusy || saving) return;
    const form = config.toForm(target.item);
    const problems = config.validate(form, { isNew: false, takenIds });
    if (Object.keys(problems).length > 0) {
      if (!(await confirmDiscard(`Open “${target.title}” and lose them?`))) return;
      open({ mode: "edit", id: target.id, form, baseline: form });
      fieldErrors.revealAll();
      notify("error", `“${target.title}” is incomplete. Fix the highlighted fields, then publish to restore it.`);
      return;
    }
    const ok = await confirm({
      title: `Restore “${target.title}”?`,
      body: (
        <p>
          This publishes the saved CMS content and shows it on the site again.
          {target.hasStatic ? " To go back to the static version instead, delete the CMS version." : ""}
        </p>
      ),
      confirmLabel: "Publish and restore",
    });
    if (!ok) return;
    const payload = config.toPayload(form);
    await runListAction(
      target,
      () => source.publish(adapter.collection, target.id, payload),
      `Restored “${target.title}”. It appears on the site within about 5 minutes.`,
      `Could not restore “${target.title}”.`,
    );
  }

  async function handleDelete(target: CmsRow<T>) {
    if (listBusy || saving) return;
    const editingThis = editor?.id === target.id;
    const ok = await confirm({
      title: `Delete the CMS version of “${target.title}”?`,
      tone: "danger",
      body: (
        <>
          {target.hasStatic ? (
            <p>
              The CMS document is removed and <strong>the static version from src/data is shown again</strong>. Your CMS edits (including drafts) are lost.
            </p>
          ) : (
            <p>
              This {noun} only exists in the CMS. <strong>Deleting removes it from the site and from this console permanently.</strong>
            </p>
          )}
          {editingThis && dirty ? <p>Unsaved changes in the editor will be lost too.</p> : null}
          <p>This cannot be undone.</p>
        </>
      ),
      confirmLabel: target.hasStatic ? "Delete and restore static" : `Delete ${noun}`,
    });
    if (!ok) return;

    const deleted = await runListAction(
      target,
      () => source.remove(adapter.collection, target.id),
      target.hasStatic
        ? `Deleted the CMS version of “${target.title}”. The static version is back within about 5 minutes.`
        : `Deleted “${target.title}”.`,
      `Could not delete “${target.title}”.`,
    );
    if (!deleted || !editingThis || !editor) return;

    discardUploads(editor);
    const staticItem = adapter.staticItems.find((item) => adapter.idOf(item) === target.id);
    if (staticItem) {
      const form = config.toForm(staticItem);
      open({ mode: "edit", id: target.id, form, baseline: form });
    } else {
      setEditor(null);
      listHeadingRef.current?.focus();
    }
  }

  const locked = Boolean(listBusy || saving);
  const editorTitle = editor ? config.formTitle(editor.form) : "";
  const preview = row && config.previewHref ? config.previewHref(row) : undefined;
  const stateNote = !editor
    ? null
    : isNew
      ? `New ${noun}: save a draft to keep working privately, or publish to add it to the site.`
      : row?.state === "static"
        ? `Static only: this ${noun} comes from src/data. Publishing creates a CMS override; saving a draft does not change the site.`
        : row?.state === "override"
          ? `Published override: the site shows this CMS version instead of the static one.`
          : row?.state === "cms-only"
            ? `CMS only: published from the CMS, with no static version.`
            : row?.state === "draft"
              ? row.hasStatic
                ? `Draft: not public yet. The site shows the static version until you publish.`
                : `Draft: not on the site until you publish.`
              : row?.state === "archived"
                ? `Archived: hidden from the site. Publish to show it again${row.hasStatic ? ", or delete the CMS version to bring back the static one" : ""}.`
                : null;

  return (
    <div className="adm-workspace">
      <CmsItemList
        headingId={listHeadingId}
        headingRef={listHeadingRef}
        noun={noun}
        nounPlural={nounPlural}
        rows={rows}
        loadState={loadState}
        loadError={loadError}
        onRetry={() => reload()}
        selectedId={editor?.id ?? null}
        busyId={listBusy}
        locked={locked}
        orderLabel={(candidate) => config.orderLabel(candidate.order)}
        previewHref={config.previewHref}
        onCreate={() => void handleCreate()}
        onEdit={(candidate) => void handleEdit(candidate)}
        onMove={(candidate, direction) => void handleMove(candidate, direction)}
        onArchive={(candidate) => void handleArchive(candidate)}
        onRestore={(candidate) => void handleRestore(candidate)}
        onDelete={(candidate) => void handleDelete(candidate)}
      />

      <div ref={editorRef} className={cn("adm-editor", !editor && "adm-editor--empty")}>
        {!editor ? (
          <div className="adm-editor__placeholder">
            <p className="adm-editor__placeholder-title">No {noun} open</p>
            <p className="adm-muted">Choose Edit on a {noun} in the list, or start a new one.</p>
            <button type="button" className="brutal-button brutal-button--small" onClick={() => void handleCreate()}>
              New {noun}
            </button>
          </div>
        ) : (
          <section aria-labelledby={editorHeadingId}>
            <header className="adm-editor__head">
              <div className="adm-editor__heading">
                <p className="adm-kicker">{isNew ? `New ${noun}` : `Editing ${noun}`}</p>
                <h3 id={editorHeadingId} ref={editorHeadingRef} tabIndex={-1} className="adm-editor__title">
                  {editorTitle || `Untitled ${noun}`}
                </h3>
                <p className="adm-editor__meta">
                  {config.formId(editor.form) ? <code className="adm-code">{config.formId(editor.form)}</code> : null}
                  {row ? <StateBadge state={row.state} /> : <span className="adm-badge adm-badge--new">Not saved</span>}
                  {row ? <span className="adm-muted">{rowStateHint(row)}</span> : null}
                </p>
              </div>
              <div className="adm-editor__head-actions">
                {preview ? (
                  <a className="adm-btn" href={preview} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={15} aria-hidden="true" />
                    Preview
                    <span className="visually-hidden"> (opens the public page in a new tab)</span>
                  </a>
                ) : null}
                <button type="button" className="adm-btn adm-btn--icon" onClick={() => void handleClose()} aria-label={`Close the ${noun} editor`} title="Close editor">
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </header>

            {stateNote ? (
              <p className="adm-note">
                {stateNote}
                {row?.hasStatic ? " Empty text and list fields fall back to the static content; links, images and logos can be removed." : ""}
              </p>
            ) : null}

            <form ref={formRef} noValidate onSubmit={(event) => event.preventDefault()} aria-labelledby={editorHeadingId}>
              <Fields
                key={editor.key}
                form={editor.form}
                update={update}
                isNew={Boolean(isNew)}
                errors={fieldErrors}
                persisted={isNew ? null : editor.baseline}
                idPrefix={idPrefix}
                disabled={Boolean(saving)}
              />

              <div className="adm-actionbar">
                <p className="adm-actionbar__state">
                  <span className={cn("adm-dot", dirty && "is-dirty")} aria-hidden="true" />
                  {dirty ? "Unsaved changes" : isNew ? "Nothing saved yet" : "All changes saved"}
                  {fieldErrors.visibleCount > 0 ? (
                    <span className="adm-actionbar__errors">
                      {" · "}
                      {plural(fieldErrors.visibleCount, "field")} to fix
                    </span>
                  ) : null}
                </p>
                <div className="adm-actionbar__buttons">
                  <button type="button" className="brutal-button brutal-button--secondary brutal-button--small" onClick={() => void handleClose()} aria-disabled={Boolean(saving) || undefined}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="brutal-button brutal-button--secondary brutal-button--small"
                    onClick={() => void handleSave("draft")}
                    aria-disabled={Boolean(saving) || undefined}
                  >
                    {saving === "draft" ? <Loader2 size={15} className="adm-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
                    {saving === "draft" ? "Saving…" : "Save draft"}
                  </button>
                  <button
                    type="button"
                    className="brutal-button brutal-button--small"
                    onClick={() => void handleSave("publish")}
                    aria-disabled={Boolean(saving) || undefined}
                  >
                    {saving === "publish" ? <Loader2 size={15} className="adm-spin" aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}
                    {saving === "publish" ? "Publishing…" : "Publish"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}
      </div>
      {confirmDialog}
    </div>
  );
}
