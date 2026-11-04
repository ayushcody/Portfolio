---
title: "My Sent Folder Knows Me Better Than Any Prompt"
date: "2025-10-12"
description: "Building Email Digital Twin: a Chrome extension that learns how you write from your sent mail and drafts four replies in your own voice, with a demo video."
tags: ["projects", "genai", "prompting"]
---

Every AI email assistant I tried had the same voice. Polite, slightly breathless, fond of "I hope this email finds you well." Nobody I know writes like that. I certainly don't. I write "Sounds good, will send by Friday" and move on with my life.

So I asked a different question: what if the assistant learned how *I* write before it wrote anything for me? The best evidence of how I write is already sitting in one place. My sent folder.

That became **Email Digital Twin**.

## Watch it first

The walkthrough shows the whole loop: build a persona from sent mail, open a thread, get four drafts, insert one into Gmail.

[Email Digital Twin: demo walkthrough](https://www.loom.com/share/31e147285d0546b7a64b4f1d5365c26d)

## How it helps

The value is not "AI writes your email." Plenty of tools do that. The value is that the draft already sounds like you, so the edit is a tweak instead of a rewrite.

In practice, that means:

- **Less editing.** Drafts mirror your usual length, formality, greetings, and sign-offs.
- **A choice, not a guess.** You get four variants (Formal, Concise, Casual, and Context-adjusted) and pick the one that fits the thread.
- **Tone that reads the room.** If a thread is tense or asks for action, the Context-adjusted draft becomes more polite or more assertive accordingly.
- **It stays inside Gmail.** The extension adds two buttons, **Build Persona** and **Draft Reply**, and inserts the chosen draft directly into the reply box.

## The architecture

![Email Digital Twin architecture. Inside a Manifest V3 Chrome extension, the content script in the Gmail tab (buttons, a 5 to 50 slider, a progress display, and draft insertion) messages the service worker, which handles OAuth through chrome.identity with the gmail.readonly scope, reads sent mail from the Gmail API, and passes each message through a MIME extractor. The token and persona JSON live in chrome.storage.local. The extension sends JSON over HTTPS to a Node.js Express server with two routes, POST /persona/build and POST /drafts/generate, each paired with a prompt file (persona_builder.txt for style only, draft_generator.txt for four drafts as strict JSON). Both call Gemini 2.5 Flash.](/blog/email-twin/architecture.svg "The browser never holds an API key; the server never holds a Gmail token.")

The system is split along one line: **who holds which secret.**

- The **Chrome extension** holds the user's Gmail access token. It talks to Gmail directly, so the token never leaves the browser.
- The **Node.js server** holds the Gemini API key. It never sees a Gmail token, only the text the extension chooses to send it.

That split shaped every other decision.

### Inside the extension

Manifest V3 extensions have two kinds of code, and the project uses both:

- The **content script** (`cs.js`) runs inside the Gmail tab. It adds the **Build Persona** and **Draft Reply** buttons, shows the slider and a live progress display, and inserts the chosen draft into Gmail's reply box. It can touch the page, but it can't make privileged requests.
- The **service worker** (`sw.js`) runs in the background. It owns OAuth, calls the Gmail API, and talks to the server. The content script asks it to do things by message (`BUILD_PERSONA`, `DRAFT_REPLY`), and the service worker reports progress back.

### Signing in

OAuth runs through `chrome.identity.launchWebAuthFlow`, with a redirect address of the form `https://<extension-id>.chromiumapp.org/`, which Chrome intercepts so the token comes straight back to the extension. The requested scope is exactly one: `gmail.readonly`.

The token and the account's email address are stored in `chrome.storage.local`, and **Sign out** removes both.

### Reading sent mail

Building a persona happens in three visible phases, each reported to the progress display:

1. **Listing.** One Gmail API call: `messages?q=in:sent&maxResults=N`, where N comes from the slider (5 to 50).
2. **Fetching.** Each message is read with `format=full`, and the progress counter ticks up one message at a time.
3. **Analyzing.** The cleaned text goes to the server.

The fetching step hides the most interesting code. An email isn't a string; it's a tree of MIME parts. A message might be `multipart/alternative` with a plain-text and an HTML version, nested inside `multipart/mixed` with attachments. The extractor walks that tree recursively, returns the first `text/plain` part it finds, and only falls back to stripping tags from `text/html` when no plain version exists. Each message body is capped at 4,000 characters, and the server keeps at most the last 250,000 characters of the combined corpus.

### Two prompts, two routes

The server has two routes, each paired with a prompt file kept outside the code so it can be read and changed on its own.

| Route | Input | Prompt file | Output |
| --- | --- | --- | --- |
| `POST /persona/build` | sent-mail bodies | `persona_builder.txt` | a JSON persona: formality, sentence length, voice, tone, typical openings, closings, transitions, sign-off |
| `POST /drafts/generate` | persona + subject, recipients and thread snippet | `draft_generator.txt` | `{ "drafts": [4 drafts] }`, each with `id`, `label`, `body` and `why` |

Both call Gemini 2.5 Flash with its thinking budget set to zero. This is a style-matching task, not a reasoning task, and skipping the thinking step makes the response noticeably faster.

The draft route also asks for `responseMimeType: "application/json"`, so the model returns JSON instead of prose that happens to contain JSON.

### When the model misbehaves

Asking for JSON reduces malformed output; it doesn't eliminate it. So the server parses defensively:

1. Try to parse the whole response.
2. If that fails, look for a JSON object at the end of the text (models sometimes add a sentence before it) and parse that.
3. If that also fails, or the response has no drafts, return a small set of safe, generic drafts instead of an error.

The persona route has its own fallback: if the response isn't valid JSON, the raw text is kept as style notes, so the second step still has something to work with. Each saved persona is stamped with the time it was built.

The generic fallback drafts are honest about what they are: their `why` field says "Fallback." A user should always be able to tell when they're looking at a personalized draft and when they're looking at a safety net.

## The decisions I'd defend in a review

**Read-only on purpose.** The tool drafts; you send. An assistant that can't send email on your behalf can't send the wrong email on your behalf either. The narrow scope also makes the consent screen honest.

**Style, not memory.** The persona prompt explicitly says to generalize patterns and never output names, email addresses, phone numbers, or signatures. The goal is "writes like you," not "remembers your contacts."

```text
Read the sanitized corpus and infer ONLY tone/style features.
Do NOT memorize names, emails, phone numbers, companies, or signatures.
Generalize patterns; never output real names/PII.
```

**Structured output, both times.** Both prompts return JSON with a fixed shape. That makes the output testable, lets the UI render four clean cards, and means a malformed response is caught by the parser instead of leaking half a sentence into your reply box.

**A "why" for every draft.** Each draft includes a one-line explanation of what it changed and why. It's a small thing, but it turns "trust me" into "here's my reasoning."

## What it doesn't do (yet)

I'd rather list the limits than have someone discover them:

- The persona is a sketch of your style, not a clone. Ten emails give a rough outline; fifty give a better one.
- It learns from the most recent sent mail, not from a curated sample, so a week of terse replies skews the persona terse.
- The prototype sends text to a backend for analysis. The next step is clearer boundaries about what is processed locally and what leaves the machine.
- The persona is rebuilt on request, not updated as you keep writing. An incremental update would keep it current without re-reading everything.
- There's no evaluation set yet. A fair test would hide some of your real replies, generate drafts for those threads, and measure how close each draft gets to what you actually sent.

## What I learned

The biggest lesson wasn't about Gmail or Gemini. It was that **personalization is mostly a data question, not a prompt question.** I spent days tuning prompts before realizing that the single best improvement was feeding the model better evidence: your actual writing, cleaned up, with private details kept out.

The code is on [GitHub](https://github.com/ayushcody/emailDigitalTwin), including both prompts.
