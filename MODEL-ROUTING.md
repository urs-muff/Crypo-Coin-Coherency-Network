# Model Routing Strategy: Minimize Cost, Maximize Autonomy

## Your Hardware + Subscriptions

| Resource | Specs | Monthly Cost |
|----------|-------|-------------|
| Mac Studio | M4 Max or M3 Ultra, 128GB unified RAM | Already owned |
| Windows PC | RTX 4060, 8GB VRAM | Already owned |
| Claude Pro | Opus 4.6, Sonnet 4.5, Haiku 4.5 (rate-limited) | ~$20/mo |
| Cursor Pro+ | Background agents, MAX mode | ~$40/mo |
| OpenAI Pro | GPT-5, Codex, o3 (rate-limited) | ~$20/mo |
| Google Gemini Pro | Gemini 3 Flash, 2.5 Pro | ~$20/mo |
| **Total subscriptions** | | **~$100/mo** |

## The Routing Principle

```
Use the CHEAPEST model that can do the job.
Escalate ONLY when the cheap model fails or the task is provably hard.
```

---

## Four Tiers

```
┌─────────────────────────────────────────────────────────────────┐
│ TIER 0: LOCAL (FREE)                              ~70% of work │
│                                                                 │
│ Mac: Qwen3-Coder 30B via MLX (68-100+ tok/s)                  │
│ Win: Qwen3-Coder 30B via Ollama (40-50 tok/s)                 │
│                                                                 │
│ Cost: ~$0.001/M tokens (electricity only)                      │
│                                                                 │
│ USE FOR:                                                        │
│ • Spec drafting (from your 2-3 sentence direction)             │
│ • Test generation (from spec)                                   │
│ • Simple endpoint implementation                                │
│ • Code completion and autocomplete                              │
│ • Boilerplate generation (models, routers, fixtures)           │
│ • Linting suggestions and simple refactors                     │
│ • Documentation generation                                      │
│ • Git commit message drafting                                   │
│ • First-pass code review                                        │
├─────────────────────────────────────────────────────────────────┤
│ TIER 1: BUDGET CLOUD (CHEAP)                      ~15% of work │
│                                                                 │
│ DeepSeek V3.2 API ($0.03 input / $0.42 output per M tokens)   │
│ Gemini 2.0 Flash Lite ($0.08 / $0.30)                          │
│ OpenRouter free models (Qwen3-Coder-480B, Gemini Flash)        │
│                                                                 │
│ Cost: ~$0.03-0.50/M tokens                                     │
│                                                                 │
│ USE FOR:                                                        │
│ • Complex reasoning when local model struggles                  │
│ • Multi-step code generation (10+ files)                       │
│ • Long-context tasks (>32K tokens of context)                  │
│ • DeepSeek for SWE-bench-level bug fixes (73% accuracy)        │
│ • Second-opinion review (different model breaks echo chamber)  │
├─────────────────────────────────────────────────────────────────┤
│ TIER 2: SUBSCRIPTION MODELS (INCLUDED)            ~12% of work │
│                                                                 │
│ Claude Haiku 4.5 ($1/$5 but included in Pro)                   │
│ Claude Sonnet 4.5 ($3/$15 but included in Pro)                 │
│ GPT-4o via OpenAI Pro                                           │
│ Gemini 3 Flash via Gemini Pro                                   │
│                                                                 │
│ Cost: $0 marginal (within subscription limits)                  │
│                                                                 │
│ USE FOR:                                                        │
│ • Orchestrator role (Claude Code with Sonnet/Haiku)            │
│ • Review Panel (3 agents via Haiku — fast + cheap)             │
│ • Codex fire-and-forget tasks (from OpenAI Pro quota)          │
│ • Cursor interactive UI sessions (from Cursor Pro+ quota)      │
│ • Integration work spanning multiple services                   │
│ • Healer agent (fix CI failures — needs tool use)              │
├─────────────────────────────────────────────────────────────────┤
│ TIER 3: PREMIUM (EXPENSIVE)                       ~3% of work  │
│                                                                 │
│ Claude Opus 4.6 (rate-limited in Pro)                           │
│ GPT-5 (rate-limited in OpenAI Pro)                              │
│                                                                 │
│ Cost: Subscription-limited (save your quota)                    │
│                                                                 │
│ USE FOR:                                                        │
│ • Architecture decisions (when agents disagree)                │
│ • Complex multi-file debugging                                  │
│ • Security review of auth/payment code                          │
│ • Coherence algorithm design (the core IP)                     │
│ • Final review before major releases                            │
│ • When Tier 0-2 fails after 2 attempts                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Model-to-Agent Mapping

| Agent | Default Model (Tier) | Escalation Model | Why |
|-------|---------------------|-------------------|-----|
| **Spec Drafter** | Qwen3-Coder 30B local (T0) | Sonnet 4.5 (T2) | Specs are structured text; local model handles this well |
| **Test Writer** | Qwen3-Coder 30B local (T0) | Haiku 4.5 (T2) | Test patterns are repetitive; local model fine |
| **Impl Worker (backend)** | Qwen3-Coder 30B local (T0) | DeepSeek V3.2 API (T1) | Most endpoints are simple; escalate for complex logic |
| **Impl Worker (frontend)** | Cursor Pro+ quota (T2) | Sonnet 4.5 (T2) | UI needs visual feedback; use Cursor interactively |
| **Correctness Reviewer** | Qwen3-Coder 30B local (T0) | Haiku 4.5 (T2) | Checklist comparison; local model fine |
| **Security Reviewer** | DeepSeek V3.2 API (T1) | Opus 4.6 (T3) | Security needs broader training data than local |
| **Spec Compliance** | Qwen3-Coder 30B local (T0) | Haiku 4.5 (T2) | Structured comparison; local model fine |
| **Healer** | Haiku 4.5 (T2) | Sonnet 4.5 (T2) | Needs tool use for CI; Claude models best at this |
| **Orchestrator** | Haiku 4.5 (T2) | Sonnet 4.5 (T2) | Needs to coordinate agents; use subscription quota |
| **Architect** (rare) | Opus 4.6 (T3) | Human | Only for major decisions; save Opus quota for this |

### Escalation Rules

```
IF local model output:
  - Fails tests after 2 attempts → escalate to Tier 1
  - Fails review panel after 1 fix → escalate to Tier 2
  - Involves security/auth code → start at Tier 1 minimum
  - Is architecture decision → start at Tier 3

