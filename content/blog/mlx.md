---
title: "Why I Moved My Voice AI Stack to MLX, and Where PyTorch Still Wins"
date: "2026-10-24"
description: "Running speech recognition, text-to-speech, voice cloning and a local language model on one 16 GB MacBook with Apple's MLX: the architecture, the real benchmark numbers, the quantization results, and the sharp edges."
tags: ["local-ai", "mlx", "ai-engineering"]
---

Auralis, my voice AI studio, does a lot of model work for a laptop project. A single spoken turn with one of its voice agents runs speech recognition, retrieval over the agent's documents, a language model, text-to-speech and an audio watermark. Studio mode adds voice cloning in ten languages, plus Indian languages through dedicated models.

For the first two months, all of it ran on PyTorch. On my Apple M4 MacBook with 16 GB of memory, that meant two things: everything was slower than it needed to be, and the machine spent a lot of its life swapping.

In October 2026 I moved the hot path to **MLX**, Apple's machine learning framework for Apple Silicon. This post covers why, how the system is built now, what the benchmarks actually showed, and the places where MLX made my life harder rather than easier.

Every number below comes from Auralis's own benchmark scripts, run on that one laptop. They aren't universal truths about MLX, but they're honest about one real system.

## What MLX is, in one paragraph

MLX is an array framework (think NumPy, with automatic differentiation and a GPU backend) built by Apple's machine learning research team for Apple Silicon. Around it sits a growing ecosystem: `mlx-lm` for language models, `mlx-whisper` for speech recognition, `mlx-audio` for text-to-speech, and the `mlx-community` organization on Hugging Face, which publishes ready-converted and quantized versions of popular models.

Three design choices make it a good fit for a laptop:

1. **Unified memory.** On Apple Silicon, the CPU and GPU share one pool of memory. MLX arrays live there, so there's no copying tensors from "RAM" to "VRAM" and back. On a 16 GB machine, that also means every gigabyte counts once, not twice.
2. **Lazy evaluation.** Operations build a graph; nothing is computed until a result is actually needed (or you call `mx.eval`). MLX can then fuse and schedule the work.
3. **First-class quantization.** Converting a model to 4-bit or 8-bit weights is a single command, and quantized models are the normal way to run things, not an afterthought.

A tiny taste of the API:

```python
import mlx.core as mx

a = mx.random.normal((4096, 4096))
b = a @ a.T          # nothing has run yet: this only builds the graph
mx.eval(b)           # now the matrix multiply runs on the GPU
```

And running a quantized language model locally takes three lines:

```python
from mlx_lm import load, generate

model, tokenizer = load("mlx-community/Llama-3.2-3B-Instruct-4bit")
print(generate(model, tokenizer, prompt="Explain unified memory in one sentence.", max_tokens=80))
```

## The architecture: one API, one worker per model

Here's how Auralis runs its models on a Mac today.

![Auralis on Apple Silicon. A FastAPI API process with a memory guard talks over HTTP on 127.0.0.1 to MLX worker processes running in their own virtual environment: Kokoro 82M for speech (about 0.9 GB), Whisper large-v3-turbo for recognition (about 1.7 GB), Qwen3-TTS 0.6B 8-bit for voice cloning (about 2.4 GB), Llama 3.2 3B 4-bit for local replies (about 2.2 GB), and an opt-in Indic-Speak 4-bit worker (about 2.1 GB peak). A parent watch makes each worker exit if the API dies. All share 16 GB of unified memory, and a PyTorch fallback handles a request when a worker fails.](/blog/mlx/auralis-architecture.svg "One API process, one MLX worker per model, one shared pool of unified memory. Footprints from the app's model memory bench, 27 Oct 2026.")

A few decisions in that diagram deserve an explanation.

### Workers are separate processes, in a separate environment

Each MLX model runs as its own small HTTP server, listening only on `127.0.0.1`, started and owned by the main API process. They live in their own Python virtual environment (`.venv-mlx`).

That wasn't a style choice. It was forced by dependencies: `mlx-audio` needs `transformers` 5.x, while the PyTorch voice-cloning package I also use pins `transformers` 4.x. Two incompatible versions can't share one environment, but two processes can each have their own.

