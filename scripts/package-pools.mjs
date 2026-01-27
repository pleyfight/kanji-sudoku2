import { createReadStream, createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

const PUZZLE_DIR = join(process.cwd(), 'src', 'puzzle-data');
const SENTENCE_DIR = join(process.cwd(), 'src', 'data', 'sentences');
const OUT_DIR = join(process.cwd(), 'public', 'data');
const FORCE = process.env.FORCE === '1';

const targets = [
  { label: 'puzzles/easy.json', source: join(PUZZLE_DIR, 'easy.json'), target: join(OUT_DIR, 'puzzles', 'easy.json.gz') },
  { label: 'puzzles/medium.json', source: join(PUZZLE_DIR, 'medium.json'), target: join(OUT_DIR, 'puzzles', 'medium.json.gz') },
  { label: 'puzzles/hard.json', source: join(PUZZLE_DIR, 'hard.json'), target: join(OUT_DIR, 'puzzles', 'hard.json.gz') },
  { label: 'puzzles/expert.json', source: join(PUZZLE_DIR, 'expert.json'), target: join(OUT_DIR, 'puzzles', 'expert.json.gz') },
  { label: 'sentences/rows.json', source: join(SENTENCE_DIR, 'rows.json'), target: join(OUT_DIR, 'sentences', 'rows.json.gz') },
  { label: 'sentences/columns.json', source: join(SENTENCE_DIR, 'columns.json'), target: join(OUT_DIR, 'sentences', 'columns.json.gz') },
];

async function compressFile({ label, source, target }) {
  if (!existsSync(source)) {
    throw new Error(`Missing source file: ${source}`);
  }

  if (!FORCE && existsSync(target) && statSync(target).size > 0) {
    console.log(`${label} already packaged, skipping.`);
    return;
  }

  mkdirSync(dirname(target), { recursive: true });
  console.log(`Compressing ${label}...`);
  await pipeline(createReadStream(source), createGzip({ level: 9 }), createWriteStream(target));
  console.log(`Wrote ${target}`);
}

for (const target of targets) {
  await compressFile(target);
}
