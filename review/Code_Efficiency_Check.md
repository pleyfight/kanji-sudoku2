# The Architecture of Endurance — Clean Code + Efficiency Codex (Mandatory Agent Policy)

- Schema version: 1.2.0
- Document ID: clean-code-efficiency-guideline
- Purpose: Ensure all produced code is understandable, maintainable, testable, secure, observable, and appropriately efficient for its constraints. Minimize accidental complexity, control entropy via refactoring hygiene, and prevent avoidable algorithmic regressions (e.g., O(n^2) where O(n) is feasible).

## Philosophical Foundations

- Primary bottleneck: Human cognitive capacity is the scarcest resource; optimize code for readability and long-term change safety.
- Clean code is:
  - Risk management strategy
  - Economic necessity (maintenance dominates initial creation cost)
  - Entropy resistance discipline (continuous refactoring + architectural hygiene)
- Complexity types:
  - Essential complexity: Complexity inherent to the problem domain and requirements.
  - Accidental complexity: Self-inflicted complexity from poor naming, tangled dependencies, convoluted control flow, needless abstractions, and hidden state.
  - Mandate: Ruthlessly eliminate accidental complexity; manage essential complexity via appropriate abstraction and boundaries.
- Rewrite warning:
  - Rule: Prefer evolutionary change over rewrites; rewrites are last resort and require explicit justification and migration plan.
  - Why: Rewrites often fail due to loss of institutional knowledge and underestimation of edge cases.

## Non-goals and Realities

- Myth busting:
  - Claim: Big O of 0
  - Status: invalid target
  - Explanation: Big-O describes growth with input size n. The best common targets are O(1) or O(log n) where possible, but many tasks must inspect all inputs, making O(n) optimal.
- Optimization paradox:
  - Default rule: Write clean code by default; optimize only after profiling identifies a real bottleneck.
  - Exception rule: When clean code is too slow, isolate the optimization behind clean interfaces/boundaries and document the tradeoff and measurements.
- Priority order:
  1. Correctness
  2. Clarity/maintainability
  3. Security
  4. Operational viability (observability, deployability)
  5. Performance (measured, not guessed)

## Agent Mandates

- Must read before coding: true
- Must apply for all changes: true
- No code until precheck complete: true
- Must not claim Big O zero: true
- Must define n for each algorithm: true
- Must produce complexity note for nontrivial logic: true
- Must produce cognitive complexity note for complex functions: true
- Must measure when performance claims are made: true
- Must instrument for observability when shipping features: true
- Must avoid globals and singletons: true
- Must use dependency injection for external dependencies: true
- Must document major architecture decisions with ADR: true

## Metrics and Thresholds

- Intent: Use metrics as heuristics to detect risk. Optimize for comprehension, not for gaming numbers.
- Cyclomatic complexity: Counts independent paths; useful but can mislead (e.g., flat switch may be readable).
- Cognitive complexity:
  - Definition: Heuristic for mental effort to understand code; increases with nesting, recursion, and control flow breaks.
  - Heuristics:
    - Green: max_score 10, guidance: Generally acceptable.
    - Yellow: min_score 11, max_score 15, guidance: Refactor if easy; ensure tests are strong.
    - Red: min_score 16, guidance: Treat as a black box risk. Must refactor, split, or provide explicit justification + extra tests.
  - Gate:
    - Blocker threshold: 16
    - Required actions if exceeded:
      - Reduce nesting via early returns and helper extraction
      - Split responsibilities or introduce parameter objects
      - Add targeted tests and property-based tests if appropriate
      - Document rationale if kept above threshold

## Paradigms and System Design

- Convergence of paradigms:
  - Prefer immutability and pure functions to reduce concurrency hazards.
  - Prefer explicit contracts (types, interfaces, type hints) to reduce runtime ambiguity.
