# Versioning Policy

Date: 2026-02-13
Project: Kudoko (`package.json` currently `0.1.0`)

## Policy

- Versioning model: SemVer (`MAJOR.MINOR.PATCH`).
- While major version is `0`, we still follow SemVer intent:
  - `PATCH`: bug fixes, hardening, test/tooling/CI changes, docs-only changes.
  - `MINOR`: backward-compatible gameplay features or UX additions.
  - `MAJOR`: breaking changes to saved data, puzzle schemas, public APIs, or player-facing behavior that is not backward-compatible.

## Step-to-Version Impact

This maps current prioritized work items to expected version impact.

| Step ID | Change Summary | Expected Impact |
|---|---|---|
| HIGH-002 | Add enforceable testing gate (unit + smoke), stabilize quality checks | PATCH |
| HIGH-003 | Define and apply versioning policy/process | PATCH |
| MEDIUM-001 | Observability schema (structured logs/events) | PATCH |
| MEDIUM-002 | CI automation baseline improvements | PATCH |
| MEDIUM-003 | Deduplicate Sudoku logic | PATCH (or MINOR if behavior changes) |
| MEDIUM-004 | Decompose `AppContent` | PATCH |
| MEDIUM-005 | Complexity notes/documentation | PATCH |
| LOW-001 | Code-splitting for bundle optimization | PATCH |
| LOW-002 | ADR templates and initial ADRs | PATCH |

## Bump Rules For Releases

- Use `PATCH` by default unless behavior or compatibility changes.
- Promote to `MINOR` when adding user-visible features that are backward-compatible.
- Promote to `MAJOR` when any compatibility contract breaks:
  - persisted `localStorage` format changes without migration
  - puzzle definition/schema incompatibility
  - removed/renamed public interfaces consumed externally

