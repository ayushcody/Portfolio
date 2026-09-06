# Ayush Chougula — Portfolio

A playful neo-brutalist portfolio for an AI systems and full-stack engineer. The homepage introduces Ayush, selected work, working style, experience, achievements, skills, writing, and contact.

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** CSS and Framer Motion, with reduced-motion support
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

## Local redesign scope

Keep changes local until the owner explicitly requests a PR. Any requested PR must use `godostroyer`. Product constraints are in [PRODUCT.md](PRODUCT.md), and the design decisions are in [DESIGN.md](DESIGN.md).
