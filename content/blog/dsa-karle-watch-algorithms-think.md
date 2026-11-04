---
title: "Watch Algorithms Think: Why I Built DSA Karle"
date: "2025-10-28"
description: "Most DSA resources explain the answer. DSA Karle shows the algorithm running, step by step, from lesson content written as typed JSON. Here's how it works and why."
tags: ["projects", "education", "frontend"]
---

Here is how I learned two pointers the first time. I read the definition. I read the code. I nodded. I closed the tab. Two days later, someone asked me to explain it and I produced a sentence with the confidence of someone describing a movie he only saw the poster of.

The problem wasn't the explanation. It was that I never *watched* the algorithm make a decision. Every DSA resource I used showed the final code, which is the one moment where all the interesting thinking has already happened.

So I started building **DSA Karle** ("karle" being Hindi for "just do it already"). The goal is simple: you should see an algorithm think before you read a single line of its code.

![DSA Karle home page with a sliding-window walkthrough playing beside the headline "Watch algorithms think."](/blog/dsakarle/home.jpg "The home page runs a real walkthrough. Press the arrow key and the window slides.")

## Start with a question, not a definition

Every lesson opens with a small, concrete problem instead of a definition. This is the hook for two pointers, straight from the lesson file:

> You have an $18 gift card and a shop's price list, sorted from cheapest to priciest: 1, 2, 4, 6, 8, 10, 15. Which two items cost exactly $18 together, without trying every pair?

Then it nudges you. The cheapest and the priciest together cost 16, which isn't enough. What does that tell you about the 1?

It tells you the 1 can't be in *any* answer. One comparison just eliminated an item and all of its pairs. That's the whole algorithm. You discovered it before the lesson named it.

## One lesson, seven moves

Every lesson follows the same sequence, so you always know where you are:

1. **Picture**: the shape of the idea, drawn.
2. **Hook**: a real problem that makes you want the idea.
3. **Watch**: the algorithm runs step by step, with pointers moving and variables updating.
4. **Try**: change the input and predict the next move.
5. **Recognise**: which problems call for this pattern, and which don't.
6. **Code**: the same logic in Python, Java, or C++, with each line linked to its step.
7. **Practice**: hand-picked problems, each with a one-line insight.

![The Two Pointers lesson: a sidebar of topics, the seven lesson steps, and a diagram of a sorted array with left and right pointers.](/blog/dsakarle/lesson-two-pointers.jpg "A lesson page. The diagram labels the pointers 'smallest' and 'largest' and notes the rule: move the one that helps.")

Consistency here is a feature, not laziness. When the structure never changes, your attention goes to the idea instead of to the page.

## Lessons are data, not pages

This is the technical decision everything else depends on. A lesson is not a hand-built React page. It is a JSON document, and the app renders it.

The diagram you see in the lesson above comes from this:

```json
{
  "kind": "array",
  "label": "nums",
  "cells": [1, 2, 4, 6, 8, 10, 15],
  "pointers": [
    { "name": "left", "index": 0, "role": "ptrA" },
    { "name": "right", "index": 6, "role": "ptrB" }
  ],
  "marks": [
    { "index": 0, "role": "compare" },
    { "index": 6, "role": "compare" }
  ]
}
```

Each step of a walkthrough is a state object like this one. Stepping forward means moving to the next state; the SVG diagram, the highlighted code line, and the variable panel all read from the same object, so they can never disagree.

Treating content as data pays off in three ways:

- **Validation.** Every lesson is checked against a Zod schema at build time. A typo in a pointer role fails the build instead of rendering a broken diagram for a student.
- **Reuse.** The same array renderer draws two pointers, sliding window, and binary search. A new lesson is mostly writing, not engineering.
- **Search.** A build script indexes every lesson with Fuse.js ahead of time, so search is instant and nothing heavy runs in the browser.

## Showing how ideas connect

The part I'm proudest of is the pattern map. Arrows point from what to learn first to what it unlocks. If you're stuck on sliding window, the map shows you it builds on arrays and two pointers, and that's usually where the gap is.

![The DSA Karle pattern map: data structures as round nodes and algorithms as square nodes, connected by arrows showing which topic to learn first.](/blog/dsakarle/pattern-map.jpg "The pattern map. Round nodes are data structures; square nodes are algorithms and patterns.")

## What building it taught me about explaining things

DSA Karle is a coding project, but most of the hard work was writing. Every lesson forced the same questions:

- What does the reader already know at this exact point?
- What's the smallest example that still shows the idea?
- Which word will confuse a beginner, and should it be defined right here?
- What is the *one* sentence they should remember?

For two pointers, that sentence is: *sorted order makes every move safe.* A sum that's too small can only be fixed by a bigger left number. A sum that's too big, only by a smaller right one.

Code is the last step of understanding, not the first. DSA Karle is my attempt to build the steps before it.

The project is open source on [GitHub](https://github.com/ayushcody/dsakarle).
