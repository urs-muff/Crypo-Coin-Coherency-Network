# Spec-Driven Development Plan (Revised)

## What the Research Actually Says

Before planning anything, here's what the data shows about AI coding agents in February 2026:

| Reality | Data Point |
|---------|-----------|
| Well-scoped tasks with specs + tests | ~80% success rate |
| Vague "build the whole thing" prompts | 41% code churn within 2 weeks |
| AI-generated code vulnerability rate | 45% |
| AI code quality deficit (unsupervised) | 40% |
| Fully delegatable tasks | 0-20% of total work |
| Context rot threshold | ~130K tokens (despite 200K advertised) |
| Terminal-Bench hard tasks | 16% accuracy |
| Claude Code's failure mode | Simplifies specs, swaps tests to match bad code |
| Codex's failure mode | No mid-task steering, struggles with React |
| Cursor's failure mode | Expensive, autonomous output often doesn't compile |

**Bottom line:** These tools are powerful accelerators, not autonomous replacements. The teams pulling ahead have strong testing, clear specs, and modular architecture — not the fanciest AI tool.

---

## The Spec-Driven Development Pattern That Works

```
                    THE RELIABLE LOOP

  ┌──────────────────────────────────────────┐
  │                                          │
  │   1. Human writes SPEC (what + why)      │
  │              ↓                           │
  │   2. Human writes TESTS (pass/fail)      │
  │              ↓                           │
  │   3. AI implements CODE (how)            │
  │              ↓                           │
  │   4. CI validates (tests + lint)         │
  │              ↓                           │
  │   5. Human reviews PR                    │
  │              ↓                           │
  │   6. Merge or AI fixes + re-run          │
  │                                          │
  └──────────────────────────────────────────┘

  Key insight: Steps 1-2 are human. Step 3 is AI.
  Steps 4-5 are automated + human. This is the
  only pattern that reliably produces working code.
```

### Why Test-First Is Non-Negotiable

Simon Willison: *"Having a robust test suite is like giving agents superpowers."*

Without tests, AI agents:
- Ship subtle bugs you don't catch until production
- "Fix" code by changing tests to match wrong behavior
- Generate plausible-looking code that silently fails

With tests, AI agents:
- Self-correct through red → green cycles
- Can be safely given larger tasks (test suite catches drift)
- Produce code you can trust enough to merge

---

## Revised Tool Deployment

### What Each Tool Should and Should NOT Do

```
┌─────────────────────────────────────────────────────────────────┐
│  CLAUDE CODE — Architect + Integrator                          │
│                                                                 │
│  DO:                                                            │
│  • Write specs (Markdown + YAML)                               │
│  • Write test skeletons (the contract)                         │
│  • Multi-file refactors (rename, extract, restructure)         │
│  • Database schema design + migrations                         │
│  • Git operations, PR creation, CI/CD setup                    │
│  • Code review of Codex/Cursor output                          │
│  • Fix failing CI on other agents' PRs                         │
│                                                                 │
│  DO NOT:                                                        │
│  • Run sessions longer than ~1 hour (context rot)              │
│  • Let it change tests to match wrong code (watch for this)    │
│  • Trust it for security-critical code without human review    │
│  • Ask it to "build the whole feature" in one shot             │
├─────────────────────────────────────────────────────────────────┤
│  CODEX — Async Task Worker                                     │
│                                                                 │
│  DO:                                                            │
│  • Implement single endpoints from spec + test skeleton        │
│  • Generate unit tests for existing code                       │
│  • Scoped refactors ("rename X to Y across these 5 files")    │
│  • Data pipeline scripts with clear input/output contracts     │
│  • Documentation generation from code                          │
│                                                                 │
│  DO NOT:                                                        │
│  • Frontend/React work (documented weakness)                   │
│  • Architecture decisions                                       │
│  • Tasks without test files to validate against                │
│  • Open-ended exploration ("figure out the best approach")     │
├─────────────────────────────────────────────────────────────────┤
│  CURSOR PRO+ — Interactive UI Development                      │
│                                                                 │
│  DO:                                                            │
│  • UI component development (visual hot-reload feedback)       │
│  • CSS/layout iteration with instant preview                   │
│  • Graph visualization tuning (React Flow, force-graph)        │
│  • Quick inline fixes you can see immediately                  │
│                                                                 │
│  DO NOT:                                                        │
│  • Background agent tasks (expensive, quality issues)          │
│  • Large autonomous features (output often doesn't compile)    │
│  • Use as a replacement for Claude Code on backend work        │
└─────────────────────────────────────────────────────────────────┘
```