- Functional core, imperative shell:
  - Rule: Keep domain/business logic as a functional core: pure functions, immutable data, deterministic behavior. Keep I/O and integration as an imperative shell: networking, persistence, UI, side effects.
  - Benefits: Testability, reasoning simplicity, concurrency safety, ease of optimization.
- Boundaries first:
  - Rule: Protect the domain (crown jewels) from volatile infrastructure (DB, frameworks, APIs).
  - Default architecture: Hexagonal (Ports and Adapters) / Clean Architecture dependency rule: dependencies point inward.

## Definitions

- n: The size of the relevant input (e.g., number of records, length of string, number of requests). Must be explicitly stated for each task/algorithm.
- Hot path: Code executed frequently (UI thread, high-traffic endpoints, tight loops, streaming). Hot paths require measurement-based performance gates.
- SLAP: Single Level of Abstraction Principle: a function should operate at one level of abstraction (avoid mixing orchestration with low-level details).
- Stepdown rule: Code should read top-down like a narrative; each level calls the next lower level, reducing context switching.
- CQS: Command-Query Separation: commands change state and return void/unit; queries return data and do not change state.
- Data clump: A set of values frequently passed together; indicates a missing concept that should become a parameter/value object.
- Flag argument: A boolean parameter that switches behavior; usually indicates the function does more than one thing and should be split.
- Law of Demeter: Only talk to immediate collaborators; avoid message chains like a.b().c().d() that couple you to internals.
- Hexagonal architecture: Ports and Adapters: isolate domain logic from infrastructure by defining ports (interfaces) in the core and implementing adapters outside.

## Guideline Matrix

- Naming: Variable Scope Rule — Length of variable name should be inversely proportional to its scope (short scope = short name; wide scope = descriptive).
- Naming: Function Scope Rule — Length of function name should be directly proportional to its scope (public = short/abstract, private = long/descriptive).
- Naming: Intent-Revealing — Names must answer: why it exists, what it does, how it is used.
- Functions: Do One Thing — Functions should do one thing at one level of abstraction (SLAP).
- Functions: CQS — Separate commands (state change) from queries (return value).
- Functions: Limit Arity — Max 3 arguments. Use parameter objects for more to avoid data clumps.
- SOLID: SRP — Separate code based on the actor responsible for change.
- SOLID: DIP — Depend on abstractions (interfaces), not concretions. Invert control using dependency injection.
- Structure: Composition > Inheritance — Avoid fragile base classes. Use composition for flexibility and decoupling.
- Structure: Law of Demeter — Talk only to immediate friends. Avoid train wrecks (a.b().c().d()).
- Arch: Hexagonal Architecture — Isolate domain from infrastructure using ports and adapters.
- State: Immutability — Default to immutable data structures to prevent side effects and race conditions.
- State: Avoid Globals — No singletons. Pass dependencies explicitly via constructor injection.
- Error: Exceptions — Use exceptions for errors, not control flow. Fail fast on invalid input.
- Testing: Testing Pyramid — Many unit tests, fewer integration tests, few end-to-end tests.
- Testing: Property-Based Testing — Use PBT to find edge cases and validate invariants rather than just examples.
- Ops: Observability — Log events, measure metrics, trace requests. Observability-driven development.
- Ops: 12-Factor — Build stateless, config-driven, strictly separated applications for cloud resilience.
- Meta: Boy Scout Rule — Always leave the code cleaner than you found it.
- Meta: YAGNI — Do not implement features until actually needed. Speculative generality is waste.

## Expanded Guidelines

### Naming Semantics

- Domain-driven naming: Use the domain’s ubiquitous language. If business says "Policy", code says "Policy" (not "Rule" or "Config").
- Verb uniformity: Avoid synonym aliasing. Standardize verbs across the codebase.
  - get: Local, fast access; no I/O.
  - fetch: Remote or potentially slow I/O.
  - find: Search that may return empty (null/option/result).
  - load: Hydrate from storage; may be slow.
  - compute: Pure calculation; no side effects.
