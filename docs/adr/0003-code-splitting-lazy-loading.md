# ADR 0003: Code Splitting and Lazy Loading Strategy

- Status: Accepted
- Date: 2026-02-13
- Owners: Kudoko maintainers

## Context

The app had a single large client bundle carrying both landing screen and
game-only UI/modals. This increased initial JS payload for first load.

## Decision

Use route/state-aware lazy loading for heavy game-only UI and overlays:

- `React.lazy` + `Suspense` for game panels/header and modals/popovers.
- Keep home menu path light for first paint.
- Configure a stable vendor split for React runtime:
  - `manualChunks.react = ['react', 'react-dom']`

## Consequences

- Positive:
  - Smaller initial entry bundle.
  - Better cache behavior via stable vendor chunk.
  - Game-specific code loads on demand.
- Negative:
  - More request/chunk orchestration.
  - Requires handling loading boundaries (`Suspense` fallbacks).

## Alternatives Considered

- Single-bundle delivery:
  - Rejected due to avoidable initial payload cost.
- Over-aggressive micro-chunking:
  - Rejected to avoid excessive network overhead and complexity.

## Follow-up

- Track bundle/chunk sizes over time and adjust split points as needed.
