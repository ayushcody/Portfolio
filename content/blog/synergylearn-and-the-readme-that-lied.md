---
title: "SynergyLearn, and the README That Lied to Me"
date: "2025-11-26"
description: "What I built in SynergyLearn (an AI learning platform with roadmaps, an in-browser IDE and Gemini hints) and a before-and-after rewrite of its setup guide, which turned out to be wrong in three places."
tags: ["projects", "writing", "genai"]
---

This is a post about two things I made: a learning platform, and a mistake. The platform took weeks. The mistake took one paragraph, and I didn't notice it until I tried to follow my own instructions on a clean machine.

Let's start with the part that went well.

## What SynergyLearn is

**SynergyLearn** is a personalized learning platform for people trying to break into tech. You pick a career path, get a structured roadmap, learn each topic, and practice in a code editor that runs your solution against tests, right in the browser.

![SynergyLearn landing page with the headline "Master Tech Skills With AI Guidance" and buttons to start learning or explore topics.](/blog/synergylearn/landing.jpg "The landing page.")

The core loop:

1. **Choose a path.** Full Stack, AI/ML, DevOps, Data Science, and more, each with its own roadmap.
2. **Learn a topic.** Gemini generates topic content, which is sanitized, checked, cached in Firestore, and paired with tutorial videos validated through the YouTube Data API.
3. **Practice.** A Monaco editor (the engine behind VS Code) sends your code to Judge0, which runs it in a sandbox and returns test results.
4. **Get unstuck.** Ask for a hint. Gemini nudges you toward the answer without handing it over.
5. **Keep going.** Progress, streaks, and badges are saved per user.

![A row of career path cards: Full Stack, AI/ML, DevOps, Blockchain, Mobile and Data Science.](/blog/synergylearn/career-paths.jpg "Career paths, each backed by its own roadmap.")

![Six feature cards: AI-Powered Learning, Interactive Coding, Gamified Progress, Lightning Fast, Career-Focused and Community Driven.](/blog/synergylearn/features.jpg "The feature overview on the landing page.")

## The architecture, briefly

A React and Vite single-page app talks to an Express API. Firebase Auth issues ID tokens; the API verifies them with the Firebase Admin SDK before touching anyone's data in Firestore. Gemini handles content, assessments, and hints. Judge0 handles code execution.

The design rule I cared most about: **every external service is allowed to fail.** Gemini can time out. Judge0 has rate limits. YouTube has quotas. None of those should end a student's study session.

So every AI call has a non-AI fallback. Here's the hint service, in full:

```js
async function getHint({ userCode, failingTest, stepTitle, hintLevel = 1 }) {
  const hint = await requestGeminiHint({ userCode, failingTest, stepTitle, hintLevel });
  if (hint) {
    return { hint, source: 'gemini' };
  }
  const fallbackHint = FALLBACK_HINTS[hintLevel % FALLBACK_HINTS.length];
  return { hint: fallbackHint, source: 'fallback' };
}
```

If Gemini isn't configured, or it fails, the student still gets a useful hint ("Review your loop boundaries; common issues are off-by-one errors"). The response also says which source it came from, so the UI never pretends a canned hint was personalized.

The same idea runs through the rest: popular topics are pre-cached on startup, generated content is cached with a time-to-live, and when the YouTube quota runs out the app rotates curated fallback videos.

![SynergyLearn sign-up screen with email and password fields.](/blog/synergylearn/signup.jpg "Sign-up. Everything past this point is per-user and protected by Firebase Auth.")

## Now, the mistake

A few weeks after the first version, I cloned the repository onto a fresh machine and followed my own README. I got stuck three times in ten minutes.

The README wasn't badly written. It was confidently, fluently *wrong*, which is worse.

### Before

This is the original setup section, lightly trimmed:

````md
### 1. Install Dependencies

```powershell
# Server dependencies
cd .\roadmap-mvp\server
npm install
```

### 4. Seed the Roadmap Data

After the server is running, seed the Full Stack Developer roadmap:

```powershell
Invoke-RestMethod -Uri http://localhost:4000/api/seed -Method Post
```

### 5. Verify Setup

Expected response: `{ "ok": true }`
````

Here's what was wrong with it:

| Problem | Why it matters |
| --- | --- |
| `roadmap-mvp\server` doesn't exist. The repository has `server/` at the root. | Step 1 fails immediately. A reader's first experience is an error. |
| The seed endpoint requires a signed-in user's token, but the command sends none. | Step 4 returns `401 Unauthorized`, and nothing tells you why. |
| The health check returns `{ "status": "ok", ... }`, not `{ "ok": true }`. | A working setup looks broken, so the reader starts "fixing" things that aren't wrong. |
| Every command is PowerShell-only. | macOS and Linux readers have to translate as they go. |
| No step says what success looks like. | The reader can't tell which step failed, only that something did. |

Each problem is small. Together, they turn a ten-minute setup into an hour of guessing.

### After

The rewrite follows a few rules: one action per step, a visible result after every step, commands that work on any OS, and the reason behind anything surprising.

````md
## Run SynergyLearn locally

You need Node.js 18 or later, a Firebase project with Firestore enabled,
and a Firebase service account key (a JSON file).

1. Install the API dependencies.

   ```bash
   cd server
   npm install
   ```

2. Create `server/.env` from the example and add your keys.

   ```bash
   cp .env.example .env
   ```

   Only `FIREBASE_SERVICE_ACCOUNT_JSON` is required. Without
   `GEMINI_API_KEY`, hints fall back to built-in tips.

3. Start the API.

   ```bash
   npm run dev
   ```

   You should see: `Server running on http://localhost:4000`

4. Check that the API is healthy. In a second terminal:

   ```bash
   curl http://localhost:4000/api/health
   ```

   You should see `"status": "ok"`. If `"firebase"` is `false`,
   your service account JSON wasn't loaded; recheck step 2.

5. Install and start the web app.

   ```bash
   cd ../web
   npm install
   cp .env.example .env
   npm run dev
   ```

   Open the URL it prints (usually http://localhost:5173).

6. Create an account on the sign-up page.

   The roadmap seed endpoint requires a signed-in user,
   so seeding happens from the app after you sign in, not from the terminal.
````

The new version is barely longer. It's just honest about what happens at each step.

## What I took away

I wrote that README with AI help, and every sentence in it sounded right. The model was fluent; the instructions were stale. The folder had been renamed, an endpoint had gained authentication, and the health check had grown a richer response. Nobody re-ran the steps.

So now I have a rule: **documentation that hasn't been executed is a hypothesis.** Every procedure I write gets followed, start to finish, on a machine that isn't mine before anyone else sees it.

The code for SynergyLearn lives in my [Learning repository](https://github.com/ayushcody/Learning).
