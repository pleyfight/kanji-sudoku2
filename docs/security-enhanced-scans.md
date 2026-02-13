# Enhanced Security Scans

Date: 2026-02-13

This project includes optional enhanced security scans beyond the baseline
`quality:gate`.

## Included Scans

- OSV lockfile scan (via OSV public API)
- Snyk dependency scan (requires `SNYK_TOKEN`)
- CodeQL static analysis (GitHub Actions workflow)

## Local Commands

- `npm run security:osv`
- `npm run security:snyk` (requires `SNYK_TOKEN`)
- `npm run security:enhanced` (runs OSV + Snyk if token exists)

## CI Workflow

Workflow: `.github/workflows/security-enhanced.yml`

Triggers:

- Weekly schedule (`Monday 07:00 UTC`) runs OSV scan.
- Manual dispatch allows choosing which scans to run:
  - `run_osv`
  - `run_snyk`
  - `run_codeql`

Notes:

- Snyk job is skipped unless `SNYK_TOKEN` repository secret is configured.
- CodeQL is manual by default to keep baseline CI fast and avoid forcing
  platform-level setup where unavailable.
