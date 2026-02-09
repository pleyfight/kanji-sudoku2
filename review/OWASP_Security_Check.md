# AGENTS_Code_Check

- Spec version: 1.0.0
- Role: Senior Software Security Expert
- Purpose: Run comprehensive code quality, correctness, security, performance, reliability, and technical-debt checks on changes before delivery.

## Required Agent Output

- Summary: What passed/failed and why (high-level).
- Risk register: Ranked issues with severity, likelihood, blast_radius, and remediation.
- Patches or diffs: Exact fixes or recommended diffs with tradeoffs.
- Proof: Commands run, key logs, and test evidence (links/snippets).
- Next actions: What is blocked and what info is needed.

## Inputs Required

- Repo root: Path to repository root.
- Build and test commands: Project-specific commands (or allow auto-detect).
- Runtime targets: OS/arch and deployment environment(s).
- Language versions: Compiler/interpreter and toolchain versions.
- CI constraints: Time/memory limits, required checks, and gating rules.
- Non-functional requirements:
	- Latency SLO: Target latency (e.g., p95/p99).
	- Throughput: Expected QPS/throughput.
	- Memory budget: Peak/steady memory constraints.
	- Availability: Availability or reliability target.
	- Cost budget: Compute/network/storage cost constraints.
	- Security posture: Authn/authz model, data sensitivity, compliance.
- Contracts:
	- API specs: OpenAPI/GraphQL/Proto schemas as applicable.
	- Data schemas: DB schema and migration expectations.
	- Interface boundaries: Module/service boundaries and ownership.
- Failure modes: What must never happen (data loss, privilege escalation, etc.).

## Stop Conditions

| ID | Condition | Severity |
| --- | --- | --- |
| STOP_BUILD_FAIL | Build fails or does not reproduce from clean state | blocker |
| STOP_TEST_FAIL | Any required test suite fails | blocker |
| STOP_SECURITY_HIGH | High/critical security issue found with no accepted mitigation | blocker |
| STOP_HOTPATH_UNKNOWN | Hot-path Big-O / performance regression risk unknown | blocker |
| STOP_AUTHZ_MISSING | Authorization missing/incorrect on privileged operations | blocker |
| STOP_DATA_CORRUPTION_RISK | Unhandled edge cases likely to cause crashes or data corruption | blocker |
| STOP_OBSERVABILITY_INSUFFICIENT | Insufficient observability to debug in production for changed behavior | blocker |

## Complexity Reference

### Big-O Categories

- O(1): Constant-time operations
- O(log n): Divide-and-conquer / balanced tree operations
- O(n): Linear scaling
- O(n^2): Quadratic growth (often nested loops)

### Performance Axes

- time_complexity_speed
- space_complexity_memory
- transmission_performance_io_roundtrips_and_bytes
- power_consumption_energy
- real_time_response_deadlines_tail_latency_jitter

## Check Groups

### PREFLIGHT: Understand the Change

- PF_001_INTENT: Change intent and impact mapping (analysis, high)
	- Pass criteria: Changed files/modules identified; user-visible impact and acceptance criteria stated; sensitive areas flagged (auth, crypto, payments, PII, I/O, concurrency, migrations, critical paths)
	- Evidence required: diff_summary, impact_notes
- PF_002_DEPENDENCIES: Dependency and environment sanity (analysis, high)
	- Pass criteria: Lockfiles consistent; no accidental local-only assumptions; licenses checked if policy requires
	- Evidence required: lockfile_status, toolchain_versions
- PF_003_CODE_REVIEW: Code review & change management (process, medium)
	- Pass criteria: Diff is small/focused or logically staged; readability prioritized over cleverness; review feedback incorporated into code/docs; sensitive areas reviewed by appropriate owner(s)
	- Evidence required: review_notes_or_rationale

### CORRECTNESS: Correctness Checks

- CR_001_CLEAN_BUILD: Clean build from scratch (command, blocker)
	- Command placeholders: <clean_build_command>
	- Pass criteria: Build succeeds with no new warnings (or warnings-as-errors pass)
	- Evidence required: build_log
- CR_002_SMOKE_RUN: Runtime smoke test (command, high)
	- Command placeholders: <smoke_run_command>
	- Pass criteria: App starts; config/env validated; graceful shutdown works; no hangs or obvious runtime errors
	- Evidence required: runtime_log
- CR_003_CONTRACTS: Assertions, contracts, and error handling (analysis, high)
	- Pass criteria: Preconditions/postconditions/invariants are correct; no silent failures; errors are meaningful and consistent
	- Evidence required: notes_contracts
- CR_004_EDGE_CASES: Edge-case pass (analysis, high)
	- Pass criteria: Null/empty/invalid inputs handled; boundary conditions verified (off-by-one, timezones, encoding); retry loops bounded (no infinite loops or storms)
	- Evidence required: edge_case_list, tests_or_notes

