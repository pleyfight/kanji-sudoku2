# TASK_PRIORITY

## Meta

- File type: TASK_PRIORITY
- Authority: execution_order
- Maintained by: agent

## Context Summary

- Product description: Kanji-based Sudoku puzzle game (frontend-only).
- MVP goal: Stable playable game with clear UX, error resilience, and basic quality gates.
- Constraints: Frontend-only; Vercel deploy; lightweight toolchain preferred.
- Assumptions: No backend yet; observability uses client logs until a logging backend is chosen.

## Priority Rules

1. HIGH priority tasks must be completed before MEDIUM.
2. MEDIUM priority tasks must be completed before LOW.
3. Working on a lower-priority task while a higher-priority task exists is a protocol violation.
4. All reprioritization must be documented.

## Priorities

### HIGH

- Description: Foundational, blocking, or MVP-critical tasks
- Tasks:
  - id: HIGH-002
  - name: Add testing gate (unit + smoke)
  - goal: Add a test runner, scripts, and at least one smoke test.
  - priority_reason: PRD mandates tests before advancing steps.
  - dependencies: [HIGH-001]
  - blocks: [MEDIUM-001, MEDIUM-002]
  - related_areas: [qa, frontend]
  - expected_outcome: npm scripts for tests; baseline test coverage for critical flows.
  - risks: [tests not running in CI, flaky tests]
  - status: BLOCKED (Vitest hangs — root cause is HIGH-005)

  - id: HIGH-003
  - name: Define versioning impact per step
  - goal: Introduce version impact recording and bump version from 0.0.0.
  - priority_reason: PRD requires version impact and rationale per completed step.
  - dependencies: [HIGH-001]
  - blocks: []
  - related_areas: [infrastructure, qa]
  - expected_outcome: Version policy applied in repo and PRD memory updates.
  - risks: [inconsistent versioning]
  - status: PARTIALLY DONE (version 0.1.0 declared in PRD; package.json version TBD)

  - id: HIGH-005
  - name: Fix bundle size — move puzzle JSON to async loading
  - goal: Replace eager `import.meta.glob` of ~170 MB JSON with async fetch from `public/data/puzzles/`.
  - priority_reason: Root cause of build termination and Vitest hang. Blocks HIGH-002 and all CI tasks.
  - dependencies: [HIGH-001]
  - blocks: [HIGH-002, MEDIUM-002]
  - related_areas: [frontend, performance, qa]
  - expected_outcome: Build completes; tests execute; initial load under 5 MB.
  - risks: [async loading adds complexity to puzzle initialization]
  - promoted_from: LOW-001

### MEDIUM

- Description: Important but non-blocking tasks
- Tasks:
  - id: MEDIUM-001
  - name: Observability schema
  - goal: Define structured client logging format and correlation ID strategy.
  - priority_reason: PRD requires structured logs and consistent taxonomy.
  - dependencies: [HIGH-001]
  - related_areas: [observability, frontend]
  - expected_outcome: Logging helper and documented log schema.

  - id: MEDIUM-002
  - name: CI automation baseline
  - goal: Add a simple pipeline definition (format/lint/typecheck/test/build).
  - priority_reason: PRD requires quality gates and runnable pipeline.
  - dependencies: [HIGH-002]
  - related_areas: [infrastructure, qa]
  - expected_outcome: CI job that matches PRD quality gate expectations.

  - id: MEDIUM-003
  - name: Deduplicate Sudoku logic
  - goal: Consolidate Sudoku generation/validation to a single module.
  - priority_reason: Reduces divergence risk and accidental complexity.
  - dependencies: [HIGH-001]
  - related_areas: [frontend]
  - expected_outcome: Single source of truth for Sudoku rules.

  - id: MEDIUM-004
  - name: Decompose AppContent
  - goal: Split large view logic into smaller components/hooks.
  - priority_reason: Cognitive complexity and SRP alignment.
  - dependencies: [HIGH-001]
  - related_areas: [frontend]
  - expected_outcome: Clearer boundaries and improved readability.

  - id: MEDIUM-005
  - name: Add complexity notes for nontrivial logic
  - goal: Document $n$, time, and space complexity for core algorithms.
  - priority_reason: Code Efficiency Check requires explicit complexity notes.
  - dependencies: [HIGH-001]
  - related_areas: [frontend, qa]
  - expected_outcome: Complexity notes documented near core logic.

  - id: MEDIUM-007
  - name: Fix getDifficultyFromId ID range mismatch
  - goal: Consolidate conflicting ID range mappings in App.tsx and data/puzzles/types.ts.
  - priority_reason: Correctness — different functions return different difficulties for the same puzzle ID.
  - dependencies: []
  - related_areas: [frontend]
  - expected_outcome: Single source of truth for puzzle ID → difficulty mapping.

  - id: MEDIUM-008
  - name: Consolidate fragmented i18n labels
  - goal: Move per-component label dicts (HomeMenu, Controls, VictoryModal, Settings, App.tsx hardcoded strings) into centralized labels.ts.
  - priority_reason: Reduces shotgun surgery for language changes; aligns with DRY and SRP.
  - dependencies: []
  - related_areas: [frontend]
  - expected_outcome: Single labels.ts with all user-facing strings.

