"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Loader2, RotateCcw, Save, Send } from "lucide-react";
import { publishSingleton, saveSingletonDraft } from "@/lib/cms/adminWrites";
import { getPublicProfile } from "@/lib/cms/publicReads";
import type { CmsReadResult, CmsWriteResult } from "@/lib/cms/types";
import { checkExternalUrl } from "@/lib/urls";
import { profile as staticProfile, type Profile } from "@/src/data/profile";
import { cn } from "@/lib/utils";
import { useConfirm } from "./ConfirmDialog";
import { FormSection, focusFirstInvalid, ListField, TextAreaField, TextField, useFieldErrors, type FieldErrors } from "./fields";
import { friendlyError, fromLines, plural, toLines } from "./format";
import { useNotify } from "./status";
import { UrlField } from "./UrlField";

export type ProfileSource = {
  load: () => Promise<CmsReadResult<Profile>>;
  saveDraft: (profile: Profile) => Promise<CmsWriteResult>;
  publish: (profile: Profile) => Promise<CmsWriteResult>;
};

export const firestoreProfileSource: ProfileSource = {
  load: getPublicProfile,
  saveDraft: (profile) => saveSingletonDraft("profile", profile),
  publish: (profile) => publishSingleton("profile", profile),
};

/** Profile form: list fields are raw text, parsed when saving. */
type ProfileForm = Omit<Profile, "preferredRoles" | "currentFocus" | "engineeringStyle" | "credibility"> & {
  preferredRoles: string;
  currentFocus: string;
  engineeringStyle: string;
  credibility: string;
};

const LIST_KEYS = ["preferredRoles", "currentFocus", "engineeringStyle", "credibility"] as const;

function toForm(profile: Profile): ProfileForm {
  return {
    ...profile,
    preferredRoles: toLines(profile.preferredRoles),
    currentFocus: toLines(profile.currentFocus),
    engineeringStyle: toLines(profile.engineeringStyle),
    credibility: toLines(profile.credibility),
  };
}

function validate(form: ProfileForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Add your name.";
  if (!form.headline.trim()) errors.headline = "Add a headline.";
  const email = form.email?.trim() ?? "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.replace(/^mailto:/, ""))) errors.email = "Enter a valid email address.";

  const urls: [string, string | undefined, "any" | "github" | "image"][] = [
    ["profilePhoto", form.profilePhoto, "image"],
    ["github", form.links.github, "github"],
    ["linkedin", form.links.linkedin, "any"],
    ["portfolio", form.links.portfolio, "any"],
  ];
  for (const [key, value, kind] of urls) {
    const check = checkExternalUrl(value, kind);
    if (!check.ok) errors[key] = check.error;
  }
  const resume = form.resumePath.trim();
  if (resume && !resume.startsWith("/") && !checkExternalUrl(resume).ok) {
    errors.resumePath = "Use a site path such as /resume or a full https:// URL.";
  }
  return errors;
}

const cleanUrl = (value: string | undefined, kind: "any" | "github" | "image") => {
  const check = checkExternalUrl(value, kind);
  return check.ok ? (check.value ?? "") : "";
};

