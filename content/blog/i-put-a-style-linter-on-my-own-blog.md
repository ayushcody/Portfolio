---
title: "I Put a Style Linter on My Own Blog. It Found Twelve Problems. Seven Were Its Fault."
date: "2026-09-17"
description: "Treating writing like code: a small Python linter that checks terminology, alt text, links, headings and sentence length on every post, and what its first run taught me about automated quality checks."
tags: ["writing", "docs-as-code", "python"]
featured: true
---

Code gets linted, type-checked, and tested before it ships. My writing got a quick reread and a hopeful click on "publish."

That asymmetry started to bother me. My blog is Markdown files in a Git repository, built by the same pipeline as the rest of the site. It's already docs-as-code. It just had no checks.

So I wrote one: a Python script that reads every post and enforces the house style. No dependencies, under 300 lines, and it runs with `npm run lint:content`.

## What it checks

| Rule | Level | What it catches |
| --- | --- | --- |
| **Front matter** | Error | Missing title, date, description or tags; dates that aren't `YYYY-MM-DD` |
| **Terminology** | Error | `Github` instead of `GitHub`, `Javascript`, `NodeJS`, `e-mail`, `API's` |
| **Image alt text** | Error | Images with no alt text; local image paths that don't exist |
| **Internal links** | Error | Links to `/blog/...` posts that don't exist |
| **Meme blocks** | Error | A meme card with a format the site can't render |
| **Featured posts** | Error | More featured posts than the blog index can show |
| **Word choice** | Warning | "simply," "obviously," "in order to," "click here" |
| **Retrieval-hostile phrases** | Warning | "as mentioned above," "see below" |
| **Headings** | Warning | Extra h1s, skipped levels, duplicate headings |
| **Sentence length** | Warning | Sentences over 38 words |
| **Description length** | Warning | Descriptions outside 60–230 characters, which get cut off in search results |

Errors fail the run. Warnings are advice, unless you pass `--strict`, which turns them into errors for CI.

## Style rules live in data, not code

The terminology list is a JSON file, not a block of `if` statements. Anyone who can edit a list can change the house style without touching Python:

```json
{
  "prefer": {
    "Github": "GitHub",
    "NodeJS": "Node.js",
    "e-mail": "email",
    "login to": "log in to"
  },
  "avoid": {
    "simply": "Tells the reader it's easy; if it isn't for them, it reads as a judgment.",
    "as mentioned above": "Retrieval reads sections on their own; name the thing again.",
    "click here": "Link text should say where the link goes."
  }
}
```

Each "avoid" entry carries its reason. A linter that says *what* is wrong without saying *why* teaches people to work around it. One that explains itself teaches the style.

## The first run

Here's what it said the first time I ran it across eleven posts:

```text
ayush-framework...md:1: warning [description-length] 242 characters; aim for 60-230
ayush-framework...md:10: warning [sentence-length] 39-word sentence: "You type "build me…"
email-digital-twin...md:67: warning [sentence-length] 41-word sentence: "It was that **pers…"
genai-basics...md:9: warning [sentence-length] 39-word sentence: "Every week someone…"
genai-basics...md:28: warning [sentence-length] 41-word sentence: "The single most use…"
genai-basics...md:107: warning [heading] duplicate heading 'Use it on Monday'
genai-basics...md:160: warning [heading] duplicate heading 'Use it on Monday'
genai-basics...md:190: warning [heading] duplicate heading 'Use it on Monday'
rag-is-dead...md:1: warning [description-length] 232 characters; aim for 60-230
rag-is-dead...md:65: warning [word-choice] 'as mentioned above': Retrieval reads...
synergylearn...md:69: warning [heading] use '##' for sections; the post title is the only h1
synergylearn...md:99: warning [heading] jumps from h1 to h3

11 posts checked: 0 errors, 12 warnings
```

Twelve warnings. I went through them one by one, expecting to fix twelve things in my writing.

## Five were real

- **Two descriptions were too long.** Both would have been truncated in search results, losing the most specific part of the sentence. Fixed by cutting the filler, not the meaning.
- **Three duplicate headings.** My GenAI guide had four sections all called "Use it on Monday." Readers can tell them apart from context. A chatbot retrieving one section on its own can't. They're now "Use it on Monday: RAG," "Use it on Monday: MCP servers," and so on.

That second fix is the one I'm happiest about. It's invisible to a casual reader and makes a real difference to anyone, or anything, landing on that section from search.

## Seven were the linter's fault

This was the more useful lesson.

- **Four "long sentences" weren't long.** My sentence splitter only split after `.`, `!` or `?` followed by a space. A sentence ending in `?"` or `.**` (a closing quote or bold marker) didn't split, so two normal sentences were counted as one long one. The fix: allow closing quotes and emphasis markers after the punctuation.
- **Two heading errors came from inside a code block.** My SynergyLearn post shows a README *as an example*, inside a four-backtick fence that contains its own three-backtick fences. The linter closed the outer block at the first inner fence and then read the example README's headings as the post's own. The fix: a fence only closes on the same character with at least the same length, which is how Markdown itself works.
- **One "as mentioned above" was a quotation.** The RAG post quotes the phrase as an example of what *not* to write. The fix: quoted text is a mention, not a use, so word-choice rules skip it.

After both rounds of fixes, the run is clean:

```text
11 posts checked: 0 errors, 0 warnings
```

## What this taught me about automated quality checks

**False positives are the real enemy.** Seven out of twelve warnings were wrong. If I'd shipped the linter like that, I'd have learned to ignore it within a week, and so would anyone else. A check people ignore is worse than no check, because it looks like coverage.

**Start with warnings, promote to errors.** New rules go in as warnings. Once a rule has run across all the content without false alarms, it can become an error. Terminology started as an error because a typo in "GitHub" has no legitimate exceptions. Sentence length will probably never be an error, because sometimes a long sentence is the right one.

**Make every message actionable.** "Line 107: duplicate heading 'Use it on Monday' (first on line 47)" tells you exactly where to look and what to change. "Style issue detected" tells you nothing.

**Automate the boring checks so reviewers focus on the hard ones.** A script can catch `Github` all day. It can't tell whether a procedure is correct, whether an explanation will make sense to a beginner, or whether a claim is true. That's still a human's job, and now the human has more time for it.

## Running it yourself

```bash
python3 scripts/lint_content.py            # all posts
python3 scripts/lint_content.py --strict   # warnings fail too (for CI)
python3 scripts/lint_content.py --external # also check that external links respond
```

The natural next step is wiring `--strict` into the build so a post that breaks the style can't be deployed. It also works as a pre-commit hook, so problems are caught before they even reach a pull request.

Writing doesn't have to be untested just because it isn't code. It just needs someone to write the tests.
