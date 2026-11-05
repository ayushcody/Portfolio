---
title: "DeepInfer, Explained: How DeepSeek Serves 155 Trillion Tokens a Day"
date: "2026-11-01"
description: "DeepSeek open-sourced the inference engine behind its own API. What DeepInfer is, how prefill and decode are split, why KV caches live on SSDs for days, how DSpark speculative decoding works, and what the benchmarks show."
tags: ["inference", "genai", "ai-engineering"]
---

On 16 October 2026, DeepSeek did something AI labs rarely do. It open-sourced the software that runs its own production API.

The project is called **DeepInfer**. It's the inference framework behind DeepSeek-V4.1-Flash, and according to DeepSeek's own deployment notes, a single cluster running it serves **155 trillion tokens a day**. Within weeks, tens of thousands of developers had starred the repository on GitHub.

Most of the AI conversation is about models: who trained the biggest one, who tops which benchmark. DeepInfer is about the other half of the problem, the half that decides what a model *costs* to use. DeepSeek's documentation puts it in one sentence:

> A model defines the boundary of what is possible; serving those capabilities to a massive user base at a reasonable cost is the core problem an inference framework has to solve.

This post explains what DeepInfer is, how it works, and why its design choices are worth understanding even if you'll never run a 128-GPU cluster. I've kept the jargon to a minimum and explained it wherever it's unavoidable.

![The DeepInfer repository on GitHub: deepseek-ai/DeepInfer, Apache-2.0 licensed, about 25,500 stars and 3,100 forks, with folders for csrc, deep_cluster, deepinfer, doc, eval, examples, scripts, tests and vendor.](/blog/deepinfer/github-repo.jpg "github.com/deepseek-ai/DeepInfer, November 2026.")

## DeepInfer at a glance

| | |
| --- | --- |
| **What it is** | DeepSeek's high-performance inference framework, the engine that runs its large-scale production service |
| **Released** | 16 October 2026, on GitHub |
| **License** | Apache-2.0 (the model weights it serves are MIT-licensed) |
| **Model supported** | DeepSeek-V4.1-Flash (default checkpoint: `DeepSeek-V4.1-Flash-1017`, a 1M-token context model) |
| **Hardware** | NVIDIA SM100 (Blackwell-class) GPUs and Huawei Ascend 950 NPUs |
| **Language** | Python, with C++ and CUDA, plus kernels written in TileLang |
| **Built on** | Originally vLLM, with ideas from SGLang and TensorRT-LLM |
| **Production scale** | One cluster serves 155 trillion tokens a day, earning about $38 per GPU-hour at off-peak prices |

## First, some vocabulary

Four ideas come up again and again. Here they are in plain English.

| Term | Plain meaning |
| --- | --- |
| **Inference** | Running a trained model to answer a request (as opposed to training it) |
| **Token** | A chunk of text, roughly three-quarters of a word. Models read and write tokens |
| **KV cache** | The model's working memory for a conversation. Computing it is expensive, so reusing it saves time and money |
| **Mixture of Experts (MoE)** | A model built from many smaller "expert" networks, where each token only uses a few of them. Huge total size, modest cost per token |

DeepSeek-V4.1-Flash is an MoE model. The benchmark charts in the repo show 384 routed experts. Serving an MoE model well is mostly about getting the right tokens to the right experts on the right GPUs, fast.

## The big idea: reading and writing are different jobs

Every request to a language model has two phases, and they want opposite things from the hardware.

![Prefill versus decode. Prefill reads the whole prompt in one big parallel pass; it is compute-bound, and DeepSeek runs it on ordinary 8-GPU machines with the smallest expert-parallel group that fits memory (EP2 to EP8); it sets time to first token. Decode writes the answer one token per user per step; it is memory-bandwidth-bound, and DeepSeek runs it on 64 to 128-GPU supernodes with the widest expert parallelism the GPUs allow (EP64 to EP128); it sets tokens per second per user. The KV cache passes from prefill to decode.](/blog/deepinfer/prefill-decode.svg "Two jobs, two kinds of hardware.")

- **Prefill** reads your whole prompt at once. Thousands of tokens go through the model in parallel, so the GPUs are busy doing math. The limit is raw compute. Prefill decides your **time to first token**.
- **Decode** writes the answer, one token at a time for each user. Each step does a little math but has to read a lot of model weights from memory. The limit is memory bandwidth, and the fix is to batch many users together. Decode decides your **tokens per second**.