### The Practical Workflow

```
YOU (Human) — ~30-60 min/day
│
├── Write specs for next 2-3 tasks (~15 min)
├── Write or approve test skeletons (~10 min)
├── Review PRs that passed CI (~15 min)
├── Make decisions on `needs-decision` issues (~5 min)
└── Optional: Cursor session for UI polish (~30 min)

CLAUDE CODE — Orchestrator
│
├── Reads spec + tests → implements → runs tests → creates PR
├── Reviews Codex PRs → fixes issues → re-pushes
├── Maintains CLAUDE.md and per-directory rules
└── Handles multi-file integrations

CODEX — Background Worker
│
├── Picks up scoped issues with spec + test files attached
├── Implements in sandbox → runs tests → creates PR
└── No human interaction during execution

CURSOR — Interactive UI (when you choose to open it)
│
├── You drive, Cursor assists
├── Component-by-component UI building
└── Visual verification loop
```

---

## Spec Format: What Actually Works

### The Spec Template

Every feature starts as a spec file. This is the contract that AI agents implement against.

```markdown
# Spec: [Feature Name]

## Purpose
[1-2 sentences: WHY this exists, what user problem it solves]

## Requirements
- [ ] Requirement 1 (specific, testable)
- [ ] Requirement 2 (specific, testable)
- [ ] Requirement 3 (specific, testable)

## API Contract (if applicable)
### `GET /api/projects/{ecosystem}/{name}`
Request:
- `ecosystem`: string (npm | pypi | nuget | crates | go)
- `name`: string (package name)

Response (200):
```json
{
  "ecosystem": "npm",
  "name": "react",
  "version": "19.1.0",
  "coherence_score": 0.87,
  "contributors_count": 42,
  "dependents_count": 98234,
  "last_release": "2026-01-15T00:00:00Z"
}
```

Response (404):
```json
{ "detail": "Project not found" }
```

## Data Model (if applicable)
```yaml
Project:
  properties:
    ecosystem: { type: string, enum: [npm, pypi, nuget, crates, go] }
    name: { type: string }
    coherence_score: { type: float, min: 0.0, max: 1.0 }
```

## Files to Create/Modify
- `api/app/routers/projects.py` — route handler
- `api/app/services/project_service.py` — business logic
- `api/app/models/project.py` — Pydantic model

## Acceptance Tests
See `api/tests/test_projects.py` — all tests must pass.

## Out of Scope
- [Explicitly list what this does NOT include]
```

### The Test Skeleton Template

Written by human (or Claude Code with human review) BEFORE implementation:

```python
# api/tests/test_projects.py
"""
Tests for the projects endpoint.
These tests define the contract. Implementation must make them pass.
"""
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_project_returns_project(client: AsyncClient, seeded_db):
    """GET /api/projects/npm/react returns project data."""
    response = await client.get("/api/projects/npm/react")
    assert response.status_code == 200
    data = response.json()
    assert data["ecosystem"] == "npm"
    assert data["name"] == "react"
    assert 0.0 <= data["coherence_score"] <= 1.0
    assert isinstance(data["dependents_count"], int)

@pytest.mark.asyncio
async def test_get_project_not_found(client: AsyncClient, seeded_db):
    """GET /api/projects/npm/nonexistent returns 404."""
    response = await client.get("/api/projects/npm/nonexistent-pkg-xyz")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_get_project_invalid_ecosystem(client: AsyncClient):
    """GET /api/projects/invalid/react returns 422."""
    response = await client.get("/api/projects/invalid/react")
    assert response.status_code == 422
```

