---
title: "An Agent Is a Loop With a Budget: Seven Lessons From Building Agentic Systems"
date: "2026-01-21"
description: "What a year of building research assistants, alert-triage pipelines and coding workflows taught me about agents: when to use them, when not to, and the guardrails that matter more than the model."
tags: ["agents", "genai", "ai-engineering"]
---

In 2025, "agent" became the word you added to a pitch to make it sound expensive. By the end of the year I had built enough of them, for research, for security alert triage, and inside my GenAI internship, to have opinions. Most of those opinions are about what agents should *not* do.

Here's the definition I use: **an agent is a language model in a loop, choosing its next action based on what the last action returned.** That's it. Everything else is guardrails.

And the guardrails are the job, because left alone, an agent will cheerfully do this:

```meme
format: dialogue
Me: Find the cheapest flight to Bengaluru next Friday.
Agent: On it. First, some background reading on the history of aviation.
Agent: I have opened 37 tabs.
Me:
Agent: Would you like to hear about loyalty programs?
```

Seven lessons, roughly in the order I learned them the hard way.

## 1. Most "agent" problems are workflow problems

If you already know the steps, you don't need an agent. You need a pipeline.

"Summarize this ticket, classify its severity, then draft a reply" has a fixed shape. Writing it as three prompt calls in sequence gives you something cheaper, faster, and debuggable: when it breaks, you know which step broke.

Anthropic's guide *Building Effective Agents* names the useful middle ground well. Before reaching for a fully autonomous loop, try these:

| Pattern | Shape | Good for |
| --- | --- | --- |
| **Prompt chaining** | Step A's output feeds step B | Draft → check → polish |
| **Routing** | Classify first, then send to a specialized prompt | Support tickets, query types |
| **Parallelization** | Several calls at once, results combined | Reviewing a document for different issues |
| **Orchestrator–workers** | One model splits the task; others do the pieces | Research across many sources |
| **Evaluator–optimizer** | One model writes; another critiques; repeat | Translation, writing with strict criteria |

A true agent, one that decides its own path, is for problems where the path genuinely depends on what it discovers: debugging, open-ended research, investigating an incident.

## 2. The stopping condition is a feature

Every agent I've built needed a better answer to "when do you stop?" than "when you're done." A model that isn't sure it's done will keep going, politely and expensively.

Now every loop gets three exits:

- **Success**: the goal is met, checked by something concrete (tests pass, a schema validates, a citation exists).
- **Budget**: a maximum number of steps, tokens, or minutes.
- **Escalation**: "I'm stuck; here's what I tried," handed to a human.

The third one is the most underrated. An agent that says "I couldn't find it" is useful. An agent that invents something so it can finish is a liability.

## 3. Tools are an API for a very literal colleague

The model chooses tools from their names, descriptions, and parameter schemas, and nothing else. A vague description gets a vague choice.

Compare:

```text
search(q)                → "Search."
search_runbooks(query)   → "Search internal runbooks by keyword. Returns the
                            five most relevant sections with their page URLs.
                            Use for operational procedures, not for code."
```

The second version tells the model what it searches, what comes back, and when *not* to use it. My rule now: if a new teammate couldn't use the tool from its description alone, neither can the model.

Fewer tools also help. An agent with forty tools spends its attention choosing. One with six well-described tools gets on with the job.

## 4. Context is a budget too

Every tool result goes back into the context window. Ten steps in, the model is reading a pile of raw search results, stack traces, and file listings, and the original instructions are a distant memory.

What helped:

- **Return less from tools.** Five relevant lines beat a full log file.
- **Summarize between phases.** After research and before writing, compress findings into a short brief and start the writing step from that.
- **Restate the goal.** Keep the task and constraints near the end of the context, where the model is paying attention.

People started calling this *context engineering* in 2025, and the name stuck because it's accurate: deciding what the model sees at each step matters more than how cleverly you phrase the prompt.

## 5. Grounding beats confidence

On Research Saathi, a multi-agent research assistant I designed, retrieval agents gather evidence from documents first, and only fall back to web search when local retrieval comes back weak. A separate reasoning step writes the answer, and it may only use what was retrieved.

That split is the whole point. A single agent that searches and writes in one breath tends to fill gaps with plausible filler. Separating "find" from "say," and making "say" cite "find," removed most of that.

## 6. Side effects need a human, every time

Reading is cheap to undo. Sending, deleting, merging, deploying, and paying are not.

On an alert-triage prototype built at a hackathon (Agentic SOC), the agent could classify severity, reason about likely causes, and *propose* remediation. It could not execute remediation. An analyst approved each action.

That wasn't a limitation we planned to remove later. It was the design. In security, finance, and anything customer-facing, the agent's job is to make the human faster, not absent.

## 7. Evaluate the trajectory, not just the answer

An agent can reach the right answer by a terrible route: forty steps, three irrelevant tools, one lucky guess. If you only grade final answers, you'll ship that.

What I measure now:

- **Outcome**: was the result correct and complete?
- **Steps**: how many, and were any wasted or repeated?
- **Tool choice**: did it use the right tool at the right time?
- **Failure behavior**: when it couldn't succeed, did it say so honestly?
- **Cost and latency**: would a person wait this long for this answer?

Keep a small set of test tasks with known answers and run it after every prompt or tool change. Agents regress quietly; tests make them regress loudly.

## The checklist I start every agent with

- [ ] Could this be a fixed workflow instead?
- [ ] What concrete check proves the goal is met?
- [ ] What's the step and cost budget?
- [ ] Which tools, exactly, and is each description good enough for a new hire?
- [ ] Which actions need a human's approval?
- [ ] Where are the logs, and can I replay a run?
- [ ] What are my ten test tasks?

An agent with a budget, a short tool list, and a human at the risky steps is genuinely useful. An agent without them is a very fast way to open 37 tabs.
