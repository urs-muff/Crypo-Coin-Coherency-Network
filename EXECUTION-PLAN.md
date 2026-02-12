# Execution Plan: Open Source Contribution Intelligence ("Coherence")

## Tool Assignment Strategy

You have three AI coding tools. Each has distinct strengths. Here's how to deploy them:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOOL DEPLOYMENT MAP                              │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                      │
│  CLAUDE CODE │  Orchestrator & Architect                            │
│  (Terminal)  │  • Spec writing, YAML definitions, planning          │
│              │  • Complex multi-file refactors                      │
│              │  • Database schema design, migrations                │
│              │  • CI/CD pipeline setup                              │
│              │  • Code review and integration                       │
│              │  • Git operations, PR creation                       │
│              │  • Background tasks: indexing scripts, data pipeline  │
│              │                                                      │
├──────────────┼──────────────────────────────────────────────────────┤
│              │                                                      │
│  CODEX       │  Autonomous Background Builder                       │
│  (Background)│  • Bulk feature implementation from specs            │
│              │  • Test generation (unit + integration)              │
│              │  • API endpoint scaffolding from OpenAPI spec        │
│              │  • Data model boilerplate                            │
│              │  • Documentation generation                          │
│              │  • Repetitive CRUD operations                        │
│              │  • Run as background tasks, review output async      │
│              │                                                      │
├──────────────┼──────────────────────────────────────────────────────┤
│              │                                                      │
│  CURSOR PRO+ │  Interactive UI Builder                              │
│  (IDE)       │  • UI component development (visual feedback)        │
│              │  • Frontend iteration with hot reload                │
│              │  • Graph visualization tuning                        │
│              │  • CSS/layout/responsive design                      │
│              │  • Quick fixes and inline edits                      │
│              │  • Debugging with breakpoints                        │
│              │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

### Orchestration Pattern

```
YOU (Human)
 │
 ├── Review Linear board each morning (~5 min)
 ├── Approve/reject major decisions when flagged
 ├── Weekly 30-min review of progress + direction
 │
 ▼
LINEAR (Tracking)
 │
 ├── Backlog: All planned work as issues
 ├── Sprint: Current 1-week sprint (6-8 issues)
 ├── In Progress: What AI agents are working on now
 ├── Review: Completed work awaiting your approval
 └── Done: Approved and merged
 │
 ▼
AI AGENTS (Execution)
 │
 ├── Claude Code → creates branches, writes specs, integrates
 ├── Codex → picks up issues, implements in background, creates PRs
 └── Cursor → UI polish, visualization, interactive development
```

---

## Tech Stack Decision

### What Changes from the Existing Repo

| Layer | Current | New | Why |
|-------|---------|-----|-----|
| Frontend framework | CRA (Create React App) | **Next.js 16** | SSR for public pages, API routes for BFF, better DX |
| UI components | Raw Tailwind | **shadcn/ui + Base UI** | Professional look instantly, code ownership |
| State/data | React Query 3 | **TanStack Query 5** | Current version, better caching |
| Graph visualization | react-force-graph | **React Flow + react-force-graph** | React Flow for interactive editing, force-graph for exploration |
| Backend | None (calls localhost:9090) | **FastAPI (Python)** | Fastest iteration, auto OpenAPI docs, Python data ecosystem |
| Database | None | **Neo4j AuraDB** (graph) + **PostgreSQL** (relational) | Neo4j for dependency traversals, Postgres for users/billing/events |
| Data bootstrap | None | **deps.dev API + Libraries.io dataset** | 100M+ dependency edges on day one |
| Tracking | None | **Linear** | Agent API, MCP support, GitHub integration |
| CI/CD | None | **GitHub Actions** | Standard, free for public repos |
| Deployment | None | **Vercel** (frontend) + **Railway** (API + DBs) | Zero-config deploy, generous free tiers |

### Why Python/FastAPI Instead of C#/.NET

The architecture spec calls for C#/.NET with Orleans. That's the right long-term architecture for the full Coherence Network platform. But for the **first use case** (OSS Contribution Intelligence), we need speed:

- FastAPI ships a working API in hours, not days
- Python has the best libraries for graph analysis (NetworkX, igraph)
- Python is the language of AI/ML (all agent frameworks: LangChain, CrewAI, etc.)
- deps.dev has Python client libraries
- FastAPI auto-generates OpenAPI docs → instant Codex-readable specs
- We can always rewrite hot paths in C# later when scale demands it

