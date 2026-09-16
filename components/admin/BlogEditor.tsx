"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Inbox, Loader2, Pencil, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { deleteBlogPost, listBlogPosts, saveBlogPost, type AdminBlogPost } from "@/lib/firebase/content";
import { cn } from "@/lib/utils";
import { useConfirm } from "./ConfirmDialog";
import { CheckboxField, focusFirstInvalid, FormSection, ListField, TextAreaField, TextField, useFieldErrors, type FieldErrors } from "./fields";
import { friendlyError, fromCsv, plural, SLUG_PATTERN, slugify, slugifyWhileTyping, toCsv } from "./format";
import { useNotify } from "./status";

export type BlogSource = {
  list: () => Promise<AdminBlogPost[]>;
  save: (post: AdminBlogPost) => Promise<void>;
  remove: (slug: string) => Promise<void>;
};

export const firestoreBlogSource: BlogSource = {
  list: () => listBlogPosts(false),
  save: saveBlogPost,
  remove: deleteBlogPost,
};

type PostForm = Omit<AdminBlogPost, "tags"> & { tags: string };

const today = () => new Date().toISOString().slice(0, 10);

const blankPost = (): PostForm => ({ slug: "", title: "", date: today(), description: "", tags: "", content: "", published: false });
const toForm = (post: AdminBlogPost): PostForm => ({ ...post, tags: toCsv(post.tags) });

function validate(form: PostForm, isNew: boolean, taken: ReadonlySet<string>): FieldErrors {
  const errors: FieldErrors = {};
  const slug = form.slug.trim();
  if (!slug) errors.slug = "Add a slug.";
  else if (!SLUG_PATTERN.test(slug)) errors.slug = "Use lowercase letters, numbers and single hyphens.";
  else if (isNew && taken.has(slug)) errors.slug = "A post with this slug already exists.";
  if (!form.title.trim()) errors.title = "Add a title.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) errors.date = "Pick a date.";
  return errors;
}

type Editor = { isNew: boolean; form: PostForm; baseline: PostForm; key: number };

