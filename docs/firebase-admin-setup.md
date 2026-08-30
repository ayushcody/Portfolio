# Firebase Admin Setup

This site has a private `/admin` console for editing profile copy, project cards, and blog posts.

The console uses Firebase client auth for sign-in and Firestore Security Rules for the real authorization boundary. Do not rely on the UI alone.

## 1. Create Firebase project

1. Go to Firebase Console.
2. Create a project.
3. Add a Web app.
4. Copy the web config values.

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

Restart the dev server after adding these values.

## 2. Enable auth

1. Firebase Console -> Authentication -> Sign-in method.
2. Enable Email/Password.
3. Create your admin user.
4. Copy that user's UID from Authentication -> Users.
5. Paste it into `NEXT_PUBLIC_ADMIN_UID`.

## 3. Admin authorization

Firebase web app config values are public by design. The `NEXT_PUBLIC_ADMIN_*` allowlist is a client-side UX gate so the admin dashboard stays hidden from non-admin accounts, but it is not the security boundary. Firestore Security Rules must enforce real read/write protection.

Supported allowlist variables:

```txt
NEXT_PUBLIC_ADMIN_UID
NEXT_PUBLIC_ADMIN_UIDS
NEXT_PUBLIC_ADMIN_EMAIL
NEXT_PUBLIC_ADMIN_EMAILS
```

`NEXT_PUBLIC_ADMIN_UID` and `NEXT_PUBLIC_ADMIN_EMAIL` accept one value. `NEXT_PUBLIC_ADMIN_UIDS` and `NEXT_PUBLIC_ADMIN_EMAILS` accept comma-separated values. UID matching is exact. Email matching is case-insensitive. UID allowlisting is preferred because Firebase Auth UIDs are stable even if an email address changes.

Example placeholders:

```txt
NEXT_PUBLIC_ADMIN_UID=your_firebase_auth_uid_here
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
```

If all admin allowlist variables are missing or empty, the dashboard intentionally locks everyone out. Do not commit `.env.local`.

## 4. Firestore rules

Firestore reads should only expose public/published content. Admin writes must require an authenticated admin user. Client-side checks are not security.

The current admin console still writes these legacy collections:

- `projects/{projectId}`
- `blogPosts/{slug}`
- `siteSettings/profile`

The example below matches the current admin console. Replace `YOUR_ADMIN_UID` before publishing rules. Treat this as a starting checklist, not a complete production review.


```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.uid == "YOUR_ADMIN_UID";
    }

    match /projects/{projectId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /blogPosts/{slug} {
      allow read: if resource.data.published == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }

    match /siteSettings/{document} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

## 5. Storage rules for photos

If you want to upload profile/project images to Firebase Storage, use a narrow folder and admin-only writes.

```js
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null && request.auth.uid == "YOUR_ADMIN_UID";
    }

    match /portfolio/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin()
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

For now, the admin console stores photo URLs. Upload the image to Storage, copy the download URL, then paste it into the Profile tab.

## 6. Data model

Collections used by the admin console:

- `projects/{projectId}`
- `blogPosts/{slug}`
- `siteSettings/profile`

Blog posts support Markdown content and a `published` boolean. Drafts are visible in admin but not publicly readable by non-admin users.

## 7. CMS service paths

The shared CMS service layer is prepared for draft/published content, but the current admin UI has not been migrated to these helpers yet.

Singleton documents use valid Firestore document paths:

- `cms/profile/states/draft`
- `cms/profile/states/published`
- `cms/siteSettings/states/draft`
- `cms/siteSettings/states/published`

Editable item collections use:

- `cms/projects/items/{id}`
- `cms/experience/items/{id}`
- `cms/skills/items/{id}`
- `cms/achievements/items/{id}`
- `cms/interests/items/{id}`
- `cms/blogPosts/items/{id}`

Publish actions can write version snapshots to:

- `cms/versions/items/{timestamp-contentType-id}`

Public CMS read helpers read only published CMS content. If Firebase is not configured, Firestore is unavailable, or published content is missing, they return static fallback content from `src/data/*`. This keeps local development and static builds from depending on Firestore.

The Admin Profile/Hero editor now uses a draft/publish flow:

- Save Draft writes profile content to `cms/profile/states/draft`.
- Publish writes profile content to `cms/profile/states/published`.
- The public homepage Hero reads the published profile through the CMS public read helper and falls back to `src/data/profile.ts` when needed.

Firestore rules must enforce:

- Public reads only for published content.
- Writes only for authenticated admin users.
- No reliance on client-side allowlist checks as security.

## 8. Deployment notes

Add the same environment variables to Vercel or your deployment provider.

Do not commit `.env.local`.