### TESTING: Testing (Confidence Engineering)

- TS_000_PYRAMID: Test pyramid suite design (analysis, medium)
	- Pass criteria: Suite stays pyramid-shaped (many unit, fewer integration, few E2E); E2E tests kept minimal and high-value; flaky/slow tests are quarantined or fixed
	- Evidence required: test_suite_notes
- TS_001_UNIT: Unit tests (command, high)
	- Command placeholders: <unit_test_command>
	- Pass criteria: Unit tests pass; includes happy-path, boundary, invalid inputs, and regressions for fixed bugs
	- Evidence required: unit_test_report
- TS_002_INTEGRATION: Integration tests (command, high)
	- Command placeholders: <integration_test_command>
	- Pass criteria: Integration tests pass; migrations/transactions/idempotency validated where applicable
	- Evidence required: integration_test_report
- TS_003_E2E: E2E/system tests (command, medium)
	- Command placeholders: <e2e_test_command>
	- Pass criteria: E2E tests pass (if applicable); auth, rate limits, cross-service compatibility verified
	- Evidence required: e2e_test_report
- TS_004_PROPERTY: Property-based testing (optional, medium)
	- When to apply: parsers, serializers, rules_engines, data_transformations
	- Command placeholders: <property_test_command>
	- Pass criteria: Properties/invariants hold across generated inputs
	- Evidence required: property_test_report
- TS_005_FUZZ: Fuzz testing (optional, high)
	- When to apply: deserialization, regex_heavy, file_uploads, user_strings, protocol_parsing
	- Command placeholders: <fuzz_command>
	- Pass criteria: No crashes, hangs, or critical findings under fuzzing budget
	- Evidence required: fuzz_summary
- TS_006_MUTATION: Mutation testing (optional, medium)
	- When to apply: core_logic_modules
	- Command placeholders: <mutation_test_command>
	- Pass criteria: Key mutants killed; weak areas identified and improved
	- Evidence required: mutation_report
- TS_007_COVERAGE: Coverage sanity check (analysis, low)
	- Pass criteria: Coverage used to find blind spots (not worshipped); critical paths have meaningful tests
	- Evidence required: coverage_report_or_notes

### OBSERVABILITY: Debugging & Observability Readiness

- OB_001_LOGGING: Logging hygiene (analysis, high)
	- Pass criteria: Structured logs (if standard); no secrets/PII in logs; correlation/request IDs present where applicable; correct log levels used
	- Evidence required: logging_notes
- OB_002_METRICS: Metrics for latency/error/saturation/throughput (analysis, medium)
	- Pass criteria: Key KPIs instrumented; cardinality controlled; dashboards/alerts updated if needed
	- Evidence required: metrics_notes
- OB_003_TRACING: Distributed tracing readiness (analysis, medium)
	- Pass criteria: Spans and context propagate across boundaries; sampling strategy does not hide important failures
	- Evidence required: tracing_notes
- OB_004_ERROR_REPORTING: Error reporting and safe messages (analysis, high)
	- Pass criteria: Stack traces preserved internally; user-facing errors are safe and do not leak sensitive info
	- Evidence required: error_handling_notes
- OB_005_SLOS: SLO/SLI and error budget alignment (analysis, medium)
	- Pass criteria: Relevant SLIs and SLO targets defined (if service); load/stress tests map to p95/p99 latency and failure rate goals; release decisions consider error budget
	- Evidence required: slo_notes

### CODE_QUALITY: Code Quality (Clean, Maintainable, Readable)

- CQ_001_FORMAT_LINT: Formatting and lint clean (command, high)
	- Command placeholders: <format_command>, <lint_command>
	- Pass criteria: Formatter applied; no new lint warnings
	- Evidence required: lint_report
- CQ_002_STRUCTURE: Structure, modularity, and boundaries (analysis, high)
	- Pass criteria: Clear boundaries (UI/domain/infra); minimal cyclic dependencies; functions/classes are cohesive; no unnecessary abstractions
	- Evidence required: architecture_notes
- CQ_003_DOCS: Documentation and intent (analysis, medium)
	- Pass criteria: Public APIs documented; gotchas documented near code; README/ADRs/changelog updated if behavior changed
	- Evidence required: doc_updates

### PERFORMANCE: Complexity & Systems Performance

- PFM_001_BIGO: Big-O review on hotspots (analysis, high)
	- Pass criteria: Hot functions/endpoints have stated time and space complexity; regressions avoided (e.g., O(n log n) -> O(n^2)); I/O complexity stated as calls and bytes where relevant
	- Evidence required: bigo_notes
- PFM_002_TIME: Time complexity (speed) checks (analysis, medium)
	- Pass criteria: Critical paths identified; profiling/benchmarks used where needed; no unnecessary heavy regex/allocations in hot loops
	- Evidence required: benchmark_or_profile_notes
