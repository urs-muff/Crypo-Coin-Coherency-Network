# Agent Autonomy Architecture

## The Shift: From Human-in-the-Loop to Human-on-the-Loop

The previous plan had humans at 5 of 6 steps. This plan pushes AI to handle
everything except the irreducible human decisions.

```
PREVIOUS: Human writes spec → Human writes tests → AI implements → CI → Human reviews → Merge

NOW:      Human sets direction → AI agents handle everything else → Human approves/rejects
```

### What Humans Actually Must Do (Irreducible)

Based on production data from StrongDM, OpenObserve, Anthropic, and Cursor:

| Human Decision | Why It Can't Be Automated (Yet) |
|----------------|-------------------------------|
| Product direction | "What should we build next?" — requires market judgment |
| Architecture choices | Agents copy patterns, good or bad. They don't evaluate tradeoffs |
| Security sign-off | 45% vulnerability rate in AI code. Stanford Law flagged this explicitly |
| Scope/priority | "Is this worth doing?" requires business context |
| Final merge to main | DoltHub's Gas Town merged failing tests autonomously. Never again |
| Cost oversight | Agent teams burn $100+/hour without supervision |

### What Humans Should NOT Be Doing

| Old Human Task | Who Does It Now | How |
|----------------|-----------------|-----|
| Writing detailed specs | Spec Drafter agent | Drafts from 2-3 sentence direction |
| Writing test skeletons | Test Writer agent | Generates from spec |
| Reviewing every line of code | Review Panel (multi-agent) | 3 specialist agents review |
| Fixing CI failures | Healer agent | Up to 5 retry iterations |
| Deciding if PR matches spec | Compliance agent | Checks spec requirements vs implementation |
| Writing docs | Doc agent | Generates from code + spec |

---

## The Agent Council

