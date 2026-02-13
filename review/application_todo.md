# Application TODO List

Date: 2026-02-13

## High Priority

- [x] Add CI pipeline gate for `npm run lint`, `npm run security:check`, `npm run audit`, and stable test/build commands.
- [x] Fix blocked quality gates: resolve build termination and vitest queue hang so checks are enforceable.
- [x] Add unit tests for security boundary logic:
  - skip-score sanitization/parsing
  - invalid puzzle ID rejection in game actions
- [x] Define and apply versioning policy (complete HIGH-003 from task priority).

## Medium Priority

- [x] Strengthen CI automation baseline (manual dispatch trigger, concurrency cancellation, timeout, and build artifact upload).
- [x] Decompose `AppContent` in `src/App.tsx` into smaller components/hooks to lower cognitive complexity.
- [x] Deduplicate Sudoku validation logic into a single reusable module.
- [x] Introduce structured client logging schema (level/event/context/correlation id).
- [x] Add complexity notes ($n$, time, space) for nontrivial paths (`gameState`, puzzle selection, board validation).

## Low Priority

- [x] Add code-splitting/lazy loading to reduce bundle cost.
- [x] Add ADR template and record key architecture decisions.
- [x] Add optional enhanced scans (OSV/Snyk/CodeQL) once CI baseline is stable.
