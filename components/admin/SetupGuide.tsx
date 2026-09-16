import { CircleAlert, CircleCheck } from "lucide-react";
import { getAdminAllowlist } from "@/lib/firebase/adminAccess";
import { isFirebaseConfigured, storage } from "@/lib/firebase/client";
import { CMS_PATHS } from "@/lib/cms/paths";
import { plural } from "./format";

export const ENV_TEMPLATE = `NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_UID=
NEXT_PUBLIC_ADMIN_UIDS=
NEXT_PUBLIC_ADMIN_EMAIL=
NEXT_PUBLIC_ADMIN_EMAILS=`;

type Check = { ok: boolean; label: string; detail: string };

export function ConfigChecklist() {
  const allowlist = getAdminAllowlist();
  const checks: Check[] = [
    {
      ok: isFirebaseConfigured,
      label: "Firebase web config",
      detail: isFirebaseConfigured ? "All NEXT_PUBLIC_FIREBASE_* values are set." : "Add the six NEXT_PUBLIC_FIREBASE_* values to .env.local.",
    },
    {
      ok: Boolean(storage),
      label: "Storage for image uploads",
      detail: storage ? "Logo and thumbnail uploads are available." : "Uploads stay off until Firebase (including the storage bucket) is configured. URLs still work.",
    },
    {
      ok: allowlist.configured,
      label: "Admin allowlist",
      detail: allowlist.configured
        ? `${plural(allowlist.uids.length, "UID")} and ${plural(allowlist.emails.length, "email")} allowed.`
        : "Add NEXT_PUBLIC_ADMIN_UID or NEXT_PUBLIC_ADMIN_EMAIL. Until then everyone is locked out.",
    },
  ];

  return (
    <ul className="adm-checklist">
      {checks.map((check) => (
        <li key={check.label} className={check.ok ? "is-ok" : "is-missing"}>
          {check.ok ? <CircleCheck size={18} aria-hidden="true" /> : <CircleAlert size={18} aria-hidden="true" />}
          <div>
            <p className="adm-checklist__label">
              {check.label}
              <span className="visually-hidden">{check.ok ? ": ready" : ": needs setup"}</span>
            </p>
            <p className="adm-checklist__detail">{check.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Setup tab: configuration status, where content lives and how publishing reaches the site. */
export function SetupGuide({ uid, email }: { uid?: string | null; email?: string | null }) {
  return (
    <div className="adm-setup">
      <section className="adm-card adm-card--flat" aria-labelledby="setup-status">
        <h3 id="setup-status" className="adm-card__title">
          Configuration
        </h3>
        <ConfigChecklist />
        {uid ? (
          <p className="adm-muted adm-mt-3">
            Signed in as {email ?? "an admin"} · UID <code className="adm-code">{uid}</code>. Use this UID in the Firestore and Storage rules.
          </p>
        ) : null}
      </section>

      <section className="adm-card adm-card--flat" aria-labelledby="setup-publishing">
        <h3 id="setup-publishing" className="adm-card__title">
          How publishing works
        </h3>
        <ul className="adm-bullets">
          <li>
            <strong>Static first.</strong> Projects and experience come from src/data. A published CMS document with the same ID replaces that item; a new ID adds one.
          </li>
          <li>
            <strong>Drafts are private.</strong> The site ignores drafts, so the static version (if any) stays live until you publish.
          </li>
          <li>
            <strong>Archive hides.</strong> An archived document removes that ID from the site, including its static version. Delete the CMS version to bring the static
            one back.
          </li>
          <li>
            <strong>About 5 minutes.</strong> Pages are regenerated every 300 seconds, so published changes appear on the public site within about 5 minutes.
          </li>
        </ul>
      </section>

      <section className="adm-card adm-card--flat" aria-labelledby="setup-paths">
        <h3 id="setup-paths" className="adm-card__title">
          Where content is stored
        </h3>
        <dl className="adm-paths">
          <dt>Profile</dt>
          <dd>
            <code className="adm-code">{CMS_PATHS.profileDraft}</code>, <code className="adm-code">{CMS_PATHS.profilePublished}</code>
          </dd>
          <dt>Projects</dt>
          <dd>
            <code className="adm-code">{CMS_PATHS.projects}/&#123;id&#125;</code>
          </dd>
          <dt>Experience</dt>
          <dd>
            <code className="adm-code">{CMS_PATHS.experience}/&#123;id&#125;</code>
          </dd>
          <dt>Version history</dt>
          <dd>
            <code className="adm-code">{CMS_PATHS.versions}/&#123;id&#125;</code> (written on every publish)
          </dd>
          <dt>Blog (legacy)</dt>
          <dd>
            <code className="adm-code">blogPosts/&#123;slug&#125;</code>
          </dd>
          <dt>Images</dt>
          <dd>
            <code className="adm-code">portfolio/experience-logos/</code>, <code className="adm-code">portfolio/project-images/</code>
          </dd>
        </dl>
        <p className="adm-muted adm-mt-3">
          Rules and step-by-step setup: <code className="adm-code">docs/firebase-admin-setup.md</code>. The legacy top-level <code className="adm-code">projects</code>{" "}
          collection is no longer used.
        </p>
      </section>
    </div>
  );
}