### Per-Directory CLAUDE.md Files

```
api/
├── CLAUDE.md              # "This is a FastAPI app. Use Pydantic v2 models.
│                          #  All endpoints need tests in tests/. Run: pytest"
├── app/
│   ├── routers/
│   │   └── CLAUDE.md      # "Each router file handles one resource.
│   │                      #  Use dependency injection for services.
│   │                      #  Follow the pattern in projects.py"
│   └── services/
│       └── CLAUDE.md      # "Services contain business logic only.
│                          #  No HTTP concerns. No database imports.
│                          #  Accept and return Pydantic models."
web/
├── CLAUDE.md              # "Next.js 16 App Router. Use shadcn/ui components.
│                          #  Server Components by default. 'use client' only
│                          #  when needed. Run: npm test"
└── src/
    └── components/
        └── CLAUDE.md      # "Use shadcn/ui primitives. Follow the pattern
                           #  in existing components. No inline styles."
```

---

## Revised Project Structure

Aligned with what agents can maintain: small files, clear boundaries, test parity.

```
coherencycoin/
│
├── CLAUDE.md                          # Root project config
├── specs/                             # Human-written specs (the source of truth)
│   ├── 001-project-api.md
│   ├── 002-dependency-graph.md
│   ├── 003-coherence-algorithm.md
│   ├── 004-search.md
│   ├── 005-stack-analysis.md
│   └── ...
│
├── api/                               # FastAPI backend
│   ├── CLAUDE.md                      # API-specific agent rules
│   ├── pyproject.toml
│   ├── app/
│   │   ├── main.py                   # App entry (tiny — just mounts routers)
│   │   ├── config.py                 # Settings from env vars
│   │   ├── deps.py                   # Dependency injection (db sessions, etc.)
│   │   ├── models/                   # Pydantic models (one per resource)
│   │   │   ├── project.py            # < 50 lines
│   │   │   ├── contributor.py        # < 50 lines
│   │   │   ├── dependency.py         # < 50 lines
│   │   │   └── coherence.py          # < 50 lines
│   │   ├── routers/                  # Route handlers (one per resource)
│   │   │   ├── CLAUDE.md
│   │   │   ├── projects.py           # < 80 lines
│   │   │   ├── contributors.py
│   │   │   ├── dependencies.py
│   │   │   ├── coherence.py
│   │   │   └── search.py
│   │   └── services/                 # Business logic (one per domain)
│   │       ├── CLAUDE.md
│   │       ├── graph_service.py      # Neo4j queries
│   │       ├── coherence_service.py  # Score computation
│   │       ├── indexer_service.py    # Registry crawling
│   │       └── github_service.py     # GitHub API
│   └── tests/                        # 1:1 mirror of routers + services
│       ├── conftest.py               # Fixtures: test client, seeded DB
│       ├── test_projects.py          # Tests for projects router
│       ├── test_contributors.py
│       ├── test_coherence.py
│       └── test_graph_service.py
│
├── web/                               # Next.js frontend
│   ├── CLAUDE.md
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── explore/page.tsx      # Graph explorer
│   │   │   ├── project/[eco]/[name]/page.tsx
│   │   │   └── stack/page.tsx        # Import your stack
│   │   ├── components/
│   │   │   ├── CLAUDE.md
│   │   │   ├── ui/                   # shadcn/ui (auto-installed)
│   │   │   ├── coherence-gauge.tsx   # Score visualization
│   │   │   ├── dependency-tree.tsx   # React Flow tree
│   │   │   ├── project-card.tsx      # Project summary card
│   │   │   └── search-bar.tsx        # Global search
│   │   └── lib/
│   │       ├── api.ts                # API client (typed, from OpenAPI)
│   │       └── utils.ts
│   └── __tests__/                    # Component tests
│       ├── coherence-gauge.test.tsx
│       └── project-card.test.tsx
│
├── scripts/
│   ├── bootstrap_npm.py              # Load npm data from deps.dev
│   ├── bootstrap_pypi.py             # Load PyPI data
│   └── compute_coherence.py          # Batch score computation
│
├── docker-compose.yml                 # Neo4j + Postgres for local dev
├── .github/workflows/
│   ├── api-ci.yml                    # pytest + ruff on every PR
│   └── web-ci.yml                    # npm test + npm run lint on every PR
└── .gitignore
```