IF subscription model:
  - Hits rate limit → fall back to DeepSeek API (Tier 1)
  - Fails after 3 attempts → escalate to next tier
  - Is near daily Opus limit → defer non-critical Opus tasks to tomorrow
```

---

## Local Model Setup

### Mac Studio (Primary Workhorse)

```bash
# Install MLX (fastest on Apple Silicon)
pip install mlx-lm

# Download Qwen3-Coder 30B (MLX format)
# This is a MoE model: 30.5B total, 3.3B active
# At Q4_K_M: ~18GB RAM, leaving 110GB free
mlx_lm.convert --hf-path Qwen/Qwen3-Coder-30B-A3B --mlx-path ./models/qwen3-coder-30b -q

# Or use Ollama (easier, slightly slower)
brew install ollama
ollama serve  # starts on localhost:11434
ollama pull qwen3-coder:30b

# For maximum local quality (slower, ~12-18 tok/s):
ollama pull llama3.1:70b-instruct-q6_K

# Run as OpenAI-compatible API (for tool integration)
# Ollama already serves at http://localhost:11434/v1/chat/completions
```

### Windows PC (Secondary / Parallel)

```powershell
# Install Ollama for Windows
# Download from ollama.com

# Start Ollama
ollama serve  # starts on localhost:11434

# Pull models that fit in 8GB VRAM
ollama pull qwen3-coder:30b          # MoE, 3.3B active, fits in 8GB
ollama pull qwen2.5-coder:7b         # Dense, for fast autocomplete
ollama pull gpt-oss:20b              # OpenAI's open model, 3.6B active

# Run as OpenAI-compatible API
# Same endpoint: http://localhost:11434/v1/chat/completions
```

### Both Machines Running Together

```
Mac Studio (ollama on :11434)        Windows PC (ollama on :11434)
├── Qwen3-Coder 30B                  ├── Qwen3-Coder 30B
├── Llama 3.1 70B (quality tasks)    ├── Qwen 2.5 Coder 7B (autocomplete)
└── Codestral 22B (prototyping)      └── GPT-OSS 20B (reasoning)

