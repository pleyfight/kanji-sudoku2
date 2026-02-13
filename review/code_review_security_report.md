# Code Review Security Report

Date: 2026-02-13
Scope: Frontend game state, puzzle loading/selection, persistence boundaries, and project security gates.

## Summary

- Passed: Linting, dependency audit, and static security pattern scan.
- Implemented: Runtime sanitization for persisted skip-score data and strict puzzle ID guardrails.
- Implemented: Repeatable security check command (`npm run security:check`) to block dangerous code patterns.

## Risk Register

1. Severity: Medium
Likelihood: Medium
Blast Radius: Puzzle rotation logic and runtime stability
Issue: Untrusted `localStorage` skip-score payload could contain malformed keys/values and affect weighted puzzle selection.
Remediation: Parse, sanitize, clamp, and whitelist against known puzzle IDs before use.
Status: Fixed in `src/data/puzzles/index.ts`.

2. Severity: Medium
Likelihood: Low
Blast Radius: Puzzle loading and state initialization
Issue: `loadPuzzle` accepted any number-shaped input and relied only on map lookup.
Remediation: Enforce safe-integer positive ID validation at the action boundary.
Status: Fixed in `src/lib/gameState.ts`.

3. Severity: Medium (preventive)
Likelihood: Medium over time
Blast Radius: Whole frontend
Issue: No enforceable static check for risky APIs (e.g., `eval`, HTML injection sinks).
Remediation: Added policy scanner script and npm command.
Status: Fixed in `scripts/security-check.mjs` and `package.json`.

## Patches Applied

- `src/data/puzzles/index.ts`
  - Added `parseSkipScores` and `clampSkipScore`.
  - Sanitized persisted data to numeric keys only, safe integers, existing puzzle IDs, bounded scores.
  - Guarded `markPuzzleSkipped` against invalid puzzle IDs.
- `src/lib/gameState.ts`
  - Added safe-integer and positive-value input validation in `loadPuzzle`.
- `scripts/security-check.mjs`
  - Added static scan for blocked patterns: `eval/new Function`, raw HTML assignment sinks, `dangerouslySetInnerHTML`, and insecure `http://` URLs.
  - High-severity findings fail the check.
- `package.json`
  - Added `security:check` script.

## Proof / Evidence

Commands run:

- `npm run lint` -> pass
- `npm run security:check` -> pass (`Security check passed: no blocked patterns found.`)
- `npm run audit` -> pass (`found 0 vulnerabilities`)

## Next Actions

- Add the new `security:check` command to CI as a required gate.
- Add tests covering skip-score sanitization and invalid puzzle ID input.
- Add centralized structured logging and error taxonomy (from current priority plan).
