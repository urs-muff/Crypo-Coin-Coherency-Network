# Coherence Network: Framework Architecture Spec

## The Core Idea in One Sentence

**A spec-driven, self-modifying agent framework where everything — including the kernel — is a concept that can be observed, modified, extended, and transitioned between states of matter.**

---

## Design Philosophy

### From Agent Zero: What We Take

Agent Zero proved that an agent framework works best when it is **prompt-driven, transparent, and minimally opinionated**. We adopt:

- **Everything is editable** — behavior defined by specs, not hard-coded logic
- **Agents create their own tools** — the framework doesn't presume what capabilities are needed
- **Hierarchical delegation** — agents can spawn subordinate agents
- **Memory as a first-class concern** — agents learn and remember across sessions

### What We Do Differently

- **Compiled, not interpreted** — C#/.NET gives us type safety, performance, and the richest enterprise ecosystem
- **Spec-driven, not prompt-driven** — specs are machine-readable schemas, not natural language markdown files. They generate typed code.
- **The kernel itself is a concept** — there is no privileged, untouchable core. Even the kernel is defined by a spec and can be replaced.
- **States of matter as persistence model** — data doesn't just "exist," it exists *in a phase* and transitions between phases through well-defined operations

---

## The States of Matter Model

This is the central metaphor and the actual architecture of data flow.

```
╔══════════════════════════════════════════════════════════════════════════╗
║                        STATES OF MATTER                                ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  ICE (Solid)              WATER (Liquid)           GAS (Gaseous)       ║
║  ═══════════              ══════════════           ══════════════       ║
║  Frozen specs             Generated code           Runtime state       ║
║  in Git repos             & structured data        in memory           ║
║                                                                        ║
║  • YAML/JSON schemas      • C# source files        • Live objects      ║
║  • Concept definitions    • Compiled assemblies     • Agent state       ║
║  • Event type specs       • Database projections    • Message queues    ║
║  • Governance rules       • SQLite caches           • Computed scores   ║
║  • Algorithm definitions  • API client code         • Active sessions   ║
║                                                                        ║
║  Immutable, versioned     Regenerable, typed        Ephemeral, fast    ║
║  The source of truth      The working form          The living form     ║
║                                                                        ║
╠══════════════════════════════════════════════════════════════════════════╣
║                     PHASE TRANSITIONS                                  ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  MELTING    (Ice → Water)    Source generators read specs,              ║
║                              emit typed C# code at compile time        ║
║                                                                        ║
║  EVAPORATING (Water → Gas)   Runtime loads compiled types,             ║
║                              hydrates state, activates agents          ║
║                                                                        ║
║  CONDENSING  (Gas → Water)   Runtime state persisted as events         ║
║                              in the event store, projections rebuilt   ║
║                                                                        ║
║  FREEZING    (Water → Ice)   Significant state changes committed       ║
║                              back to Git as updated specs              ║
║                                                                        ║
║  SUBLIMATION (Ice → Gas)     GitHub Actions trigger direct runtime     ║
║                              state changes from spec commits           ║
║                                                                        ║
║  DEPOSITION  (Gas → Ice)     Agent-discovered patterns codified        ║
║                              directly into spec definitions            ║
║                                                                        ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Why This Matters

Every piece of data in the system has a natural phase:

| Example Data | Natural Phase | Why |
|---|---|---|
| "What is a Concept?" (definition) | Ice | Rarely changes. Version-controlled. Reviewed by humans. |
| `class Concept : INode { ... }` | Water | Generated from the ice definition. Regenerable. |
| `concept_42.CoherenceScore = 0.87` | Gas | Computed in real-time. Changes constantly. |
| Event: `ConceptLinked(42, 99)` | Water (event store) | Persisted, but structured for querying. |
| Coherence algorithm parameters | Ice | Tuned carefully, governed by proposals. |
| Compiled coherence algorithm | Water | Generated from the ice parameters. |
| Live coherence calculation | Gas | Running in memory every second. |

The framework makes phase transitions **explicit operations**, not implicit side effects. You always know where data lives and how it got there.

---

## The Minimal Kernel

The kernel is **five interfaces**. That's it. Everything else is a plugin.

```
IKernel
├── IConceptHost       — Load, resolve, and manage concepts (including the kernel itself)
├── IPhaseManager      — Transition data between ice/water/gas states
├── IMessageBus        — Route messages between concepts and agents
├── IPluginHost        — Discover, load, isolate, and hot-reload plugins
└── ILifecycle         — Start, stop, health check, graceful shutdown
```

### Why Only Five?

Because anything else can be loaded as a plugin. Need AI capabilities? That's a plugin providing `IChatClient`. Need event sourcing? That's a plugin providing `IEventStore`. Need governance? That's a plugin providing `IProposalEngine`. The kernel just provides enough to load and wire those plugins together.

### The Kernel Is a Concept

The kernel itself is defined by a spec file:

```yaml
# specs/kernel.concept.yaml
concept:
  id: "KERNEL"
  name: "Coherence Kernel"
  version: "1.0.0"
  interfaces:
    - IConceptHost
    - IPhaseManager
    - IMessageBus
    - IPluginHost
    - ILifecycle
  default_implementation: "CoherenceKernel.Default"
  replaceable: true
  governance:
    replacement_requires: "proposal_majority"