**This is a deliberate "make it work, then make it right" decision.** The concept model and spec format remain the same — only the runtime changes.

---

## Project Structure

```
Crypo-Coin-Coherency-Network/
│
├── docs/                              # All planning & spec documents
│   ├── concepts/                      # Concept definitions (moved from /concepts)
│   ├── FRAMEWORK-architecture-spec.md
│   ├── FIRST-USE-CASE-analysis.md
│   └── EXECUTION-PLAN.md             # This document
│
├── api/                               # FastAPI backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry
│   │   ├── config.py                 # Settings (env vars)
│   │   ├── models/                   # Pydantic models
│   │   │   ├── project.py            # OSS Project model
│   │   │   ├── contributor.py        # Contributor model
│   │   │   ├── dependency.py         # Dependency model
│   │   │   └── coherence.py          # Coherence score model
│   │   ├── routers/                  # API route handlers
│   │   │   ├── projects.py           # /api/projects
│   │   │   ├── contributors.py       # /api/contributors
│   │   │   ├── dependencies.py       # /api/dependencies
│   │   │   ├── coherence.py          # /api/coherence
│   │   │   └── search.py             # /api/search
│   │   ├── services/                 # Business logic
│   │   │   ├── graph.py              # Neo4j graph operations
│   │   │   ├── coherence_calculator.py
│   │   │   ├── indexer.py            # Package registry indexer
│   │   │   └── github_client.py      # GitHub API integration
│   │   ├── agents/                   # AI agent definitions
│   │   │   ├── indexer_agent.py
│   │   │   ├── health_agent.py
│   │   │   └── risk_agent.py
│   │   └── db/                       # Database connections
│   │       ├── neo4j.py              # Neo4j driver
│   │       └── postgres.py           # SQLAlchemy/Postgres
│   ├── tests/
│   │   ├── test_projects.py
│   │   ├── test_coherence.py
│   │   └── test_graph.py
│   ├── pyproject.toml                # Python dependencies
│   ├── Dockerfile
│   └── .env.example
│
├── web/                               # Next.js frontend (replaces crypto-coin-coherency-app)
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Landing / Dashboard
│   │   │   ├── explore/
│   │   │   │   └── page.tsx          # Dependency graph explorer
│   │   │   ├── project/
│   │   │   │   └── [ecosystem]/
│   │   │   │       └── [name]/
│   │   │   │           └── page.tsx  # Project detail page
│   │   │   ├── stack/
│   │   │   │   └── page.tsx          # "Import Your Stack" page
│   │   │   └── api/                  # BFF routes (proxy to FastAPI)
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── graph/                # Graph visualization components
│   │   │   ├── project/              # Project-specific components
│   │   │   └── layout/               # Layout components
│   │   ├── lib/                      # Utilities
│   │   │   ├── api-client.ts         # Typed API client (generated from OpenAPI)
│   │   │   └── utils.ts
│   │   └── hooks/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── components.json               # shadcn/ui config
│   └── Dockerfile
│
├── scripts/                           # Data pipeline & utilities
│   ├── bootstrap_graph.py            # Load Libraries.io + deps.dev data
│   ├── index_ecosystem.py            # Index a package ecosystem
│   └── compute_coherence.py          # Batch coherence score computation
│
├── .github/
│   ├── workflows/
│   │   ├── api-ci.yml                # API tests + lint
│   │   ├── web-ci.yml                # Frontend build + lint
│   │   └── deploy.yml                # Deploy to Railway + Vercel
│   └── ISSUE_TEMPLATE/
│       ├── feature.md
│       └── bug.md
│
├── docker-compose.yml                 # Local dev: API + Neo4j + Postgres
├── CLAUDE.md                          # Claude Code project config
├── CONTRIBUTING.md
├── README.md
└── LICENSE
```

---

## Sprint Plan: Weeks 1-8

### Principles
- **API-first**: Every feature starts as an API endpoint, UI follows
- **Deploy on day 1**: CI/CD and deployment before features
- **Test as you go**: Every endpoint has at least one integration test
- **Weekly demos**: Working software visible to potential contributors each Friday
- **Decision gates**: Major decisions flagged in Linear, you approve async

---

### Sprint 0: Foundation (Days 1-3)
**Goal: Deployable skeleton with CI/CD. Zero features, full pipeline.**