Because they're so different, DeepSeek runs them on **separate pools of machines**, a design called **prefill/decode disaggregation**:

- **Prefill** runs on ordinary 8-GPU machines, using the *smallest* expert-parallel group that fits in memory (EP2 to EP8). Prefill batches are already big, so small groups keep load balanced and cut network traffic.
- **Decode** runs on 64- to 128-GPU supernodes using **wide expert parallelism** (EP64 to EP128). Spreading the experts across many GPUs means each GPU reads less memory per step, which raises throughput.
- **Images** are handled by a third pool: a vision encoder service, where a single, cheaper GPU per instance is usually enough.

Once prefill finishes, the KV cache it produced is sent to a decode machine, and decoding continues there.

## The architecture

Here's the full system DeepSeek runs in production, from DeepInfer's own documentation:

![DeepSeek V4.1 Flash inference system architecture. A user request arrives as JSON at DeepSeek Recipe, which turns it into a token list and sampling parameters for the Entrypoint. The Entrypoint sends work to the Prefill Load Balancer, which feeds the Prefill Service; each prefill instance has its own expert-parallel load balancer. A Vision Encoder Load Balancer feeds a Vision Encoder Service that sends image embeddings to prefill. Prefill hands requests and KV cache to the Decode Load Balancer and the Decode Service, each instance with its own expert-parallel load balancer. Decode returns tokens to the Entrypoint, and DeepSeek Recipe returns the JSON response. Both prefill and decode read and write an external KV cache storage system built on 3FS.](/blog/deepinfer/architecture_overview.jpg "The DeepSeek V4.1 Flash inference system. Diagram from the DeepInfer repository (Apache-2.0).")

Follow one request through it:

1. **DeepSeek Recipe** turns the API request (Chat Completions, Responses or Messages format) into tokens and sampling settings.
2. The **Entrypoint** checks the KV cache store for a reusable prefix of the conversation.
3. The **Prefill Load Balancer** sends the request to a prefill engine, and the **Vision Encoder** processes any images.
4. **Prefill** computes the KV cache for whatever part of the prompt wasn't already cached.
5. The **Decode Load Balancer** picks a decode engine, and **decode** generates the answer.
6. Tokens flow back through the Entrypoint and DeepSeek Recipe, and new KV cache is saved to **3FS** storage for next time.

## What's actually in the repo

It's important to be precise here, because "DeepSeek open-sourced its inference stack" is only partly true.

![What DeepInfer open-sources. Open source under Apache-2.0: the engine and scheduler with zero-overhead asynchronous scheduling; kernels (FlashMLA, DeepGEMM, DeepEP, TileKernels, DeepSelect and TileLang); parallelism with attention data parallelism and MoE expert parallelism with load balancing; DSpark speculative decoding with confidence-scheduled verification; SWA bounded replay; and correctness features (structured outputs, batch-invariant inference and deterministic sampling). Not included yet: the KV cache system (3FS storage and kvcache-store), prefill and decode disaggregation wiring, and the prefill, decode and vision load balancers. Also released: deepseek-recipe, in Rust with Python bindings, for API encoding.](/blog/deepinfer/open-vs-not.svg "The engine is open. The cluster plumbing around it isn't (yet).")

The open-source release is the **engine**: everything that runs on a node and makes one model replica fast. The parts that glue many replicas into a service, namely the KV cache system, the prefill-to-decode wiring and the load balancers, are tied to DeepSeek's internal infrastructure and aren't included. DeepSeek describes their design in its deployment Q&A instead, and says most of the engine-side functionality for disaggregation is already in the code.

So DeepInfer today is best understood as a high-performance engine plus a very detailed blueprint for the rest.

## Six techniques worth understanding

### 1. Wide expert parallelism, with load balancing

In an MoE model, each token is routed to a few experts. With **expert parallelism (EP)**, different experts live on different GPUs. The danger is that some experts are far more popular than others, so a few GPUs end up doing most of the work while the rest wait.

DeepInfer's answer is **EPLB** (expert-parallel load balancing). Each GPU holds a few *redundant* copies of popular experts. The system tracks how busy each expert has been over recent steps and periodically reshuffles which GPU hosts what. DeepSeek reports that the slowest GPU ends up only about 4.5% to 9% busier than the average.

Going wider pays off in decode. Here's DeepSeek's comparison of 8-way and 64-way expert parallelism:

![Decode throughput versus per-user speed for DeepSeek V4.1 Flash at 131,072 context. With EP64 and 64 redundant experts, output reaches about 26,300 tokens per second per GPU at 256 requests per rank, and about 15,700 at 64 requests while each user gets about 246 tokens per second. With EP8 and 32 redundant experts, the curve is lower: about 24,900 tokens per second per GPU at 256 requests, and about 12,600 at 64 requests at about 198 tokens per second per user.](/blog/deepinfer/wide_ep_decode_pareto.png "EP64 (blue) beats EP8 (orange) at every load: more total throughput and faster per-user speed. Chart from the DeepInfer repository (Apache-2.0).")

Read the chart like this: further right means each user gets their answer faster, and higher means the GPU serves more tokens in total. Every point on the EP64 curve is above and to the right of the matching EP8 point. Spreading experts wider gives you both.

### 2. A KV cache that lives on SSDs for days

When you continue a conversation, or an agent calls the model again with a long, mostly identical prompt, most of the prompt has been seen before. If its KV cache is still around, prefill can skip it.

DeepSeek takes this further than almost anyone:

- The KV cache is stored on a dedicated **3FS** distributed file system with about **100 PiB of SSD**, not in GPU memory or RAM.
- It's kept for **3 days for agent traffic** and **7 days for chatbot traffic**. Three days covers a weekend, so Monday's agent runs can reuse Friday's context.
- Data is protected with 10+2 erasure coding, so each storage group survives two nodes failing at once.
- Because storage is separate from compute, any prefill machine can use any cached prefix, and a crashed GPU server doesn't lose the cache.

Why SSDs? They're far cheaper per gigabyte than memory, and DeepSeek's model compresses its KV cache heavily, so reading it from disk is fast enough. It also helps explain why providers can charge so much less for cached input tokens than for fresh ones.

### 3. SWA bounded replay: recompute less

DeepSeek-V4.1-Flash uses **sliding-window attention (SWA)** in many layers, where each token only looks at a fixed number of recent tokens. Normally, rebuilding that state means reprocessing a long stretch of the prompt.

**Bounded replay** recomputes only the most recent 128 tokens and limits the attention window to that segment. That makes the recomputation cost a constant, no matter how long the conversation is. Applied to the decoder layers, DeepSeek says it nearly halves total prefill computation.

### 4. DSpark: smarter speculative decoding

Decode produces one token per step, and every step costs a full trip through the model. **Speculative decoding** cheats, legitimately: a small, fast draft model guesses the next few tokens, and the big model checks all the guesses in a single step. Correct guesses are kept, so one expensive step can yield several tokens.

![DSpark speculative decoding in four steps. 1: a small draft model proposes 5 tokens. 2: a confidence head predicts each token's acceptance odds. 3: the scheduler chooses to verify only the prefix worth checking. 4: the big model checks them all in one pass. An illustrative example shows five draft tokens (the, cat, sat, on, a) with odds 0.95, 0.9, 0.8, 0.45 and 0.2; the first three are verified and the low-confidence tail is skipped. In DeepSeek's numbers, it verifies 3.2 to 4.4 tokens instead of 5, accepts about 3.2 on average, and gains 4 to 7% throughput at the production operating point.](/blog/deepinfer/dspark.svg "Guess cheaply, check once, keep the good ones.")

DeepInfer's version, **DSpark**, adds a twist. Checking guesses isn't free, and late guesses are usually wrong. So a **confidence head** estimates how likely each draft token is to be accepted, and the scheduler only verifies the guesses worth checking.

DeepSeek's measurements: verifying 3.2 to 4.4 draft tokens per step instead of always 5, while keeping about the same number accepted (3.20 versus 3.29). At the production load of about 60 sequences per GPU, that's **4% to 7% more throughput**, and up to 11% at higher loads.

### 5. Zero-overhead scheduling

Each decode step has CPU work (deciding what to run next, processing results) and GPU work (running the model). Done one after another, the GPU sits idle while the CPU thinks.

DeepInfer overlaps them. While the GPU runs step N, the CPU is already preparing step N+1 and finishing step N−1. The GPU never waits. It's a simple idea, borrowed from SGLang and NanoFlow, and it's on by default.

### 6. Correctness you can rely on

Three features exist so that results are predictable, not just fast:

- **Structured outputs** constrain the model to valid JSON, a regex or a grammar. The constraint is compiled ahead of time on a separate machine, then applied as a token mask at each decode step.
- **Batch-invariant inference** gives identical results no matter which other requests happen to share the batch. Normally, batch composition can change results in tiny ways.
- **Deterministic sampling** gives identical output for identical input, settings and seed. That's invaluable for debugging and evaluation.

