# Firebase Admin Setup

The site has a private `/admin` console (not indexed) for editing the profile, projects, experience and legacy blog posts.

The console signs in with Firebase Auth. **Firestore and Storage Security Rules are the real authorization boundary**; the client-side allowlist only decides whether the dashboard is shown. Do not rely on the UI alone.

Without Firebase configuration the public site keeps working from the static content in `src/data`, and `/admin` shows a setup panel.

## 1. Create the Firebase project

1. Go to the Firebase Console and create a project.
2. Add a Web app and copy its config values.
3. Enable **Cloud Firestore** and **Storage** (Storage is needed for company logo and project image uploads).

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_UID=
NEXT_PUBLIC_ADMIN_UIDS=
NEXT_PUBLIC_ADMIN_EMAIL=
NEXT_PUBLIC_ADMIN_EMAILS=
```

Restart the dev server after adding these values. Do not commit `.env.local`.

## 2. Enable auth

1. Firebase Console → Authentication → Sign-in method → enable **Email/Password**.
2. Create your admin user.
3. Copy the user's UID from Authentication → Users.
4. Put it in `NEXT_PUBLIC_ADMIN_UID` **and** in the rules below (replace `YOUR_ADMIN_UID`).

The admin Setup tab also shows the UID of the signed-in account.

## 3. Admin allowlist (UX gate)

Firebase web config values are public by design. The `NEXT_PUBLIC_ADMIN_*` allowlist is a client-side gate that keeps the dashboard hidden from other accounts; it is not the security boundary.

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_ADMIN_UID` | One UID |
| `NEXT_PUBLIC_ADMIN_UIDS` | Comma-separated UIDs |
| `NEXT_PUBLIC_ADMIN_EMAIL` | One email |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Comma-separated emails |

UID matching is exact and preferred (UIDs never change). Email matching is case-insensitive. If every allowlist variable is empty, the dashboard locks everyone out.

## 4. Data model

The admin writes through `lib/cms/adminWrites.ts`. Every CMS document gets `id`, `status` (`draft` | `published` | `archived`), `hidden`, `createdAt`, `updatedAt`, `publishedAt` and `version`. Writes use `setDoc(..., { merge: true })`.

### Paths

| Content | Path | Written by |
| --- | --- | --- |
| Profile draft | `cms/profile/states/draft` | Profile → Save draft |
| Profile (public) | `cms/profile/states/published` | Profile → Publish |
| Projects | `cms/projects/items/{id}` | Projects tab |
| Experience | `cms/experience/items/{id}` | Experience tab |
| Version history | `cms/versions/items/{timestamp-type-id}` | Every publish (admin-only snapshot) |
| Blog posts (legacy) | `blogPosts/{slug}` | Blog tab |
| Company logos | Storage `portfolio/experience-logos/…` | Experience → logo upload |
| Project images | Storage `portfolio/project-images/…` | Projects → thumbnail upload |

`cms/siteSettings/states/{draft|published}` and `cms/{skills|achievements|interests|blogPosts}/items/{id}` are reserved by the CMS layer but have no editor yet.

The legacy top-level `projects/{id}` collection and `siteSettings/profile` document are **no longer used** by the admin or the site. They can be deleted once you have moved anything you need into the CMS.

### How the public site merges projects and experience

Static data in `src/data/projects.ts` and `src/data/experience.ts` is the base. CMS documents are overrides keyed by `id` (`lib/cms/firestore.ts` → `readMergedCmsCollection`):

| CMS document | Public result |
| --- | --- |
| none | Static item is shown ("Static only" in the admin) |
| `status: "published"` | Replaces the static item with the same id, or adds a new item ("Published override" / "CMS only") |
| `status: "draft"` | Ignored. The static item (if any) stays live |
| `status: "archived"` or `hidden: true` | That id is removed from the site, including its static version |

Deleting a CMS document ("Delete CMS version") restores the static item if one exists; otherwise the item is gone.

Because one document holds one state, **saving a draft over a published document unpublishes it** (the admin asks for confirmation). Publishing writes the document and a snapshot in `cms/versions/items`.

Merge details (`lib/cms/normalize.ts`):

- Text and list fields that are empty in the CMS document fall back to the static value.
- `links`: every key present in the document wins, even when empty. The admin always writes all seven keys (`live`, `github`, `loom`, `documentation`, `caseStudy`, `demo`, `video`), with `""` for a removed link, so a static link can be removed.
- `companyLogo` (experience) and `visuals.thumbnail` (projects) work the same way: the admin always writes them, `""` when removed. An empty logo renders the initials mark.
- URLs are validated when saving (`lib/urls.ts`, bare domains become `https://`) and again when rendering; only `http(s)` URLs and `/public` paths are ever used.

### Project document (`cms/projects/items/{id}`)