| Task | Tool | Time | Dependency |
|------|------|------|------------|
| Set up Linear workspace + project | You (manual) | 30 min | — |
| Create `CLAUDE.md` project config | Claude Code | 10 min | — |
| Scaffold FastAPI project (`api/`) | Claude Code | 30 min | — |
| Scaffold Next.js project (`web/`) | Codex (background) | 30 min | — |
| Write `docker-compose.yml` (Neo4j + Postgres + API) | Claude Code | 20 min | API scaffold |
| Set up GitHub Actions CI (lint + test) | Claude Code | 30 min | Both scaffolds |
| Deploy API to Railway (empty) | Claude Code | 20 min | CI passing |
| Deploy web to Vercel (empty) | Claude Code | 15 min | CI passing |
| Install shadcn/ui + base components | Cursor | 30 min | Web scaffold |
| Create landing page shell | Cursor | 1 hr | shadcn/ui |
| Write OpenAPI spec for v0.1 | Claude Code | 1 hr | — |

**Exit criteria:** `git push` triggers CI, deploys to staging. Landing page is live. API returns `{"status": "ok"}` at `/health`.

**Decision gate:** None. This is infrastructure.

---

### Sprint 1: The Graph (Week 1)
**Goal: Load real dependency data into Neo4j. API serves project + dependency queries.**

| Task | Tool | Time |
|------|------|------|
| Define Neo4j schema (node labels, relationship types, indexes) | Claude Code | 2 hr |
| Write `bootstrap_graph.py` — load Libraries.io dataset | Claude Code | 4 hr |
| Implement deps.dev API client | Codex (background) | 2 hr |
| Build Neo4j service layer (`services/graph.py`) | Claude Code | 3 hr |
| API: `GET /api/projects/{ecosystem}/{name}` | Codex (background) | 1 hr |
| API: `GET /api/projects/{ecosystem}/{name}/dependencies` | Codex (background) | 1 hr |
| API: `GET /api/projects/{ecosystem}/{name}/dependents` | Codex (background) | 1 hr |
| API: `GET /api/search?q=` (full-text search on project names) | Codex (background) | 1 hr |
| Integration tests for all endpoints | Codex (background) | 2 hr |
| Run bootstrap script — load top 5,000 npm packages | Claude Code | Background job |
| Generate TypeScript API client from OpenAPI spec | Claude Code | 30 min |

**Exit criteria:** API serves real dependency data for 5,000+ npm packages. Search works. Tests pass.

**Decision gate for you:** How many ecosystems to bootstrap initially? (Recommend: npm only for Week 1, add PyPI in Week 2)

---

### Sprint 2: Coherence Scores + Project Pages (Week 2)
**Goal: Every project has a coherence score. UI shows project detail pages.**

| Task | Tool | Time |
|------|------|------|
| Define coherence algorithm (weighted formula, inputs, normalization) | Claude Code | 3 hr |
| Implement GitHub API client (stars, contributors, activity) | Codex (background) | 2 hr |
| Build `coherence_calculator.py` service | Claude Code | 4 hr |
| API: `GET /api/projects/{eco}/{name}/coherence` | Claude Code | 1 hr |
| API: `GET /api/coherence/top?ecosystem=npm&limit=50` | Codex (background) | 1 hr |
| Batch compute coherence for all indexed projects | Claude Code | Background job |
| UI: Project detail page (score, deps, dependents, contributors) | Cursor | 6 hr |
| UI: Search page with filters (ecosystem, score range, language) | Cursor | 4 hr |
| UI: Coherence score visualization component (gauge + breakdown) | Cursor | 3 hr |
| Add PyPI ecosystem to indexer | Codex (background) | 2 hr |
| Index top 5,000 PyPI packages | Claude Code | Background job |

**Exit criteria:** Visit `/project/npm/react` and see a real coherence score with breakdown. Search works across npm + PyPI. UI is clean and professional.

**Decision gate for you:** Review coherence algorithm weights before batch computation. Review UI design before building more pages.

---

### Sprint 3: Import Your Stack + Risk View (Week 3)
**Goal: Users can upload package-lock.json and see their dependency health.**

