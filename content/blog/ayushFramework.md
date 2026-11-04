---
title: "The AYUSH Framework: Architect Your UX, System, and Handoff"
date: "2026-06-21"
description: "How to build full-stack products with AI without losing control of the codebase: plan the product, map the system, and hand off to an AI IDE one tested slice at a time."
tags: ["agents", "ai-engineering", "frameworks"]
---

*Yes, the framework is named after me. In my defense, the acronym works, and naming it after someone else felt like plagiarism.*

Here's a pattern I watched happen to friends, classmates, and, embarrassingly, me. You open an AI IDE. You type "build me a dashboard for tracking habits." Forty minutes later you have three hundred files, two authentication systems that disagree with each other, a database schema nobody designed, and a login page that works only on Tuesdays.

The AI didn't fail. The *brief* failed. "Build me a dashboard" isn't a task; it's a wish.

**AYUSH** (Architect Your UX, System, and Handoff) is the framework I wrote to stop that from happening. It turns a rough idea into a scoped, architected, sliced, reviewed, and deployable full-stack product, and it works for solo builders who don't consider themselves backend experts.

The one-line version:

> **Plan the product. Map the system. Hand off to AI.**

## The golden rule

> The Architect AI decides what should be built.
> The AI IDE implements one bounded slice at a time.
> The human tests, approves, and commits.

No vague prompts. No unlocked scope. No feature without acceptance criteria. No deployment without hardening.

## Who does what

AYUSH separates two AI roles that most people blur into one chat window:

| Role | Owns | Avoids |
| --- | --- | --- |
| **Architect AI** (a chat model such as ChatGPT or Claude) | Product clarity, scope, architecture, prompts, reviews | Editing the repository blindly |
| **AI IDE** (Cursor, Windsurf, VS Code with an assistant) | Reading code, editing files, running commands, fixing bugs | Making product or architecture decisions alone |
| **You** | Final decisions, testing, commits, deployment | Trusting generated code without review |

The Architect thinks. The Builder edits. You decide. When one model does all three in one long conversation, nobody is checking anybody.

## The ten phases

| # | Phase | Focus | What you walk away with |
| --- | --- | --- | --- |
| 1 | Discovery | Product clarity | Product definition, target user, problem, core loop |
| 2 | Scope | MVP boundaries | Must-haves, non-goals, a PRD |
| 3 | UX | Product surface | Routes, flows, page states, forms |
| 4 | Architecture | System design | Stack, schema, auth, services, folder structure |
| 5 | Contracts | Interfaces | API and server actions, DB schema, types, validation |
| 6 | Build plan | Sequencing | Vertical slices with acceptance criteria |
| 7 | Implementation | Building | Scaffold, auth, data layer, core loop, features |
| 8 | Review | Quality | Code review, architecture drift check, fixes |
| 9 | Hardening | Production safety | Reliability, security, performance, UX polish |
| 10 | Deploy | Launch | Production environment, deploy, smoke tests |

Each phase ends with a **gate**: a short checklist you must pass before moving on. The gates are the whole point. They're what stops the forty-minute, three-hundred-file disaster.

## Phase 1: Discovery

The goal is to make the idea painfully specific before anyone writes a line of code. The Architect AI gets this prompt:

```text
I want to clarify this product before building.

Idea:
[PASTE IDEA]

Give me:
1. One-sentence product definition:
   "[Product] helps [specific user] do [specific action] so they can [specific outcome]."
2. Target user: be specific. Avoid generic categories.
3. Current painful workflow: what does the user do today without this?
4. Core user loop: what repeated action creates value?
5. MVP feature list: only 4–6 must-have features.
6. Out of scope: at least 10 things I should not build in v1.
7. Riskiest assumptions: product, technical, distribution.
8. Brutal truth: why might this fail?
```

The "out of scope" and "brutal truth" items do the most work. Asking an AI what *not* to build is one of the most underused prompts there is.

**Discovery gate:** I can explain the product in one sentence. I know the exact user, their painful workflow, and the core loop. I know the top competitors, my positioning, and my riskiest assumptions.

## Phase 2: Scope lock and PRD

Split features into must-have, nice-to-have, and explicitly deferred. Then write a PRD where **every requirement is numbered and testable**. If a requirement can't be tested, it isn't ready.

The rule that saves the most time:

> After this phase, new ideas go into a backlog. They do not enter the current MVP unless you deliberately reopen scope.

## Phase 3: UX routes and states

Define every screen before the AI IDE invents its own. For each route: path, access level (public, protected, admin), purpose, data needed, and user actions.

Then, for every important page, define its states:

```text
Page: /dashboard
Loading:            what the user sees while data loads
Empty:              what the user sees when there are no records
Success:            the normal loaded state
Error:              what the user sees when a request fails
Permission denied:  what the user sees without access
Unauthenticated:    redirect or message
```

Most AI-generated apps only build the "success" state. Real users live in the other five.

## Phases 4 and 5: Architecture and contracts

Keep the architecture boring. My default stack for solo-built SaaS and AI web apps:

| Layer | Default | Why |
| --- | --- | --- |
| Frontend | Next.js (App Router) | Full-stack, server rendering, strong ecosystem |
| Language | TypeScript | Type safety from database to UI |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent UI |
| Database and auth | Supabase | Postgres, auth, storage, and row-level security in one place |
| Validation | Zod | One schema for client and server validation |
| Hosting | Vercel | Simple deploys for Next.js |
| Analytics | Add later | Only after the core loop works |

> **Boring tools beat clever architecture.**

Then lock the contracts *before* implementation: database tables with types, defaults, foreign keys, indexes and access rules; TypeScript types; Zod schemas for every input; and a standard error model (`UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`). Contracts are what keep the frontend and backend from drifting apart three slices later.

## Phase 6: Vertical slices

This is the heart of AYUSH. A **vertical slice** builds one user-visible capability end to end: UI, server, database, validation, and feedback.

Don't build the whole frontend first. Don't build the whole backend first. Build one feature all the way through, test it, commit it, and only then start the next.

The standard order:

1. Project scaffold
2. Platform setup (environment, database connection)
3. Auth (sign-up, login, logout, protected routes)
4. Database foundation (schema, access rules, data layer)
5. App shell (layout, navigation)
6. Primary CRUD
7. **Core user loop**, the first real moment of value
8. Secondary features, one at a time
9. Polish
10. Hardening
11. Deploy

Every slice is written down like this before the AI IDE sees it:

```text
Slice name:          Create a habit
Goal:                A signed-in user can create a habit and see it on the dashboard.
User value:          The core loop starts working.
Layers touched:      UI form, server action, habits table
Files likely changed: app/dashboard/*, lib/habits/*, db/migrations/*
Dependencies:        Auth and database foundation slices
Acceptance criteria: [checklist]
Manual tests:        happy path · invalid input · empty state · error state · unauthorized
Risks:               duplicate submits, missing ownership check
Commit message:      feat(habits): create habit from dashboard
```

## Phase 7: The handoff prompt

The AI IDE never gets "build the app." It gets one slice, with fences:

```text
You are working as a senior full-stack engineer inside an existing codebase.
Implement exactly one bounded vertical slice.

Rules:
- Do not modify unrelated files.
- Do not add dependencies unless required and explained first.
- Do not change the architecture unless explicitly asked.
- Do not use `any` types.
- Keep business logic out of UI components.
- Validate all user input server-side.
- Enforce auth and ownership checks server-side.

Current slice: [NAME]
Goal: [ONE SENTENCE]
Scope (build): [EXACT ITEMS]
Non-scope (do NOT build): [EXPLICIT LIST]
Files allowed to modify: [LIST]
Files not allowed to modify: [LIST]
Data contract: [TYPES OR SCHEMA]
Acceptance criteria: [CHECKLIST]

After coding: summarize files changed, explain key decisions,
tell me how to test it, and list any risks or TODOs.
```

The "files not allowed to modify" line alone has saved me hours of untangling helpful-but-unrequested refactors.

## Phase 8: Review every two or three slices

After every two or three slices, the Architect AI reviews the diff like a senior engineer: correctness, separation of concerns, access control, data integrity, type safety, UX states, performance, and maintainability. Every issue gets a priority (Critical, High, Medium, Low), and the review ends with a verdict: **Pass**, **Pass with fixes**, or **Blocked**.

Critical and High issues are fixed before the next slice. Not "later." Before.

## Phases 9 and 10: Harden, then deploy

Hardening happens when the product is functionally complete, not after launch. Every server action checks authentication, every user-owned query checks ownership, row-level security is enabled *and tested*, inputs are validated server-side, errors don't leak internals, forms prevent double submits, and network failures don't break the app shell.

Then deploy, and immediately run smoke tests in production: sign-up, login, logout, the core loop end to end, data persisting after refresh, one user unable to see another's data, mobile layout, and a clean browser console.

## The definition of done (for every single slice)

- [ ] Acceptance criteria pass
- [ ] Happy path tested
- [ ] Empty, error, and unauthorized states tested
- [ ] Server-side validation exists
- [ ] Auth and ownership are enforced
- [ ] TypeScript and lint pass
- [ ] No unrelated files modified
- [ ] Commit created, TODOs documented

## The operating rhythm

1. The Architect AI defines the slice.
2. The AI IDE implements only that slice.
3. You test the happy path *and* the failure path.
4. Fix bugs before adding scope.
5. Commit after every working slice.
6. Review every two or three slices.
7. Harden before deployment.

## When things get messy

They will. Long AI sessions drift. When the codebase starts to feel tangled:

1. Stop feature work.
2. Ask the Architect AI for an architecture health check.
3. Identify Critical and High issues.
4. Fix only those.
5. Commit the cleanup.
6. Resume the next slice.

And if you recognize yourself in any of these, the framework is for you:

- Writing prompts like "build the dashboard."
- Letting the AI IDE decide product scope.
- Accepting generated code without reading it.
- Adding authentication after the core features.
- Checking ownership only in the UI.
- Testing only the happy path.
- Deploying without running a local production build.

## Why I wrote it down

AI made writing code dramatically faster. It did not make *deciding what to write* any faster, and that's where most projects actually fail. AYUSH moves the thinking to the front, splits the work so each AI does the part it's good at, and keeps a human at every gate.

The best part is that none of it is specific to one model or one IDE. Tools will change every few months. Clear scope, explicit contracts, small slices, and honest testing won't.
