import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OSV_BATCH_URL = 'https://api.osv.dev/v1/querybatch';
const CHUNK_SIZE = 500;
const failOnFindings = process.env.OSV_FAIL_ON_FINDINGS !== '0';

function loadLockfile() {
  const lockPath = resolve(process.cwd(), 'package-lock.json');
  const raw = readFileSync(lockPath, 'utf8');
  return JSON.parse(raw);
}

function deriveNameFromPackageKey(key) {
  const marker = 'node_modules/';
  const markerIndex = key.lastIndexOf(marker);
  if (markerIndex === -1) return null;
  const name = key.slice(markerIndex + marker.length).trim();
  return name || null;
}

function collectDependencyQueries(lockfile) {
  const packages = lockfile?.packages;
  if (!packages || typeof packages !== 'object') {
    return [];
  }

  const dedup = new Map();
  for (const [key, entry] of Object.entries(packages)) {
    if (!entry || typeof entry !== 'object') continue;
    if (entry.link) continue;
    const version = typeof entry.version === 'string' ? entry.version : null;
    if (!version) continue;

    const explicitName = typeof entry.name === 'string' ? entry.name : null;
    const derivedName = deriveNameFromPackageKey(key);
    const name = explicitName ?? derivedName;
    if (!name) continue;

    const dedupKey = `${name}@${version}`;
    if (!dedup.has(dedupKey)) {
      dedup.set(dedupKey, { name, version });
    }
  }

  return [...dedup.values()];
}

function chunk(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function queryOsvBatch(queries) {
  const payload = {
    queries: queries.map((item) => ({
      package: { ecosystem: 'npm', name: item.name },
      version: item.version,
    })),
  };

  const response = await fetch(OSV_BATCH_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`OSV API request failed: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();
  return Array.isArray(body?.results) ? body.results : [];
}

async function main() {
  const lockfile = loadLockfile();
  const dependencies = collectDependencyQueries(lockfile);

  if (dependencies.length === 0) {
    console.log('OSV scan skipped: no lockfile dependency entries found.');
    process.exit(0);
  }

  console.log(`OSV scan: querying ${dependencies.length} dependency version(s).`);
  const findings = [];

  for (const dependencyChunk of chunk(dependencies, CHUNK_SIZE)) {
    const results = await queryOsvBatch(dependencyChunk);
    dependencyChunk.forEach((dependency, index) => {
      const vulns = Array.isArray(results[index]?.vulns) ? results[index].vulns : [];
      if (vulns.length === 0) return;

      findings.push({
        name: dependency.name,
        version: dependency.version,
        vulns: vulns.map((vuln) => ({
          id: vuln.id ?? 'UNKNOWN',
          summary: vuln.summary ?? '',
        })),
      });
    });
  }

  if (findings.length === 0) {
    console.log('OSV scan passed: no known vulnerabilities found for lockfile dependencies.');
    process.exit(0);
  }

  const vulnCount = findings.reduce((total, finding) => total + finding.vulns.length, 0);
  console.error(`OSV scan found ${vulnCount} vulnerability record(s) across ${findings.length} package version(s).`);
  for (const finding of findings) {
    const ids = finding.vulns.map((vuln) => vuln.id).join(', ');
    console.error(`- ${finding.name}@${finding.version}: ${ids}`);
  }

  if (failOnFindings) {
    process.exit(1);
  }

  console.warn('OSV findings detected, but OSV_FAIL_ON_FINDINGS=0 so this run is non-blocking.');
  process.exit(0);
}

main().catch((error) => {
  console.error(`OSV scan failed to execute: ${String(error)}`);
  process.exit(2);
});
