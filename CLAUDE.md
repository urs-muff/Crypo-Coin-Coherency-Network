# Coherency Coin — Open Source Contribution Intelligence

## Project Overview
A platform that maps the open source ecosystem as a coherence graph, computes project health scores, and enables fair funding flows from companies to maintainers.

## Architecture
- **API**: FastAPI (Python) in `api/` — serves all data via REST endpoints
- **Web**: Next.js 16 + shadcn/ui in `web/` — SSR frontend with Tailwind CSS
- **Graph DB**: Neo4j — stores dependency graph (projects, contributors, dependencies)
- **Relational DB**: PostgreSQL — stores users, sessions, billing, events
- **Data Sources**: deps.dev API, Libraries.io dataset, GitHub API, npm/PyPI registries

## Directory Structure
```
api/          — FastAPI backend (Python 3.12+)
web/          — Next.js frontend (TypeScript)
scripts/      — Data pipeline scripts (bootstrap, index, compute)
specs/        — Feature specs (source of truth for AI implementation)
.github/      — CI/CD workflows
```

## Development Commands
```bash
# Start everything locally
docker compose up

# API only
cd api && uvicorn app.main:app --reload --port 8000

# Web only
cd web && npm run dev

# Run API tests
cd api && pytest

# Run web tests
cd web && npm test

# Lint
cd api && ruff check .
cd web && npm run lint
```

## Spec-Driven Development Workflow
Every feature follows this sequence: Spec -> Test -> Implement -> CI -> Review -> Merge.
- Specs live in `specs/` as numbered Markdown files
- Tests are written BEFORE implementation (they define the contract)
- AI agents implement against the spec + tests
- CI validates automatically
- Human reviews every PR before merge

## Key Conventions
- API endpoints follow REST: `/api/{resource}/{id}/{sub-resource}`
- All API responses use Pydantic models (type-safe, auto-documented)
- Frontend API client is auto-generated from OpenAPI spec
- Neo4j node labels: `Project`, `Contributor`, `Organization`
- Neo4j relationship types: `DEPENDS_ON`, `MAINTAINED_BY`, `CONTRIBUTES_TO`, `FUNDED_BY`
- Coherence scores are 0.0-1.0 floats, computed from weighted inputs
- All dates in ISO 8601 UTC

## File Size Limits
Keep files small so AI agents can reliably read, understand, and modify them:
- Pydantic models: ~50 lines (one model per file)
- Route handlers: ~80 lines (thin — delegate to services)
- Service files: ~150 lines (single responsibility)
- Test files: ~200 lines
- React components: ~100 lines (one component per file)
- If a file exceeds these limits, split it.

## Branch Strategy
- `main` — production, protected
- `claude/*` — Claude Code working branches
- `codex/*` — OpenAI Codex working branches
- Feature branches: `feat/description`
- Bug fixes: `fix/description`

## Testing Requirements
- Every API endpoint needs at least one integration test
- Use `pytest` with `httpx.AsyncClient` for API tests
- Frontend: React Testing Library for components
- CI must pass before merge

## Agent Guardrails

### Do NOT modify test files when implementing features.
Tests are the contract. If tests fail, fix the implementation, not the tests.
If a test seems wrong, stop and create an issue labeled `needs-decision`.

### Implement exactly what the spec says.
Do not simplify, skip edge cases, or substitute a "good enough" approach.
If the spec is unclear, stop and ask — do not guess.

### Only modify files listed in the issue.
Do not refactor adjacent code, add features not in the spec, or "improve"
existing code. Stay in scope.

### Flag security-sensitive code.
All code handling user input, authentication, or external API calls must be
labeled `security-review` on the PR for human review.

### Start fresh sessions for each task.
Do not continue stale sessions. Context rot degrades output quality after
~45 minutes. Start a new session for each issue.

## Decision Gates
When encountering a major architectural decision, do NOT proceed autonomously. Instead:
1. Document the options in a GitHub issue
2. Label it `needs-decision`
3. Wait for human approval before implementing

Major decisions include:
- Adding new dependencies or services
- Changing the data model or Neo4j schema
- Modifying the coherence algorithm
- Adding new ecosystems to index
- Any change affecting deployment or infrastructure
- Security-sensitive changes

## Style Guide
- Python: Follow ruff defaults (PEP 8 + modern Python idioms)
- TypeScript: Follow Next.js conventions, strict mode
- Commits: Conventional Commits format (`feat:`, `fix:`, `docs:`, `chore:`)
- No emojis in code or commits
- Keep functions small and focused
- Prefer composition over inheritance
- No premature abstractions
