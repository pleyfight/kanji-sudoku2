import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const sentenceDir = join(process.cwd(), 'src', 'data', 'sentences');
const rowPath = join(sentenceDir, 'rows.json');
const columnPath = join(sentenceDir, 'columns.json');
const EXPECTED_COUNT = 40000;
const EXPECTED_LENGTH = 9;

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

function isInRanges(codePoint, ranges) {
  return ranges.some((range) => codePoint >= range.start && codePoint <= range.end);
}

function isJapaneseChar(char) {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) return false;
  return isInRanges(codePoint, KANA_RANGES) || isInRanges(codePoint, KANJI_RANGES);
}

function validatePool(label, entries, seenGlobal) {
  const errors = [];
  if (!Array.isArray(entries)) {
    errors.push(`${label} is not an array.`);
    return errors;
  }
  if (entries.length !== EXPECTED_COUNT) {
    errors.push(`${label} has ${entries.length} entries; expected ${EXPECTED_COUNT}.`);
  }
  const seenLocal = new Set();
  entries.forEach((entry, index) => {
    if (typeof entry !== 'string') {
      errors.push(`${label}[${index}] is not a string.`);
      return;
    }
    const codepointLength = Array.from(entry).length;
    if (codepointLength !== EXPECTED_LENGTH) {
      errors.push(`${label}[${index}] length ${codepointLength}, expected ${EXPECTED_LENGTH}.`);
    }
    for (const char of entry) {
      if (!isJapaneseChar(char)) {
        errors.push(`${label}[${index}] contains non-Japanese character.`);
        break;
      }
    }
    if (seenLocal.has(entry)) {
      errors.push(`${label}[${index}] is a duplicate within ${label}.`);
    } else {
      seenLocal.add(entry);
    }
    if (seenGlobal.has(entry)) {
      errors.push(`${label}[${index}] duplicates entry from the other pool.`);
    } else {
      seenGlobal.add(entry);
    }
  });
  return errors;
}

const rows = JSON.parse(readFileSync(rowPath, 'utf8'));
const columns = JSON.parse(readFileSync(columnPath, 'utf8'));

const errors = [];
const seenGlobal = new Set();
errors.push(...validatePool('rows', rows, seenGlobal));
errors.push(...validatePool('columns', columns, seenGlobal));

if (errors.length) {
  console.error('Sentence validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Sentence validation passed (${rows.length} rows, ${columns.length} columns).`);
