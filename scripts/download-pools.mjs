import { createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';

const BASE_URL = process.env.POOL_BASE_URL ?? process.env.DATA_POOL_BASE_URL;
const FORCE = process.env.FORCE === '1';

if (!BASE_URL) {
  throw new Error('Set POOL_BASE_URL to the base URL that hosts /puzzles/*.json.gz and /sentences/*.json.gz');
}

const normalizedBase = BASE_URL.replace(/\/+$/, '');
const targets = [
  'puzzles/easy.json.gz',
  'puzzles/medium.json.gz',
  'puzzles/hard.json.gz',
  'puzzles/expert.json.gz',
  'sentences/rows.json.gz',
  'sentences/columns.json.gz',
];

async function downloadFile(relativePath) {
  const url = `${normalizedBase}/${relativePath}`;
  const targetPath = join(process.cwd(), 'public', 'data', relativePath);

  if (!FORCE && existsSync(targetPath) && statSync(targetPath).size > 0) {
    console.log(`${relativePath} already exists, skipping.`);
    return;
  }

  mkdirSync(dirname(targetPath), { recursive: true });
  console.log(`Downloading ${relativePath}...`);

  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  await pipeline(response.body, createWriteStream(targetPath));
  console.log(`Saved ${targetPath}`);
}

for (const target of targets) {
  await downloadFile(target);
}