Modeled on OpenObserve's production system (went from 380 to 700+ tests,
caught production bugs before customers). One "super agent" failed. Bounded
specialists with clear roles works.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HUMAN (You)                                      │
│                                                                     │
│  Inputs:                                                            │
│  • 2-3 sentence feature direction ("I want users to upload their   │
│    package-lock.json and see which dependencies are at risk")       │
│  • Yes/No on decision gates                                        │
│  • Yes/No on merge to main                                         │
│                                                                     │
│  Time: ~15-30 min/day                                               │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  ORCHESTRATOR (Claude Code)                          │
│                                                                     │
│  The team lead. Decomposes direction into tasks, assigns to         │
│  specialist agents, integrates results, resolves conflicts.         │
│                                                                     │
│  Uses sub-agents for parallel work. Maintains the specs/ dir.       │
│  Creates GitHub issues with spec + test references.                 │
│  Pushes decision gates to human when needed.                        │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
          ┌────────────┼────────────┬────────────┬────────────┐
          ▼            ▼            ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  SPEC    │ │  TEST    │ │  IMPL    │ │  REVIEW  │ │  HEALER  │
    │  DRAFTER │ │  WRITER  │ │  WORKER  │ │  PANEL   │ │          │
    │          │ │          │ │          │ │          │ │          │
    │ Expands  │ │ Writes   │ │ Writes   │ │ 3-agent  │ │ Fixes    │
    │ direction│ │ tests    │ │ code to  │ │ review:  │ │ failing  │
    │ into     │ │ from     │ │ make     │ │ correct, │ │ tests,   │
    │ full     │ │ spec.    │ │ tests    │ │ secure,  │ │ lint,    │
    │ spec.    │ │ Contract │ │ pass.    │ │ spec-    │ │ CI.      │
    │          │ │ first.   │ │          │ │ compliant│ │ Up to 5  │
    │ Grounded │ │          │ │ Codex or │ │          │ │ retries. │
    │ in repo  │ │ Grounded │ │ Claude   │ │ Grounded │ │          │
    │ context. │ │ in spec. │ │ Code.    │ │ in tests │ │ Grounded │
    │          │ │          │ │          │ │ + spec.  │ │ in CI    │
    │          │ │          │ │ Grounded │ │          │ │ output.  │
    │          │ │          │ │ in tests.│ │          │ │          │
    └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### How Agents Ground Each Other (Breaking the Echo Chamber)

The central problem: when AI validates AI, they share blind spots.
Five techniques that actually work:

```
1. DETERMINISTIC GROUNDING (most reliable)
   Code compiles → Tests pass → Lint clean → CI green
   Binary. No AI judgment needed. This is the backbone.

2. HOLDOUT SCENARIOS (StrongDM pattern)
   Integration test scenarios stored in tests/holdout/
   Implementing agent CANNOT see these files (.claudeignore)
   Only CI runs them. Agent can't game what it can't see.

3. SPEC-AS-ORACLE
   Review Panel checks implementation against spec requirements.
   Each requirement has a checkbox. Agent must cite the code
   that satisfies each requirement. Auditable.

4. MULTI-MODEL REVIEW (breaks model-specific bias)
   Claude writes code → Codex reviews (or vice versa).
   Different training data = partially different blind spots.
   Not perfect, but measurably better than self-review.

5. FAILURE-MODE FRAMING (94% vs 66% consistency)
   Review agents ask "what could go wrong with this code?"
   not "is this code good?" Veris AI research shows this
   nearly doubles review consistency.
```

---

## The Autonomous Pipeline

### Phase 1: Direction → Spec (AI-Driven)

**Input from human:** 2-3 sentences of direction.

Example: *"Users should be able to search for any npm or PyPI package and see
its coherence score, dependency count, and last release date."*

**Spec Drafter agent:**
1. Reads existing specs/ for patterns and conventions
2. Reads existing code for current data model and API patterns
3. Reads existing tests for testing conventions
4. Drafts a full spec following the template in specs/TEMPLATE.md
5. Lists files to create/modify
6. Identifies dependencies on other specs
7. Flags any decision gates (new dependencies, schema changes, etc.)

**Grounding:** The spec references actual code paths, actual data models,
actual test patterns from the repo. Not hallucinated structure.

**Human touchpoint:** Only if decision gate is flagged. Otherwise, flows
straight to Test Writer.

### Phase 2: Spec → Tests (AI-Driven)

**Test Writer agent:**
1. Reads the spec
2. Reads existing test files for patterns (conftest.py, fixtures, etc.)
3. Writes test file(s) with:
   - Happy path tests (one per requirement in spec)
   - Error/edge case tests (404, 422, invalid input)
   - Integration tests if spec crosses service boundaries
4. Runs tests to confirm they FAIL (red phase)
5. If tests pass without implementation, flags a problem

**Grounding:** Tests must fail. A passing test without implementation means
the test is wrong. This is a hard gate.

### Phase 3: Tests → Implementation (AI-Driven)

**Implementation Worker:**
- For backend endpoints: Codex (fire-and-forget, has spec + tests)
- For multi-file integration: Claude Code (interactive, can iterate)
- For UI components: Claude Code sub-agent (or Cursor if you're available)

1. Reads spec + test files
2. Implements code in files listed in spec
3. Runs tests locally
4. Iterates until tests pass
5. Runs linter, fixes issues
6. Creates PR with spec reference in description

**Grounding:** Tests pass. Lint clean. Only files from spec are modified.
PR description maps requirements to implementation.

### Phase 4: Implementation → Review (AI-Driven)

**Review Panel** (3 specialist sub-agents, run in parallel):

```
┌─────────────────────────────────────────────────────────────┐
│ CORRECTNESS AGENT                                           │
│                                                             │
│ • Reads the diff                                            │
│ • Reads the spec requirements checklist                     │
│ • For each requirement: does the code satisfy it?           │
│ • Checks: tests all pass, no test files modified,           │
│   only spec-listed files changed                            │
│ • Ask: "What could go wrong with this implementation?"      │
│                                                             │
│ Output: checklist + risk assessment                         │
├─────────────────────────────────────────────────────────────┤
│ SECURITY AGENT                                              │
│                                                             │
│ • Reads the diff                                            │
│ • Checks for OWASP Top 10 patterns                         │
│ • Checks: SQL/Cypher injection, XSS, auth bypass,          │
│   input validation, secrets in code                         │
│ • Ask: "How could an attacker exploit this code?"           │
│                                                             │
│ Output: security findings (critical/warning/info)           │
│ If critical: blocks merge, flags for human review           │
├─────────────────────────────────────────────────────────────┤
│ SPEC COMPLIANCE AGENT                                       │
│                                                             │
│ • Reads the diff against the spec                           │
│ • For each spec requirement: cite the exact code location   │
│ • Flag any spec requirements not addressed                  │
│ • Flag any code that goes beyond the spec (scope creep)     │
│ • Ask: "Does this do exactly what the spec says,            │
│   no more, no less?"                                        │
│                                                             │
│ Output: requirement traceability matrix                     │
└─────────────────────────────────────────────────────────────┘
```

**Grounding:** Each reviewer agent checks against a different source of truth
(tests, OWASP checklist, spec). Not just "does this look good?" but
"does this match X?" where X is concrete.

### Phase 5: Review → Heal → Merge (AI-Driven, Human Gate)

**Healer agent** (if review finds issues):
1. Reads review findings
2. Fixes issues (up to 5 iterations)
3. Re-runs tests after each fix
4. Re-submits for review

**Merge gate:**
- If Review Panel passes AND CI green AND no security criticals:
  → Auto-label `ready-for-merge`
  → Notify human for final approval
- If security critical found:
  → Label `security-review`, block merge, notify human
- If Review Panel fails after 3 Healer cycles:
  → Label `needs-decision`, notify human

**Human action:** Scan the Review Panel summary. Approve or reject.
This should take <2 minutes per PR because all the analysis is done.

---

## Decision Routing: What Gets Escalated vs Auto-Handled

```
                    ┌─────────────┐
                    │  New Task    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Decision    │
                    │ Required?   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼────┐ ┌────▼─────┐
        │ ROUTINE   │ │ SCOPE  │ │ MAJOR    │
        │           │ │ CHANGE │ │          │
        │ • Impl    │ │        │ │ • New    │
        │   endpoint│ │ • New  │ │   service│
        │ • Fix bug │ │   field│ │ • Schema │
        │ • Add test│ │ • New  │ │   change │
        │ • Refactor│ │   param│ │ • Auth   │
        │           │ │ • New  │ │ • Deploy │
        │ AUTO      │ │   error│ │ • New dep│
        │ (agents)  │ │   code │ │          │
        │           │ │        │ │ HUMAN    │
        │           │ │ AGENT  │ │ DECISION │
        │           │ │ DRAFT  │ │          │
        │           │ │ HUMAN  │ │ Create   │
        │           │ │ APPROVE│ │ issue +  │
        │           │ │        │ │ wait     │
        └───────────┘ └────────┘ └──────────┘
```

### Escalation Triggers (Agent Knows to Stop)

Add to CLAUDE.md and agent system prompts:

```
STOP and escalate to human (create issue labeled `needs-decision`) when:
- Adding any new pip/npm dependency
- Changing Neo4j node labels or relationship types
- Modifying the coherence score formula or weights
- Adding a new API resource (not just a new endpoint on existing resource)
- Any change to authentication or authorization
- Any change to deployment configuration
- Estimated token cost for a task exceeds $50
- You've been working on the same task for 3+ iterations without progress
- Two agents disagree on the correct approach
```

---

## The Bounce-Back Pattern: Agents Challenging Each Other

This is what you asked about — agents bouncing ideas and grounding each other.

### How It Works

```
SCENARIO: Orchestrator needs to decide how to implement search

┌────────────────────────────────────────────────────────────────┐
│ ORCHESTRATOR: "We need to implement project search. I'm going │
│ to have two agents prototype different approaches."            │
│                                                                │
│ SUB-AGENT A (Research):                                        │
│ "Investigate: Neo4j full-text search. Read the Neo4j docs,    │
│  check our current schema, estimate query performance for      │
│  100K+ nodes. Return: approach doc with pros, cons, code       │
│  sample, estimated complexity."                                │
│                                                                │
│ SUB-AGENT B (Research):                                        │
│ "Investigate: PostgreSQL full-text search + tsvector. Read     │
│  our Postgres schema, check if we already have the columns,    │
│  estimate performance. Return: approach doc with pros, cons,   │
│  code sample, estimated complexity."                           │
│                                                                │
│              [Both run in PARALLEL]                             │
│                                                                │
│ ORCHESTRATOR receives both reports, then:                      │
│                                                                │
│ SUB-AGENT C (Judge):                                           │
│ "Compare these two approaches against our requirements:        │
│  - Must search by package name and description                 │
│  - Must return results in <200ms for 100K packages             │
│  - Must not add new infrastructure                             │
│  Which approach better fits? What could go wrong with each?"   │
│                                                                │
│ ORCHESTRATOR: Makes recommendation. If it's a major            │
│ decision (new dependency), escalates to human. If routine       │
│ (just a query strategy), proceeds with the winner.             │
└────────────────────────────────────────────────────────────────┘
```

### What Makes This Different From an Echo Chamber

1. **Each agent researches independently** — reads different docs, writes
   different code samples. Not "Agent A proposes, Agent B reacts."

2. **Judge agent uses failure-mode framing** — "What could go wrong?" not
   "Which is better?" This catches risks that optimistic agents miss.

3. **Grounded in code, not opinion** — Each agent must show a working code
   sample and reference actual project files. No abstract arguments.

4. **Deterministic verification** — The winning approach gets a test suite.
   If the code doesn't work, the approach is rejected regardless of how
   good the argument was.

5. **Escalation when agents disagree** — If the Judge can't decide, that's
   a signal the decision is non-trivial. Escalate to human.

---

## Practical Implementation

### What You Need to Set Up

#### 1. Claude Code Hooks (Automation)

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash(git commit:*)",
        "command": "echo 'Commit created. Run tests before pushing.'"
      }
    ],
    "Stop": [
      {
        "command": "echo 'Session complete. Check todos and PR status.'"
      }
    ]
  }
}
```

#### 2. Per-Directory Agent Rules

```
specs/CLAUDE.md:
  "You are a spec drafter. Read existing specs for format. Read existing
   code for current patterns. Output a spec matching TEMPLATE.md exactly.
   Flag any decision gates. Do not implement — only specify."

