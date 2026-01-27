import { createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { x as extract } from 'tar';

const JESC_URL = 'https://nlp.stanford.edu/projects/jesc/data/raw.tar.gz';
const TARGET_DIR = join(process.cwd(), 'data', 'jesc');
const ARCHIVE_PATH = join(TARGET_DIR, 'raw.tar.gz');
const FORCE = process.env.FORCE === '1';

async function download() {
  if (!existsSync(TARGET_DIR)) {
    mkdirSync(TARGET_DIR, { recursive: true });
  }

  if (!FORCE && existsSync(ARCHIVE_PATH) && statSync(ARCHIVE_PATH).size > 0) {
    console.log('JESC archive already exists, skipping download.');
    return;
  }

  console.log(`Downloading JESC from ${JESC_URL}...`);
  const response = await fetch(JESC_URL);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download JESC: ${response.status} ${response.statusText}`);
  }

  await pipeline(response.body, createWriteStream(ARCHIVE_PATH));
  console.log(`Saved archive to ${ARCHIVE_PATH}`);
}

async function extractArchive() {
  console.log('Extracting JESC archive...');
  await extract({ file: ARCHIVE_PATH, cwd: TARGET_DIR });
  console.log('Extraction complete.');
}

await download();
await extractArchive();