- Boolean naming: Booleans must read as yes/no questions. Use is/has/can/should prefixes.
  - Avoid: isNotValid, notReady
  - Why: Negative booleans create double negatives and logic bugs.
- Collections naming: Collections imply plurality (users) or container type (userList/userSet) to prevent misuse.
- Interfaces vs implementations: Name interfaces by the abstraction (e.g., OrderRepository) and implementations by behavior/technology (e.g., SqlOrderRepository). Avoid redundant suffixes like Interface.
  - Note: If language ecosystem requires prefixes (e.g., IUser), follow repo conventions first.

### Function and Method Design

- Do one thing with nuance: A function does "one thing" when its internal steps are one level of abstraction below its name (SLAP). Stepdown rule required.
- Size vs depth synthesis: Prefer cohesion and conceptual unity over extreme fragmentation. Avoid shallow modules (too many tiny wrappers).
  - Healthy heuristics:
    - Typical lines: min 5, max 15 (heuristic only; complexity metrics and clarity matter more than line count)
    - Avoid poltergeists: Avoid functions that exist only to call another function unless it provides meaningful semantic naming or isolation.
- Arity rules: Max parameters 3. Prefer niladic, monadic, dyadic. Triadic allowed with caution; polyadic requires parameter object and justification.
- Data clumps: If 4+ values travel together, introduce a parameter/value object and move related behavior there.
- Flag arguments: Avoid boolean flags that change behavior. Split into two functions or use strategy/polymorphism.
  - Example transform: render(true) -> renderVisible(), renderHidden()
- CQS enforcement: Commands change state and return void/unit; queries return data and are side-effect free.
  - Exception policy: If a function must both mutate and return data, document why and add extra tests to prevent heisenbugs.

### SOLID Full Set

- SRP: Separate responsibilities by actor (who requests change). One module/class should not serve multiple unrelated actors.
  - Smell: Divergent change: one class changes for many reasons.
- OCP: Open for extension, closed for modification. Prefer polymorphism/strategies over modifying switches for new types.
  - Smell: Type-code switches that grow with every new feature.
- LSP: Subtypes must be substitutable for base types without breaking expectations.
  - Red flags: NotImplemented exceptions in derived class; derived class weakens postconditions or strengthens preconditions.
- ISP: Clients should not depend on methods they do not use. Split fat interfaces into role interfaces.
  - Smell: Robot forced to implement eat() because Worker has it.
- DIP: High-level policies should not depend on low-level details. Both depend on abstractions; inject implementations.
  - Mechanism: Dependency injection; define ports in the core, implement adapters outside.

### Architecture and Boundaries

- Dependency rule: Source code dependencies point inward toward high-level policies (domain/use-cases). Infrastructure depends on core, not the reverse.
- Ports and adapters:
  - Ports: Interfaces defined in the core (e.g., OrderRepository).
  - Adapters: Implementations in infrastructure (e.g., SqlOrderRepository, HttpPaymentGateway).
  - Testing benefit: Swap infrastructure adapters for in-memory or mock adapters to enable fast tests.
- Tell don’t ask: Prefer telling objects what to do over reaching through their internals (supports LoD).
  - Avoid: order.getCustomer().getAddress().getZipCode()
  - Prefer: order.getCustomerZipCode(), order.shipToPostalCode()
- Avoid global state: No global state, singletons, or hidden dependencies. Dependencies must be explicit in constructors or function parameters.

### Code Smells and Refactoring

- Bloaters:
  - Long method: Large method or cognitive complexity in red zone.
    - Treatments: Extract method, replace temp with query, introduce parameter object.
  - Large class: God object; many unrelated fields/methods; divergent change.
    - Treatments: Extract class, extract module, split by actor (SRP).
  - Primitive obsession: Domain concepts modeled as primitives (string zip code, int money).
    - Treatments: Replace data value with object; introduce value objects with validation/invariants.
