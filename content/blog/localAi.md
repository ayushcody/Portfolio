---
title: "I Started Running AI Locally the Same Month RAM Became a Luxury Good"
date: "2025-12-12"
description: "Why I run language models on my own machine, the memory math that decides what fits, and how to pick a model size, all written while memory prices were climbing faster than my GPU fans."
tags: ["local-ai", "genai", "privacy"]
---

My timing has always been impeccable. I decided to get serious about running language models locally in the same few months that memory prices went vertical.

Through late 2025, AI data centers bought up DRAM supply at a pace the consumer market couldn't match, and the price of an ordinary RAM kit roughly doubled between summer and December. Upgrading my laptop's memory went from "small treat" to "major life decision."

![The "stonks" meme: a figure in a suit stands in front of a stock-market board with a glowing arrow shooting upward. The caption reads "POV: RAM in 2026".](/blog/local-ai/stonks.jpg "Me, who only wanted 32 GB to run a 14B model.")

So this post is two things: why local AI is worth it anyway, and how to do the memory math *before* you spend money you'll miss.

## Why run models locally at all?

Cloud models are better at most things. I still use them every day. But local models win in four situations that come up more often than you'd think:

- **Privacy.** The prompt never leaves your machine. Client code, personal notes, and unreleased work stay on your disk. For anything involving sensitive data, "it never left the laptop" is the easiest security review you'll ever pass.
- **Offline work.** Trains, flights, and campus Wi-Fi all stop being problems.
- **Cost at volume.** Summarizing ten thousand log lines or tagging a folder of documents costs electricity, not tokens.
- **Learning.** Nothing teaches you what quantization, context length, and throughput mean like watching your own machine struggle with them.

## The only math that matters: will it fit?

A model's weights have to sit in memory (RAM, or VRAM on a GPU) while it runs. The rough size is:

> **memory ≈ parameters × bytes per parameter**, plus extra for the context.

Bytes per parameter depends on **quantization**, which stores each weight with fewer bits. Full precision uses 16 bits (2 bytes) per weight. Common local formats use 8 bits or about 4 bits.

| Model size | 16-bit | 8-bit | ~4-bit (Q4) |
| --- | --- | --- | --- |
| 3B | ~6 GB | ~3 GB | ~2 GB |
| 7–8B | ~16 GB | ~8 GB | ~5 GB |
| 14B | ~28 GB | ~15 GB | ~9 GB |
| 32B | ~64 GB | ~34 GB | ~20 GB |
| 70B | ~140 GB | ~75 GB | ~40 GB |

These are ballpark numbers for the weights alone. On top of that comes the **KV cache**, the model's working memory for the conversation, which grows with context length. A long document can add several gigabytes. Your operating system, browser, and editor also want their share.

**A practical rule:** take the Q4 number, add 30–50% for context and breathing room, and compare that with the memory you can actually spare.

## What that means for real machines

| You have | Comfortable choice | What it's good at |
| --- | --- | --- |
| 8 GB RAM | 3B–4B at Q4 | Autocomplete, short summaries, classification |
| 16 GB RAM | 7B–8B at Q4 | Everyday chat, code explanations, drafting |
| 32 GB RAM | 14B at Q4–Q8 | Solid coding help, longer documents |
| 64 GB+ (or a big GPU) | 32B at Q4 | Close to older cloud models on many tasks |

On Apple Silicon Macs, RAM and GPU memory are the same pool (unified memory), which is why a MacBook with 32 GB can run models that would need a dedicated graphics card on a PC. It's also why the RAM you choose at purchase matters so much: you can't add more later.

## Choosing quantization without overthinking it

- **Q4 (about 4-bit)** is the sweet spot for most people. Noticeable savings, modest quality loss.
- **Q8** is close to full quality if you have the room.
- **Below Q4**, quality drops faster. A smaller model at Q4 often beats a larger model squeezed to 2–3 bits.

When in doubt: **the biggest model that fits at Q4 with room to spare.**

## The tools I actually use

- **Ollama** for the command line. `ollama run llama3.1:8b` downloads and starts a model in one line, and it exposes a local API other tools can call.
- **LM Studio** for a desktop app with a model browser, a chat window, and a local server that speaks an OpenAI-style API.
- **llama.cpp** underneath many of these: the engine that made running quantized models on ordinary hardware practical.

One small win from my own setup: some of my tools send requests in a format LM Studio's local server only partly understands. A small Python proxy sits between them, flattens the message content, and strips the fields the local server rejects before forwarding the request. Now the tools I already use can point at a model on my own machine without knowing the difference.

## Where local models still lose

I'd be lying if I said local was strictly better:

- **Quality gap.** For hard reasoning and large refactors, frontier cloud models are still clearly ahead.
- **Speed.** On a laptop, a 14B model writes at reading speed. Fine for chat, slow for a long code review.
- **Heat and battery.** My laptop fan now has opinions, and it shares them.
- **Context length.** Long contexts eat memory, so you trade document size against model size.

My split: local for private and high-volume work, cloud for the hardest problems, and never anything sensitive in a tool I haven't checked.

## The short version

1. Decide what you'll use it for before choosing a model.
2. Do the memory math: parameters × bytes per parameter, plus 30–50%.
3. Start with an 8B model at Q4 through Ollama or LM Studio.
4. Move up in size only when you hit a quality wall, not a hype post.

And if you're buying a machine for this: buy more RAM than you think you need. Prices might calm down by the time you read this. My wallet is not optimistic.