/** Same payload shape the previous console wrote, with URLs normalized by lib/urls. */
function buildProfilePayload(form: ProfileForm): Profile {
  const fullName = form.fullName.trim();
  const [firstName = "", ...restName] = fullName.split(/\s+/).filter(Boolean);
  const github = cleanUrl(form.links.github, "github");
  const linkedin = cleanUrl(form.links.linkedin, "any");
  const email = form.email?.trim().replace(/^mailto:/, "") || "";
  const resumePath = form.resumePath.trim() || form.links.resume?.trim() || "/resume";
  const lines = (key: (typeof LIST_KEYS)[number]) => fromLines(form[key]);

  return {
    ...form,
    fullName,
    initials: form.initials.trim(),
    headline: form.headline.trim(),
    role: form.role.trim(),
    shortBio: form.shortBio.trim(),
    longBio: form.longBio.trim(),
    location: form.location?.trim(),
    timezone: form.timezone?.trim(),
    email,
    availability: form.availability?.trim(),
    preferredRoles: lines("preferredRoles"),
    currentFocus: lines("currentFocus"),
    engineeringStyle: lines("engineeringStyle"),
    credibility: lines("credibility"),
    education: {
      ...form.education,
      degree: form.education?.degree?.trim(),
      institution: form.education?.institution?.trim(),
      status: form.education?.status?.trim(),
      location: form.education?.location?.trim(),
    },
    links: {
      github,
      linkedin,
      email: email ? `mailto:${email}` : undefined,
      resume: resumePath,
      portfolio: cleanUrl(form.links.portfolio, "any") || undefined,
    },
    ctas: {
      primary: form.ctas.primary.trim(),
      secondary: form.ctas.secondary.trim(),
    },
    name: fullName,
    firstName,
    lastName: restName.join(" "),
    title: form.headline.trim(),
    tagline: form.tagline.trim(),
    heroDescription: form.heroDescription.trim(),
    contactDescription: form.contactDescription.trim(),
    github,
    githubHandle: form.githubHandle.trim(),
    linkedin,
    linkedinHandle: form.linkedinHandle.trim(),
    locationShort: form.locationShort.trim(),
    profilePhoto: cleanUrl(form.profilePhoto, "image"),
    resumePath,
  };
}

type LoadInfo = { state: "loading" | "ready"; source?: "firestore" | "fallback"; error?: string };

