---
name: add-project
description: Add a project to Ayush's portfolio from a GitHub repo or local folder - verified copy in the project schema, real screenshots to the cover/gallery spec, and the build, link and accessibility checks. Use when asked to "add my new repo X to the portfolio", "put project X on the site", or to update an existing project's data or screenshots.
---

# Add a project to the portfolio

The goal of every project entry: a recruiter for AI engineering roles should understand in a few seconds **what the thing does, that it is real, and how to see it** (screenshots, demo, video, code). Everything below serves that.

## Ground rules (non-negotiable)

- **Never invent a metric, link or claim.** A metric needs a `source` someone could check (README line, benchmark output, test, published blog post). No number? Describe concretely what the system does instead.
- `links.repo` only for **public** repos. `links.demo` only if it returns 200 **and** loads the product. `links.video` only for published videos.
- Real screenshots only. Never mock up a UI. Never show personal data, emails, phone numbers, tokens or keys; use dummy or seed data.
- Never type API keys or passwords into an app's UI.
- Work on a branch. Don't push, merge or deploy without Ayush's say-so. Don't touch `content/blog/**`, `public/resume.pdf` or certificates.
- No new npm dependencies without asking.

## Where things live

| What | Where |
| --- | --- |
| Schema (the contract; read it first) | `src/data/projectSchema.ts` |
| Project content (single source of truth) | `src/data/projects.ts` |
| Screenshots + alt text + captions | `public/projects/<slug>/` with `media.json` |
| Generated media module (don't edit by hand) | `src/data/projectMedia.ts` ← `npm run media` |
| Accessors used by pages | `lib/projects.ts` (`getProjects`, `getProject`, `getFeaturedProjects`, `getProjectsWithCapability`) |
| Link rendering and order | `lib/projectLinks.ts` (demo → npm → video → code → write-up) |
| Terminal screenshot renderer (CLIs) | `.claude/skills/add-project/render_terminal.mjs` |

Pages, sitemap and the skills page pick a new project up automatically. You never need to edit components to add a project.

## Step 1: Gather facts from the source

1. Find the repo: `gh repo view ayushcody/<name> --json name,visibility,url,homepageUrl,createdAt,description,isFork,parent`. Find the local folder (usually `/Users/ayushchougula/Desktop/Ayush/Projects/<name>`); `git -C <dir> remote get-url origin` confirms the match. A private fork of someone else's repo (client work) gets no repo link. `contextree --ai --depth 2` in the folder is a quick map of an unfamiliar repo.
2. Read the README **and the code**: entry points, routers, workers, model calls, the data store. Note real component names; they become the architecture flow.
3. Check the homepage or demo URL: `curl -s -o /dev/null -L -w '%{http_code}' <url>`, then load it in a browser to see that it is the product. Repo homepage URLs go stale (several Vercel ones return 404); test them, don't trust them. npmjs.com answers 403 to curl, so check a package with `npm view <name> maintainers repository.url` (it must be Ayush's) and open the page in a browser.
4. Look for numbers with a source: benchmark scripts/outputs, eval results, test counts, verified-behaviour notes in the README, and blog posts in `content/blog/` about the project (link one as `links.writeup: "/blog/<slug>"`).
5. Year: `git log --reverse --format=%cs | head -1`. Team or solo: `git log --format=%an | sort | uniq -c`, README credits, and any "Developed by" credit on a live site. Ask Ayush if unclear.
6. Put a time limit on anything you run against a project (`perl -e 'alarm 20; exec @ARGV' <command>`); some commands walk huge folders or never exit.

## Step 2: Write the entry in `src/data/projects.ts`

Fill every required field of `Project`. Copy structure:

- `outcome` (≤110 chars, shown on cards): what it does or achieved. **Not** the role. Example: "Answers a clinic's phone in Hindi, Marathi or English, books the slot, and confirms on WhatsApp."
- `summary`: what it is and who it is for, 2–3 sentences.
- `problem`: the real problem, one or two sentences.
- `approach`: what is technically interesting about how it works.
- `architecture.overview`, `architecture.flow` (3–6 stages a request passes through, each named after a real component; the UI draws it, and it is the only visual for projects with no interface), `architecture.highlights` (3).
- `results`: concrete outcomes; numbers go in `metrics` (`{ value, label, source }`).
- `tradeoffs` / `learnings` / `nextSteps`: optional; only specific, true points.
- `role`: honest. "Solo build: …" or "Team of N; I built …".
- `stack`: most important first (cards show four). `category` and `capabilities`: from the schema's lists, only what the project demonstrates.
- `status`: `Live` (a demo that works, or a published package in `links.package`), `Pilot` (real users beyond Ayush), `Working build` (runs end to end from source), `Archived`.
- `origin`: only with evidence: `Freelance` (client work), `Hackathon`, `Take-home`, `Challenge entry`. Shown beside the status.
- `links.package`: a published package Ayush owns (npm, PyPI). Shown as "npm" and as the primary button when there is no demo.
- `recognition`: only with evidence (e.g. `src/data/achievements.ts`).
- `order`: position on /projects. `featured`: 1–4 only if it should replace a homepage slot (ask Ayush; the set leads with voice AI).

