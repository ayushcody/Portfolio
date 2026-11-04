---
title: "GenAI Writes Fluently. That Is the Whole Problem."
date: "2025-03-11"
description: "A field guide to the ways language models go wrong (hallucination, stale context, drift, flattery) and the habits that keep AI-assisted writing accurate."
tags: ["genai", "writing", "prompting"]
---

Last month I asked a model how to configure a library I was using. It answered instantly, with a clean code sample and a confident explanation of a flag called `--strict-sync`.

The flag does not exist. It never existed. The answer had the tone of a senior engineer and the accuracy of a horoscope.

That moment changed how I think about generative AI. The impressive part of these models is that they write *fluently*. The dangerous part is the same thing. A wrong answer in broken English gets caught. A wrong answer in polished English gets copied into a README.

## Why fluent and accurate are different things

A large language model (LLM) is trained to predict the next most likely piece of text. "Likely" and "true" overlap a lot, which is why these tools are useful. They are not the same, which is why they need supervision.

When the model does not know something, it does not go quiet. It produces the most plausible-sounding continuation. For a configuration flag, the most plausible continuation is a flag that sounds right.

So the question I ask is no longer "Can AI write this?" It almost always can. The question is "How will I know if it's wrong?"

## A field guide to how models go wrong

These are the failure modes I now check for, every time.

| Failure mode | What it looks like | How I catch it |
| --- | --- | --- |
| **Hallucination** | Invented flags, APIs, citations, or statistics, stated confidently | Run the command. Open the cited page. If I can't verify it, it doesn't ship. |
| **Stale context** | Advice that was correct two versions ago; deprecated APIs | Give the model the current docs or changelog instead of trusting its memory. Note the version I tested against. |
| **Context drift** | In a long chat, early instructions quietly stop applying | Restate the constraints, or start a fresh session with a clean summary. |
| **Sycophancy** | It agrees with a wrong premise because I phrased the question confidently | Ask neutrally: "Is X true?" beats "Why is X true?" |
| **Silent omission** | The answer is correct but skips a step, a warning, or an edge case | Compare against a checklist of what a complete answer must contain. |
| **Over-generalization** | One example becomes "always"; one platform becomes "everywhere" | Ask: "Under what conditions is this not true?" |

Hallucination gets the headlines. In practice, stale context and silent omission cause more damage, because the output *looks* right and mostly *is* right.

## The habits that actually help

### 1. Ground the model in sources, not memory

The single biggest improvement is giving the model the material instead of asking it to remember. Paste the relevant docs, the code, or the changelog, and tell it to answer only from that.

```text
Use only the reference material below. If the answer is not in it,
say "Not covered in the provided material" instead of guessing.

For every factual claim, quote the sentence it comes from.

Reference material:
<paste the docs, code, or release notes here>

Task:
<what you want written>
```

The "quote the sentence" line matters. It turns a vague answer into something I can check in thirty seconds.

### 2. Ask for its uncertainty out loud

I end most drafting prompts with: *"List anything in your answer you are not certain about."* Models are surprisingly good at flagging their weak spots when asked directly. They are terrible at volunteering them.

### 3. Test every step against the real thing

If the output is a procedure, I follow the procedure. On a clean machine if possible. Documentation that hasn't been executed is a hypothesis.

### 4. Keep a human accuracy gate

AI can draft, summarize, restructure, and tighten. It cannot be accountable. Before anything I write with AI help is published, a person (usually me, ideally someone else too) checks it against the product.

### 5. Never paste what you shouldn't

Customer data, credentials, and private code do not go into tools that aren't approved for them. "It was faster" is not a reason anyone accepts after a leak.

## Where AI genuinely makes writing better

None of this means "don't use AI for writing." I use it every day. It is excellent at:

- **First drafts from structured input.** Give it a spec and a template; get a draft to edit.
- **Restructuring.** "Turn this wall of text into a numbered procedure with one action per step."
- **Consistency passes.** "Flag every place where I call the same thing by two different names."
- **Audience shifts.** "Rewrite this for someone who has never used a terminal."
- **Finding gaps.** "What would a first-time user ask that this page doesn't answer?"

Notice the pattern: in each case, I already have the facts. The model is helping with *shape*, not *truth*.

## The rule I write by

The model drafts. I verify. My name goes on it.

Writing with AI is still writing. The tool changed. The accountability didn't.
