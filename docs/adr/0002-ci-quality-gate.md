# ADR 0002: Enforceable CI Quality Gate

- Status: Accepted
- Date: 2026-02-13
- Owners: Kudoko maintainers

## Context

Quality checks (linting, type checks, security checks, tests, build) existed
as separate commands and were not always enforced uniformly in CI.

## Decision

Adopt a single enforceable CI gate command and run it in GitHub Actions:

- Canonical command: `npm run quality:gate`
- Gate includes: lint, typecheck, security scan, audit, unit tests,
  smoke test, and build.
- CI workflow runs on push/pull request, with concurrency cancellation,
  timeout, and artifact upload.

## Consequences

- Positive:
  - One source of truth for merge quality.
  - Fewer drift risks between local checks and CI checks.
  - Reproducible pass/fail behavior.
- Negative:
  - Longer pipeline duration.
  - Gate failures can block unrelated feature delivery.

## Alternatives Considered

- Keep checks split and partially required:
  - Rejected due to inconsistent enforcement.
- Run only lint + tests in CI:
  - Rejected because type/security/build regressions could slip in.

## Follow-up

- Keep `quality:gate` synced with evolving project standards.