Voice: plain and concrete, sentences under 38 words, no hype. Never "simply / easily / obviously / utilize / in order to". Correct names: GitHub, Next.js, Node.js, TypeScript, PostgreSQL (see `content/style/terminology.json`). Prefer commas and colons to em dashes.

## Step 3: Capture screenshots

Spec (identical for every project, enforced by `scripts/build_project_media.mjs`):

- **Cover:** `cover.webp`, exactly **1600×1000** (16:10), WebP q≈80, aim ≤150 KB (cap 200 KB). Capture at a **1440×900 viewport, deviceScaleFactor 2**, then resize: `cwebp -q 80 -resize 1600 1000 in.png -o cover.webp`. Show the product doing its job (results on screen), with no browser chrome, cookie banners or dev overlays.
- **Gallery:** 2–4 images, `01-<what>.webp`, 1600 px wide, prefer 16:10, height ≤ ~1200, ≤200 KB each, covering different steps.
- **Sources, in order of preference:** live URL → run it locally (ports 5100–5199; stop servers after) → for CLIs, a real terminal session (real commands, real output, rendered faithfully; say "terminal output" in alt text) → for backends, a real interface (FastAPI `/docs`, eval output, a frame from a real demo video with `ffmpeg`). Nothing visual? No cover; set `noVisualReason` and the page draws the architecture flow.
- **CLIs:** record the real session with colour (`script -q /dev/null sh -c '<cmd>'`, then strip macOS's `^D` artifact as `render_terminal.mjs` explains) and render it with `node .claude/skills/add-project/render_terminal.mjs`. Choose commands whose complete output fits one window; don't cut output off. Run them on public repos so no private paths or names show.
- **Live sites:** some keep a connection open and never reach "network idle"; use `waitUntil: 'load'` plus a 3–4 s wait. Screenshot a section with `locator.screenshot()`, and drop any shot that catches a sticky header over content or a half-finished reveal animation.
- **Client sites:** public pages only (never log in to an admin). Leave out testimonials and before/after photos of the client's customers, and contact details (phone, address).
- **Recordings (high value for voice and agent projects):** a 20–40 s continuous excerpt of a real session plays on the case study and gets a "▶ <label> 0:34" link on the card. Add `"clip": { "file", "poster", "label", "duration", "caption", "transcript" }` to media.json. The caption must say how it was cut.
  - Find a segment with no personal data on screen or spoken. Get word timings with local Whisper (`HF_HUB_OFFLINE=1 /Users/ayushchougula/Desktop/Ayush/Projects/Auralis/backend/.venv-mlx/bin/python`, `mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", word_timestamps=True)`), and check every frame of the window with a contact sheet (`ffmpeg -ss A -to B -i in.mp4 -vf "fps=1/2,scale=640:-1,tile=4x5" -frames:v 1 sheet.png`). Cut where the on-screen subtitle changes.
  - Encode: `ffmpeg -ss A -to B -i in.mp4 -vf "scale=1280:720,fade=t=in:st=0:d=0.35,fade=t=out:st=<len-0.6>:d=0.6" -af "afade=t=in:st=0:d=0.3,afade=t=out:st=<len-0.7>:d=0.7" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart call.mp4` (aim for ≤ 4 MB), plus a poster frame as WebP. The player uses `preload="none"`, so the page only pays for the poster.
- **Look at every image** (open it). A blank, loading, skeleton, error or empty state is a failure.

Playwright without adding a dependency:

```js
import { createRequire } from 'node:module';
const require = createRequire('/Users/ayushchougula/Desktop/Ayush/Projects/Vasoli/node_modules/');
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
```

`public/projects/<slug>/media.json`:

```json
{
  "cover": { "file": "cover.webp", "alt": "What is on screen, specifically" },
  "gallery": [
    { "file": "01-step.webp", "alt": "What is on screen", "caption": "What it shows and why it matters, 1–2 sentences." }
  ]
}
```

Then run `npm run media`. It must exit 0 (it checks sizes, alt text, captions and missing files).

## Step 4: Check

1. `npx tsc --noEmit && npx eslint . && npx next build`. All must pass; the build prerenders `/projects/<slug>`.
2. Run the site (`npx next dev -p 3400`) and look at the homepage (if featured), `/projects` (card, cover, filter count) and `/projects/<slug>` at 1440×900 and 390×844, light and dark (`localStorage.theme = 'dark'`).
3. Every external link on the page resolves (`curl -L` each `links.*`; npm pages in a browser), every image has alt text, and the gallery dialog works with the keyboard (Tab, Enter, arrows, Esc).
4. If you changed the featured set, check that the homepage's first screen still says who Ayush is before the cards.
5. Commit in small steps with descriptive messages (content, media, then any fixes).

## Step 5: Report back

Say what you added, which links and metrics went in (with sources), what you could not verify or capture and why, and the questions only Ayush can answer (missing numbers, team size, whether a private repo can be linked).
