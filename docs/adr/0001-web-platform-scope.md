# ADR 0001: Web Platform Scope

- Status: Accepted
- Date: 2026-02-13
- Owners: Kudoko maintainers

## Context

The project currently ships as a React + Vite browser application.
There is no native iOS or Android codebase in this repository.
Some UI modules are mobile-oriented, but they are responsive web views.

## Decision

The product scope is web-only for now:

- One browser-delivered app codebase.
- Responsive layouts for desktop and mobile browsers.
- No native mobile build/release pipeline in this repo.

## Consequences

- Positive:
  - Single codebase and release path.
  - Faster iteration and lower maintenance overhead.
  - Shared gameplay logic across desktop/mobile web.
- Negative:
  - No native app-store distribution.
  - No native-only APIs unless bridged via web standards.

## Alternatives Considered

- Native iOS + Android apps:
  - Rejected for current phase due to duplicated platform effort.
- Hybrid shell wrappers now:
  - Deferred until there is a clear distribution requirement.

## Follow-up

- Revisit this ADR if app-store distribution becomes a near-term goal.