- PFM_003_SPACE: Space complexity (memory) checks (analysis, medium)
	- Pass criteria: Peak memory behavior understood; no unbounded caches/queues; streaming used instead of full buffering where appropriate
	- Evidence required: memory_notes
- PFM_004_TRANSMISSION: Transmission performance (network/storage I/O) (analysis, medium)
	- Pass criteria: Round-trips minimized (batching, avoid N+1); bytes minimized (field selection, compression where appropriate); timeouts/retries prevent amplification; backpressure handled for streaming
	- Evidence required: io_notes
- PFM_005_POWER: Power consumption (energy) (analysis, low)
	- When to apply: mobile, edge, iot, battery_sensitive
	- Pass criteria: Avoid polling where possible; batch network operations; avoid CPU-heavy loops on main/UI thread; background tasks respect platform constraints
	- Evidence required: power_notes
- PFM_006_REALTIME: Real-time response time checks (analysis, high)
	- When to apply: real_time_systems, ui_interaction_deadlines, audio_video, control_loops
	- Pass criteria: Latency targets defined (avg, p95/p99, worst-case if needed); bounded work per tick/frame; heavy work offloaded; load tests validate jitter/tail latency
	- Evidence required: realtime_notes
- PFM_007_ALT_APPROACH: Algorithmic alternatives considered (analysis, medium)
	- Pass criteria: At least one alternative considered when complexity/I-O is high; preference given to reducing I/O count/bytes before micro-optimizations
	- Evidence required: alternatives_notes

### RELIABILITY: Robustness & Reliability

- RL_001_FAILURE_HANDLING: Timeouts, retries, backoff/jitter, circuit breakers (analysis, high)
	- Pass criteria: External calls have timeouts; retries are bounded with backoff/jitter; circuit breaking or bulkheads used where appropriate; graceful degradation exists for partial failures
	- Evidence required: reliability_notes
- RL_002_CONCURRENCY: Concurrency safety (analysis, high)
	- Pass criteria: No obvious race conditions/deadlocks; shared mutable state controlled; thread safety of used libraries verified where relevant
	- Evidence required: concurrency_notes
- RL_003_RESOURCES: Resource management (leaks, bounds) (analysis, high)
	- Pass criteria: Files/sockets/DB connections closed; caches/queues bounded; leak risks addressed
	- Evidence required: resource_notes
- RL_004_IDEMPOTENCY: Idempotency and consistency (analysis, medium)
	- Pass criteria: Idempotency ensured where required; transaction boundaries explicit; replays/retries safe
	- Evidence required: idempotency_notes
- RL_005_LOAD_STRESS_SOAK_SPIKE: Load/stress/soak/spike testing (optional, high)
	- When to apply: services, performance_sensitive, scaling_changes
	- Command placeholders: <load_test_command>, <stress_test_command>, <soak_test_command>, <spike_test_command>
	- Pass criteria: Breaking point identified; failure mode documented; recovery time validated; bottlenecks identified and tracked
	- Evidence required: load_test_results
- RL_006_CHAOS_GAMEDAY: Chaos engineering and game days (optional, medium)
	- When to apply: critical_systems, high_availability
	- Pass criteria: Steady-state metrics defined; hypothesis-driven fault injection executed safely; blast radius minimized; runbooks validated in a game day
	- Evidence required: chaos_report

### SECURITY: Security (Non-Negotiable)

- SEC_001_THREAT_MODEL: Lightweight threat model (analysis, high)
	- Pass criteria: Assets, attackers, entry points identified; trust boundaries noted; abuse cases considered
	- Evidence required: threat_model_notes
- SEC_002_INPUT_VALIDATION: Input validation and output encoding (analysis, high)
	- Pass criteria: Inputs validated at boundaries; outputs encoded appropriately (web/templating contexts)
	- Evidence required: validation_notes
- SEC_003_INJECTION: Injection defenses (analysis, blocker)
	- Pass criteria: Parameterized queries used; no command/path traversal exposure; template contexts safe; web apps handle CSRF/XSS appropriately
	- Evidence required: injection_notes
- SEC_004_AUTHZ: Authorization correctness (analysis, blocker)
	- Pass criteria: Authorization enforced for every protected action; no trusting the client; least privilege applied
	- Evidence required: authz_notes
- SEC_005_CRYPTO: Cryptography sanity (analysis, high)
	- Pass criteria: Vetted crypto libraries used; no custom crypto; secure randomness; correct key sizes/modes/rotation capability
	- Evidence required: crypto_notes
- SEC_006_SECRETS: Secret handling (analysis, blocker)
	- Pass criteria: No hardcoded secrets; secrets excluded from logs; rotation supported
	- Evidence required: secrets_scan_notes