| Task | Tool | Time |
|------|------|------|
| API: `POST /api/stack/analyze` (accepts package-lock.json, requirements.txt) | Claude Code | 4 hr |
| API: `GET /api/stack/{id}/risks` (sorted by severity) | Codex (background) | 2 hr |
| API: `GET /api/stack/{id}/summary` (aggregate coherence stats) | Codex (background) | 1 hr |
| Parser for package-lock.json, requirements.txt, Cargo.toml | Codex (background) | 3 hr |
| UI: "Import Your Stack" page (drag & drop upload) | Cursor | 4 hr |
| UI: Stack analysis results page (risk table, summary cards) | Cursor | 6 hr |
| UI: Dependency tree visualization (React Flow) | Cursor | 6 hr |
| Risk classification logic (critical/high/medium/low) | Claude Code | 2 hr |
| Email notification setup (Resend) for risk alerts | Codex (background) | 2 hr |
| Write contributor documentation | Claude Code | 2 hr |
| Create public roadmap page | Cursor | 2 hr |

**Exit criteria:** Drop a `package-lock.json` → see a full risk analysis with visual dependency tree. This is the "wow moment" for demos.

**Decision gate for you:** Review the risk classification thresholds. Decide whether to open-source the repo at this point.

---

### Sprint 4: Graph Explorer + Contributor Profiles (Week 4)
**Goal: Interactive full-graph exploration. Individual contributor pages.**

| Task | Tool | Time |
|------|------|------|
| API: `GET /api/graph/neighborhood?center={id}&depth=2` | Claude Code | 3 hr |
| API: `GET /api/contributors/{username}` | Codex (background) | 1 hr |
| API: `GET /api/contributors/{username}/projects` | Codex (background) | 1 hr |
| API: `GET /api/contributors/{username}/impact` (downstream reach) | Claude Code | 3 hr |
| GitHub contributor indexing (commit history, PR activity) | Claude Code | 4 hr |
| UI: Full interactive graph explorer (React Flow) | Cursor | 8 hr |
| UI: Contributor profile page | Cursor | 4 hr |
| UI: Landing page with live stats (projects indexed, avg coherence) | Cursor | 3 hr |
| Authentication (GitHub OAuth) | Claude Code | 3 hr |
| User accounts in PostgreSQL | Codex (background) | 2 hr |

**Exit criteria:** Users can explore the graph visually. Contributors can claim their profile via GitHub OAuth. Landing page shows real-time stats.

**Decision gate for you:** Review graph explorer UX. Decide on contributor profile features.

---

### Sprint 5: Polish, Performance, Launch Prep (Week 5-6)
**Goal: Production-ready. Public launch.**

| Task | Tool | Time |
|------|------|------|
| Performance optimization (Neo4j query caching, API response times) | Claude Code | 4 hr |
| Rate limiting + API key system | Codex (background) | 2 hr |
| Error handling + monitoring (Sentry) | Codex (background) | 2 hr |
| SEO: project pages are server-rendered with meta tags | Cursor | 3 hr |
| UI: Responsive design pass (mobile-friendly) | Cursor | 4 hr |
| UI: Dark mode | Cursor | 2 hr |
| Write README for open source launch | Claude Code | 2 hr |
| Create "good first issue" issues for contributors | Claude Code | 1 hr |
| Public API documentation page | Cursor | 3 hr |
| Index NuGet, crates.io, Go modules | Codex (background) | 4 hr |
| Load testing | Claude Code | 2 hr |
| Security audit (OWASP basics) | Claude Code | 2 hr |

**Exit criteria:** Site loads in <2s. API p99 <500ms. 5+ ecosystems indexed. Mobile works. Contributor docs are clear. 10+ "good first issues" ready.

**Decision gate for you:** Go/no-go for public launch. Review any security findings.

---

### Sprint 6-8: Growth Features (Weeks 6-8)
**Goal: Funding flows, AI agents, ecosystem effects.**