### LOW

- Description: Deferred or nice-to-have tasks
- Tasks:
  - id: LOW-002
  - name: ADR templates and initial ADRs
  - goal: Add ADR template and document major architecture decisions.
  - defer_reason: No major architecture change right now.
  - future_value: Clear decision history and reduced future ambiguity.

  - id: LOW-003
  - name: Wire FailureModal component
  - goal: FailureModal.tsx is defined but never rendered; connect it to isFailed state.
  - defer_reason: Expert mode failure path is secondary to core gameplay.
  - future_value: Complete expert mode UX.

  - id: LOW-004
  - name: Remove dead code modules
  - goal: Delete sudoku.ts, boardGenerator.ts, and constants.ts (confirmed not imported anywhere).
  - defer_reason: Dead code is harmless; removal can wait for a cleanup pass.
  - future_value: Reduced confusion and codebase size.

## Completed Tasks

- id: HIGH-001
- name: Complete discovery + MVP definition
- priority_at_execution: HIGH
- summary: PRD discovery questionnaire filled with product, user, and technical defaults. MVP definition populated.
- files_touched: [review/PRD.md]
- tests_executed: []
- version_impact: NONE

- id: HIGH-004
- name: Block inputs while paused
- priority_at_execution: HIGH
- summary: Inputs gated while paused across all input paths in gameState.ts.
- files_touched: [src/lib/gameState.ts]
- tests_executed: []
- version_impact: PATCH

- id: MEDIUM-006
- name: Dependency vulnerability scan gate
- priority_at_execution: MEDIUM
- summary: Added npm audit script and documented usage.
- files_touched: [package.json]
- tests_executed: [npm run audit — 0 vulnerabilities]
- version_impact: NONE

## Reprioritization Log

- date: 2026-02-12
- change: LOW-001 (Code-splitting for large bundle) promoted to HIGH-005 (Fix bundle size — move puzzle JSON to async loading)
- reason: 170 MB of JSON eagerly imported via import.meta.glob causes Vite build termination and Vitest hang. This blocks HIGH-002 (testing) and MEDIUM-002 (CI). Root cause of both documented blockers.
- impact: HIGH-005 now blocks HIGH-002 and MEDIUM-002.

- date: 2026-02-12
- change: Added MEDIUM-007 (getDifficultyFromId mismatch), MEDIUM-008 (i18n consolidation), LOW-003 (wire FailureModal), LOW-004 (remove dead code)
- reason: Discovered during comprehensive code review.
- impact: No blocking changes; expands backlog with review-identified issues.

## Agent Notes

- sudoku.ts, boardGenerator.ts, and constants.ts are confirmed dead code (not imported anywhere in src/).
- Build and Vitest failures are both caused by puzzle JSON bundle size — fix HIGH-005 first.
- Version 0.1.0 declared in PRD but not yet in package.json (part of HIGH-003).