- Couplers:
  - Feature envy: Method uses another class's data more than its own.
    - Treatments: Move method; introduce richer domain method on the owning class.
  - Inappropriate intimacy: Classes depend on each other's internals/private fields.
    - Treatments: Encapsulate fields; move method/field; introduce interface/port.
  - Message chains: Train wreck call chains.
    - Treatments: Hide delegate; tell-don't-ask; LoD refactor.
- Change preventers:
  - Shotgun surgery: One logical change requires many small edits across files.
    - Treatments: Move method/field to concentrate responsibility; introduce cohesive module boundary.
  - Divergent change: Single class changes for multiple reasons/actors.
    - Treatments: Extract class; split by responsibility/actor (SRP).

### Verification and Correctness

- Fail fast: Validate inputs at boundaries. Throw/return errors early, not deep inside the system.
- Exceptions vs return types: Use exceptions for exceptional conditions. For expected failure modes (e.g., parsing), prefer Try-pattern or Result/Either types (avoid exceptions as control flow).
- Design by contract: Define preconditions, postconditions, and invariants. Use assertions or explicit checks as appropriate.
  - Poka yoke: Design APIs that are hard to misuse (mistake-proofing).
- Testing strategy:
  - Testing pyramid: Many unit tests, fewer integration tests, few end-to-end tests.
  - TDD: When feasible, write tests first to force decoupled design.
  - Property-based testing: Use invariants/properties to generate many inputs and discover edge cases.
  - Mutation testing: Where quality is critical, use mutation testing to verify tests actually detect defects. Costly; apply selectively to core logic.

### Concurrency and Temporal Integrity

- Immutability default: Prefer immutable data and pure functions. Use mutation only when necessary and justified by profiling.
- Ownership thinking: Clarify who owns a resource, how it is shared, and when it is released, even in GC languages.
- Resource management:
  - RAII guidance: Tie resource lifetime to scope where language supports it; otherwise ensure deterministic cleanup patterns (try/finally, using/with).
  - Avoid: Leaking file handles, sockets, subscriptions, listeners.
- Async/await rules:
  - Do not block async flows with sync waits (deadlock/starvation risk). Propagate await upward.
  - Support cancellation for long-running operations (cancellation tokens/abort signals).
  - Time out external calls and handle retries with backoff only for appropriate failure modes.

### Operational Viability

- Twelve-factor selected:
  - Config: Store config in environment; do not hardcode secrets; do not commit .env files.
  - Backing services: Treat DB/queues as attached resources; bind via URLs/connection strings.
  - Processes: Stateless processes; externalize state (DB/Redis). No sticky sessions unless explicitly designed.
  - Disposability: Fast startup; graceful shutdown (handle termination signals, finish/abort safely).
  - Dev/prod parity: Keep environments similar; use containers where appropriate.
  - Logs: Treat logs as event streams; write to stdout/stderr; let infra aggregate.
- Observability-driven development:
  - Rule: Before shipping, answer: "How will we know if this breaks?" Add instrumentation as part of the feature.
  - Signals:
    - Logs: Discrete events with correlation IDs; avoid noisy "I am here" logs; never log secrets.
    - Metrics: Aggregates (latency, error rate, saturation); define alert thresholds where appropriate.
    - Traces: Distributed traces for cross-service requests; propagate trace context.

### Performance and Data-Oriented Design

- Clean code default: true
- When to optimize:
  - Profiling identifies a bottleneck
  - Hot path violates latency/throughput targets
  - Memory/GC pressure causes instability
- Allowed optimization exceptions:
  - Use mutation for locality/caching when measured
  - Inline code or reduce abstraction overhead when measured
  - Data-oriented layouts for tight loops when measured
- Isolation rule: Keep optimized code behind clean boundaries/interfaces. Document tradeoffs and benchmarks.

### Governance and Culture

- Code reviews:
  - Focus: Architecture, correctness, design, security, operational risk
  - Automate: Formatting, linting, basic static checks
  - Tone: Critique code, not coder; use questions to surface reasoning and risks.