/** Legacy Firestore blog posts (blogPosts collection). The public blog renders Markdown files from content/blog. */
export function BlogEditor({ source = firestoreBlogSource }: { source?: BlogSource }) {
  const notify = useNotify();
  const [confirm, confirmDialog] = useConfirm();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [request, setRequest] = useState(0);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const openCount = useRef(0);
  const headingId = useId();
  const listHeadingId = useId();

  useEffect(() => {
    let active = true;
    source
      .list()
      .then((next) => {
        if (!active) return;
        setPosts(next);
        setLoadError(null);
        setLoadState("ready");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(friendlyError(error, "Could not load posts."));
        setLoadState("error");
      });
    return () => {
      active = false;
    };
  }, [source, request]);

  const taken = useMemo(() => new Set(posts.map((post) => post.slug)), [posts]);
  const errors = useMemo(() => (editor ? validate(editor.form, editor.isNew, taken) : {}), [editor, taken]);
  const fieldErrors = useFieldErrors(errors);
  const dirty = Boolean(editor && JSON.stringify(editor.form) !== JSON.stringify(editor.baseline));

  const editorKey = editor?.key;
  useEffect(() => {
    if (editorKey !== undefined) headingRef.current?.focus();
  }, [editorKey]);

  const reload = (quiet = false) => {
    if (!quiet) setLoadState("loading");
    setRequest((value) => value + 1);
  };

  async function confirmDiscard() {
    if (!dirty) return true;
    return confirm({
      title: "Discard unsaved changes?",
      body: <p>The post you are editing has changes that are not saved.</p>,
      confirmLabel: "Discard changes",
      cancelLabel: "Keep editing",
      tone: "danger",
    });
  }

  async function open(post: AdminBlogPost | null) {
    if (!(await confirmDiscard())) return;
    const form = post ? toForm(post) : blankPost();
    openCount.current += 1;
    fieldErrors.reset();
    setSlugEdited(Boolean(post));
    setEditor({ isNew: !post, form, baseline: form, key: openCount.current });
  }

  async function close() {
    if (busy === "save" || !(await confirmDiscard())) return;
    setEditor(null);
    fieldErrors.reset();
    listHeadingRef.current?.focus();
  }

  const set = (patch: Partial<PostForm>) => setEditor((current) => (current ? { ...current, form: { ...current.form, ...patch } } : current));

  async function save() {
    if (!editor || busy) return;
    const count = Object.keys(errors).length;
    if (count > 0) {
      flushSync(() => fieldErrors.revealAll());
      focusFirstInvalid(formRef.current);
      notify("error", `${plural(count, "field")} need${count === 1 ? "s" : ""} attention before the post can be saved.`);
      return;
    }
    const saved = editor.form;
    setBusy("save");
    try {
      await source.save({ ...saved, slug: saved.slug.trim(), title: saved.title.trim(), description: saved.description.trim(), tags: fromCsv(saved.tags) });
      notify("success", `Saved “${saved.title.trim()}” to Firestore.`);
      setEditor((current) => (current ? { ...current, isNew: false, baseline: saved } : current));
      reload(true);
    } catch (error) {
      notify("error", `Could not save the post. ${friendlyError(error)}`);
    } finally {
      setBusy(null);
    }
  }

  async function remove(post: AdminBlogPost) {
    if (busy) return;
    const ok = await confirm({
      title: `Delete “${post.title || post.slug}”?`,
      tone: "danger",
      body: <p>The Firestore document blogPosts/{post.slug} is deleted permanently. Markdown posts in content/blog are not affected.</p>,
      confirmLabel: "Delete post",
    });
    if (!ok) return;
    setBusy(post.slug);
    try {
      await source.remove(post.slug);
      notify("success", `Deleted “${post.title || post.slug}”.`);
      if (editor?.form.slug === post.slug && !editor.isNew) {
        setEditor(null);
        listHeadingRef.current?.focus();
      }
    } catch (error) {
      notify("error", `Could not delete the post. ${friendlyError(error)}`);
    } finally {
      setBusy(null);
      reload(true);
    }
  }

  const disabled = busy === "save";
  const bind = (key: string) => ({ id: `post-${key}`, error: fieldErrors.errorFor(key), onBlur: () => fieldErrors.touch(key), disabled });

  return (
    <>
      <p className="adm-note adm-note--warn">
        The public blog renders Markdown files from <code className="adm-code">content/blog</code>. Posts saved here are stored in the Firestore{" "}
        <code className="adm-code">blogPosts</code> collection and are not shown on the site yet.
      </p>
      <div className="adm-workspace">
        <section className="adm-list" aria-labelledby={listHeadingId} aria-busy={loadState === "loading" || undefined}>
          <div className="adm-list__head">
            <h3 id={listHeadingId} ref={listHeadingRef} tabIndex={-1} className="adm-list__title">
              Firestore posts
              {loadState === "ready" ? <span className="adm-count">{posts.length}</span> : null}
            </h3>
            <button type="button" className="adm-btn" onClick={() => void open(null)}>
              <Plus size={15} aria-hidden="true" />
              New post
            </button>
          </div>

          {loadState === "loading" ? (
            <div className="adm-list__placeholder" role="status">
              <Loader2 size={18} className="adm-spin" aria-hidden="true" />
              Loading posts…
            </div>
          ) : null}
          {loadState === "error" ? (
            <div className="state-note state-note--error adm-list__placeholder">
              <div>
                <strong>Could not load posts.</strong>
                <p>{loadError}</p>
                <button type="button" className="adm-btn adm-mt-2" onClick={() => reload()}>
                  <RefreshCw size={15} aria-hidden="true" />
                  Retry
                </button>
              </div>
            </div>
          ) : null}
          {loadState === "ready" && posts.length === 0 ? (
            <div className="state-note adm-list__placeholder">
              <Inbox size={18} aria-hidden="true" />
              <div>
                <strong>No Firestore posts yet.</strong>
                <p>Markdown posts in content/blog are listed on the site regardless.</p>
              </div>
            </div>
          ) : null}
          {loadState === "ready" && posts.length > 0 ? (
            <ol className="adm-rows">
              {posts.map((post) => {
                const selected = !editor?.isNew && editor?.form.slug === post.slug;
                return (
                  <li key={post.slug} className={cn("adm-row", selected && "is-selected")} aria-current={selected || undefined}>
                    <div className="adm-row__main">
                      <div className="adm-row__text">
                        <p className="adm-row__title">
                          {post.title || post.slug}
                          {busy === post.slug ? <Loader2 size={14} className="adm-spin" role="img" aria-label="Deleting" /> : null}
                        </p>
                        <p className="adm-row__meta">
                          <code className="adm-code">{post.slug}</code> · {post.date}
                        </p>
                        <p className="adm-row__state">
                          <span className={cn("adm-badge", post.published ? "adm-badge--override" : "adm-badge--draft")}>{post.published ? "Published flag on" : "Draft"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="adm-row__actions" role="group" aria-label={`Actions for ${post.title || post.slug}`}>
                      <button type="button" className="adm-btn adm-btn--row" onClick={() => void open(post)}>
                        <Pencil size={14} aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                      <span className="adm-row__spacer" aria-hidden="true" />
                      <button
                        type="button"
                        className="adm-btn adm-btn--row adm-btn--icon adm-btn--danger-text"
                        aria-label={`Delete ${post.title || post.slug}`}
                        title="Delete post"
                        aria-disabled={Boolean(busy) || undefined}
                        onClick={() => void remove(post)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </section>

        <div className={cn("adm-editor", !editor && "adm-editor--empty")}>
          {!editor ? (
            <div className="adm-editor__placeholder">
              <p className="adm-editor__placeholder-title">No post open</p>
              <p className="adm-muted">Choose Edit on a post, or start a new one.</p>
              <button type="button" className="brutal-button brutal-button--small" onClick={() => void open(null)}>
                New post
              </button>
            </div>
          ) : (
            <section aria-labelledby={headingId}>
              <header className="adm-editor__head">
                <div className="adm-editor__heading">
                  <p className="adm-kicker">{editor.isNew ? "New post" : "Editing post"}</p>
                  <h3 id={headingId} ref={headingRef} tabIndex={-1} className="adm-editor__title">
                    {editor.form.title.trim() || "Untitled post"}
                  </h3>
                  {editor.form.slug ? (
                    <p className="adm-editor__meta">
                      <code className="adm-code">blogPosts/{editor.form.slug}</code>
                    </p>
                  ) : null}
                </div>
                <div className="adm-editor__head-actions">
                  <button type="button" className="adm-btn adm-btn--icon" onClick={() => void close()} aria-label="Close the post editor" title="Close editor">
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              </header>

              <form ref={formRef} noValidate onSubmit={(event) => event.preventDefault()} aria-labelledby={headingId}>
                <div className="adm-form" key={editor.key}>
                  <FormSection title="Post">
                    <TextField
                      {...bind("title")}
                      label="Title"
                      required
                      value={editor.form.title}
                      onChange={(value) => set(editor.isNew && !slugEdited ? { title: value, slug: slugify(value) } : { title: value })}
                    />
                    <TextField
                      {...bind("slug")}
                      label="Slug"
                      required
                      mono
                      readOnly={!editor.isNew}
                      value={editor.form.slug}
                      onChange={(value) => {
                        setSlugEdited(true);
                        set({ slug: slugifyWhileTyping(value) });
                      }}
                      onBlur={() => {
                        set({ slug: slugify(editor.form.slug) });
                        fieldErrors.touch("slug");
                      }}
                      hint={editor.isNew ? "Cannot be changed after the first save." : "Fixed after the first save."}
                    />
                    <TextField {...bind("date")} label="Date" type="date" required value={editor.form.date} onChange={(value) => set({ date: value })} />
                    <ListField {...bind("tags")} separator="comma" label="Tags" value={editor.form.tags} onChange={(value) => set({ tags: value })} />
                    <TextAreaField {...bind("description")} label="Description" rows={3} className="adm-span-2" value={editor.form.description} onChange={(value) => set({ description: value })} />
                    <TextAreaField {...bind("content")} label="Markdown content" rows={16} mono className="adm-span-2" value={editor.form.content} onChange={(value) => set({ content: value })} />
                    <CheckboxField
                      id="post-published"
                      label="Published"
                      checked={editor.form.published}
                      disabled={disabled}
                      onChange={(checked) => set({ published: checked })}
                      description="Marks the Firestore post as public. The site does not render Firestore posts yet."
                    />
                  </FormSection>
                </div>

                <div className="adm-actionbar">
                  <p className="adm-actionbar__state">
                    <span className={cn("adm-dot", dirty && "is-dirty")} aria-hidden="true" />
                    {dirty ? "Unsaved changes" : editor.isNew ? "Nothing saved yet" : "All changes saved"}
                    {fieldErrors.visibleCount > 0 ? <span className="adm-actionbar__errors"> · {plural(fieldErrors.visibleCount, "field")} to fix</span> : null}
                  </p>
                  <div className="adm-actionbar__buttons">
                    <button type="button" className="brutal-button brutal-button--secondary brutal-button--small" onClick={() => void close()} aria-disabled={disabled || undefined}>
                      Cancel
                    </button>
                    <button type="button" className="brutal-button brutal-button--small" onClick={() => void save()} aria-disabled={disabled || undefined}>
                      {disabled ? <Loader2 size={15} className="adm-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
                      {disabled ? "Saving…" : "Save post"}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
      {confirmDialog}
    </>
  );
}