```ts
{
  id, status, hidden, order, priority,          // order === priority; lower is shown first
  title, shortTitle, category, year,
  projectStatus: "Live" | "Prototype" | "Case Study" | "Archived",
  featured, showOnHome,
  archived,                                      // content flag: listed under "From the archive" (still public)
  summary, oneLine, problem, solution, myRole,
  techStack: string[], tags: string[],
  architectureHighlights, features, impact, challenges, learnings, nextSteps: string[],
  links: { live, github, loom, documentation, caseStudy, demo, video },   // all keys, "" = none
  visuals: { thumbnail, thumbnailAlt },           // thumbnail "" = none
  createdAt, updatedAt, publishedAt, version
}
```

### Experience document (`cms/experience/items/{id}`)

```ts
{
  id, status, hidden,
  order,                                         // timeline position: 0 = newest (static items use their array index)
  company, companyLogo,                          // companyLogo "" = initials mark
  chapterTitle, progressionLabel, role, period, type, location,
  shortSummary, responsibilities: string[], impact: string[], techStack: string[],
  featured,
  createdAt, updatedAt, publishedAt, version
}
```

### Reordering

The list arrows swap two items. If the current positions are already distinct and ascending, the two items trade values (two writes); otherwise every visible item is renumbered (projects from 1, experience from 0). A static-only item that has to move gets a **published override containing its current static content**; the admin lists these items and asks before writing. Later edits to `src/data` for such an item are hidden until its CMS version is deleted.

## 5. Firestore rules

Replace `YOUR_ADMIN_UID` (add more UIDs to the list if needed). Treat this as a starting point, not a full security review.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.uid in ['YOUR_ADMIN_UID'];
    }

    function hasValidStatus() {
      return request.resource.data.status in ['draft', 'published', 'archived'];
    }

    // Projects, experience and other CMS item collections.
    // Public visitors may only read published and archived documents (archived ones tell the site
    // which static items to hide). Drafts stay private.
    match /cms/{collection}/items/{id} {
      allow get, list: if isAdmin()
        || (collection != 'versions' && resource.data.status in ['published', 'archived']);
      allow create, update: if isAdmin() && (collection == 'versions' || hasValidStatus());
      allow delete: if isAdmin();
    }

    // Version snapshots: admin only. (Also covered above; kept explicit for clarity.)
    match /cms/versions/items/{id} {
      allow read, write: if isAdmin();
    }

    // Singletons: cms/profile/states/{draft|published}, cms/siteSettings/states/{draft|published}.
    match /cms/{type}/states/{state} {
      allow get: if state == 'published' || isAdmin();
      allow list: if isAdmin();
      allow create, update: if isAdmin() && state in ['draft', 'published'] && hasValidStatus();
      allow delete: if isAdmin();
    }

    // Legacy blog posts (edited in the Blog tab; the public blog renders content/blog Markdown).
    match /blogPosts/{slug} {
      allow read: if isAdmin() || resource.data.published == true;
      allow create, update, delete: if isAdmin();
    }

    // Everything else, including the legacy top-level `projects` collection, is closed.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Notes:

- **List queries must match the rule.** Firestore rules are not filters: a public query is only allowed if it can return nothing but published/archived documents. The site's merged reads (`readMergedCmsCollection`, used for projects and experience) query with `where("status", "in", ["published", "archived"])`, which satisfies the rule. The admin's `listItems` reads the whole collection and is allowed because the admin passes `isAdmin()`.
- `get` on `cms/profile/states/published` is public; the draft is admin-only.
- If a public read is denied or fails, the site falls back to the static content and keeps rendering.
- A catch-all `allow ... if false` is the default anyway; it is listed to make the closed legacy paths explicit. Remove the `blogPosts` block if you stop using the Blog tab.

## 6. Storage rules

Uploads go to `portfolio/experience-logos/` and `portfolio/project-images/` (`lib/firebase/storage.ts`). The admin accepts PNG, JPG, WebP, AVIF and SVG up to 2 MB before uploading; the rules enforce images under 5 MB.

```js
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null && request.auth.uid in ['YOUR_ADMIN_UID'];
    }

    function isImageUnder5Mb() {
      return request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }

    match /portfolio/experience-logos/{path=**} {
      allow read: if true;
      allow create, update: if isAdmin() && isImageUnder5Mb();
      allow delete: if isAdmin();
    }

    match /portfolio/project-images/{path=**} {
      allow read: if true;
      allow create, update: if isAdmin() && isImageUnder5Mb();
      allow delete: if isAdmin();
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

Uploaded images are only rendered through `<img>` (never inlined), so SVG scripts do not run on the site.

**Remove** in the uploader clears the field. The file itself is deleted from Storage only when it was uploaded in the same session and never saved; otherwise it stays in the bucket (delete it in the Firebase Console if needed).

## 7. Publishing and caching

- The homepage uses ISR with `revalidate = 300`: published changes (profile, projects, experience, archive, delete) appear on the public site within about **5 minutes**.
- Drafts never appear publicly.
- The Preview button opens the public page (`/projects/{id}`, or the homepage experience section), which shows published content only.

## 8. Deployment

Add the same environment variables to Vercel (or your host), deploy the Firestore and Storage rules above, then redeploy. Environment variable names are unchanged from earlier versions of the console.
