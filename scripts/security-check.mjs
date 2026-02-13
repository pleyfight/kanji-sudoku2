import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const root = process.cwd();
const sourceRoot = join(root, 'src');
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const checks = [
  {
    id: 'SEC-INJECTION-001',
    severity: 'high',
    description: 'Avoid eval/new Function because they execute dynamic code.',
    regex: /\beval\s*\(|\bnew\s+Function\s*\(/g,
  },
  {
    id: 'SEC-XSS-002',
    severity: 'high',
    description: 'Avoid writing raw HTML via innerHTML/outerHTML.',
    regex: /\.\s*(innerHTML|outerHTML)\s*=/g,
  },
  {
    id: 'SEC-XSS-003',
    severity: 'medium',
    description: 'Review dangerouslySetInnerHTML usage for sanitization.',
    regex: /dangerouslySetInnerHTML/g,
  },
  {
    id: 'SEC-TRANSPORT-004',
    severity: 'medium',
    description: 'Avoid insecure http:// URLs in app source.',
    regex: /["'`](http:\/\/[^"'`\s]+)["'`]/g,
  },
];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!allowedExtensions.has(extname(entry.name))) continue;
    files.push(fullPath);
  }
  return files;
}

function lineFromIndex(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

if (!statSync(sourceRoot, { throwIfNoEntry: false })?.isDirectory()) {
  console.error('Security check failed: src directory not found.');
  process.exit(1);
}

const files = walk(sourceRoot);
const findings = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const check of checks) {
    const regex = new RegExp(check.regex.source, check.regex.flags);
    let match = regex.exec(text);
    while (match) {
      findings.push({
        id: check.id,
        severity: check.severity,
        description: check.description,
        file: relative(root, file),
        line: lineFromIndex(text, match.index),
        snippet: match[0],
      });
      match = regex.exec(text);
    }
  }
}

if (findings.length === 0) {
  console.log('Security check passed: no blocked patterns found.');
  process.exit(0);
}

const highCount = findings.filter((finding) => finding.severity === 'high').length;

console.error(`Security check found ${findings.length} finding(s).`);
for (const finding of findings) {
  console.error(
    `[${finding.severity.toUpperCase()}] ${finding.id} ${finding.file}:${finding.line} - ${finding.description} (${finding.snippet})`
  );
}

if (highCount > 0) {
  console.error('Failing because high-severity findings were detected.');
  process.exit(1);
}

console.log('Only medium findings detected. Treat as review-required warnings.');
process.exit(0);
