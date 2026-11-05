---
title: "DeepInfra, Explained: The Inference Cloud Quietly Serving Open-Source AI"
date: "2026-11-01"
description: "What DeepInfra is, where it came from, how its inference stack and API work, how it makes money, and when you'd use it, with diagrams and screenshots."
tags: ["inference", "genai", "ai-engineering"]
---

If you've called an open-weight model like DeepSeek, Qwen, Llama or Nemotron through an API in the last year, there's a fair chance a company called **DeepInfra** answered. Most people have never heard of it.

It doesn't train models. It doesn't make a chatbot. It does one thing, and that one thing has quietly become one of the most important layers in AI: **inference**, running already-trained models for real users, billions of times a day.

This post is my attempt to explain DeepInfra properly: what it is, where it came from, what's actually in its stack, how it makes money, and when you'd use it. Everything below is based on DeepInfra's own announcements, docs and pricing pages as of early November 2026, linked at the end.

![DeepInfra's homepage: the headline "Reliable AI Inference" with model cards showing per-token prices and an on-demand NVIDIA B300 GPU at 5.89 dollars per instance-hour.](/blog/deepinfra/home.jpg "deepinfra.com, November 2026. The model cards on the right show the whole business at a glance: a model, and a price per million tokens.")

## DeepInfra at a glance

| | |
| --- | --- |
| **What it is** | A cloud built only for AI inference: you send a request, it runs an AI model on its GPUs and sends back the result |
| **Founded** | 2022 by Nikola Borisov (CEO), Yessen Kanapin and Georgios Papoutsis, the team behind the imo messenger app; based in Palo Alto |
| **How you use it** | An OpenAI-compatible API: change the base URL and the model name in code you already have |
| **What it runs** | 200+ open-source models (text, vision, speech, embeddings, images and more), plus some proprietary models |
| **What it owns** | Its own NVIDIA GPUs across nine data centers: eight in the US and one in Toronto |
| **How it charges** | Per million tokens for shared models, per GPU-hour for dedicated hardware |
| **Funding** | About $133M: an $8M seed, an $18M Series A (April 2025) and a $107M Series B (May 2026) |
| **Scale** | 22 trillion tokens a week and more than $105M in annualized revenue (September 2026) |

## First, what "inference" means

Every AI model has two lives.

- **Training** is when the model learns. It happens once (or a few times), costs a fortune, and needs thousands of GPUs working together for weeks.
- **Inference** is when the model is used. Every time someone asks a question, the model runs again to produce an answer. It's smaller per request, but it never stops.

For years, almost all the attention and money went to training. DeepInfra's founding bet, in their own words from the Series A post, was that "while enormous resources were being poured into training AI models, the infrastructure needed to run these models in production was lagging behind."

That bet has aged well. Two trends made inference the bigger problem:

1. **Open-weight models got good.** Models like DeepSeek, Qwen, Kimi and Nemotron reached quality close to the best proprietary models. Anyone can download them, but running a 400-billion-parameter model yourself needs serious hardware.
2. **Agents multiplied the number of model calls.** A chatbot makes one call per message. An agent might make 50 to 100 calls to finish one task, all day, every day. DeepInfra estimated in May 2026 that nearly 30% of its weekly token volume came from agents.

If you want the basics of what happens inside one model call, I covered that in [GenAI for working developers](/blog/genAiBasics).

## The story so far

![A timeline. 2022: founded by the team behind the imo messenger. Seed: 8 million dollars, led by A.Capital and Felicis. April 2025: 18 million dollar Series A, Felicis and Georges Harik, Blackwell GPUs arrive. May 2026: 107 million dollar Series B, 500 Global and Harik, about 5 trillion tokens a week. July 2026: Toronto data center, ninth site and first outside the US, over 1,000 B300 GPUs. September 2026: over 105 million dollars annualized revenue, about 14 times year over year, 22 trillion tokens a week.](/blog/deepinfra/timeline.svg "Four years from founding to a nine-figure revenue run rate.")

- **2022: the founding.** The founders had previously built **imo**, a messaging app used by more than 200 million people. Running a global, always-on messaging service turned out to be good training for running a global, always-on inference service. The company launched with an **$8M seed** led by A.Capital and Felicis.
- **April 2025: Series A, $18M.** Led by Felicis and Georges Harik (one of Google's earliest engineers). By then, DeepInfra said its processing volume had grown more than 8,000 times since the seed, and it had just received a large shipment of NVIDIA Blackwell GPUs. Growth sped up after reasoning models like DeepSeek arrived, because "thinking" models spend far more computation per answer.
- **May 2026: Series B, $107M.** Co-led by 500 Global and Georges Harik, with NVIDIA, Samsung Next, Supermicro, Felicis and others. At the time, DeepInfra was processing nearly **5 trillion tokens a week**, and its revenue had tripled since the start of the year.
- **July 2026: Toronto.** Its ninth data center and the first outside the US: a 1.7 MW facility for more than 1,000 NVIDIA Blackwell **B300** GPUs.
- **September 2026: past $100M ARR.** More than **$105 million** in annualized revenue, nearly 14 times the year before, and **22 trillion tokens a week**, more than triple May's volume.

For scale: 22 trillion tokens a week is more than 36 million tokens every second, around the clock.

## What DeepInfra actually is: a vertically integrated inference stack

Here's the key idea. Most AI API companies rent GPUs from a bigger cloud and resell model access on top. DeepInfra **owns its hardware** and builds every layer above it itself.

![Where DeepInfra sits. Your app (chat, agents such as OpenCode and OpenClaw, voice through LiveKit, RAG, batch jobs) calls an OpenAI-compatible API at api.deepinfra.com/v1/openai. Under it, DeepInfra's managed inference cloud handles auth and billing, model routing across 200+ models, scheduling with standard, priority and flex tiers and fail_fast, and autoscaling, on inference engines running on owned NVIDIA GPUs (A100, H100, H200, B200, B300, NVIDIA Dynamo, fp8 and fp4 precision) across nine data centers.](/blog/deepinfra/where-it-sits.svg "You keep the app. DeepInfra runs the model and everything under it.")

From the bottom up:

| Layer | What DeepInfra does there |
| --- | --- |
| **Data centers** | Nine locations: eight in the US and one in Toronto |
| **GPUs** | Its own NVIDIA hardware: A100, H100, H200, B200 and B300 today, with Vera Rubin planned |
| **Inference engines** | Software that runs each model efficiently, tuned with NVIDIA, including the NVIDIA Dynamo distributed-inference software |
| **Scheduling and scaling** | Decides which request runs when and adds capacity as load changes; offers service tiers |
| **API** | OpenAI-compatible endpoints for chat, plus endpoints for embeddings, speech, images and more |

Why owning the hardware matters, in DeepInfra's words: it enables "structurally lower costs per token and more predictable latency than hyperscalers and general-purpose cloud providers that rely on spot or rented capacity." Renting GPUs means paying someone else's margin and sometimes losing capacity when demand spikes. Owning them means you control both the cost and the availability.

The trade-off is that owning hardware is expensive and slow to grow, which is exactly what the Series B money is for.

## The product, from a developer's seat

### 1. A catalog of 200+ models

![DeepInfra's model catalog with filters for text-generation, text-to-speech, text-to-image, embeddings, automatic speech recognition, reranker, multimodal, OCR, Priority and Flex, and featured model cards such as DeepSeek-V4.1-Flash, NVIDIA Nemotron 3.5 Super VL, Hy4-preview and MiMo-V2.6-Flash, each with prices and tags.](/blog/deepinfra/models.jpg "The model catalog. Each card shows the price per million tokens and a row of tags worth learning to read.")

The catalog goes well beyond chat models: text-to-speech, speech recognition, embeddings, rerankers, image and video generation, OCR and multimodal models. Each model card carries small tags that tell you a lot:

| Tag | What it means |
| --- | --- |
| `ZDR` | **Zero data retention**: your prompts and outputs aren't stored |
| `fp8`, `fp4` | The number precision the model runs at. Lower precision uses less memory and runs faster, usually with a small quality cost |
| `256k`, `1024k` | The context window: how many tokens the model can read at once |
| `Priority`, `Flex` | The service tiers this model supports (more on these below) |
| `cached` price | A cheaper rate for input tokens the system has seen recently, such as a long system prompt you send with every request |

DeepInfra also keeps **several versions** of popular models available, so an app in production doesn't break or change behavior every time a new version is released.

### 2. An API you already know how to use

![DeepInfra's Chat Completions documentation, showing the endpoint https://api.deepinfra.com/v1/openai and the three changes needed from existing OpenAI code: set base_url, set api_key, and set model.](/blog/deepinfra/docs.jpg "The docs make the pitch plainly: change three things in your existing OpenAI code.")

This is the single biggest reason DeepInfra is easy to adopt. The API is **OpenAI-compatible**, so code written for OpenAI works by changing three things:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["DEEPINFRA_API_KEY"],          # 1. your DeepInfra key
    base_url="https://api.deepinfra.com/v1/openai",    # 2. DeepInfra's endpoint
)

reply = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V4-Flash",             # 3. any model from the catalog
    messages=[{"role": "user", "content": "Explain inference in one sentence."}],
)
print(reply.choices[0].message.content)
```

Streaming, tool calling, structured JSON output, vision input, prompt caching and reasoning controls follow the same OpenAI-style interface. So does every library and framework that already speaks it. Switching a working app from one provider to another becomes a configuration change, not a rewrite.

## The life of a request

What happens between `create()` and the answer? DeepInfra doesn't publish its internals, but its docs describe the behavior you can control. Here it is as a simplified picture:

![Life of one request, conceptual. 1: a request to chat completions with a model, messages and an optional service tier. 2: auth and routing, from API key to account and from model to GPU pool. 3: queue by tier, priority at 1.5 times the price, standard at 1 times, flex at 0.8 times. 4: batching on the GPU, where many requests share one forward pass. 5: tokens stream back and are billed per token. A side path: with fail_fast set to true, a busy model returns HTTP 429 engine_overloaded immediately, and nothing is billed.](/blog/deepinfra/request-lifecycle.svg "A conceptual view based on DeepInfra's public documentation, not its internal design.")

Two parts of this are worth understanding, because they're where the economics and the user experience come from.

### Batching is why per-token pricing works

A GPU is massively parallel. Serving one request at a time would leave most of it idle. Inference engines **batch** many users' requests into the same computation, so one pass through the model produces the next token for dozens of conversations at once. The more traffic a provider has, the fuller its batches and the lower its cost per token. This is the deepest reason large shared inference clouds can undercut running a model yourself.

### You choose how your request waits

Every model has finite GPU capacity. When it's busy, requests queue. DeepInfra lets you decide how your request behaves in that queue:

| Tier | What happens | Price |
| --- | --- | --- |
| **Standard** | Default scheduling | 1× the base price |
| **Priority** | Jumps ahead of standard traffic for a faster first token during peak demand | 1.5× |
| **Flex** | Cheaper, but slower and occasionally unavailable; may wait up to 10 minutes for capacity | 0.8× |

There's also `fail_fast: true`. Instead of waiting in a queue, a request to a busy model gets an **immediate HTTP 429** and isn't billed. That sounds like a failure, but it's a feature for latency-sensitive apps: a voice agent would rather fail over to a backup model right away than wait in a queue while the caller hears silence.

For people who build voice agents, like me, that one parameter says a lot about who DeepInfra is building for.

## How DeepInfra makes money

![Three ways to buy DeepInfra. Serverless API: pay per million tokens, shared and autoscaled, 200 concurrent requests, no setup, best for most apps. Custom deployments: your model on dedicated GPUs, from 1.49 dollars per GPU-hour for an A100 to 5.89 for a B300, billed by the minute, best for fine-tunes. Dedicated clusters: DGX H100, B200 or B300 with 3.2 Tbps networking, the DeepCluster offering, through sales, best for big steady load.](/blog/deepinfra/ways-to-buy.svg "From pay-per-token to your own cluster.")

The business model has three tiers, from "no commitment" to "a cluster with your name on it."

### 1. Serverless, per token

You pay for the tokens you send and receive, per million. There's no setup and no minimum. Accounts get up to 200 concurrent requests by default, with more available on request. Some examples from the pricing page in early November 2026:

| Model | Input, per 1M tokens | Output, per 1M tokens |
| --- | --- | --- |
| Meta-Llama-3.1-8B-Instruct-Turbo | $0.02 | $0.04 |
| DeepSeek-V4-Flash | $0.09 | $0.18 |
| Qwen3.5-397B-A17B | $0.45 | $3.00 |
| DeepSeek-V4-Pro | $1.30 | $2.60 |
| bge-m3 (embeddings) | $0.01 | none |

To make that concrete: one million output tokens is roughly 750,000 words, several long novels. On DeepSeek-V4-Flash, that costs 18 cents.

Notice that some very large models are cheap. Qwen3.5-397B-A17B has 397 billion parameters in total but only about 17 billion active for each token. These **Mixture-of-Experts** models only run a small slice of themselves per token, so a huge model can cost about as much to serve as a medium one.

### 2. Your own model, per GPU-hour

![DeepInfra's pricing page for custom LLMs: dedicated A100, H100, H200, B200 and B300 GPUs billed by the minute and invoiced weekly, from 1.49 dollars per GPU-hour for an A100 with 80 GB to 5.89 for a B300 with 270 GB.](/blog/deepinfra/pricing-gpus.jpg "Dedicated GPUs for your own model, billed by the minute.")

If you've fine-tuned your own model, you can deploy it on dedicated GPUs and pay for uptime, from **$1.49 an hour for an A100** up to **$5.89 an hour for a B300**, billed by the minute. You get the hardware to yourself, so performance doesn't depend on other customers' traffic.

### 3. Dedicated clusters

For big, steady workloads, DeepInfra sells dedicated DGX H100, B200 and B300 clusters with 3.2 Tbps networking through its sales team, under an offering it calls DeepCluster.

## Who uses it

DeepInfra's announcements name a few customers:

- **LiveKit**, the open-source platform for real-time voice and video. Its inference lead explained the bar in the September 2026 announcement: time-to-first-token below 500 ms, more than 100 tokens per second, and no downtime, at many billions of tokens a day.
- **OpenCode**, an open-source coding agent.
- **Humans&**, a frontier lab focused on long-horizon interactions.
- **Venice AI**, which cited access to strong models with the reliability and speed it needs to ship.

Notice the pattern: real-time voice, coding agents and long-running AI systems. These are the workloads where many calls, low latency and steady costs matter most.

## Security and data

For companies sending sensitive data to a model, DeepInfra lists:

- **Zero data retention** on supported models, and a no-logging policy for user prompts.
- **SOC 2** and **ISO 27001** certification.
- Hardware it owns and operates, rather than capacity rented from another cloud.

## Where DeepInfra fits, honestly

DeepInfra isn't the only inference provider for open models, and it isn't the right answer for everything.

**It's a strong fit when:**

- you want open-weight models without running GPUs yourself;
- you already use the OpenAI SDK and want to switch models cheaply;
- your workload is high-volume or agent-driven, where cost per token dominates;
- you need low, predictable latency for voice or real-time features.

**Think twice when:**

- you need a frontier proprietary model that isn't on its catalog;
- your data can't leave your own infrastructure at all (then self-hosting or a private deployment is the answer);
- you need guarantees beyond what its tiers and dedicated options offer, such as a specific region.

And because the API is OpenAI-compatible, you don't have to choose forever. You can put DeepInfra behind the same interface as other providers and route each request to whichever gives the best price, speed or quality for that job.

## The bigger picture

DeepInfra's story is really the story of where AI spending is going. Training gets the headlines; inference gets the invoices. Every agent step, every voice turn and every search answer is an inference call, and those calls are multiplying far faster than new models are being trained.

DeepInfra's answer is unglamorous and very physical: own the GPUs, build the software for exactly one job, and sell the result by the token. Going from a seed round to more than $105M in annualized revenue in about four years suggests a lot of developers agree that the boring layer is where the leverage is.

## Sources

- [DeepInfra closes $107M Series B](https://www.globenewswire.com/news-release/2026/05/04/3286977/0/en/deepinfra-closes-107m-series-b-to-power-production-scale-ai-inference.html), GlobeNewswire, 4 May 2026
- [DeepInfra opens its first international data center, in Toronto](https://www.globenewswire.com/news-release/2026/07/08/3324125/0/en/DeepInfra-Expands-AI-Inference-Capacity-with-First-International-Data-Center-in-Toronto.html), GlobeNewswire, 8 July 2026
- [DeepInfra surpasses $100M ARR](https://www.globenewswire.com/news-release/2026/09/29/3370896/0/en/deepinfra-surpasses-100m-arr-triples-token-volume.html), GlobeNewswire, 29 September 2026
- [A milestone on our journey (Series A)](https://deepinfra.com/blog/18m-milestone), DeepInfra blog, 22 April 2025
- [DeepInfra lands $107M to build out its inference cloud](https://siliconangle.com/2026/05/04/deepinfra-lands-107m-funding-build-dedicated-inference-cloud-open-source-models/), SiliconANGLE, 4 May 2026
- [DeepInfra pricing](https://deepinfra.com/pricing), [model catalog](https://deepinfra.com/models) and [Chat Completions docs](https://docs.deepinfra.com/chat/overview), viewed early November 2026

Screenshots are of DeepInfra's public website, taken in November 2026. Prices change often; check the pricing page before you rely on any number here.