```

This means the kernel can be **replaced through the governance system**. If the community decides a different kernel implementation is better, they propose it, vote on it, and the system transitions. The bootstrapper (the only truly fixed code) resolves whatever `IKernel` implementation is registered.

---

## Concept-As-Everything Architecture

The original Coherency Network defined Concepts as the core entity. We take this further: **everything in the system is a concept**, including system components.

```
CONCEPT (base abstraction)
│
├── Domain Concepts (user-created)
│   ├── Ideas, Projects, Research
│   ├── Creative Works, Designs
│   └── Proposals, Guidelines
│
├── Economic Concepts (built-in)
│   ├── EnergyToken (CC001)
│   ├── HarmonyAgreement (CC002)
│   ├── FlowEvent (CC003)
│   └── ConceptInvestment
│
├── Agent Concepts (runtime)
│   ├── SynergyNode (user/agent)
│   ├── AgentCapability (tool/skill)
│   └── AgentMemory (learned knowledge)
│
└── System Concepts (infrastructure)
    ├── Kernel
    ├── PhaseManager
    ├── MessageBus
    ├── PluginHost
    ├── CoherenceAlgorithm
    └── GovernanceEngine
```

Because system components are concepts, they:
- Have specs (ice)
- Have generated typed code (water)
- Have runtime state (gas)
- Can be versioned, governed, invested in, and replaced
- Participate in the coherence graph like any other concept

---

## Agent Architecture

### Agents as Orleans Grains

Every agent is a **Microsoft Orleans virtual actor (grain)**. This gives us:

| Need | Orleans Provides |
|---|---|
| Agent identity | Grain identity (unique, addressable) |
| Agent state/memory | Persistent grain state (auto-saved) |
| Agent communication | Asynchronous message passing |
| One-thought-at-a-time | Single-threaded execution per grain |
| Agents that sleep | Automatic deactivation when idle |
| Agents that wake up | Automatic activation on message receipt |
| Scale to thousands | Grain placement across silos |
| Fault tolerance | Grain reactivation on silo failure |
| Event-driven agents | Orleans Streams (pub/sub) |

### Agent Hierarchy (From Agent Zero)

```
Human User
└── Agent 0 (Orchestrator Grain)
    ├── Agent 1 (Researcher Grain)
    │   └── Agent 1.1 (Specialist Grain)
    ├── Agent 2 (Builder Grain)
    └── Agent 3 (Reviewer Grain)
