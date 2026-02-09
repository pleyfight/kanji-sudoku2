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
  - id: HIGH-001
  - name: Complete discovery + MVP definition
  - goal: Fill in PRD discovery questionnaire and MVP definition fields.
  - priority_reason: PRD requires discovery and MVP definition before production changes.
  - dependencies: []
  - blocks: [HIGH-002, HIGH-003, MEDIUM-001, MEDIUM-002]
  - related_areas: [frontend, observability, qa]
  - expected_outcome: PRD populated with product/user, MVP scope, and success criteria.
  - risks: [incomplete requirements, rework]

  - id: HIGH-002
  - name: Add testing gate (unit + smoke)
  - goal: Add a test runner, scripts, and at least one smoke test.
  - priority_reason: PRD mandates tests before advancing steps.
  - dependencies: [HIGH-001]
  - blocks: [MEDIUM-001, MEDIUM-002]
  - related_areas: [qa, frontend]
  - expected_outcome: npm scripts for tests; baseline test coverage for critical flows.
  - risks: [tests not running in CI, flaky tests]

  - id: HIGH-003
  - name: Define versioning impact per step
  - goal: Introduce version impact recording and bump version from 0.0.0.
  - priority_reason: PRD requires version impact and rationale per completed step.
  - dependencies: [HIGH-001]
  - blocks: []
  - related_areas: [infrastructure, qa]
  - expected_outcome: Version policy applied in repo and PRD memory updates.
  - risks: [inconsistent versioning]

  - id: HIGH-004
  - name: Block inputs while paused
  - goal: Prevent board edits when game is paused.
  - priority_reason: Correctness and UX integrity (paused state should freeze state).
  - dependencies: [HIGH-001]
  - blocks: []
  - related_areas: [frontend, qa]
  - expected_outcome: Inputs ignored while paused in all input paths.
  - risks: [incomplete input gating]

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

  - id: MEDIUM-006
  - name: Dependency vulnerability scan gate
  - goal: Add `npm audit` (and optional OSV scan) scripts and document usage.
  - priority_reason: OWASP checklist requires dependency vulnerability scanning.
  - dependencies: [HIGH-001]
  - related_areas: [security, qa]
  - expected_outcome: Security scan commands documented and runnable.

### LOW

- Description: Deferred or nice-to-have tasks
- Tasks:
  - id: LOW-001
  - name: Code-splitting for large bundle
  - goal: Reduce Vite bundle size warning via lazy loading.
  - defer_reason: Not blocking MVP correctness or testing gates.
  - future_value: Faster initial load and improved performance.

  - id: LOW-002
  - name: ADR templates and initial ADRs
  - goal: Add ADR template and document major architecture decisions.
  - defer_reason: No major architecture change right now.
  - future_value: Clear decision history and reduced future ambiguity.

## Completed Tasks

- id:
- name:
- priority_at_execution: HIGH | MEDIUM | LOW
- summary:
- files_touched: []
- tests_executed: []
- version_impact: MAJOR | MINOR | PATCH | NONE

## Reprioritization Log

- date:
- change:
- reason:
- impact:

## Agent Notes

-
