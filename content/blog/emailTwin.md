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

## How it works

The system has two halves: a Chrome extension that talks to Gmail, and a small Node.js server that talks to Gemini.

1. **Authorize.** The extension uses OAuth with one scope: `gmail.readonly`. It can read mail. It cannot send, delete, or modify anything.
2. **Collect.** A slider picks how many recent sent emails to learn from (5 to 50). The extension fetches them through the Gmail API with a live progress indicator.
3. **Extract.** Emails are MIME trees, not strings. A recursive walk finds the `text/plain` part, falling back to stripped HTML when there isn't one.
4. **Build the persona.** The server sends the corpus to Gemini with a prompt that asks for *style only*: formality, sentence length, voice, typical openings, closings, and transitions. The result is a JSON persona, stored locally in the extension.
5. **Draft.** When you click **Draft Reply**, the persona, subject, recipients, and latest thread snippet go to a second prompt that returns four drafts as strict JSON.

## The decisions I'd defend in a review

**Read-only on purpose.** The tool drafts; you send. An assistant that can't send email on your behalf can't send the wrong email on your behalf either. The narrow scope also makes the consent screen honest.

**Style, not memory.** The persona prompt explicitly says to generalize patterns and never output names, email addresses, phone numbers, or signatures. The goal is "writes like you," not "remembers your contacts."

```text
Read the sanitized corpus and infer ONLY tone/style features.
Do NOT memorize names, emails, phone numbers, companies, or signatures.
Generalize patterns; never output real names/PII.
```

**Structured output, both times.** Both prompts return JSON with a fixed shape. That makes the output testable, lets the UI render four clean cards, and means a malformed response fails loudly instead of leaking half a sentence into your reply box.

**A "why" for every draft.** Each draft includes a one-line explanation of what it changed and why. It's a small thing, but it turns "trust me" into "here's my reasoning."

## What it doesn't do (yet)

I'd rather list the limits than have someone discover them:

- The persona is a sketch of your style, not a clone. Ten emails give a rough outline; fifty give a better one.
- It learns from the most recent sent mail, not from a curated sample, so a week of terse replies skews the persona terse.
- The prototype sends text to a backend for analysis. The next step is clearer boundaries about what is processed locally and what leaves the machine.

## What I learned

The biggest lesson wasn't about Gmail or Gemini. It was that **personalization is mostly a data question, not a prompt question.** I spent days tuning prompts before realizing that the single best improvement was feeding the model better evidence: your actual writing, cleaned up, with private details kept out.

The code is on [GitHub](https://github.com/ayushcody/emailDigitalTwin), including both prompts.