```

Any agent can spawn subordinate agents by activating new grains. The parent-child relationship is tracked in grain state. Communication flows through Orleans messaging — location-transparent, reliable, and observable.

### Agent Capabilities as Plugins

Agent capabilities (tools, skills, knowledge) are loaded as **plugins via AssemblyLoadContext**:

```
Agent Grain
├── Core: IConceptAware (can read/write concepts)
├── Core: IMessageAware (can send/receive messages)
├── Plugin: IChatCapable (can use LLMs via MEAI)
├── Plugin: ICodeCapable (can generate and execute code)
├── Plugin: ISearchCapable (can search the web/knowledge)
├── Plugin: IGovernanceCapable (can create/vote on proposals)
└── Plugin: IInvestmentCapable (can manage investments)
```

Capabilities are themselves concepts — defined by specs, governed by the community, and hot-reloadable via collectible AssemblyLoadContexts.

### AI Integration via Microsoft.Extensions.AI

All LLM interaction goes through the `IChatClient` abstraction from MEAI:

```
Agent Grain
    └── IChatClient (MEAI)
        ├── Middleware: Telemetry (OpenTelemetry)
        ├── Middleware: Caching (response cache)
        ├── Middleware: Function Calling (tool use)
        └── Provider: OpenAI / Anthropic / Ollama / Azure
```

This means:
- Switch LLM providers by changing configuration, not code
- Use cheap models for background tasks, expensive models for complex reasoning
- All LLM calls are traced and observable through Aspire
- Function calling automatically discovers and exposes plugin capabilities

---

## Spec-Driven Everything

### The Spec Is the Source of Truth

Every concept in the system starts as a YAML spec file in the Git repository (ice):

```yaml
# specs/concepts/energy-token.concept.yaml
concept:
  id: "CC001"
  name: "EnergyToken"
  category: "economic"
  version: "2.0.0"

  schema:
    type: object
    properties:
      value:
        type: number
        minimum: 0
        description: "Token value in network units"
      coherence_impact:
        type: number
        description: "How this token's movement affected network coherence"
    required: [value]

  events:
    - name: "TokenMinted"
      properties: { recipient: string, amount: number, reason: string }
    - name: "TokenTransferred"
      properties: { from: string, to: string, amount: number, coherence_delta: number }
    - name: "TokenBurned"
      properties: { holder: string, amount: number, reason: string }

  behaviors:
    - name: "RegenerativeDecay"
      description: "Tokens lose value slowly when hoarded, encouraging circulation"
      parameters: { decay_rate: 0.001, decay_period_hours: 24 }
    - name: "CoherenceMultiplier"
      description: "Token value increases when used in high-coherence transactions"
      parameters: { base_multiplier: 1.0, coherence_weight: 0.5 }

  governance:
    modify_requires: "proposal_supermajority"
    parameter_change_requires: "proposal_majority"

  relationships:
    - target: "CC003"  # FlowEvent
      type: "transfers_via"
    - target: "COH003"  # CoherenceRewards
      type: "distributed_by"
```

### Compile-Time Code Generation

A Roslyn Source Generator reads these spec files and generates:

```csharp
// AUTO-GENERATED from specs/concepts/energy-token.concept.yaml
// DO NOT EDIT — changes will be overwritten on next build

namespace CoherenceNetwork.Concepts.Generated;

public partial record EnergyToken : IConcept
{
    public required decimal Value { get; init; }
    public decimal CoherenceImpact { get; init; }
}

// Events
public sealed record TokenMinted(string Recipient, decimal Amount, string Reason) : IConceptEvent;
public sealed record TokenTransferred(string From, string To, decimal Amount, decimal CoherenceDelta) : IConceptEvent;
public sealed record TokenBurned(string Holder, decimal Amount, string Reason) : IConceptEvent;

// Validation
public sealed class EnergyTokenValidator : IConceptValidator<EnergyToken>
{
    public ValidationResult Validate(EnergyToken token)
    {
        if (token.Value < 0) return ValidationResult.Fail("Value must be >= 0");
        return ValidationResult.Ok();
    }
}
```

**The spec file is the only thing a developer edits.** The generated code is the "water" — derived, disposable, regenerable.

### Runtime Hydration

At runtime, the generated types are instantiated as Orleans grain state (gas):

```
Spec File (ice) → Generated Code (water) → Live Grain State (gas)
   YAML/JSON    →    C# records/classes    →   In-memory objects