| Feature | Sprint | Tool |
|---------|--------|------|
| Funding flow prototype (Stripe Connect) | 6 | Claude Code |
| "Sponsor this dependency chain" button | 6 | Cursor |
| AI Risk Monitor agent (alerts on coherence drops) | 6 | Claude Code |
| CLI tool: `coherence analyze package-lock.json` | 7 | Codex |
| GitHub Action: coherence check in CI pipeline | 7 | Codex |
| Public API v1 with API keys and usage tracking | 7 | Claude Code |
| Embeddable coherence badges (like shields.io) | 7 | Codex |
| Ecosystem comparison dashboards | 8 | Cursor |
| Weekly email digest (your stack's health) | 8 | Codex |
| Community features (comments, suggestions on projects) | 8 | Cursor |

---

## Tracking System: Linear Setup

### Workspace Structure

```
Workspace: Coherence
│
├── Project: API
│   ├── Label: endpoint
│   ├── Label: service
│   ├── Label: database
│   └── Label: agent
│
├── Project: Web
│   ├── Label: page
│   ├── Label: component
│   ├── Label: visualization
│   └── Label: dx (developer experience)
│
├── Project: Data
│   ├── Label: indexer
│   ├── Label: pipeline
│   └── Label: bootstrap
│
└── Project: Infrastructure
    ├── Label: ci-cd
    ├── Label: deployment
    └── Label: monitoring
```

### Issue Template for AI Agents

When creating issues that Codex or Claude Code will pick up autonomously:

```markdown
## Context
[What this feature/fix is part of. Link to parent epic.]

## Requirements
- [ ] Specific requirement 1
- [ ] Specific requirement 2
- [ ] Specific requirement 3

## API Contract (if applicable)
- Endpoint: `GET /api/foo/{id}`
- Request: (describe params)
- Response: (paste example JSON)

## Files to Create/Modify
- `api/app/routers/foo.py` — new
- `api/app/services/foo.py` — new
- `api/tests/test_foo.py` — new

## Tests Required
- [ ] Happy path test
- [ ] Edge case: empty input
- [ ] Edge case: not found

## Acceptance Criteria
When this is done, `curl http://localhost:8000/api/foo/123`
should return a valid response with real data from Neo4j.

## Agent Notes
- Tool: Codex / Claude Code / Cursor
- Priority: P1
- Estimate: S / M / L
- Dependencies: [link to blocking issues]
```

### Decision Gate Protocol

Issues requiring your input get labeled `needs-decision` and assigned to you. Format:

```markdown
## Decision Needed: [Title]

**Context:** [1-2 sentences on what we're building]

**Options:**
1. **Option A** — [description, pros, cons]
2. **Option B** — [description, pros, cons]

**Recommendation:** Option [X] because [reason]

**Impact of delay:** [What blocks if this isn't decided within 24h]
```

You receive a Linear notification. Reply with a comment. Agent picks up your decision and continues.

---

## Autonomous Workflow: How It Runs Day-to-Day

### Morning (Automated)
1. Linear board refreshes with overnight Codex PR results
2. CI runs on all new PRs automatically
3. Any failing PRs get re-assigned to Claude Code for fix

### Your Daily Review (~10 min)
1. Open Linear → check "Review" column
2. Approve/request-changes on PRs that passed CI
3. Check "Needs Decision" label → make decisions via comments
4. Glance at burndown chart

### Continuous (Background)
```
┌──────────────────────────────────────────────────────────────┐
│                    CONTINUOUS LOOP                            │
│                                                              │
│  1. Codex picks up next issue from "Sprint" column           │
│  2. Creates branch: codex/ISSUE-ID-description               │
│  3. Implements feature + tests                               │
│  4. Creates PR linked to Linear issue                        │
│  5. CI runs (lint + test + build)                            │
│  6. If CI passes → moves to "Review" column                  │
│  7. If CI fails → Claude Code picks up, fixes, re-pushes     │
│  8. You approve → merge → deploy triggers automatically       │
│  9. Loop                                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Interactive Sessions (As Needed)
- Open Cursor for UI work — visual feedback loop
- Use Claude Code for architecture decisions, complex integrations
- Pair with Cursor on graph visualization tuning

---

## Contributor Onboarding (Week 3+)

### What Makes Contributors Want to Join

1. **The product is live and useful.** They can drop their `package-lock.json` and see value.
2. **The codebase is clean.** shadcn/ui components, typed API client, clear project structure.
3. **Issues are well-written.** Every "good first issue" has context, requirements, files to modify, and tests.
4. **The API is documented.** FastAPI auto-generates interactive docs at `/docs`.
5. **CI catches mistakes.** Contributors get fast feedback on PRs.

### Contributor Experience

```
Contributor finds project (HN, Twitter, GitHub Explore)
    │
    ▼
Lands on coherence.dev → sees professional UI, real data
    │
    ▼
Clicks "Contribute" → well-organized GitHub repo
    │
    ▼
Browses "good first issues" → clear specs, labeled by skill
    │
    ▼
Forks, implements, PRs → CI validates automatically
    │
    ▼
Review within 24h (Claude Code assists with review)
    │
    ▼
Merged → contributor shows up on coherence.dev contributor page
    │
    ▼
Gets hooked → picks up bigger issues
```

### Issue Labels for Contributors

| Label | Description |
|-------|-------------|
| `good first issue` | <30 min, well-scoped, clear instructions |
| `help wanted` | Larger task, contributor-friendly |
| `api` | Backend work (Python/FastAPI) |
| `frontend` | UI work (Next.js/React) |
| `data` | Graph/indexing/pipeline work |
| `docs` | Documentation improvements |
| `design` | UI/UX design suggestions welcome |

---

## Key Metrics to Track

### Product Metrics (Weekly)
| Metric | Target (Week 4) | Target (Week 8) |
|--------|-----------------|-----------------|
| Projects indexed | 10,000 | 100,000+ |
| Ecosystems covered | 2 (npm, PyPI) | 5+ |
| Unique visitors/week | 500 | 5,000 |
| Stack analyses performed | 50 | 500 |
| API requests/day | 1,000 | 10,000 |

### Engineering Metrics (Weekly)
| Metric | Target |
|--------|--------|
| CI pass rate | >95% |
| API p99 latency | <500ms |
| Test coverage | >70% |
| Open PRs age | <48h |
| Issues closed/week | 15+ |

### Community Metrics (After Launch)
| Metric | Target (Week 8) |
|--------|-----------------|
| GitHub stars | 500+ |
| Contributors | 10+ |
| Open "good first issues" | Always 10+ available |
| PR review time | <24h |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Neo4j AuraDB free tier insufficient | Medium | High | Start free, migrate to self-hosted Neo4j on Railway if needed |
| GitHub API rate limits block indexing | High | Medium | Use deps.dev as primary source (no rate limits). GitHub for supplementary data only. Use ETags. |
| Next.js migration takes too long | Medium | Medium | Keep existing CRA app as fallback. New app can start minimal. |
| Coherence algorithm is wrong/gameable | High | Medium | Ship v1 as "beta", iterate based on community feedback. Make weights adjustable. |
| Codex output quality inconsistent | Medium | Low | All Codex PRs go through CI + Claude Code review. Never auto-merge. |
| Scope creep into funding flows too early | Medium | High | Strict sprint discipline. Funding is Sprint 6+, not before. |

---

## Decision Log

Track every major decision here. Start with:

| # | Date | Decision | Options Considered | Rationale | Decided By |
|---|------|----------|--------------------|-----------|------------|
| 1 | TBD | Tech stack: FastAPI + Next.js + Neo4j | C#/.NET (spec), Node/Express, Go | Speed to market. Python data ecosystem. Can rewrite later. | — |
| 2 | TBD | Start with npm ecosystem only | All ecosystems, npm+PyPI | Fastest bootstrap. Largest ecosystem. Add PyPI in Week 2. | — |
| 3 | TBD | Linear for tracking | GitHub Projects, Notion, Jira | Agent API, MCP support, GitHub integration | — |
| 4 | TBD | Deploy: Vercel + Railway | AWS, GCP, Fly.io | Simplest. Generous free tiers. Zero config. | — |

---

## What Needs Your Decision Now

Before Sprint 0 starts, I need you to decide:

### Decision 1: Tech Stack Approval
**Recommendation:** FastAPI (Python) + Next.js + Neo4j + PostgreSQL
**Alternative:** Stick with C#/.NET per architecture spec (slower start, better long-term)
**Impact:** Determines everything that follows.

### Decision 2: Tracking Tool
**Recommendation:** Linear (best agent integration)
**Alternative:** GitHub Projects (simpler, already in GitHub)
**Impact:** How autonomous work gets tracked and reviewed.

### Decision 3: Open Source Timing
**Option A:** Open source from Day 1 (build in public)
**Option B:** Open source at Week 3 (after "Import Your Stack" works)
**Option C:** Open source at Week 5 (after polish)
**Recommendation:** Option B — enough to impress, early enough to build community.

### Decision 4: Domain / Brand
Do you want to register a domain (e.g., `coherence.dev`, `getcoherence.dev`) before launch?
This affects deployment config and contributor messaging.