### File Size Guardrails

These aren't arbitrary — they match what AI agents can reliably read, understand, and modify:

| File Type | Max Lines | Why |
|-----------|-----------|-----|
| Pydantic models | ~50 | One model per file, no logic |
| Route handlers | ~80 | Thin — delegate to services |
| Service files | ~150 | Business logic, single responsibility |
| Test files | ~200 | Can be longer, tests are linear |
| React components | ~100 | One component per file |
| Utility files | ~80 | Small, focused helpers |

If a file exceeds these limits, it's a signal to split it. Add this to CLAUDE.md so agents know.

---

## Revised Sprint Plan (Grounded in Reality)

### What Changes from the Original Plan

| Original Assumption | Revised Reality |
|---------------------|-----------------|
| Codex runs autonomously in background | Codex runs on scoped tasks with tests pre-written |
| Cursor background agents for UI | Use Cursor interactively only (background agents too expensive + unreliable) |
| AI handles architecture decisions | Human makes all architecture decisions in specs |
| Trust AI-generated code | Every PR gets CI + human review |
| Long autonomous sessions | Break into <1 hour chunks, fresh context each time |
| AI writes tests from scratch reliably | Human writes test skeletons, AI fills implementation |

### Sprint 0: Skeleton + CI (Days 1-2)
**Human time: ~2 hours. AI time: ~4 hours.**

| Task | Who | How |
|------|-----|-----|
| Write `specs/001-project-api.md` | You | 20 min, define the first endpoint |
| Scaffold FastAPI project | Claude Code | From spec, with test fixtures |
| Scaffold Next.js project + shadcn/ui | Claude Code | Standard Next.js setup |
| Write `docker-compose.yml` | Claude Code | Neo4j + Postgres |
| Write GitHub Actions CI | Claude Code | pytest + ruff, npm test + eslint |
| Write test skeletons for first endpoint | Claude Code (you review) | Defines the contract |
| Deploy empty API + web | Claude Code | Vercel + Railway (or fly.io) |
| Set up GitHub Projects board | You | 15 min, columns: Spec → Test → Implement → Review → Done |

**Exit criteria:** `git push` → CI runs → green. `/health` returns 200. Landing page shows app name.

### Sprint 1: First Real Endpoint (Days 3-5)
**Human time: ~1 hour. AI time: ~6 hours.**

| Task | Who | How |
|------|-----|-----|
| Write `specs/002-dependency-graph.md` | You | Neo4j schema, first queries |
| Implement Neo4j connection + fixtures | Claude Code | Interactive, needs DB running |
| Implement `GET /api/projects/{eco}/{name}` | Codex | Has spec + test file, fire-and-forget |
| Implement `GET /api/projects/{eco}/{name}/dependencies` | Codex | Same pattern |
| Write `bootstrap_npm.py` (deps.dev → Neo4j) | Claude Code | Complex, needs iteration |
| Load top 1,000 npm packages | Claude Code | Run script, verify data |
| Review Codex PRs | Claude Code + you | Fix any issues, merge |

**Exit criteria:** `curl /api/projects/npm/react` returns real data. Tests pass. 1,000+ packages in graph.

