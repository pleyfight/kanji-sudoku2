import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = join(process.cwd(), 'src', 'data', 'sentences');
const ROW_FILE = join(OUTPUT_DIR, 'rows.json');
const COLUMN_FILE = join(OUTPUT_DIR, 'columns.json');
const TARGET = 40000;
const SENTENCE_LENGTH = 9;

const kanaRanges = {
  hiragana: [{ start: 0x3040, end: 0x309f }],
  katakana: [{ start: 0x30a0, end: 0x30ff }],
};

const kanjiRanges = [
  { start: 0x3400, end: 0x4dbf },
  { start: 0x4e00, end: 0x9fff },
  { start: 0xf900, end: 0xfaff },
  { start: 0x20000, end: 0x2a6df },
  { start: 0x2a700, end: 0x2b73f },
  { start: 0x2b740, end: 0x2b81f },
  { start: 0x2b820, end: 0x2ceaf },
  { start: 0x2ceb0, end: 0x2ebef },
];

function mulberry32(seed) {
  return function rng() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalizeRanges(ranges) {
  return ranges.map((range) => ({
    ...range,
    size: range.end - range.start + 1,
  }));
}

const kanjiWeighted = normalizeRanges(kanjiRanges);
const kanjiTotal = kanjiWeighted.reduce((sum, range) => sum + range.size, 0);
const hiraWeighted = normalizeRanges(kanaRanges.hiragana);
const hiraTotal = hiraWeighted.reduce((sum, range) => sum + range.size, 0);
const kataWeighted = normalizeRanges(kanaRanges.katakana);
const kataTotal = kataWeighted.reduce((sum, range) => sum + range.size, 0);

function randomFromRanges(ranges, total, rng) {
  let roll = Math.floor(rng() * total);
  for (const range of ranges) {
    if (roll < range.size) {
      return String.fromCodePoint(range.start + roll);
    }
    roll -= range.size;
  }
  const last = ranges[ranges.length - 1];
  return String.fromCodePoint(last.end);
}

function randomChar(rng) {
  const roll = rng();
  if (roll < 0.6) {
    return randomFromRanges(kanjiWeighted, kanjiTotal, rng);
  }
  if (roll < 0.8) {
    return randomFromRanges(hiraWeighted, hiraTotal, rng);
  }
  return randomFromRanges(kataWeighted, kataTotal, rng);
}

function buildSentence(rng) {
  let sentence = '';
  for (let i = 0; i < SENTENCE_LENGTH; i += 1) {
    sentence += randomChar(rng);
  }
  return sentence;
}

function generateSentences(seedLabel, target, seen) {
  const rng = mulberry32(hashString(seedLabel));
  const sentences = [];
  let safety = 0;
  while (sentences.length < target) {
    if (safety > target * 50) {
      throw new Error(`Failed to generate ${target} unique sentences for ${seedLabel}.`);
    }
    const sentence = buildSentence(rng);
    if (seen.has(sentence)) {
      safety += 1;
      continue;
    }
    seen.add(sentence);
    sentences.push(sentence);
    safety += 1;
  }
  return sentences;
}

const seen = new Set();
const rows = generateSentences('rows', TARGET, seen);
const columns = generateSentences('columns', TARGET, seen);

writeFileSync(ROW_FILE, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
writeFileSync(COLUMN_FILE, `${JSON.stringify(columns, null, 2)}\n`, 'utf8');

console.log(`Generated ${rows.length} row sentences and ${columns.length} column sentences.`);