Both expose OpenAI-compatible APIs.
Tools like Aider, Continue.dev, and custom scripts
can hit either machine.
```

---

## Tool Integration

### Aider (Terminal AI Pair Programming — Cheapest Autonomous Coding)

```bash
# Install
pip install aider-chat

# Use with local Ollama (FREE)
aider --model ollama/qwen3-coder:30b

# Use with DeepSeek API (CHEAPEST cloud, ~$0.03/M input)
export DEEPSEEK_API_KEY=your_key
aider --model deepseek/deepseek-coder

# Use with Claude (from subscription)
export ANTHROPIC_API_KEY=your_key
aider --model claude-3-5-sonnet-20241022  # or latest

# Aider handles: git commits, multi-file edits, test running
# Best for: implementation worker role
```

### Continue.dev (VS Code Autocomplete + Chat)

```json
// .continue/config.json
{
  "models": [
    {
      "title": "Qwen3 Coder 30B (Local)",
      "provider": "ollama",
      "model": "qwen3-coder:30b",
      "apiBase": "http://localhost:11434"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Qwen 2.5 Coder 7B (Local Fast)",
    "provider": "ollama",
    "model": "qwen2.5-coder:7b",
    "apiBase": "http://localhost:11434"
  }
}
```

### Claude Code (Orchestrator — Uses Subscription)

Claude Code uses your Anthropic subscription. Use it for:
- Orchestrating sub-agents
- Multi-file integration
- Review coordination
- Anything needing tool use (file edits, git, etc.)

Configure to use Haiku by default, Sonnet when needed:
```bash
# In Claude Code, use /model to switch
# Default to cheapest: haiku
# Switch to sonnet for complex tasks
# Use opus only for architecture decisions
```

### Codex (Fire-and-Forget — Uses OpenAI Subscription)

Codex uses your OpenAI Pro subscription. Use it for:
- Scoped backend tasks with pre-written tests
- Background processing while you do other things
- Each task runs in isolated sandbox

### Custom Script: Model Router

```python
#!/usr/bin/env python3
"""
Route coding tasks to the cheapest capable model.
"""

import os
import httpx

OLLAMA_URL = "http://localhost:11434/v1/chat/completions"
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

def route_task(task_type: str, complexity: str) -> dict:
    """Return model config for a task."""

    # Tier 0: Local (free)
    if task_type in ("spec_draft", "test_write", "boilerplate",
                     "simple_impl", "doc_gen", "review_first_pass"):
        return {
            "url": OLLAMA_URL,
            "model": "qwen3-coder:30b",
            "cost_tier": 0,
        }

    # Tier 1: Budget cloud
    if task_type in ("complex_impl", "security_review_first",
                     "long_context", "second_opinion"):
        return {
            "url": DEEPSEEK_URL,
            "model": "deepseek-coder",
            "headers": {"Authorization": f"Bearer {os.environ['DEEPSEEK_API_KEY']}"},
            "cost_tier": 1,
        }

    # Tier 2: Subscription (handled by Claude Code / Codex directly)
    if task_type in ("orchestrate", "heal", "multi_file", "frontend"):
        return {
            "tool": "claude-code",  # or "codex"
            "model": "haiku",       # default cheap
            "cost_tier": 2,
        }

    # Tier 3: Premium (rare)
    if task_type in ("architecture", "security_critical", "algorithm_design"):
        return {
            "tool": "claude-code",
            "model": "opus",
            "cost_tier": 3,
        }

    # Default: local
    return {"url": OLLAMA_URL, "model": "qwen3-coder:30b", "cost_tier": 0}
```

---

## Estimated Monthly Cost

### Before Optimization (Using Premium Models for Everything)

| Activity | Model | Est. Tokens/Month | Cost |
|----------|-------|-------------------|------|
| All coding tasks | Opus 4.6 | 50M | ~$750 (API) or rate-limited |
| All reviews | Sonnet 4.5 | 20M | ~$180 (API) or rate-limited |
| Codex tasks | GPT-5 | 30M | ~$600 (API) or rate-limited |
| **Total** | | | **Hitting rate limits constantly** |

### After Optimization (Tiered Routing)

| Activity | Model (Tier) | Est. Tokens/Month | Marginal Cost |
|----------|-------------|-------------------|---------------|
| Spec drafting | Local Qwen3 (T0) | 5M | ~$0 |
| Test writing | Local Qwen3 (T0) | 8M | ~$0 |
| Simple implementation | Local Qwen3 (T0) | 15M | ~$0 |
| First-pass review | Local Qwen3 (T0) | 10M | ~$0 |
| Complex implementation | DeepSeek API (T1) | 5M | ~$2 |
| Security review | DeepSeek API (T1) | 2M | ~$1 |
| Second opinions | OpenRouter free (T1) | 3M | ~$0 |
| Orchestration | Haiku subscription (T2) | 5M | $0 (included) |
| Healing / CI fixes | Haiku subscription (T2) | 3M | $0 (included) |
| Multi-file integration | Sonnet subscription (T2) | 3M | $0 (included) |
| Codex background tasks | OpenAI Pro (T2) | 5M | $0 (included) |
| Architecture decisions | Opus subscription (T3) | 1M | $0 (included) |
| **Total marginal cost** | | **65M tokens** | **~$3-5/mo** |

Plus your existing subscriptions (~$100/mo). But now you're using those
subscriptions efficiently instead of burning through rate limits.

---

## Daily Workflow (Cost-Optimized)

```
MORNING (~5 min human time)
│
├── You: Write 2-3 sentence direction
│
├── Mac (local): Spec Drafter (Qwen3-Coder 30B) → spec draft
│   └── FREE
│
├── Mac (local): Test Writer (Qwen3-Coder 30B) → test files
│   └── FREE
│
└── Mac (local): First-pass review of spec + tests
    └── FREE

WHILE YOU'RE AWAY (0 human time)
│
├── Mac (local): Implementation Worker (Qwen3-Coder 30B)
│   ├── Reads spec + tests, writes code
│   ├── Runs tests locally
│   ├── If tests fail after 2 tries → escalates to DeepSeek API ($0.03/M)
│   └── Creates branch + PR
│
├── Win (parallel): Second implementation or review task
│   └── FREE
│
├── Claude Code (Haiku): Orchestrator checks progress
│   └── Subscription (included)
│
├── DeepSeek API: Security review of the diff
│   └── ~$0.50 per review
│
└── Mac (local): Correctness + spec compliance review
    └── FREE

EVENING (~10 min human time)
│
├── You: Read Review Panel summaries (2 min each)
├── You: Approve/reject merges
├── You: Respond to any decision gates
│
└── Opus 4.6 (ONLY if needed): Complex debugging or architecture
    └── Save rate-limited quota for this
```

---

## Key Insight: Your Mac Studio IS the AI Server

With 128GB unified RAM and Qwen3-Coder 30B running at 68-100+ tok/s
via MLX, your Mac Studio is faster than streaming from most cloud APIs.

```
Local Qwen3-Coder 30B on Mac: 68-100+ tok/s, FREE
Cloud Claude Haiku 4.5:       ~50-70 tok/s, $1-5/M tokens
Cloud GPT-4o Mini:            ~40-60 tok/s, $0.15-0.60/M tokens
```

The Mac is literally faster AND free. The only reason to use cloud models
is when the task needs more capability (Opus/GPT-5 quality) or more
context (>32K tokens) than the local model can handle well.

Your Windows PC is the second worker — handling parallel tasks, autocomplete,
and lighter workloads while the Mac handles the heavy lifting.

---

## What This Means for the Agent Council

| Agent | Runs On | Model | Cost |
|-------|---------|-------|------|
| Spec Drafter | Mac (local) | Qwen3-Coder 30B | Free |
| Test Writer | Mac (local) | Qwen3-Coder 30B | Free |
| Impl Worker #1 | Mac (local) | Qwen3-Coder 30B | Free |
| Impl Worker #2 | Windows (local) | Qwen3-Coder 30B | Free |
| Correctness Reviewer | Mac (local) | Qwen3-Coder 30B | Free |
| Security Reviewer | Cloud | DeepSeek V3.2 API | ~$0.50/review |
| Spec Compliance | Windows (local) | Qwen3-Coder 30B | Free |
| Healer | Cloud | Haiku 4.5 (subscription) | Included |
| Orchestrator | Cloud | Haiku 4.5 (subscription) | Included |
| Architect (rare) | Cloud | Opus 4.6 (subscription) | Included (rate-limited) |

**~85% of agent work runs on your own hardware for free.**

The cloud subscriptions you're already paying for handle orchestration,
healing, and the rare premium tasks. DeepSeek API at $0.03/M tokens
handles the security review and complex escalations for pennies.