Separate processes turned out to have real benefits beyond resolving the conflict:

- **Memory is easy to account for and reclaim.** When a worker is stopped, the operating system gets every byte back. No hoping the garbage collector cooperates.
- **A crash is contained.** If a worker dies, the API notices, falls back for that request, and restarts it. The user's call doesn't end.
- **No orphans.** Each worker watches its parent and exits if the API process dies, so a crashed server never leaves 2 GB models running in the background.

### Fallback is automatic, per request

The Kokoro text-to-speech module is a good example. With `KOKORO_ENGINE=auto` (the default), a Mac uses the MLX worker when the MLX environment exists, and PyTorch everywhere else. If the MLX worker fails, or can't speak a particular voice or language, that single request quietly goes to a PyTorch pipeline, and the reason is logged once. The PyTorch model (about 1 GB) is only loaded when a fallback actually happens.

Both paths produce the same 24 kHz mono audio, so the watermark, the signed receipt and the file formats downstream never know which engine spoke.

### A memory guard decides what can load

Every engine has a declared memory need. Before loading one, a guard checks available memory against that need plus a 1.5 GB reserve (more under memory pressure), and evicts the least recently used model if necessary. On a 16 GB machine running a browser, an editor and Docker, this is the difference between "slightly slower" and "frozen for thirty seconds while macOS swaps."

## What MLX actually bought me

### Faster speech, with less memory

Text-to-speech is on every single voice turn, so it was the first thing I moved. Kokoro, the fast preset-voice model, runs on both PyTorch and MLX with the same voices. Measured per sentence on the M4:

| Kokoro-82M | English, per sentence | Hindi, per sentence |
| --- | --- | --- |
| PyTorch | 0.66 s | 0.83 s |
| MLX | **0.39 s** | **0.45 s** |

The read-back scores (speech turned back into text and compared with the input) were identical, and the MLX version uses about 1.6 GB less memory than the PyTorch one. Per-turn voice synthesis in the full agent dropped from 1.39 s to 0.73 s after this change and its neighbors.

### A fully local voice agent

With Whisper large-v3-turbo on MLX for speech recognition and Llama 3.2 3B (4-bit) through `mlx-lm` for replies, a voice agent works with **no API keys and no internet**. On the same 30 spoken questions (15 English, 15 Hindi), streaming, with no cloud services at all:

| Measure | Median | 95th percentile |
| --- | --- | --- |
| First sentence of the answer | 2.23 s | 3.58 s |
| Full reply ready | 3.02 s | 5.03 s |
| Speech recognition | 0.73 s | |
| Voice synthesis per turn | 0.82 s | |

A hosted model is still faster for replies. But a clinic receptionist agent that answers in about two seconds, entirely on a laptop, with nothing leaving the machine, is a genuinely different product.

### Quantization that changes what fits

This was the biggest win. Indic-Speak, a model that speaks 22 Indian languages with preset voices, is a 3.2-billion-parameter language model plus a small audio decoder. In its original form (PyTorch, bf16) it needs about 7 GB, which on a 16 GB laptop means fighting every other app for memory.

Because only the language model part is large, I converted just that part with `mlx_lm convert` at 4-bit and 8-bit (group size 64), kept the original audio decoder, and benchmarked all three on the same 27 sentences:

| Variant | Weights | Peak memory | Mean CER | Seconds of work per second of audio |
| --- | --- | --- | --- | --- |
| Original (PyTorch, bf16) | 6.1 GB | ~7 GB | 0.115 | 6.6 |
| MLX 8-bit | 3.3 GB | 3.5 GB | 0.136 | 3.5 |
| MLX 4-bit | 1.8 GB | 2.1 GB | 0.126 | 1.8 |

CER is the character error rate when the generated speech is transcribed back by Whisper; lower is better.

The 4-bit version cut memory by about 70% and generated speech about **3.7 times faster**, for a CER cost of about 0.01. That's within the noise of 27 sentences; it was even better than the original on 9 of them. Across all 81 sentences in the larger benchmark, the 4-bit cost held steady at about +0.010 CER.

Two lessons from that table:

- **"More bits" isn't automatically better.** The 8-bit version was no more accurate than 4-bit here. That surprised me, and it's within noise, but it's a good reason to measure instead of assuming.
- **Quantization is a product decision, not just an optimization.** At 2 GB instead of 7, this model stops being "only if you close everything else" and becomes something the app can keep available. It now ships as an opt-in 4-bit worker mode.

## Where MLX made things harder

None of this came free. These are the costs I actually paid.

### It's Apple Silicon only

The obvious one. Auralis also runs on Windows and Linux, so every MLX path needs a non-Apple alternative: PyTorch on CUDA, `faster-whisper` instead of `mlx-whisper`, and so on. The architecture above exists partly *because* of this: the API talks to "a speech engine," and on a Mac that engine happens to be an MLX worker.

### The port matters as much as the model

Many models are released for CUDA first. On a Mac you're often running a community port, and ports vary enormously.

The clearest example is Maya 2, an Indian-language voice-cloning model. Through one MLX port, it needed 1.4 to 1.8 seconds of work per second of speech: fine for Studio renders, far too slow for a live call. Through a different community port with hand-written Metal kernels, at 8-bit, the *same weights* needed **0.53 seconds** per second of speech and started speaking in 0.28 seconds. It became the first cloning engine faster than real time on the laptop in every Indian language tested.

My notes from that day say it plainly: the model was never slow; the first port was. When an MLX model seems slow, try another port before giving up on the model.

(One more surprise from the same test: the 8-bit version wasn't faster through the first port, because generation there was limited by computation in the decoder, not by loading weights. Quantization speeds up weight-bound work. It does nothing for compute-bound work.)

### Memory peaks are higher than steady state

The first request to an MLX model compiles GPU kernels, and memory spikes while it does. Kokoro settles at about 0.9 GB but peaks at about 2.1 GB on its first request; the Whisper worker peaks between 2.3 and 2.9 GB. The memory guard's reserve exists specifically to absorb those first-request spikes.

There's also a measurement trap: macOS reports very low resident memory (RSS) for memory-mapped model weights. Whisper showed an RSS of 162 MB while its real footprint was 1.7 GB. If you size your system by RSS on a Mac, you'll be wrong by gigabytes. Use the physical footprint, which is what Activity Monitor calls Memory.

### Buffer caches need limits

MLX keeps freed GPU buffers in a cache so it can reuse them quickly. That's great for speed and bad for a long-running server, where the cache slowly becomes most of your memory. The workers set a cache limit with `mx.set_cache_limit(...)`, and the Whisper worker calls `mx.clear_cache()` after each request to hand scratch buffers back to the operating system.

After those changes, an eight-minute soak test with real requests showed flat or falling memory for every worker. Before them, the trend went the other way.

### Young ecosystem, real bugs

At one point, clearing the cache between streamed audio chunks crashed the process with a segmentation fault (MLX issue 3450). The fix was to *not* do that in the streaming path, with a comment explaining why so nobody "optimizes" it back in later. Expect to read GitHub issues, pin versions, and test upgrades before trusting them.

## When I'd reach for MLX, and when I wouldn't

**Reach for MLX when:**

- the target is a Mac, especially for local or offline features;
- memory is tight and quantized models are acceptable (they usually are; measure to be sure);
- you want a private mode where audio and text never leave the device;
- an `mlx-community` conversion of your model already exists.

**Stick with PyTorch (or plan for both) when:**

- you deploy to Linux servers or NVIDIA GPUs;
- the model only has a CUDA implementation and no well-tested port;
- you need the widest library support for training and research.

For Auralis, the answer is both: MLX on the Mac where it's faster and lighter, PyTorch everywhere else, and an architecture where the rest of the system can't tell the difference.

## The short version

- MLX runs models on Apple Silicon's GPU using unified memory, lazy evaluation and first-class quantization.
- Moving Kokoro to MLX cut speech synthesis time per sentence by about 40 to 46% with about 1.6 GB less memory and identical accuracy.
- 4-bit quantization made a 7 GB Indian-language model fit in about 2 GB and run 3.7 times faster, for about +0.01 CER.
- One worker process per model, a memory guard, cache limits and per-request PyTorch fallback make it stable on a 16 GB laptop.
- Measure with the physical footprint, not RSS; expect first-request memory spikes; and when a model is slow, try a different port before blaming the model.