### Sprint 2: Coherence Scores + First UI (Week 2)
**Human time: ~2 hours. AI time: ~8 hours.**

| Task | Who | How |
|------|-----|-----|
| Write `specs/003-coherence-algorithm.md` | You | Define weights, formula, inputs |
| Write coherence test cases (known inputs → expected outputs) | You + Claude Code | Critical — this IS the product |
| Implement coherence service | Codex | Has spec + tests |
| Implement `GET /api/projects/{eco}/{name}/coherence` | Codex | Endpoint + service |
| Batch compute coherence for indexed projects | Claude Code | Background script |
| UI: Project detail page | Cursor (interactive) | You drive, see results live |
| UI: Search bar + results | Cursor (interactive) | Same session |
| UI: Coherence score gauge component | Cursor (interactive) | Visual, needs hot reload |

**Exit criteria:** Visit `/project/npm/react` in browser → see real coherence score with breakdown. Search works.

**Decision gate:** Review coherence algorithm weights before batch computation.

### Sprint 3: The "Wow Moment" — Import Your Stack (Week 3)
**Human time: ~2 hours. AI time: ~8 hours.**

| Task | Who | How |
|------|-----|-----|
| Write `specs/005-stack-analysis.md` | You | Upload flow, risk classification |
| Write test cases for stack parser | Claude Code | package-lock.json → parsed deps |
| Implement stack parser (package-lock.json) | Codex | Well-scoped, has tests |
| Implement stack parser (requirements.txt) | Codex | Same pattern, parallel task |
| Implement `POST /api/stack/analyze` | Claude Code | Complex endpoint, needs iteration |
| UI: Drag-and-drop upload page | Cursor (interactive) | Visual feedback critical |
| UI: Stack analysis results + risk table | Cursor (interactive) | Data table + cards |
| UI: Dependency tree visualization (React Flow) | Cursor (interactive) | Most complex UI component |
| Write CONTRIBUTING.md | Claude Code | For external contributors |
| Create 10 "good first issue" GitHub issues | Claude Code | With spec + test references |

**Exit criteria:** Drop a `package-lock.json` → see risk analysis with dependency tree. This is the demo for attracting contributors.

**Decision gate:** Go/no-go on opening the repo to contributors.

### Sprints 4-6: Expand + Polish (Weeks 4-6)

| Week | Focus | Key Deliverables |
|------|-------|-----------------|
| 4 | Graph explorer + contributor profiles | Interactive graph viz, GitHub OAuth, user accounts |
| 5 | Multi-ecosystem + performance | PyPI, NuGet indexing. Caching. API <500ms p99 |
| 6 | Public launch prep | SEO, responsive design, dark mode, README, API docs |

### Sprints 7-8: Growth (Weeks 7-8)

| Week | Focus | Key Deliverables |
|------|-------|-----|
| 7 | Developer tools | CLI (`coherence analyze`), GitHub Action, embeddable badges |
| 8 | Funding prototype | Stripe Connect, "sponsor this dependency chain" |

---

## GitHub Projects Setup

### Board Columns (Workflow)

```
Spec → Test → Implement → CI → Review → Done
 │       │        │         │      │
 │       │        │         │      └── Human approves, merges
 │       │        │         └── Automated (GitHub Actions)
 │       │        └── AI agent (Codex or Claude Code)
 │       └── Human writes test skeleton (or Claude Code, human reviews)
 └── Human writes spec
```

### Labels

| Label | Meaning |
|-------|---------|
| `spec-ready` | Spec written, ready for test writing |
| `test-ready` | Tests written, ready for AI implementation |
| `needs-decision` | Blocked on human decision |
| `claude-code` | Assigned to Claude Code |
| `codex` | Assigned to Codex |
| `cursor` | Needs interactive Cursor session |
| `good-first-issue` | External contributor friendly |
| `api` | Backend work |
| `web` | Frontend work |
| `data` | Pipeline/indexing work |