api/tests/CLAUDE.md:
  "You are a test writer. Read the spec. Read conftest.py for fixtures.
   Write tests that FAIL without implementation. If a test passes without
   new code, the test is wrong. Only write tests, never implementation."

api/app/CLAUDE.md:
  "You are an implementation worker. Read the spec. Read the tests.
   Write code to make tests pass. Do not modify tests. Do not add
   features beyond the spec. Run tests after every change."
```

#### 3. GitHub Actions: Holdout Tests

```yaml
# .github/workflows/holdout-tests.yml
name: Holdout Tests
on: pull_request
jobs:
  holdout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run holdout test suite
        run: |
          # These tests are in tests/holdout/
          # .claudeignore excludes this directory from agent context
          pytest tests/holdout/ -v
```

```
# .claudeignore
tests/holdout/
```

Implementing agents cannot see holdout tests. Only CI runs them.
This prevents the "return true" problem — code that passes visible
tests but does nothing useful.

#### 4. GitHub Actions: Auto-Review Pipeline

```yaml
# .github/workflows/agent-review.yml
name: Agent Review
on: pull_request
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: pytest api/tests/ -v
      - name: Run lint
        run: ruff check api/
      - name: Run holdout tests
        run: pytest tests/holdout/ -v
      # The review panel runs as Claude Code sub-agents
      # triggered by the Orchestrator, not by CI directly.
      # CI just provides the deterministic grounding.
