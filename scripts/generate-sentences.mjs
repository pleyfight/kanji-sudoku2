import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { gzipSync } from 'node:zlib';

const SOURCE_DIR = join(process.cwd(), 'data', 'jesc');
const OUTPUT_DIR = join(process.cwd(), 'src', 'data', 'sentences');
const PUBLIC_DIR = join(process.cwd(), 'public', 'data', 'sentences');
const ROW_FILE = join(OUTPUT_DIR, 'rows.json');
const COLUMN_FILE = join(OUTPUT_DIR, 'columns.json');
const ROW_GZ_FILE = join(PUBLIC_DIR, 'rows.json.gz');
const COLUMN_GZ_FILE = join(PUBLIC_DIR, 'columns.json.gz');
const TARGET = 40000;
const SENTENCE_LENGTH = 9;

const KANA_RANGES = [
  { start: 0x3040, end: 0x309f },
  { start: 0x30a0, end: 0x30ff },
];
const KANJI_RANGES = [
  { start: 0x3400, end: 0x4dbf },
  { start: 0x4e00, end: 0x9fff },
  { start: 0xf900, end: 0xfaff },
  { start: 0x20000, end: 0x2a6df },
  { start: 0x2a700, end: 0x2b73f },
  { start: 0x2b740, end: 0x2b81f },
  { start: 0x2b820, end: 0x2ceaf },
  { start: 0x2ceb0, end: 0x2ebef },
];
const EXTRA_JAPANESE = new Set([0x3005, 0x3007, 0x303b]); // 々, 〇, 〻

function isInRanges(codePoint, ranges) {
  return ranges.some((range) => codePoint >= range.start && codePoint <= range.end);
}

function isJapaneseChar(char) {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) return false;
  if (EXTRA_JAPANESE.has(codePoint)) return true;
  return isInRanges(codePoint, KANA_RANGES) || isInRanges(codePoint, KANJI_RANGES);
}

function normalizeJapanese(text) {
  return Array.from(text).filter(isJapaneseChar).join('');
}

function japaneseRatio(text) {
  const chars = Array.from(text);
  if (chars.length === 0) return 0;
  const japaneseCount = chars.reduce((count, ch) => count + (isJapaneseChar(ch) ? 1 : 0), 0);
  return japaneseCount / chars.length;
}

function pickJapaneseField(fields) {
  let best = '';
  let bestScore = 0;
  for (const field of fields) {
    const score = japaneseRatio(field);
    if (score > bestScore) {
      bestScore = score;
      best = field;
    }
  }
  return bestScore >= 0.5 ? best : '';
}

function findJescFile(rootDir) {
  if (!existsSync(rootDir)) return null;
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = readdirSync(current);
    for (const entry of entries) {
      const fullPath = join(current, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        stack.push(fullPath);
      } else if (/jesc/i.test(entry) && /\.(txt|tsv)$/.test(entry)) {
        return fullPath;
      } else if (entry === 'raw') {
        return fullPath;
      }
    }
  }
  return null;
}

function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const jescPath = findJescFile(SOURCE_DIR);
if (!jescPath) {
  throw new Error('JESC source file not found. Run npm run download:jesc first.');
}

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!existsSync(PUBLIC_DIR)) {
  mkdirSync(PUBLIC_DIR, { recursive: true });
}

const sentenceSet = new Set();
const reader = createInterface({
  input: createReadStream(jescPath, { encoding: 'utf8' }),
  crlfDelay: Infinity,
});

for await (const line of reader) {
  if (!line) continue;
  const fields = line.split('\t');
  const japanese = pickJapaneseField(fields);
  if (!japanese) continue;
  const normalized = normalizeJapanese(japanese);
  if (normalized.length !== SENTENCE_LENGTH) continue;
  sentenceSet.add(normalized);
}

const allSentences = shuffle(Array.from(sentenceSet));
const needed = TARGET * 2;
if (allSentences.length < needed) {
  throw new Error(`Only found ${allSentences.length} unique 9-char sentences; need ${needed}.`);
}

const rows = allSentences.slice(0, TARGET);
const columns = allSentences.slice(TARGET, needed);

const rowsJson = `${JSON.stringify(rows, null, 2)}\n`;
const columnsJson = `${JSON.stringify(columns, null, 2)}\n`;
writeFileSync(ROW_FILE, rowsJson, 'utf8');
writeFileSync(COLUMN_FILE, columnsJson, 'utf8');
writeFileSync(ROW_GZ_FILE, gzipSync(rowsJson));
writeFileSync(COLUMN_GZ_FILE, gzipSync(columnsJson));

console.log(`Generated ${rows.length} row sentences and ${columns.length} column sentences.`);
