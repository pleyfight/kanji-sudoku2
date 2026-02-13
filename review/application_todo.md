# Application TODO List

Date: 2026-02-13

## High Priority

- [ ] Add CI pipeline gate for `npm run lint`, `npm run security:check`, `npm run audit`, and stable test/build commands.
- [ ] Fix blocked quality gates: resolve build termination and vitest queue hang so checks are enforceable.
- [ ] Add unit tests for security boundary logic:
  - skip-score sanitization/parsing
  - invalid puzzle ID rejection in game actions
- [ ] Define and apply versioning policy (complete HIGH-003 from task priority).

## Medium Priority

- [ ] Decompose `AppContent` in `src/App.tsx` into smaller components/hooks to lower cognitive complexity.
- [ ] Deduplicate Sudoku validation logic into a single reusable module.
- [ ] Introduce structured client logging schema (level/event/context/correlation id).
- [ ] Add complexity notes ($n$, time, space) for nontrivial paths (`gameState`, puzzle selection, board validation).

## Low Priority

- [ ] Add code-splitting/lazy loading to reduce bundle cost.
- [ ] Add ADR template and record key architecture decisions.
- [ ] Add optional enhanced scans (OSV/Snyk/CodeQL) once CI baseline is stable.
