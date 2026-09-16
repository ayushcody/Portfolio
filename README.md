# Ayush Chougula — Portfolio

A playful neo-brutalist portfolio for an AI systems and full-stack engineer. The homepage introduces Ayush, selected work, working style, experience, achievements, skills, writing, and contact.

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 plus plain CSS design tokens
- **Animations:** CSS (including scroll-driven reveals), with reduced-motion support
- **Icons:** Lucide React
- **Markdown:** gray-matter, React Markdown & Remark GFM

## Core Features
- **Clear visual structure:** Warm paper, bold typography, crisp borders, and restrained colorful accents.
- **Project index:** All projects organized by focus, with dedicated case-study routes.
- **Achievement gallery:** Four horizontal cards with native swipe, keyboard navigation, buttons, and optional photos. See [photo instructions](public/achievements/README.md).
- **Original identity:** Portrait and signature footer preserved; floating navbar keeps its original structure.
- **Light/dark themes:** Saved preference, visible focus states, responsive navigation, and no blocking boot sequence.
- **Content:** Local data in `src/data`, Markdown in `content/blog`, and the existing Firebase CMS/fallback support.

## Running Locally

1. Install dependencies:
```bash
npm ci
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

The development command works on Windows, macOS, and Linux. Next.js fetches Google Fonts during builds, so the initial build needs network access.

## Validation

```bash
npm run lint
npm run build
```

## Content, CMS and environment

Content has local defaults in `src/data` (profile, projects, experience, skills, achievements) and `content/blog` (Markdown). The private `/admin` console (Firebase Auth + Firestore) can publish overrides; public pages re-read them every five minutes (ISR) and fall back to the local data when Firebase is not configured.

Environment variables go in `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Public site origin used for canonical URLs, Open Graph, the sitemap and robots.txt. Defaults to `https://ayushchougula.in`. |
| `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_ADMIN_*` | Only for the CMS | Firebase web config and the admin allowlist. See [docs/firebase-admin-setup.md](docs/firebase-admin-setup.md). |

## SEO & social previews

| What | Where |
| --- | --- |
| Site name, default title, description, production URL | `lib/seo.ts` (`SITE_NAME`, `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL`) |
| Root metadata (title template, Open Graph/Twitter defaults, robots, JSON-LD `Person`) | `app/layout.tsx` |
| Per-page title, description and canonical URL | each route's `metadata` / `generateMetadata`, built with `pageMetadata()` from `lib/seo.ts`. The homepage canonical is set in `app/page.tsx`. |
| Social image (1200×630) | `app/opengraph-image.tsx`, generated at build time and served at `/opengraph-image`. X/Twitter reuses it as `twitter:image`. |
| Favicon and Apple touch icon | `app/icon.png`, `app/apple-icon.png` (the AC monogram from `public/ac.png`) |
| Sitemap and robots | `app/sitemap.ts` (static pages, every project, every blog post; `/admin` and `/launch` excluded), `app/robots.ts` (disallows `/admin`) |

To change the preview **title or description**, edit `lib/seo.ts`. To change the **image**, edit the JSX in `app/opengraph-image.tsx` (it uses the colors from `app/tokens.css` and loads Space Grotesk from Google Fonts at build time, falling back to the default font when offline). A page can use its own image by adding an `opengraph-image.tsx` in its route folder.

**Before production:** if the site is served from a domain other than `https://ayushchougula.in`, set `NEXT_PUBLIC_SITE_URL` (for example `https://example.com`, no trailing slash) in the hosting environment and rebuild. Every canonical, `og:url`, `og:image`, sitemap and robots URL follows it.

**Testing:**

1. Check the tags: `curl -s https://ayushchougula.in/ | grep -E 'og:|twitter:|canonical'` or view the page source. Expect one each of `og:title`, `og:description`, `og:image` (absolute URL), `og:url`, `twitter:card` and `twitter:image`, plus one canonical link. Under `npm run dev` the homepage image URL points at `localhost`; production builds use `SITE_URL`.
2. Open `/opengraph-image` directly to see the image.
3. Preview the deployed URL with [opengraph.xyz](https://www.opengraph.xyz/), [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (use "Scrape Again" after a change). X/Twitter no longer has a card validator: paste the link into a draft post to see the card.
4. Discord, Slack and WhatsApp cache previews for a long time (often days). To see a change, share the URL with a throwaway query string such as `?v=2`.

## Design system

Design decisions are in [DESIGN.md](DESIGN.md) and product constraints in [PRODUCT.md](PRODUCT.md). Colors, type, spacing and motion tokens live in `app/tokens.css`; shared building blocks (cards, tags, buttons, logo marks, media frames) are in `app/primitives.css`. The homepage (`app/portfolio.css`) is the visual reference for every other page.
