# Observability Schema

This document defines the structured client logging schema used by the app.

## Log entry shape

Each log entry follows this shape (see `src/lib/logger.ts` for the source of truth):

- `ts` (string): ISO 8601 timestamp.
- `level` ("debug" | "info" | "warn" | "error").
- `event` (string): Dot-delimited event name.
- `component` (string): High-level system area (game, puzzles, storage, ui, init, validation, network).
- `message` (string): Human-readable summary.
- `sessionId` (string): Session-scoped ID for a browser tab.
- `correlationId` (string): Correlation identifier for a flow (defaults to session).
- `context` (object, optional): Stable metadata (difficulty, puzzleId, route, source, feature).
- `data` (object, optional): Event-specific details.

## Event naming

Event names are lowercase, dot-delimited, and scoped by domain. Example: `puzzles.pool_initialized`.

## Context fields

`context` should be reserved for stable, queryable metadata. Recommended keys:

- `difficulty`
- `puzzleId`
- `route`
- `source`
- `feature`

## Canonical events

Defined in `LOG_EVENTS`:

- `app.unhandled_error`
- `app.unhandled_rejection`
- `app.init_failure`
- `game.puzzle_skipped`
- `puzzles.pool_initialized`
- `puzzles.bag_reshuffled`
- `puzzles.init_failed`
- `storage.get_failed`
- `storage.set_failed`
- `storage.remove_failed`
- `storage.parse_failed`
- `storage.schema_invalid`
- `storage.stringify_failed`
- `ui.error_boundary`
