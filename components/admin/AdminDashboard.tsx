"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  BookOpenText,
  Camera,
  FolderKanban,
  KeyRound,
  Loader2,
  LogOut,
  Palette,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import {
  deleteBlogPost,
  deleteProject,
  listBlogPosts,
  listProjects,
  saveBlogPost,
  saveProject,
  type AdminBlogPost,
  type AdminProject,
} from "@/lib/firebase/content";
import { publishSingleton, saveSingletonDraft } from "@/lib/cms/adminWrites";
import { getPublicProfile } from "@/lib/cms/publicReads";
import { profile, projectsData } from "@/config/portfolio";
import { cn } from "@/lib/utils";
import { checkAdminAccess } from "@/lib/firebase/adminAccess";
import type { Profile } from "@/src/data/profile";

type Tab = "profile" | "projects" | "blog" | "setup";

const blankProject: AdminProject = {
  id: "",
  title: "",
  category: "",
  description: "",
  proofPoint: "",
  problem: "",
  architecture: "",
  tech: [],
  highlights: [],
  github: "",
  demo: "",
  iconKey: "Code2",
  status: "Case study",
  order: 0,
};

const blankPost: AdminBlogPost = {
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  tags: [],
  content: "",
  published: false,
};

const tabs: { id: Tab; label: string; icon: typeof FolderKanban }[] = [
  { id: "profile", label: "Profile", icon: Camera },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "blog", label: "Blog", icon: BookOpenText },
  { id: "setup", label: "Setup", icon: KeyRound },
];

function toCsv(items: string[]) {
  return items.join(", ");
}

function fromCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toLines(items: string[]) {
  return items.join("\n");
}

function fromLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalUrl(value: string | undefined) {
  return value?.trim() || undefined;
}