```

---

## Revised Human Time Budget

| Activity | Time | Frequency |
|----------|------|-----------|
| Write 2-3 sentence direction for next feature | 5 min | Daily |
| Scan Review Panel summary, approve/reject merge | 2 min/PR | 2-3x daily |
| Respond to decision gates | 5 min | When flagged |
| Weekly: review overall direction, adjust priorities | 30 min | Weekly |
| **Total** | **~15-30 min/day** | |

### Comparison

| Approach | Human Time/Day | AI Autonomy |
|----------|---------------|-------------|
| Traditional development | 8 hours | 0% |
| Previous plan (human-in-the-loop) | 1 hour | ~60% |
| **This plan (human-on-the-loop)** | **15-30 min** | **~85%** |
| StrongDM factory (maximum autonomy) | ~15 min | ~95% |

We're not going full StrongDM (they have a dedicated team building digital
twins and holdout infrastructure). But we're close to maximum practical
autonomy for a solo developer.

---

## What Stays the Same

The previous plan's foundations are still correct:
- Spec-driven development workflow
- File size limits for AI maintainability
- Project structure (api/, web/, specs/, scripts/)
- Per-directory CLAUDE.md files
- Sprint plan and milestones
- Decision gates for major architecture changes
- Test-first approach

What changes is WHO does each step and HOW MUCH human oversight each step needs.

---

## Risk Mitigation

### The "Return True" Problem
Holdout tests. Agents can't game tests they can't see.

### The Echo Chamber
Multi-model review + failure-mode framing + deterministic grounding.
Not perfect, but measurably better than single-model self-review.

### Context Rot
Fresh sessions per task. No session exceeds 45 minutes.
Orchestrator starts new sessions for each spec.

### Cost Spiral
Agent tasks are scoped. Orchestrator tracks token spend.
Escalate to human if a single task exceeds $50.

### Test Swapping
Tests are in a separate directory. CLAUDE.md explicitly forbids modification.
CI runs the original test files (from main branch) as a secondary check.

### Security
Security Agent runs on every PR. Critical findings block merge.
All auth/input handling code gets human review regardless.

---

## Getting Started: First Autonomous Run

To validate this architecture, start with one end-to-end cycle:

1. **You write:** "I want a health check endpoint at GET /api/health that
   returns {status: ok, version: string, timestamp: ISO8601}"

2. **Orchestrator** receives this direction and:
   - Asks Spec Drafter sub-agent to write specs/001-health-check.md
   - Asks Test Writer sub-agent to write api/tests/test_health.py
   - Asks Implementation Worker to make tests pass
   - Asks Review Panel to review the PR
   - Labels PR `ready-for-merge`

3. **You:** Read the 3-line Review Panel summary. Hit approve.

If this works, you have the pattern for everything else.
