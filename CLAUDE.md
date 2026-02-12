# Coherence — Open Source Contribution Intelligence

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
docs/         — Architecture specs, concept definitions, planning docs
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

## Key Conventions
- API endpoints follow REST: `/api/{resource}/{id}/{sub-resource}`
- All API responses use Pydantic models (type-safe, auto-documented)
- Frontend API client is auto-generated from OpenAPI spec
- Neo4j node labels: `Project`, `Contributor`, `Organization`
- Neo4j relationship types: `DEPENDS_ON`, `MAINTAINED_BY`, `CONTRIBUTES_TO`, `FUNDED_BY`
- Coherence scores are 0.0-1.0 floats, computed from weighted inputs
- All dates in ISO 8601 UTC

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

## Decision Gates
When encountering a major architectural decision, do NOT proceed autonomously. Instead:
1. Document the options in the relevant Linear issue
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