### Issue Template for AI Implementation

```markdown
## Spec
Link: `specs/00X-feature-name.md`

## Tests
File: `api/tests/test_feature.py` (already written, currently failing)

## Implementation Required
- [ ] `api/app/routers/feature.py` — create
- [ ] `api/app/services/feature_service.py` — create
- [ ] `api/app/models/feature.py` — create

## Done When
All tests in `test_feature.py` pass. `ruff check` clean. No other tests broken.
```

---

## Guardrails: Preventing Known AI Failure Modes

### 1. Test Swapping Prevention
Add to root `CLAUDE.md`:
```
NEVER modify test files when implementing features.
Tests are the contract. If tests fail, fix the implementation, not the tests.
If a test seems wrong, stop and flag it as `needs-decision`.
```

### 2. Simplification Prevention
Add to root `CLAUDE.md`:
```
Implement exactly what the spec says. Do not simplify, skip edge cases,
or substitute a "good enough" approach. If the spec is unclear, stop
and ask — do not guess.
```

### 3. Scope Creep Prevention
Add to root `CLAUDE.md`:
```
Only modify files listed in the issue. Do not refactor adjacent code,
add features not in the spec, or "improve" existing code. Stay in scope.
```

### 4. Security Gate
Add to root `CLAUDE.md`:
```
All code handling user input, authentication, or external API calls
must be flagged for human security review before merge.
Label the PR `security-review`.
```

### 5. Context Rot Prevention
Practical rules:
- Start fresh Claude Code sessions for each task (don't continue stale sessions)
- Keep each Codex task to one endpoint or one service file
- If a session exceeds ~45 minutes, stop and start fresh

---

## What This Approach Costs You

### Human Time Budget

| Activity | Daily | Weekly |
|----------|-------|--------|
| Write specs (1-2 per day) | 20 min | 1.5 hr |
| Review/approve test skeletons | 10 min | 1 hr |
| Review PRs (AI-generated) | 15 min | 1.5 hr |
| Decision gate responses | 5 min | 30 min |
| Cursor UI sessions (optional) | 30 min | 2.5 hr |
| **Total** | **~1 hr** | **~7 hr** |

### AI Token/Cost Budget (Estimated)

| Tool | Usage | Est. Monthly Cost |
|------|-------|-------------------|
| Claude Code (Opus) | 2-3 hours active/day | Anthropic subscription |
| Codex | 5-10 background tasks/day | OpenAI subscription |
| Cursor Pro+ | 3-4 interactive sessions/week | Cursor Pro+ subscription |
| Neo4j AuraDB Free | Dev instance | $0 |
| Railway (API + Postgres) | Dev tier | $5-20/mo |
| Vercel (Web) | Hobby tier | $0 |
| **Total infrastructure** | | **$5-20/mo** |

---

## Domain and Branding

- **Domain:** `coherencycoin.com` (registered, use now)
- **Future:** `coherence.dev` (register when there's traction)
- **Product name:** Coherency Coin (keep as-is, rebrand later if needed)
- **Repo name:** Keep current `Crypo-Coin-Coherency-Network`
- **API base URL:** `https://api.coherencycoin.com` (or subdomain)
- **Web URL:** `https://coherencycoin.com`

---

## Success Criteria by Week

| Week | You Can Demo | Confidence Level |
|------|-------------|-----------------|
| 1 | API returns real npm dependency data | High (data pipeline + simple endpoints) |
| 2 | Project pages with coherence scores in browser | High (proven patterns) |
| 3 | "Import Your Stack" — full risk analysis from package-lock.json | Medium-High (most complex feature) |
| 4 | Interactive graph explorer + contributor profiles | Medium (graph viz is finicky) |
| 6 | Public launch with 5 ecosystems indexed | Medium (depends on API rate limits) |
| 8 | Funding flow prototype + CLI tool | Medium-Low (Stripe integration complexity) |