- SEC_007_SAST_DAST: Security testing (optional, high)
	- Command placeholders: <sast_command>, <dast_command>
	- Pass criteria: No high/critical findings without mitigation; false positives documented with rationale
	- Evidence required: security_test_reports
- SEC_008_DEP_VULNS: Dependency vulnerability scanning (command, high)
	- Command placeholders: <dependency_scan_command>
	- Pass criteria: No known high/critical vulns without mitigation plan; versions pinned via lockfiles
	- Evidence required: dependency_scan_report
- SEC_009_SUPPLY_CHAIN: Supply chain security (optional, medium)
	- When to apply: releases, production_builds, regulated_environments
	- Pass criteria: SBOM produced/updated; artifact/build integrity verified; provenance recorded (consider SLSA-style requirements)
	- Evidence required: sbom_or_provenance_notes

### TECH_DEBT: Technical Debt & Software Decay

- TD_001_DEBT_SCAN: Debt/rot/erosion scan (analysis, medium)
	- Pass criteria: Hotspots identified (churn+bugs, coupling, complexity, fear zones); accidental complexity reduced where feasible; bloat/glut addressed (dead code, zombie flags/endpoints, junk-drawer utils); architecture/design erosion prevented (layer violations, god modules)
	- Evidence required: debt_scan_notes
- TD_002_LEGACY_STRATEGY: Legacy code modernization safety (analysis, medium)
	- Pass criteria: Characterization tests added before risky refactors; seams created to isolate side effects; micro-step refactoring used; strangler pattern considered over big-bang rewrite
	- Evidence required: legacy_plan_notes
- TD_003_INFRA_DEBT: Infrastructure debt checks (analysis, medium)
	- Pass criteria: CI determinism improved (pinned toolchains, reproducibility); EOL runtimes/images addressed; IaC drift avoided/detected; observability/runbooks adequate
	- Evidence required: infra_debt_notes
- TD_004_DEBT_REGISTER: Debt Register entry (deliverable, medium)
	- Pass criteria: Debt item described with type, impact, evidence, fix plan (S/M/L), and risk of doing nothing
	- Evidence required: debt_register_entry

### QUALITY_MODEL: Quality Model Cross-Check

- QM_001_ISO_25010: ISO/IEC 25010 sanity pass (analysis, low)
	- Pass criteria: Functional suitability checked; performance efficiency checked; compatibility/backwards compatibility checked; usability/accessibility checked where applicable; reliability checked; security checked; maintainability (modularity/testability) checked; portability/deployability checked
	- Evidence required: quality_model_notes

### CI_AUTOMATION: CI/Automation & Runtime Hygiene

- CI_001_PIPELINE: Single-command pipeline exists or documented (analysis, high)
	- Pass criteria: format -> lint -> typecheck -> unit -> integration -> e2e -> security -> build/package is runnable; deterministic builds where possible
	- Evidence required: pipeline_notes
- CI_002_RUNTIME_HYGIENE: Runtime hygiene (analysis, medium)
	- Pass criteria: Config separated from code; logs treated as event streams; fast startup + graceful shutdown; dev/staging/prod parity maintained
	- Evidence required: runtime_hygiene_notes

### FINAL_SIGNOFF: Final Sign-Off

- FS_001_SIGNOFF: Explicit sign-off checklist (deliverable, blocker)
	- Pass criteria: Formatting + lint clean; type checks clean (if applicable); required tests run and pass; Big-O reviewed for hotspots; security checks completed; technical debt/decay scan completed (Debt Register if needed); docs updated if needed; no known critical bugs remaining
	- Evidence required: signoff_statement, proof_bundle

## Language Tooling Templates

### JavaScript/TypeScript

- Format: prettier
- Lint: eslint
- Typecheck: tsc
- Tests: jest, vitest, playwright, cypress
- Security: npm audit, osv-scanner

### Python

- Format: black, ruff format
- Lint: ruff, pylint
- Typecheck: mypy, pyright
- Tests: pytest, hypothesis, coverage
- Security: bandit, pip-audit, osv-scanner

### Go

- Format: gofmt, goimports
- Lint: golangci-lint
- Tests: go test -race
- Security: govulncheck

### Java/Kotlin

- Format: spotless, ktlint
- Lint: checkstyle, detekt
- Tests: junit
- Security: dependency-check, osv-scanner

### Rust

- Format: rustfmt
- Lint: clippy
- Tests: cargo test
- Security: cargo audit

### C/C++

- Lint: clang-tidy, cppcheck
- Sanitizers: ASan, UBSan, TSan
- Fuzzing: libFuzzer, AFL

## Agent Execution Rules

- Do not invent commands.
- Auto-detect when possible.
- Prefer measure over guess.
- Always document tradeoffs.
- Always include repro steps.
- Never mark complete if a stop condition is triggered.
