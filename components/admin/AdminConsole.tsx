"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { BookOpenText, BriefcaseBusiness, ExternalLink, FolderKanban, LogOut, Settings2, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogEditor, type BlogSource } from "./BlogEditor";
import { useConfirm } from "./ConfirmDialog";
import { ExperienceEditor } from "./ExperienceEditor";
import { ProfileEditor, type ProfileSource } from "./ProfileEditor";
import { ProjectsEditor } from "./ProjectsEditor";
import { SetupGuide } from "./SetupGuide";
import { StatusRegion } from "./status";
import type { CmsDataSource } from "./useCmsCollection";

type TabId = "profile" | "projects" | "experience" | "blog" | "setup";

const TABS: { id: TabId; label: string; icon: LucideIcon; title: string; description: string }[] = [
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
    title: "Profile",
    description: "Name, hero copy, links and focus areas. Save a draft while you work; publish to update the site.",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    title: "Projects",
    description: "Static projects from src/data plus CMS versions. Edit, reorder, archive or add projects; links are checked before saving.",
  },
  {
    id: "experience",
    label: "Experience",
    icon: BriefcaseBusiness,
    title: "Experience",
    description: "The career timeline, newest first. Edit roles, upload company logos and set the order.",
  },
  {
    id: "blog",
    label: "Blog",
    icon: BookOpenText,
    title: "Blog",
    description: "Firestore blog posts (legacy collection).",
  },
  {
    id: "setup",
    label: "Setup",
    icon: Settings2,
    title: "Setup",
    description: "Configuration status, storage paths and publishing rules.",
  },
];

export type AdminConsoleProps = {
  account: { email?: string | null; uid?: string | null };
  onSignOut: () => void;
  /** Optional data sources (defaults: Firestore). */
  cmsSource?: CmsDataSource;
  profileSource?: ProfileSource;
  blogSource?: BlogSource;
};

/** Signed-in admin: header, keyboard-accessible tabs and one panel per content type. */
export function AdminConsole({ account, onSignOut, cmsSource, profileSource, blogSource }: AdminConsoleProps) {
  const [active, setActive] = useState<TabId>("profile");
  // Panels stay mounted after the first visit so unsaved edits survive tab switches.
  const [visited, setVisited] = useState<ReadonlySet<TabId>>(() => new Set<TabId>(["profile"]));
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ profile: null, projects: null, experience: null, blog: null, setup: null });
  const [confirm, confirmDialog] = useConfirm();

  function select(id: TabId, focus = false) {
    setActive(id);
    setVisited((current) => (current.has(id) ? current : new Set(current).add(id)));
    if (focus) tabRefs.current[id]?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TABS.length - 1;
    const target =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (target === null) return;
    event.preventDefault();
    select(TABS[target].id, true);
  }

  async function handleSignOut() {
    const ok = await confirm({
      title: "Sign out?",
      body: <p>Unsaved changes in open editors will be lost. Saved drafts and published content are not affected.</p>,
      confirmLabel: "Sign out",
    });
    if (ok) onSignOut();
  }

  return (
    <div className="adm-console">
      <header className="adm-header">
        <div>
          <p className="adm-chip adm-chip--yellow">Admin console</p>
          <h1 className="adm-header__title">Site content</h1>
          <p className="adm-muted">
            Signed in as <strong>{account.email ?? "admin"}</strong>. Published changes reach the site within about 5 minutes.
          </p>
        </div>
        <div className="adm-header__actions">
          <a className="brutal-button brutal-button--secondary brutal-button--small" href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} aria-hidden="true" />
            View site
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <button type="button" className="brutal-button brutal-button--secondary brutal-button--small" onClick={() => void handleSignOut()}>
            <LogOut size={15} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div className="adm-tabs" role="tablist" aria-label="Content sections">
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              id={`admin-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`admin-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={cn("adm-tab", selected && "is-active")}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <Icon size={16} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <StatusRegion />

      {TABS.map((tab) => (
        <section
          key={tab.id}
          id={`admin-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`admin-tab-${tab.id}`}
          hidden={active !== tab.id}
          tabIndex={0}
          className="adm-panel"
        >
          <div className="adm-panel__head">
            <h2 className="adm-panel__title">{tab.title}</h2>
            <p className="adm-muted">{tab.description}</p>
          </div>
          {visited.has(tab.id) ? (
            <>
              {tab.id === "profile" ? <ProfileEditor source={profileSource} /> : null}
              {tab.id === "projects" ? <ProjectsEditor source={cmsSource} /> : null}
              {tab.id === "experience" ? <ExperienceEditor source={cmsSource} /> : null}
              {tab.id === "blog" ? <BlogEditor source={blogSource} /> : null}
              {tab.id === "setup" ? <SetupGuide uid={account.uid} email={account.email} /> : null}
            </>
          ) : null}
        </section>
      ))}
      {confirmDialog}
    </div>
  );
}