```

---

## The Coherence Algorithm

This is the keystone that the original spec left undefined. Here's a concrete starting point:

### Coherence = Network Health Score

```yaml
# specs/algorithms/coherence.algorithm.yaml
algorithm:
  id: "COH-ALGO-001"
  name: "NetworkCoherence"
  version: "1.0.0"

  inputs:
    - name: "concept_connectivity"
      description: "How densely connected the concept graph is"
      weight: 0.25
    - name: "contribution_distribution"
      description: "How evenly contributions are distributed across participants"
      weight: 0.20
    - name: "investment_alignment"
      description: "How well investments predict actual concept value creation"
      weight: 0.20
    - name: "governance_participation"
      description: "What percentage of eligible participants vote on proposals"
      weight: 0.15
    - name: "flow_frequency"
      description: "How actively value flows through the network"
      weight: 0.10
    - name: "concept_quality"
      description: "Community-assessed quality of concepts (peer review)"
      weight: 0.10

  output:
    type: number
    range: [0, 1]
    description: "0 = no coherence (isolated, stagnant), 1 = perfect coherence (connected, flowing, equitable)"

  governance:
    weight_change_requires: "proposal_majority"
    input_add_remove_requires: "proposal_supermajority"
    algorithm_replace_requires: "proposal_supermajority"