- ADRs:
  - Rule: For significant decisions (architecture, storage, protocols, cross-cutting libraries), write an ADR: Context, Decision, Consequences, Status.
  - When required: New persistence technology or migration; cross-service contract change; new architectural pattern or major refactor; security model changes; new runtime/platform decision.
  - ADR template (json object): title, date, status, context, decision, consequences, alternatives_considered, references.
- Laws of software:
  - Conway’s law: System architecture mirrors team communication structure; design org boundaries to match desired module boundaries.
  - Hyrum’s law: All observable behaviors become depended upon; minimize surface area and treat changes carefully.
  - Gall’s law: Complex systems evolve from simple working systems; start simple and evolve.

## Workflow

- W0: Pre-Coding Clarification
  - Goal: Align on requirements and constraints before writing code.
  - Required outputs: requirements_summary, input_size_estimates, latency_or_throughput_target, edge_case_list, domain_terms_and_ubiquitous_language, data_structure_plan, initial_complexity_estimate, hot_path
  - Gate: Hard block if outputs missing. Failure action: Stop. Produce missing outputs before coding.
- W1: Design + Complexity + Boundary Check
  - Goal: Choose approach, boundaries, and data structures; prevent accidental complexity.
  - Required outputs: complexity_note, cognitive_complexity_risk_note, tradeoff_note, dependency_boundary_plan
  - Gate: Hard block if conditions missing. Failure action: Stop. Revise approach until justified.
- W2: Implementation
  - Goal: Write clean code: naming, function design, SOLID, boundary hygiene, safe state management.
  - Required outputs: code_changes, inline_documentation_if_needed
  - Gate: Soft gate; refactor before proceeding to tests if conditions fail.
- W3: Testing + Contracts
  - Goal: Prove correctness with robust tests and explicit contracts/invariants.
  - Required outputs: unit_tests, edge_case_tests, failure_case_tests, integration_tests_if_boundary_crossing, property_based_tests_if_applicable
  - Gate: Hard block if tests missing. Failure action: Stop. Add/repair tests before merge or release.
- W4: Quality Gates (Automation)
  - Goal: Enforce consistency via tools; reduce review noise.
  - Required outputs: formatter_pass, linter_pass, static_analysis_pass
  - Gate: Hard block if conditions fail. Failure action: Stop. Fix failures; do not bypass.
- W5: Observability + Ops Readiness
  - Goal: Ensure the feature is diagnosable and deploy-safe.
  - Required outputs: logging_plan, metrics_plan, tracing_plan_if_distributed, config_plan_12_factor_alignment
  - Gate: Hard block for production changes if conditions fail. Failure action: Stop. Add observability and config separation.
- W6: Performance Validation (When Relevant)
  - Goal: Measure performance and validate hot-path targets.
  - When required: hot_path == true; performance_target_specified == true; algorithmic_change_affects_scaling == true
  - Required outputs: benchmark_or_profile_results, performance_interpretation_note, optimization_isolation_note_if_optimized
  - Gate: Hard block for hot paths if conditions fail. Failure action: Stop. Measure and optimize before shipping.
- W7: PR / Review + ADR (If Needed)
  - Goal: Make review high-signal; document major decisions.
  - Required outputs: pr_description, risk_assessment, rollback_plan_if_needed, adr_if_required
  - Gate: Soft gate; improve PR or add ADR before requesting approval.

## Required Artifacts Templates

### Requirements Summary Template (plain text)

- What is being built (1–3 sentences)
- Inputs (types, expected ranges)
- Outputs (types, success criteria)
- Constraints (latency, memory, cost, security, locale/timezone)
- Domain terms (ubiquitous language)

### Complexity Note Template (json object)

- problem: string
- n_definition: string
- time_big_o: string
- space_big_o: string
- dominant_operations: [string]
- data_structures_used: [string]
- hidden_loop_risks_checked: [string]
- why_not_worse: string
- hot_path: boolean