There's also a security detail in **deepseek-recipe**, the companion library that converts API requests into tokens. If a user types text that looks like a special control token (such as `<｜User｜>`), it's encoded as ordinary text, so prompts can't smuggle in control tokens.

## The numbers

DeepInfer's README publishes two benchmark charts for DeepSeek-V4.1-Flash at a 131,072-token context.

![Prefill throughput versus latency with EP4DP4. At 4,096 tokens per batch, about 60,000 non-cached input tokens per second per GPU at about 70 ms per step; at 16,384, about 81,600 at about 200 ms; at 65,536, about 89,500 at about 730 ms.](/blog/deepinfer/prefill_pareto.png "Prefill on 4 GPUs: bigger batches raise throughput toward about 90,000 tokens per second per GPU, at the cost of longer steps. Chart from the DeepInfer repository (Apache-2.0).")

![Decode throughput versus per-user speed with EP64DP64. At 8 requests per rank, about 2,600 tokens per second per GPU while each user gets about 325 tokens per second; at 64 requests, about 15,700 per GPU at about 246 per user; at 256 requests, about 26,300 per GPU at about 103 per user.](/blog/deepinfer/decode_pareto.png "Decode on 64 GPUs: the classic trade-off between serving many users and serving each one fast. Chart from the DeepInfer repository (Apache-2.0).")

What these say in plain terms:

- **Prefill** on just 4 GPUs processes roughly **60,000 to 90,000 new prompt tokens per second per GPU**. Bigger batches are more efficient but make each step take longer.
- **Decode** on 64 GPUs shows the trade-off every inference provider manages. With few users per GPU, each user gets around **325 tokens per second**, faster than anyone can read. Pack 256 users per GPU and total output rises tenfold to about **26,000 tokens per second per GPU**, while each user still gets about **100 tokens per second**.

One caveat from the chart itself: the decode numbers assume three draft tokens with a 75% per-token acceptance rate, so real throughput depends on how predictable the text is.

## Could you run it?

You can build it, but this isn't a laptop project.

```bash
# Linux, GCC 13+, Python 3.12, and CUDA 13 (or CANN 9.2 for Ascend)
export DEEPINFER_ACCELERATOR=nvidia
./build.sh

# Downloads DeepSeek-V4.1-Flash-1017 from Hugging Face on first run
python examples/offline_inference.py --ep 8
```

The release supports **offline inference**: you hand it a batch of prompts and get results back. It's not yet a ready-made API server, because the KV cache system, disaggregation wiring and load balancers aren't included. DeepSeek's own guidance is that the smallest *efficient* production unit is **64 GPUs for prefill plus 64 for decode**.

So who is DeepInfer for?

- **Cloud and inference providers** that serve DeepSeek models and want to match DeepSeek's own speed and cost.
- **Infrastructure engineers** studying how frontier-scale serving actually works, with real code and real numbers.
- **Everyone else**, as one of the most detailed public explanations of production LLM serving. The deployment Q&A alone is worth reading.

## What I took away

**The model is only half the product.** DeepSeek's prices are famously low, and DeepInfer shows where that comes from: disaggregated prefill and decode, wide expert parallelism, days-long SSD caching, smarter speculative decoding and GPUs that never wait. None of that is in the model weights.

**Cheap storage beats expensive memory.** Keeping KV caches on SSDs for days, instead of in RAM for minutes, is a striking design choice, and it's what makes long agent sessions affordable.

**Honest documentation is a feature.** The repository is unusually clear about what isn't included, which parts depend on internal infrastructure, and which internal versions are slightly faster than the open ones (FlashMLA's decode kernel, by 5% to 10%). That candor makes it much easier to trust everything else.

Inference used to be the boring part of AI. DeepInfer is a good argument that it's where most of the engineering now lives.

## Sources

- [DeepInfer on GitHub](https://github.com/deepseek-ai/DeepInfer): README, feature list, build steps and benchmark charts (Apache-2.0)
- [DeepSeek V4.1 Flash Inference Deployment Q&A](https://github.com/deepseek-ai/DeepInfer/blob/main/doc/inference_deployment_qa.md), in the DeepInfer repository: architecture, parallelism, KV cache storage, DSpark, scheduling and production figures
- [DeepSeek-V4.1-Flash-1017 on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017): model card, license and context window

The architecture diagram and the three benchmark charts are reproduced from the DeepInfer repository under its Apache-2.0 license. The repository screenshot was taken in November 2026; star counts change daily.