export function ProfileEditor({ source = firestoreProfileSource }: { source?: ProfileSource }) {
  const notify = useNotify();
  const [confirm, confirmDialog] = useConfirm();
  const staticForm = useMemo(() => toForm(staticProfile), []);
  const [form, setForm] = useState<ProfileForm>(staticForm);
  const [baseline, setBaseline] = useState<ProfileForm>(staticForm);
  const [load, setLoad] = useState<LoadInfo>({ state: "loading" });
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = useMemo(() => validate(form), [form]);
  const fieldErrors = useFieldErrors(errors);
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);

  useEffect(() => {
    let active = true;
    source
      .load()
      .then((result) => {
        if (!active) return;
        const next = toForm(result.data);
        setForm(next);
        setBaseline(next);
        setLoad({ state: "ready", source: result.source, error: result.error ? friendlyError(result.error) : undefined });
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setLoad({ state: "ready", source: "fallback", error: friendlyError(loadError) });
      });
    return () => {
      active = false;
    };
  }, [source]);

  const set = (patch: Partial<ProfileForm>) => setForm((current) => ({ ...current, ...patch }));
  const bind = (key: string) => ({
    id: `profile-${key}`,
    error: fieldErrors.errorFor(key),
    onBlur: () => fieldErrors.touch(key),
    disabled: Boolean(saving) || load.state === "loading",
  });

  async function save(mode: "draft" | "publish") {
    if (saving) return;
    const count = Object.keys(errors).length;
    if (count > 0) {
      flushSync(() => fieldErrors.revealAll());
      focusFirstInvalid(formRef.current);
      notify("error", `${plural(count, "field")} need${count === 1 ? "s" : ""} attention before the profile can be saved.`);
      return;
    }
    setSaving(mode);
    const saved = form;
    try {
      const payload = buildProfilePayload(form);
      const result = mode === "draft" ? await source.saveDraft(payload) : await source.publish(payload);
      if (!result.ok) {
        notify("error", `Could not ${mode === "draft" ? "save the draft" : "publish the profile"}. ${friendlyError(result.error)}`);
        return;
      }
      const message =
        mode === "draft"
          ? "Profile draft saved. The site keeps the published profile until you publish."
          : "Profile published. The homepage hero updates within about 5 minutes.";
      notify(result.warning ? "info" : "success", result.warning ? `${message} Note: ${result.warning}` : message);
      setBaseline(saved);
    } catch (saveError) {
      notify("error", `Could not save the profile. ${friendlyError(saveError)}`);
    } finally {
      setSaving(null);
    }
  }

  async function resetToStatic() {
    const ok = await confirm({
      title: "Reset the form to the static profile?",
      body: <p>The form is filled with the profile from src/data/profile.ts. Nothing is saved until you save a draft or publish.</p>,
      confirmLabel: "Reset form",
    });
    if (!ok) return;
    setForm(staticForm);
    fieldErrors.reset();
    notify("info", "Form reset to the static profile. Save or publish to write it.");
  }

  async function revert() {
    const ok = await confirm({
      title: "Discard unsaved changes?",
      body: <p>The form goes back to the last loaded or saved profile.</p>,
      confirmLabel: "Discard changes",
      cancelLabel: "Keep editing",
      tone: "danger",
    });
    if (!ok) return;
    setForm(baseline);
    fieldErrors.reset();
  }

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const busy = Boolean(saving);

  return (
    <div className="adm-editor adm-editor--solo">
      <header className="adm-editor__head">
        <div className="adm-editor__heading">
          <p className="adm-kicker">One profile for the whole site</p>
          <h3 className="adm-editor__title">Profile and hero</h3>
          <p className="adm-editor__meta adm-muted">Drafts are private. Publishing updates the homepage hero and the profile details used across the site.</p>
        </div>
      </header>

      {load.state === "loading" ? (
        <p className="adm-note" role="status">
          <Loader2 size={15} className="adm-spin" aria-hidden="true" /> Loading the published profile…
        </p>
      ) : load.error ? (
        <p className="adm-note adm-note--warn">Loaded the static profile because Firestore could not be read: {load.error}</p>
      ) : (
        <p className="adm-note">
          {load.source === "firestore"
            ? "Showing the published profile. Drafts are not loaded back yet: this form always starts from the published version."
            : "No published profile yet: showing the static profile from src/data/profile.ts."}
        </p>
      )}

      <form ref={formRef} noValidate onSubmit={(event) => event.preventDefault()} aria-label="Profile">
        <div className="adm-form">
          <FormSection title="Identity">
            <TextField {...bind("fullName")} label="Full name" required value={form.fullName} onChange={(value) => set({ fullName: value })} />
            <TextField {...bind("initials")} label="Initials" value={form.initials} onChange={(value) => set({ initials: value })} />
            <TextField {...bind("headline")} label="Headline" required value={form.headline} onChange={(value) => set({ headline: value, title: value })} />
            <TextField {...bind("role")} label="Role" value={form.role} onChange={(value) => set({ role: value })} />
            <TextField {...bind("location")} label="Location" value={form.location ?? ""} onChange={(value) => set({ location: value })} />
            <TextField {...bind("timezone")} label="Timezone" value={form.timezone ?? ""} onChange={(value) => set({ timezone: value })} placeholder="Asia/Kolkata" />
          </FormSection>

          <FormSection title="Hero copy" columns={1}>
            <TextAreaField {...bind("shortBio")} label="Short bio" rows={3} value={form.shortBio} onChange={(value) => set({ shortBio: value })} />
            <TextAreaField {...bind("longBio")} label="Long bio" rows={5} value={form.longBio} onChange={(value) => set({ longBio: value })} />
            <TextAreaField {...bind("heroDescription")} label="Hero description" rows={3} value={form.heroDescription} onChange={(value) => set({ heroDescription: value })} />
            <TextAreaField {...bind("availability")} label="Availability" rows={2} value={form.availability ?? ""} onChange={(value) => set({ availability: value })} />
          </FormSection>

          <FormSection title="Contact and links">
            <TextField {...bind("email")} label="Email" type="email" autoComplete="off" value={form.email ?? ""} onChange={(value) => set({ email: value })} />
            <TextField
              {...bind("resumePath")}
              label="Resume path"
              mono
              value={form.resumePath}
              onChange={(value) => set({ resumePath: value, links: { ...form.links, resume: value } })}
              hint="A site path such as /resume, or a full URL."
            />
            <UrlField
              {...bind("github")}
              label="GitHub profile"
              kind="github"
              value={form.links.github ?? ""}
              onChange={(value) => set({ links: { ...form.links, github: value }, github: value })}
              placeholder="https://github.com/username"
            />
            <UrlField
              {...bind("linkedin")}
              label="LinkedIn profile"
              value={form.links.linkedin ?? ""}
              onChange={(value) => set({ links: { ...form.links, linkedin: value }, linkedin: value })}
              placeholder="https://linkedin.com/in/username"
            />
            <UrlField
              {...bind("portfolio")}
              label="Portfolio URL"
              value={form.links.portfolio ?? ""}
              onChange={(value) => set({ links: { ...form.links, portfolio: value } })}
            />
            <UrlField
              {...bind("profilePhoto")}
              label="Profile photo"
              kind="image"
              value={form.profilePhoto}
              onChange={(value) => set({ profilePhoto: value })}
              placeholder="/profile.png or https://…"
              hint="A /public path or an https:// image URL."
            />
          </FormSection>

          <FormSection title="Focus areas" description="One item per line.">
            {LIST_KEYS.map((key) => (
              <ListField
                key={key}
                {...bind(key)}
                separator="lines"
                rows={5}
                label={
                  key === "preferredRoles"
                    ? "Preferred roles"
                    : key === "currentFocus"
                      ? "Current focus"
                      : key === "engineeringStyle"
                        ? "Engineering style"
                        : "Credibility chips"
                }
                value={form[key]}
                onChange={(value) => set({ [key]: value } as Partial<ProfileForm>)}
              />
            ))}
          </FormSection>

          <FormSection title="Education and calls to action">
            <TextField {...bind("degree")} label="Degree" value={form.education?.degree ?? ""} onChange={(value) => set({ education: { ...form.education, degree: value } })} />
            <TextField
              {...bind("institution")}
              label="Institution"
              value={form.education?.institution ?? ""}
              onChange={(value) => set({ education: { ...form.education, institution: value } })}
            />
            <TextField
              {...bind("educationStatus")}
              label="Education status"
              value={form.education?.status ?? ""}
              onChange={(value) => set({ education: { ...form.education, status: value } })}
            />
            <TextField
              {...bind("educationLocation")}
              label="Education location"
              value={form.education?.location ?? ""}
              onChange={(value) => set({ education: { ...form.education, location: value } })}
            />
            <TextField {...bind("ctaPrimary")} label="Primary button label" value={form.ctas.primary} onChange={(value) => set({ ctas: { ...form.ctas, primary: value } })} />
            <TextField {...bind("ctaSecondary")} label="Secondary button label" value={form.ctas.secondary} onChange={(value) => set({ ctas: { ...form.ctas, secondary: value } })} />
          </FormSection>
        </div>

        <div className="adm-actionbar">
          <p className="adm-actionbar__state">
            <span className={cn("adm-dot", dirty && "is-dirty")} aria-hidden="true" />
            {dirty ? "Unsaved changes" : "No unsaved changes"}
            {fieldErrors.visibleCount > 0 ? <span className="adm-actionbar__errors"> · {plural(fieldErrors.visibleCount, "field")} to fix</span> : null}
          </p>
          <div className="adm-actionbar__buttons">
            <button type="button" className="adm-btn adm-btn--ghost" onClick={() => void resetToStatic()} aria-disabled={busy || undefined} disabled={load.state === "loading"}>
              <RotateCcw size={15} aria-hidden="true" />
              Reset to static
            </button>
            <button
              type="button"
              className="brutal-button brutal-button--secondary brutal-button--small"
              onClick={() => dirty && !busy && void revert()}
              aria-disabled={!dirty || busy || undefined}
            >
              Cancel
            </button>
            <button
              type="button"
              className="brutal-button brutal-button--secondary brutal-button--small"
              onClick={() => void save("draft")}
              aria-disabled={busy || load.state === "loading" || undefined}
              disabled={load.state === "loading"}
            >
              {saving === "draft" ? <Loader2 size={15} className="adm-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
              {saving === "draft" ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              className="brutal-button brutal-button--small"
              onClick={() => void save("publish")}
              aria-disabled={busy || load.state === "loading" || undefined}
              disabled={load.state === "loading"}
            >
              {saving === "publish" ? <Loader2 size={15} className="adm-spin" aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}
              {saving === "publish" ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </form>
      {confirmDialog}
    </div>
  );
}