### Cognitive Complexity Risk Note Template (json object)

- areas_at_risk: [string]
- expected_sources: [nesting, recursion, branching, exception_paths, async_flow]
- mitigations: [string]
- target_max_score: number

### Dependency Boundary Plan Template (json object)

- domain_core: [string]
- use_cases: [string]
- ports_interfaces: [string]
- adapters_infrastructure: [string]
- dependency_inversion_applied: boolean
- notes: string

### Observability Plan Template (json object)

- logs: [string]
- metrics: [string]
- traces: [string]
- correlation_ids: [string]
- privacy_notes: [string]

### PR Description Template (plain text)

- What changed
- Why it changed
- How it was tested
- Observability notes (logs/metrics/traces)
- Performance notes (if relevant)
- Security notes
- Risks + rollback plan

## Automation Gates

### Required in CI

- G1: format (severity if fail: BLOCKER)
- G2: lint (severity if fail: BLOCKER)
- G3: unit_tests (severity if fail: BLOCKER)
- G4: static_analysis (severity if fail: BLOCKER)

### Recommended in CI

- G5: dependency_scan (severity if fail: HIGH)
- G6: secret_scan (severity if fail: HIGH)
- G7: coverage_threshold (severity if fail: MEDIUM)
- G8: mutation_testing_for_core_logic (severity if fail: MEDIUM)

### Hot-path Additions

- G9: benchmark_or_profile_required (severity if fail: BLOCKER_FOR_HOT_PATH)

## Agent Self-Review Prompts

- What is the domain language here, and do my identifiers match it?
- What is n, and what are my time and space Big-O?
- Did I accidentally create O(n^2) via hidden loops (contains/includes, nested searches, sorts in loops)?
- Does the code minimize accidental complexity (naming, control flow, dependency tangles)?
- Does each function do one thing at one abstraction level (SLAP + stepdown rule)?
- Did I avoid flag arguments and keep arity <= 3 (or use a parameter object)?
- Did I separate commands from queries (CQS)?
- Did I apply SOLID (especially OCP/ISP/LSP) where it matters, not as ceremony?
- Did I avoid globals/singletons and inject dependencies explicitly?
- Does the domain core remain independent of infrastructure (dependency rule)?
- Did I identify smells (long method, shotgun surgery, primitive obsession) and refactor appropriately?
- Do tests cover happy path, edge cases, and failure cases? Is the pyramid shape reasonable?
- Is there observability: logs, metrics, traces, with correlation IDs and no secrets?
- If this is a hot path, did I measure with profiling/benchmarks before optimizing?
- Did I apply YAGNI and leave the code cleaner than I found it?

## Exception Policy

- Rule: Exceptions to rules are allowed only with explicit documentation and must not skip BLOCKER items without approval.
- Required exception fields:
  - exception_reason
  - which_checks_skipped
  - risk_assessment
  - mitigation_plan
  - benchmark_or_evidence_if_performance_related
  - follow_up_ticket

## Output Requirements for the Agent

### Before Any Code Output

- Provide requirements_summary
- Provide domain_terms_and_ubiquitous_language
- Provide complexity_note (time + space) for any nontrivial logic
- Provide cognitive_complexity_risk_note if logic is branching/nested/async-heavy
- List edge cases
- State whether hot_path is true/false
- State whether the change touches: security, performance hot paths, architecture boundaries

### With Code Output

- Brief explanation of approach and boundaries
- How naming aligns with domain language and verb conventions
- How tests cover happy/edge/failure paths (and PBT/mutation if used)
- Any security considerations and input validation strategy
- Observability notes (logs/metrics/traces, correlation IDs, privacy)
- If hot_path or performance-sensitive: include measurement results or plan
- If architectural change: show ports/adapters and dependency direction
- If any rule exceptions: include exception_policy documentation
