---
title: "Designing Multi-Agent SOC Pipelines with LangGraph"
date: "2024-05-15"
description: "A deep dive into how I approach building an autonomous security operation center using multi-agent reasoning, specialized tooling, and session memory."
tags: [Agentic AI, Architecture, Open Source]
---

Building a reliable multi-agent system requires strict control over the execution flow. In this note, I share my learnings from building the **Agentic SOC** system using LangGraph and Python.

## The Alert Fatigue Problem

Security operations centers (SOCs) are notoriously plagued by extreme alert fatigue. Junior analysts are tasked with reviewing hundreds of potential incidents daily. This results in:
- High burnout rates
- Important threats slipping through the cracks
- Inconsistent playbooks applied depending on the analyst

By utilizing specialized LLM agents, we can orchestrate a triage pipeline that works deterministically.

## Architecture

We use a standard hierarchical agent pattern:

1. **Orchestrator Agent**: Acts as the SOC Manager. It receives the initial alert json.
2. **Threat Intel Agent**: Responsible for querying VirusTotal, internal MISP, and Shodan.
3. **Log Retrieval Agent**: Responsible for writing Splunk/Elastic queries to find related events.

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class AgentState(TypedDict):
    alert_details: dict
    threat_intel: dict
    logs_found: List[str]
    final_decision: str

# Define node functions for each agent
def threat_intel_node(state):
    # Query VT
    return {"threat_intel": perform_vt_lookup(state["alert_details"])}

def log_retrieval_node(state):
    # Query internal SIEM
    return {"logs_found": query_siem(state["alert_details"])}

# Build graph
workflow = StateGraph(AgentState)
workflow.add_node("threat_intel", threat_intel_node)
workflow.add_node("log_retrieval", log_retrieval_node)

# Add edges...
```

Instead of letting an agent randomly decide its tooling, we enforce a graph-based state machine. The orchestrator delegates, waits for context, and only then proceeds to resolution.

## Why Skeuomorphism Matters Even in AI

You might wonder why I focus so heavily on the UI of internal AI tools. The truth is, security analysts treat these systems with skepticism. 

> If an AI tool lacks a polished, tactile, and transparent UI, it simply won't be adopted. Trust is built visually just as much as practically.

By displaying the agent's "chain of thought" in real-time glowing terminals, the user feels a sense of collaboration rather than replacement.

---
*Stay tuned for Part 2 where I cover how we handle hallucinated query generation.*
