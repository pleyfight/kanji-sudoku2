import { spawnSync } from 'node:child_process';

function runStep(name, command, args, env = process.env) {
  console.log(`\n[enhanced-security] ${name}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env,
  });
  return result.status ?? 1;
}

const failures = [];

const osvStatus = runStep('OSV dependency scan', 'node', ['scripts/osv-audit.mjs']);
if (osvStatus !== 0) {
  failures.push(`OSV scan failed (exit ${osvStatus})`);
}

if (process.env.SNYK_TOKEN && process.env.SNYK_TOKEN.trim().length > 0) {
  const snykStatus = runStep(
    'Snyk scan',
    'npx',
    ['--yes', 'snyk', 'test', '--severity-threshold=high', '--all-projects'],
    {
      ...process.env,
      SNYK_TOKEN: process.env.SNYK_TOKEN,
    }
  );
  if (snykStatus !== 0) {
    failures.push(`Snyk scan failed (exit ${snykStatus})`);
  }
} else {
  console.log('\n[enhanced-security] Snyk scan skipped: SNYK_TOKEN is not configured.');
}

console.log('\n[enhanced-security] CodeQL runs via GitHub Actions workflow: .github/workflows/security-enhanced.yml');

if (failures.length > 0) {
  console.error('\n[enhanced-security] Completed with failures:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\n[enhanced-security] Completed successfully.');
process.exit(0);
