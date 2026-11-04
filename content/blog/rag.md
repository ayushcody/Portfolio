---
title: "RAG Has Died Twice Since 2025. It's Doing Fine."
date: "2026-08-12"
description: "Long context was supposed to kill retrieval. Then agentic search was. Why RAG keeps coming back, what IBM's 'Is RAG Still Needed?' gets right, and how to write docs retrieval can find."
tags: ["rag", "genai", "writing"]
---

Retrieval-augmented generation has the most dramatic career in AI. It's been declared dead at least twice since I started building with it, and both times it got up, dusted itself off, and went back to answering questions about your company's leave policy.

Here's the obituary, the resurrection, and the part almost nobody talks about: why the quality of a RAG system depends on the people who write the documents.

## Death #1: "Just put it all in the context window"

Through 2024 and into 2025, context windows grew from thousands of tokens to hundreds of thousands, and then to a million and beyond. The argument wrote itself. Why build a pipeline of chunking, embeddings, a vector database, and a reranker when you can paste the whole manual into the prompt?

For some problems, that argument is correct. If your knowledge is one document, fits comfortably in the window, and rarely changes, long context is the simplest thing that works. Fewer moving parts, fewer things to break.

But the people declaring RAG dead were mostly testing small, static, public documents. Real knowledge bases are none of those things.

## Why it didn't stay dead

Long context solved "can the model see it?" It didn't solve anything else a production system needs:

- **Scale.** A company's documentation isn't one manual. It's thousands of pages across products and versions. No context window holds all of it, and even if one did, you'd pay to send all of it with every question.
- **Freshness.** Documentation changes daily. Retrieval reads today's version; a cached prompt reads whatever you pasted last month.
- **Permissions.** Not everyone may read every document. Retrieval can filter by who's asking. A giant prompt can't un-show what it already contains.
- **Attention.** Models are measurably worse at using information buried in the middle of very long inputs. More context isn't the same as more understanding.
- **Citations.** Retrieval knows exactly which passages it used, so the answer can point to its sources. "Somewhere in these 900 pages" isn't a citation.

IBM Technology put the debate into one explainer titled, plainly, **"Is RAG Still Needed?"** The answer it lands on is the grown-up one: it depends on your data. Small, bounded, stable knowledge suits long context. Large, changing, permission-sensitive knowledge still needs retrieval. Most real systems end up using both: retrieve the right handful of passages, then give the model a generous window to reason over them.

```meme
format: nah-yeah
nah: Paste all 900 pages of the product docs into every prompt.
yeah: Retrieve the three paragraphs that answer the question, and cite them.
```

## Death #2: "Agents don't need vector search"

The second obituary came from coding agents. Several popular coding tools found that, for codebases, an agent running plain text search (grep, file listings, opening files) often beat a vector index. Code has exact names; searching for `validateUser` finds `validateUser`.

That was a real finding, and an important one. It just wasn't the death of RAG. It was RAG growing up:

- The "R" doesn't have to mean "vector database." Keyword search, structured queries, and an agent deciding *what to look up next* are all retrieval.
- Naive RAG (one fixed retrieval step, fixed-size chunks, no reranking) did die, and deserved to.
- What replaced it is **agentic retrieval**: the model searches, reads, decides it needs more, and searches again, often mixing keyword and semantic search.

So the honest headline is not "RAG is dead." It's "retrieve-once-and-hope is dead." Retrieval itself is more central than ever, because every agent spends most of its time looking things up.

## The part nobody puts in the architecture diagram

After building RAG systems for legal research and multi-source study assistants, here's my least glamorous conclusion: **most bad RAG answers are documentation problems.**

Retrieval can only find what was written, and it finds clearly structured writing far more reliably than walls of text. The model can only be as accurate as the passage it was handed.

If you write documentation that a RAG system or a docs chatbot will read (and increasingly, that's all documentation), these habits matter more than any embedding model:

### 1. One topic per section, with a heading that says what it is

Chunkers usually split on headings. "Overview," "Notes," and "More information" describe every page and therefore match nothing. "Rotate an API key" matches exactly the question someone will ask.

### 2. Make every section stand on its own

A chunk is read without the page around it. "As mentioned above" and "repeat the previous step" point at text the model will never see. Name the thing again. Repeat the prerequisite.

### 3. Use one name for one thing

If the same feature is called "workspace" on one page, "project" on another, and "tenant" in the API docs, retrieval treats them as three different topics. A terminology list is retrieval infrastructure.

### 4. Put the answer before the backstory

Lead with the action or the fact, then explain. A chunk that spends four sentences on history before the actual procedure may get cut off right where the useful part starts.

### 5. Label versions and dates

When two versions of a page exist, retrieval may return both and the model will blend them. Clear version metadata ("Applies to version 7.1 and later") lets the system, and the reader, pick correctly.

### 6. Keep tables and code blocks intact and labeled

A table without its header row is a list of mysterious numbers. Introduce every table and code block with a sentence saying what it shows.

## How to tell whether it's working

You can't improve what you don't measure. A lightweight evaluation loop:

1. **Write 20–50 real questions** users actually ask, with the correct answer and the page it comes from.
2. **Check retrieval separately from generation.** For each question, was the right passage in the top results? If not, the problem is the content or the chunking, not the model.
3. **Check faithfulness.** Does every claim in the answer appear in the retrieved passages? Anything that doesn't is hallucinated, however plausible.
4. **Log the misses as content gaps.** Questions with no good passage to retrieve are a to-do list for the documentation team. That might be the most valuable output of the whole system.

## So, is RAG dead?

It's been dead twice, and both times it came back stronger, because the problem it solves never went away: models don't know your information, and your information is large, private, and changing.

What actually changed is where the effort goes. Less on fancy vector math, more on retrieval that adapts, evaluation that's honest, and documentation written so both humans and machines can find the answer on the first try.

RAG isn't dead. Lazy RAG is. Long live well-written docs.