```

The algorithm itself is a concept — governed, versioned, and replaceable. Starting simple (weighted sum of six metrics) and evolving through governance as the community learns what actually matters.

---

## Technology Stack: What We Reuse

The principle is: **build only what is novel, reuse everything else**.

### Core Runtime

| Component | Technology | Why |
|---|---|---|
| Language | C# / .NET 9+ | Type safety, performance, enterprise ecosystem, source generators |
| Agent Runtime | Microsoft Orleans 10 | Virtual actors = agents. State, messaging, scaling for free |
| AI Abstraction | Microsoft.Extensions.AI | Provider-agnostic LLM access. `IChatClient` interface |
| Plugin Isolation | AssemblyLoadContext + McMaster.NETCore.Plugins | Hot-reload, version isolation, safe plugin boundaries |
| Event Sourcing | Marten on PostgreSQL | Events (water), projections, document storage. One database dependency |
| Dev Orchestration | .NET Aspire | Single-command launch, dashboard, telemetry, service discovery |

### Spec & Code Generation

| Component | Technology | Why |
|---|---|---|
| Spec Format | YAML + JSON Schema | Human-readable, machine-parseable, version-controllable |
| Code Generation | Roslyn Incremental Source Generators | Zero runtime overhead, IDE integration, compile-time safety |
| Schema Validation | NJsonSchema | Runtime validation of specs and data against JSON Schema |
| API Generation | Kiota | Typed API clients from OpenAPI specs |
| Templating | Scriban | Clean separation of generation model from output template |

### Infrastructure (Minimize Cost)

| Component | Technology | Cost | Role |
|---|---|---|---|
| Spec Storage | GitHub Repository | Free | Ice layer. Source of truth. |
| CI/CD | GitHub Actions | Free (public repos) | Spec validation, code gen verification, agent scheduled runs |
| Database | PostgreSQL (Supabase / Neon / Railway) | Free tier → ~$5/mo | Water layer. Marten event store + projections |
| Edge State | Cloudflare Durable Objects | Free (5 GB) | Gas layer at the edge. Per-concept SQLite |
| Static Hosting | GitHub Pages or Cloudflare Pages | Free | UI hosting |
| Container Runtime | Fly.io or Railway | Free tier → ~$5/mo | Orleans silo hosting for development |
| Observability | .NET Aspire + OpenTelemetry | Free (self-hosted) | Full trace/metric visibility |

**Total cost for development: $0-10/month**

### Protocols & Standards

| Protocol | Purpose |
|---|---|
| MCP (Model Context Protocol) | Tool interoperability between agents and external systems |
| A2A (Agent-to-Agent) | Inter-agent communication across framework boundaries |
| OpenAPI 3.2 | API surface description and client generation |
| JSON Schema Draft 2020-12 | All data type definitions |
| OpenTelemetry | Distributed tracing and metrics |

---

## Solution Structure

```
coherence-network/
├── specs/                              # ICE LAYER — Source of Truth
│   ├── kernel.concept.yaml
│   ├── concepts/
│   │   ├── energy-token.concept.yaml       # CC001
│   │   ├── harmony-agreement.concept.yaml  # CC002
│   │   ├── flow-event.concept.yaml         # CC003
│   │   ├── coherence-web.concept.yaml      # CC004
│   │   ├── synergy-link.concept.yaml       # CC005
│   │   ├── coherence-exchange.concept.yaml # CC006
│   │   ├── synergy-node.concept.yaml       # CC007
│   │   └── collective-wisdom.concept.yaml  # CC008
│   ├── algorithms/
│   │   └── coherence.algorithm.yaml
│   ├── governance/
│   │   └── harmony-guidelines.yaml
│   └── agents/
│       ├── orchestrator.agent.yaml
│       ├── researcher.agent.yaml
│       └── builder.agent.yaml
│
├── src/
│   ├── CoherenceNetwork.Abstractions/   # Kernel interfaces (5 interfaces)
│   │   ├── IConceptHost.cs
│   │   ├── IPhaseManager.cs
│   │   ├── IMessageBus.cs
│   │   ├── IPluginHost.cs
│   │   ├── ILifecycle.cs
│   │   └── IConcept.cs
│   │
│   ├── CoherenceNetwork.SourceGen/      # MELTING — Roslyn Source Generators
│   │   ├── ConceptGenerator.cs          # Reads concept specs, emits C# types
│   │   ├── EventGenerator.cs            # Reads event specs, emits event records
│   │   └── ValidatorGenerator.cs        # Reads constraints, emits validators
│   │
│   ├── CoherenceNetwork.Kernel/         # Default kernel implementation
│   │   ├── DefaultKernel.cs
│   │   ├── DefaultConceptHost.cs
│   │   ├── DefaultPhaseManager.cs
│   │   ├── DefaultMessageBus.cs
│   │   └── DefaultPluginHost.cs
│   │
│   ├── CoherenceNetwork.Grains/         # Orleans Agent Grains
│   │   ├── ConceptGrain.cs              # Each concept is a grain
│   │   ├── AgentGrain.cs                # Each agent is a grain
│   │   ├── CoherenceGrain.cs            # Network coherence calculator
│   │   └── GovernanceGrain.cs           # Proposal/voting grain
│   │
│   ├── CoherenceNetwork.Events/         # Marten Event Sourcing
│   │   ├── EventStore.cs
│   │   ├── Projections/
│   │   │   ├── ConceptGraphProjection.cs
│   │   │   ├── CoherenceScoreProjection.cs
│   │   │   └── UserPortfolioProjection.cs
│   │   └── Handlers/
│   │       └── EventHandlers.cs
│   │
│   ├── CoherenceNetwork.Plugins/        # Plugin Infrastructure
│   │   ├── PluginLoader.cs              # ALC-based loading
│   │   ├── PluginContracts/             # Shared contracts assembly
│   │   │   ├── IAgentCapability.cs
│   │   │   ├── IChatCapable.cs
│   │   │   ├── ISearchCapable.cs
│   │   │   └── ICodeCapable.cs
│   │   └── BuiltIn/
│   │       ├── ChatPlugin/              # MEAI-based LLM access
│   │       ├── SearchPlugin/            # Web/knowledge search
│   │       └── MemoryPlugin/            # FAISS-like vector recall
│   │
│   ├── CoherenceNetwork.Api/            # ASP.NET Core API
│   │   ├── Program.cs
│   │   └── Endpoints/
│   │
│   └── CoherenceNetwork.AppHost/        # .NET Aspire orchestration
│       └── Program.cs
│
├── plugins/                             # External plugins (each is its own project)
│   ├── Plugin.Governance/
│   ├── Plugin.Marketplace/
│   └── Plugin.Coherence/
│
├── tests/
│   ├── CoherenceNetwork.Tests.Unit/
│   └── CoherenceNetwork.Tests.Integration/
│
└── tools/
    └── spec-validator/                  # CLI tool to validate spec files