function buildProfilePayload(draft: Profile): Profile {
  const fullName = draft.fullName.trim();
  const [firstName = "", ...restName] = fullName.split(/\s+/).filter(Boolean);
  const lastName = restName.join(" ");
  const github = optionalUrl(draft.links.github) || "";
  const linkedin = optionalUrl(draft.links.linkedin) || "";
  const email = draft.email?.trim() || "";
  const resumePath = draft.resumePath.trim() || draft.links.resume?.trim() || "/resume";

  return {
    ...draft,
    fullName,
    initials: draft.initials.trim(),
    headline: draft.headline.trim(),
    role: draft.role.trim(),
    shortBio: draft.shortBio.trim(),
    longBio: draft.longBio.trim(),
    location: draft.location?.trim(),
    timezone: draft.timezone?.trim(),
    email,
    availability: draft.availability?.trim(),
    preferredRoles: draft.preferredRoles.map((item) => item.trim()).filter(Boolean),
    currentFocus: draft.currentFocus.map((item) => item.trim()).filter(Boolean),
    engineeringStyle: draft.engineeringStyle.map((item) => item.trim()).filter(Boolean),
    education: {
      degree: draft.education?.degree?.trim(),
      institution: draft.education?.institution?.trim(),
      status: draft.education?.status?.trim(),
      location: draft.education?.location?.trim(),
    },
    links: {
      github,
      linkedin,
      email: email ? `mailto:${email.replace(/^mailto:/, "")}` : undefined,
      resume: resumePath,
      portfolio: optionalUrl(draft.links.portfolio),
    },
    ctas: {
      primary: draft.ctas.primary.trim(),
      secondary: draft.ctas.secondary.trim(),
    },
    credibility: draft.credibility.map((item) => item.trim()).filter(Boolean),
    name: fullName,
    firstName,
    lastName,
    title: draft.headline.trim(),
    tagline: draft.tagline.trim(),
    heroDescription: draft.heroDescription.trim(),
    contactDescription: draft.contactDescription.trim(),
    github,
    githubHandle: draft.githubHandle.trim(),
    linkedin,
    linkedinHandle: draft.linkedinHandle.trim(),
    locationShort: draft.locationShort.trim(),
    profilePhoto: optionalUrl(draft.profilePhoto) || "",
    resumePath,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isValidGitHubRepoUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;

  try {
    const url = new URL(trimmed);
    const [, owner, repo, ...rest] = url.pathname.split("/");
    return url.protocol === "https:" && url.hostname === "github.com" && Boolean(owner) && Boolean(repo) && rest.length === 0;
  } catch {
    return false;
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan/60 focus:bg-white/[0.07]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white outline-none transition focus:border-purple/60 focus:bg-white/[0.07]"
      />
    </label>
  );
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [projectDraft, setProjectDraft] = useState<AdminProject>(blankProject);
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [postDraft, setPostDraft] = useState<AdminBlogPost>(blankPost);
  const [profileDraft, setProfileDraft] = useState<Profile>(profile);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState<"draft" | "publish" | null>(null);

  const adminAccess = useMemo(() => checkAdminAccess(user), [user]);
  const isAllowedAdmin = adminAccess.allowed;

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isAllowedAdmin) return;
    void refreshContent();
    void loadProfileContent();
  }, [isAllowedAdmin]);

  async function loadProfileContent() {
    setProfileLoading(true);
    try {
      const result = await getPublicProfile();
      setProfileDraft(result.data);
      if (result.error) {
        setMessage(`Profile loaded from static fallback. ${result.error}`);
      }
    } catch (error) {
      setProfileDraft(profile);
      setMessage(error instanceof Error ? `Profile fallback loaded. ${error.message}` : "Profile fallback loaded.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function refreshContent() {
    try {
      setLoading(true);
      const [remoteProjects, remotePosts] = await Promise.all([listProjects(), listBlogPosts(false)]);
      setProjects(remoteProjects);
      setPosts(remotePosts);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load content.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (!auth) return;
    setLoading(true);
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfileDraft() {
    setProfileSaving("draft");
    setMessage("");
    const result = await saveSingletonDraft("profile", buildProfilePayload(profileDraft));
    if (result.ok) {
      setMessage(result.warning ? `Draft saved. ${result.warning}` : "Draft saved.");
    } else {
      setMessage(result.error || "Draft save failed.");
    }
    setProfileSaving(null);
  }

  async function handlePublishProfile() {
    setProfileSaving("publish");
    setMessage("");
    const result = await publishSingleton("profile", buildProfilePayload(profileDraft));
    if (result.ok) {
      setMessage(result.warning ? `Published. Public Hero will use this content. ${result.warning}` : "Published. Public Hero will use this content.");
    } else {
      setMessage(result.error || "Profile publish failed.");
    }
    setProfileSaving(null);
  }

  async function handleSaveProject() {
    const id = projectDraft.id || slugify(projectDraft.title);
    if (!id) {
      setMessage("Project needs a title or ID.");
      return;
    }
    if (!isValidGitHubRepoUrl(projectDraft.github)) {
      setMessage("GitHub URL must follow https://github.com/owner/repo or be left empty.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await saveProject({ ...projectDraft, id });
      setProjectDraft(blankProject);
      await refreshContent();
      setMessage("Project saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Project save failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProject(id: string) {
    setLoading(true);
    setMessage("");
    try {
      await deleteProject(id);
      await refreshContent();
      setMessage("Project deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Project delete failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePost() {
    const slug = postDraft.slug || slugify(postDraft.title);
    if (!slug) {
      setMessage("Blog post needs a title or slug.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await saveBlogPost({ ...postDraft, slug });
      setPostDraft(blankPost);
      await refreshContent();
      setMessage("Blog post saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Blog save failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(slug: string) {
    setLoading(true);
    setMessage("");
    try {
      await deleteBlogPost(slug);
      await refreshContent();
      setMessage("Blog post deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Blog delete failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!isFirebaseConfigured) {
    return <SetupPanel />;
  }

  if (!adminAccess.configured) {
    return <LockedAdminPanel />;
  }

  if (!authReady) {
    return <LoadingPanel />;
  }

  if (!user) {
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <div className="rounded-[2rem] border border-white/10 bg-surface/80 p-8 shadow-[0_0_60px_rgba(110,91,255,0.18)] backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange">Admin Control</p>
              <h1 className="text-3xl font-bold">Sign in</h1>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email" value={email} onChange={setEmail} type="email" />
            <Field label="Password" value={password} onChange={setPassword} type="password" />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-background transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Unlock Console
            </button>
          </form>
          {message && <p className="mt-4 rounded-xl border border-orange/20 bg-orange/10 p-3 text-sm text-orange">{message}</p>}
        </div>
      </section>
    );
  }

  if (!isAllowedAdmin) {
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6">
        <div className="rounded-[2rem] border border-orange/20 bg-orange/10 p-8 text-center">
          <h1 className="text-3xl font-bold">Not authorized</h1>
          {user.email ? <p className="mt-3 text-sm font-bold text-orange">{user.email}</p> : null}
          <p className="mt-3 text-muted">
            This account is not authorized for admin access.
          </p>
          <button
            onClick={() => auth && signOut(auth)}
            className="mt-6 rounded-full bg-white px-5 py-3 font-bold text-background"
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-screen w-full max-w-7xl px-6 py-28 md:px-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan">
            <Palette className="h-4 w-4" />
            Colourful control room
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Admin Console</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Manage your profile copy, project cards, and blog drafts from Firestore.
          </p>
        </div>
        <button
          onClick={() => auth && signOut(auth)}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-3 rounded-[1.5rem] border border-white/10 bg-surface/60 p-2 backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition",
                activeTab === tab.id ? "bg-white text-background" : "text-muted hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {message && <p className="mb-6 rounded-2xl border border-cyan/20 bg-cyan/10 p-4 text-sm text-cyan">{message}</p>}

      {activeTab === "profile" && (
        <Panel title="Profile / Hero Controls" accent="from-cyan/20 to-purple/20">
          {profileLoading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-cyan" />
              Loading published profile or static fallback...
            </div>
          ) : null}

          <div className="grid gap-8">
            <section>
              <h3 className="mb-4 text-lg font-bold text-white">Identity</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full Name" value={profileDraft.fullName} onChange={(value) => setProfileDraft({ ...profileDraft, fullName: value })} />
                <Field label="Initials" value={profileDraft.initials} onChange={(value) => setProfileDraft({ ...profileDraft, initials: value })} />
                <Field label="Headline" value={profileDraft.headline} onChange={(value) => setProfileDraft({ ...profileDraft, headline: value, title: value })} />
                <Field label="Role" value={profileDraft.role} onChange={(value) => setProfileDraft({ ...profileDraft, role: value })} />
                <Field label="Location" value={profileDraft.location || ""} onChange={(value) => setProfileDraft({ ...profileDraft, location: value })} />
                <Field label="Timezone" value={profileDraft.timezone || ""} onChange={(value) => setProfileDraft({ ...profileDraft, timezone: value })} />
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-white">Hero Copy</h3>
              <div className="grid gap-5">
                <TextArea label="Short Bio" value={profileDraft.shortBio} onChange={(value) => setProfileDraft({ ...profileDraft, shortBio: value })} />
                <TextArea label="Long Bio" rows={5} value={profileDraft.longBio} onChange={(value) => setProfileDraft({ ...profileDraft, longBio: value })} />
                <TextArea label="Hero Description / Positioning" value={profileDraft.heroDescription} onChange={(value) => setProfileDraft({ ...profileDraft, heroDescription: value })} />
                <TextArea label="Availability" value={profileDraft.availability || ""} onChange={(value) => setProfileDraft({ ...profileDraft, availability: value })} />
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-white">Contact & Links</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Email" type="email" value={profileDraft.email || ""} onChange={(value) => setProfileDraft({ ...profileDraft, email: value })} />
                <Field label="Profile Photo URL" value={profileDraft.profilePhoto} onChange={(value) => setProfileDraft({ ...profileDraft, profilePhoto: value })} />
                <Field label="GitHub URL" value={profileDraft.links.github || ""} onChange={(value) => setProfileDraft({ ...profileDraft, links: { ...profileDraft.links, github: value }, github: value })} />
                <Field label="LinkedIn URL" value={profileDraft.links.linkedin || ""} onChange={(value) => setProfileDraft({ ...profileDraft, links: { ...profileDraft.links, linkedin: value }, linkedin: value })} />
                <Field label="Portfolio URL" value={profileDraft.links.portfolio || ""} onChange={(value) => setProfileDraft({ ...profileDraft, links: { ...profileDraft.links, portfolio: value } })} />
                <Field label="Resume Path" value={profileDraft.resumePath} onChange={(value) => setProfileDraft({ ...profileDraft, resumePath: value, links: { ...profileDraft.links, resume: value } })} />
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-white">Focus Areas</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <TextArea label="Preferred Roles (one per line)" rows={6} value={toLines(profileDraft.preferredRoles)} onChange={(value) => setProfileDraft({ ...profileDraft, preferredRoles: fromLines(value) })} />
                <TextArea label="Current Focus (one per line)" rows={6} value={toLines(profileDraft.currentFocus)} onChange={(value) => setProfileDraft({ ...profileDraft, currentFocus: fromLines(value) })} />
                <TextArea label="Engineering Style (one per line)" rows={6} value={toLines(profileDraft.engineeringStyle)} onChange={(value) => setProfileDraft({ ...profileDraft, engineeringStyle: fromLines(value) })} />
                <TextArea label="Credibility Chips (one per line)" rows={6} value={toLines(profileDraft.credibility)} onChange={(value) => setProfileDraft({ ...profileDraft, credibility: fromLines(value) })} />
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-white">Education & CTAs</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Degree" value={profileDraft.education?.degree || ""} onChange={(value) => setProfileDraft({ ...profileDraft, education: { ...profileDraft.education, degree: value } })} />
                <Field label="Institution" value={profileDraft.education?.institution || ""} onChange={(value) => setProfileDraft({ ...profileDraft, education: { ...profileDraft.education, institution: value } })} />
                <Field label="Education Status" value={profileDraft.education?.status || ""} onChange={(value) => setProfileDraft({ ...profileDraft, education: { ...profileDraft.education, status: value } })} />
                <Field label="Education Location" value={profileDraft.education?.location || ""} onChange={(value) => setProfileDraft({ ...profileDraft, education: { ...profileDraft.education, location: value } })} />
                <Field label="Primary CTA Label" value={profileDraft.ctas.primary} onChange={(value) => setProfileDraft({ ...profileDraft, ctas: { ...profileDraft.ctas, primary: value } })} />
                <Field label="Secondary CTA Label" value={profileDraft.ctas.secondary} onChange={(value) => setProfileDraft({ ...profileDraft, ctas: { ...profileDraft.ctas, secondary: value } })} />
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton onClick={handleSaveProfileDraft} loading={profileSaving === "draft"} disabled={Boolean(profileSaving)} label={profileSaving === "draft" ? "Saving Draft" : "Save Draft"} />
            <ActionButton onClick={handlePublishProfile} loading={profileSaving === "publish"} disabled={Boolean(profileSaving)} label={profileSaving === "publish" ? "Publishing" : "Publish"} />
            <button
              type="button"
              disabled={Boolean(profileSaving)}
              onClick={() => {
                setProfileDraft(profile);
                setMessage("Form reset to static fallback. Save or publish to write it.");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08] disabled:opacity-60"
            >
              Reset form to static fallback
            </button>
          </div>

          <p className="text-sm leading-relaxed text-muted">
            Draft saves to the CMS draft profile. Publish writes the profile used by the public Hero. Draft loading will be added later; this form currently starts from the published profile or static fallback.
          </p>
        </Panel>
      )}

      {activeTab === "projects" && (
        <Panel title="Project Controls" accent="from-orange/20 to-cyan/20">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="ID / Slug" value={projectDraft.id} onChange={(value) => setProjectDraft({ ...projectDraft, id: slugify(value) })} />
              <Field label="Title" value={projectDraft.title} onChange={(value) => setProjectDraft({ ...projectDraft, title: value, id: projectDraft.id || slugify(value) })} />
              <Field label="Category" value={projectDraft.category} onChange={(value) => setProjectDraft({ ...projectDraft, category: value })} />
              <Field label="Proof Point" value={projectDraft.proofPoint} onChange={(value) => setProjectDraft({ ...projectDraft, proofPoint: value })} />
              <Field label="GitHub URL" value={projectDraft.github} onChange={(value) => setProjectDraft({ ...projectDraft, github: value })} />
              <Field label="Live Demo URL" value={projectDraft.demo} onChange={(value) => setProjectDraft({ ...projectDraft, demo: value })} />
              <Field label="Icon Key" value={projectDraft.iconKey} onChange={(value) => setProjectDraft({ ...projectDraft, iconKey: value })} placeholder="Code2, Mail, Scale, BookOpen" />
              <Field label="Order" type="number" value={projectDraft.order} onChange={(value) => setProjectDraft({ ...projectDraft, order: Number(value) })} />
              <div className="md:col-span-2">
                <TextArea label="Description" value={projectDraft.description} onChange={(value) => setProjectDraft({ ...projectDraft, description: value })} />
              </div>
              <div className="md:col-span-2">
                <TextArea label="Problem" value={projectDraft.problem} onChange={(value) => setProjectDraft({ ...projectDraft, problem: value })} />
              </div>
              <div className="md:col-span-2">
                <TextArea label="Architecture" value={projectDraft.architecture} onChange={(value) => setProjectDraft({ ...projectDraft, architecture: value })} />
              </div>
              <Field label="Tech CSV" value={toCsv(projectDraft.tech)} onChange={(value) => setProjectDraft({ ...projectDraft, tech: fromCsv(value) })} />
              <Field label="Highlights CSV" value={toCsv(projectDraft.highlights)} onChange={(value) => setProjectDraft({ ...projectDraft, highlights: fromCsv(value) })} />
            </div>

            <ItemList
              title="Saved Projects"
              empty="No Firebase projects yet. Static project cards still render publicly."
              items={projects.length ? projects : projectsData.map((item, index) => ({ id: item.id, title: item.title, subtitle: "Static fallback", order: index }))}
              onEdit={(id) => {
                const match = projects.find((item) => item.id === id);
                if (match) setProjectDraft(match);
              }}
              onDelete={(id) => void handleDeleteProject(id)}
            />
          </div>
          <ActionButton onClick={handleSaveProject} loading={loading} label="Save Project" />
        </Panel>
      )}

      {activeTab === "blog" && (
        <Panel title="Blog Controls" accent="from-purple/20 to-orange/20">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Slug" value={postDraft.slug} onChange={(value) => setPostDraft({ ...postDraft, slug: slugify(value) })} />
              <Field label="Title" value={postDraft.title} onChange={(value) => setPostDraft({ ...postDraft, title: value, slug: postDraft.slug || slugify(value) })} />
              <Field label="Date" type="date" value={postDraft.date} onChange={(value) => setPostDraft({ ...postDraft, date: value })} />
              <Field label="Tags CSV" value={toCsv(postDraft.tags)} onChange={(value) => setPostDraft({ ...postDraft, tags: fromCsv(value) })} />
              <div className="md:col-span-2">
                <TextArea label="Description" value={postDraft.description} onChange={(value) => setPostDraft({ ...postDraft, description: value })} />
              </div>
              <div className="md:col-span-2">
                <TextArea label="Markdown Content" rows={14} value={postDraft.content} onChange={(value) => setPostDraft({ ...postDraft, content: value })} />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-white">
                <input
                  type="checkbox"
                  checked={postDraft.published}
                  onChange={(event) => setPostDraft({ ...postDraft, published: event.target.checked })}
                  className="h-4 w-4 accent-cyan"
                />
                Publish this post
              </label>
            </div>

            <ItemList
              title="Saved Posts"
              empty="No Firebase posts yet."
              items={posts.map((post) => ({ id: post.slug, title: post.title, subtitle: post.published ? "Published" : "Draft" }))}
              onEdit={(slug) => {
                const match = posts.find((item) => item.slug === slug);
                if (match) setPostDraft(match);
              }}
              onDelete={(slug) => void handleDeletePost(slug)}
            />
          </div>
          <ActionButton onClick={handleSavePost} loading={loading} label="Save Blog Post" />
        </Panel>
      )}

      {activeTab === "setup" && <SetupPanel />}
    </section>
  );
}

function Panel({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 shadow-2xl backdrop-blur-xl">
      <div className={cn("border-b border-white/10 bg-gradient-to-r p-6", accent)}>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="space-y-6 p-6 md:p-8">{children}</div>
    </div>
  );
}

function ActionButton({ onClick, loading, label, disabled = false }: { onClick: () => void; loading: boolean; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={loading || disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-background transition hover:scale-[1.01] disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {label}
    </button>
  );
}

function ItemList({
  title,
  empty,
  items,
  onEdit,
  onDelete,
}: {
  title: string;
  empty: string;
  items: { id: string; title: string; subtitle?: string; order?: number }[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <Plus className="h-4 w-4 text-cyan" />
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="font-bold text-white">{item.title}</p>
              <p className="mt-1 text-xs text-muted">{item.subtitle || item.id}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => onEdit(item.id)} className="rounded-full bg-cyan/10 px-3 py-1 text-xs font-bold text-cyan">
                  Edit
                </button>
                <button onClick={() => onDelete(item.id)} className="rounded-full bg-orange/10 px-3 py-1 text-xs font-bold text-orange">
                  <Trash2 className="inline h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

function SetupPanel() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-24">
      <div className="rounded-[2rem] border border-white/10 bg-surface/80 p-8 shadow-[0_0_70px_rgba(0,229,255,0.12)] backdrop-blur-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple/20 bg-purple/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-purple">
          <KeyRound className="h-4 w-4" />
          Firebase setup needed
        </div>
        <h1 className="text-4xl font-bold">Connect your admin console</h1>
        <p className="mt-4 text-muted">
          Add Firebase web config values to <code className="text-cyan">.env.local</code>, enable Email/Password Auth,
          paste the Firestore rules from <code className="text-cyan">docs/firebase-admin-setup.md</code>, then restart the dev server.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-xs leading-relaxed text-white">
{`NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_UID=
NEXT_PUBLIC_ADMIN_UIDS=
NEXT_PUBLIC_ADMIN_EMAIL=
NEXT_PUBLIC_ADMIN_EMAILS=`}
        </pre>
      </div>
    </section>
  );
}

function LockedAdminPanel() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-24">
      <div className="rounded-[2rem] border border-orange/20 bg-orange/10 p-8 shadow-[0_0_70px_rgba(255,122,0,0.12)] backdrop-blur-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange">
          <KeyRound className="h-4 w-4" />
          Admin locked
        </div>
        <h1 className="text-4xl font-bold">Admin allowlist is not configured</h1>
        <p className="mt-4 text-muted">
          Add <code className="text-orange">NEXT_PUBLIC_ADMIN_UID</code> or{" "}
          <code className="text-orange">NEXT_PUBLIC_ADMIN_EMAIL</code> to your environment variables.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The dashboard intentionally locks everyone out until an explicit Firebase Auth UID or email allowlist is configured.
        </p>
      </div>
    </section>
  );
}

function LoadingPanel() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <div className="flex items-center gap-3 rounded-[2rem] border border-white/10 bg-surface/80 p-8 text-muted shadow-[0_0_60px_rgba(0,229,255,0.10)] backdrop-blur-xl">
        <Loader2 className="h-5 w-5 animate-spin text-cyan" />
        Checking admin access...
      </div>
    </section>
  );
}