```

---

## Bootstrap Sequence

How the system starts from zero:

```
1. BOOTSTRAPPER (the only fixed code)
   │
   ├── Read specs/kernel.concept.yaml
   ├── Resolve IKernel implementation
   │   (default: CoherenceNetwork.Kernel.DefaultKernel)
   └── Call kernel.Start()

2. KERNEL STARTS
   │
   ├── IPluginHost.DiscoverPlugins()
   │   └── Scan plugin directories, load via ALC
   │
   ├── IConceptHost.LoadSpecs()
   │   └── Read all *.concept.yaml from specs/
   │   └── Validate against JSON Schema
   │   └── Register concept types
   │
   ├── IPhaseManager.MeltAll()
   │   └── Source generators already ran at compile time
   │   └── Verify generated code matches current specs
   │
   ├── IMessageBus.Start()
   │   └── Initialize Orleans Streams
   │
   └── ILifecycle.Ready()
       └── System accepting requests

3. AGENT ACTIVATION (on-demand via Orleans)
   │
   ├── First message to AgentGrain<"orchestrator">
   ├── Orleans activates the grain
   ├── Grain loads state from Marten
   ├── Grain loads capabilities from plugins
   └── Grain begins processing
```

---

## How This Serves the Coherency Network Vision

### Mapping Original Concepts to Framework Components

| Original Concept | Framework Implementation |
|---|---|
| **Energy Token (CC001)** | Concept spec → generated type → Orleans grain with Marten events |
| **Harmony Agreements (CC002)** | Concept spec with constraint definitions → generated validator + grain |
| **Flow Events (CC003)** | Event specs → generated event records → Marten event store |
| **Coherence Web (CC004)** | The concept system itself — every spec IS a concept |
| **Synergy Links (CC005)** | Relationship specs → generated edge types → graph projections |
| **Coherence Exchange (CC006)** | Marketplace plugin with concept-as-listing pattern |
| **Synergy Nodes (CC007)** | Agent grains with persistent state and plugin capabilities |
| **Collective Wisdom (CC008)** | Governance plugin with proposal grains and voting streams |
| **Unity Consciousness (COH001)** | The coherence algorithm that measures interconnectedness |
| **Flow State Collaboration (COH002)** | Agent coordination patterns via Orleans |
| **Coherence Rewards (COH003)** | Event-driven reward distribution via stream subscribers |

### Everything Is Modifiable

Because everything is a concept defined by a spec:
- Want to change how tokens work? Edit the spec, rebuild.
- Want a new agent type? Add an agent spec, rebuild.
- Want to replace the coherence algorithm? Propose it, vote, swap the spec.
- Want to replace the *kernel itself*? Propose it, get supermajority, swap the implementation.

### Revenue Still Works

All the revenue models from the vision review still apply:
- **Transaction fees**: FlowEvent handlers can extract platform fees
- **Premium plugins**: Advanced capabilities loaded as paid plugins
- **Enterprise licenses**: Self-hosted Orleans clusters with private concept graphs
- **API access**: ASP.NET Core API layer with metered access
- **Coherence as a Service**: The algorithm itself, exposed as an API

---

## Implementation Roadmap

### Phase 0: Skeleton (Weeks 1-2)
- Create .NET solution with project structure
- Define the 5 kernel interfaces in `CoherenceNetwork.Abstractions`
- Write the bootstrapper
- Set up .NET Aspire AppHost
- Create first concept spec (a simple "Note" concept)
- Build Roslyn source generator that reads one spec and generates one type
- Verify the ice→water→gas pipeline works end-to-end

### Phase 1: Concepts Come Alive (Weeks 3-6)
- Convert all 8 CC00X concepts to YAML spec files
- Extend source generator to handle full concept schema
- Set up Marten event store on PostgreSQL
- Implement ConceptGrain (Orleans) with persistent state
- Build concept CRUD through API endpoints
- Implement relationships as edges in the concept graph
- Build Marten projection for concept graph visualization

### Phase 2: Agents Think (Weeks 7-10)
- Implement AgentGrain with MEAI integration
- Build plugin system with ALC isolation
- Create ChatPlugin (LLM access), SearchPlugin, MemoryPlugin
- Implement agent hierarchy (parent-child delegation)
- Build a simple orchestrator agent that can reason about concepts
- Add MCP support for tool interoperability

### Phase 3: The Economy Starts (Weeks 11-14)
- Implement EnergyToken with Marten events
- Build FlowEvent processing with multi-party distribution
- Implement the coherence algorithm (start with simple weighted metrics)
- Build coherence rewards distribution via Orleans Streams
- Create HarmonyAgreement grain with constraint enforcement

### Phase 4: Governance & Community (Weeks 15-18)
- Implement Proposal grain with voting
- Build governance engine (proposal lifecycle management)
- Create Harmony Guidelines concept
- Implement concept modification governance (require approval for changes)
- Build the community UI (React or Blazor)
- Deploy to production infrastructure

### Phase 5: Self-Modification (Weeks 19+)
- Implement kernel replacement through governance
- Build spec-editing agents (agents that can propose spec changes)
- Add hot-reload for plugins (collectible ALC)
- Implement cross-community federation
- Build learning pathways and skill matching
- Full ice→water→gas→water→ice lifecycle (agent discoveries become specs)

---

## Key Design Decisions and Rationale

### Why C#/.NET and Not Python?

| Concern | Python (Agent Zero) | C#/.NET (This Framework) |
|---|---|---|
| Type safety | Runtime errors | Compile-time guarantees |
| Performance | Interpreted, GIL | Compiled, true parallelism |
| Code generation | Limited | Roslyn source generators are unmatched |
| Enterprise adoption | Limited | .NET is standard in enterprise |
| Actor model | Would need to build | Orleans is production-proven at Microsoft scale |
| Plugin isolation | No good story | AssemblyLoadContext with unloading |
| AI integration | Many libraries | MEAI is the emerging standard |
| Hosting | Needs runtime | Self-contained, AOT-compilable |

### Why Orleans and Not Raw Actors?

Orleans gives us the **virtual actor model** — agents exist conceptually even when not in memory. They activate on demand and deactivate when idle. We get fault tolerance, scaling, and persistence without building any of it. This maps perfectly to agents that should "always exist" but only consume resources when active.

### Why Marten and Not EventStoreDB?

Marten runs on PostgreSQL. That means one database handles event sourcing, document storage, AND projections. EventStoreDB is a separate database requiring separate infrastructure. For a project minimizing cost and complexity, Marten is the clear winner. If we outgrow it, migration to EventStoreDB is straightforward because our events are just .NET records.

### Why Specs in YAML and Not Markdown?

The original concept docs are in markdown — great for humans, unusable for code generation. YAML gives us machine-readable schemas that are still human-readable. JSON Schema provides validation. Roslyn source generators can parse YAML at compile time. The markdown docs become the *commentary* on the specs, not the specs themselves.

### Why Not Just Use Microsoft Agent Framework Directly?

The Microsoft Agent Framework is excellent but opinionated about orchestration patterns. Our framework needs **everything to be a concept** — including the orchestration patterns themselves. We use Microsoft's building blocks (MEAI, Orleans) but compose them according to our own concept-as-everything architecture. As the Microsoft Agent Framework matures, specific components can be adopted as plugins.

---

## Summary

This framework takes the best ideas from:
- **Agent Zero**: Transparency, self-modification, minimal built-in assumptions
- **Orleans**: Virtual actors for agent lifecycle, state, and communication
- **MEAI**: Provider-agnostic AI integration
- **Marten**: Event sourcing with PostgreSQL simplicity
- **Roslyn**: Compile-time code generation from specs
- **The Coherency Network vision**: Concepts as first-class economic entities in a coherence-optimized graph

And combines them into something new: **a system where the spec is the source of truth, code is a derived artifact, agents are virtual actors, everything is a governable concept, and data flows between states of matter through well-defined phase transitions**.

The result is a framework that is:
- **Affordable** — runs on free tiers during development
- **Type-safe** — C# with generated types from specs
- **Self-modifying** — even the kernel can be replaced through governance
- **Observable** — Aspire + OpenTelemetry for full visibility
- **Scalable** — Orleans handles thousands of concurrent agents
- **Aligned** — the coherence algorithm ensures the system rewards what matters
