import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT = join(process.cwd(), 'src', 'data', 'japanese', 'characters.json');

const kanaRanges = {
  hiragana: [{ start: 0x3040, end: 0x309f }],
  katakana: [{ start: 0x30a0, end: 0x30ff }],
};

const kanjiRanges = [
  { name: 'CJK Unified Ideographs Extension A', start: 0x3400, end: 0x4dbf },
  { name: 'CJK Unified Ideographs', start: 0x4e00, end: 0x9fff },
  { name: 'CJK Compatibility Ideographs', start: 0xf900, end: 0xfaff },
  { name: 'CJK Unified Ideographs Extension B', start: 0x20000, end: 0x2a6df },
  { name: 'CJK Unified Ideographs Extension C', start: 0x2a700, end: 0x2b73f },
  { name: 'CJK Unified Ideographs Extension D', start: 0x2b740, end: 0x2b81f },
  { name: 'CJK Unified Ideographs Extension E', start: 0x2b820, end: 0x2ceaf },
  { name: 'CJK Unified Ideographs Extension F', start: 0x2ceb0, end: 0x2ebef },
];

function buildCharacters(ranges) {
  const chars = [];
  for (const range of ranges) {
    for (let cp = range.start; cp <= range.end; cp += 1) {
      chars.push(String.fromCodePoint(cp));
    }
  }
  return chars;
}

const hiragana = buildCharacters(kanaRanges.hiragana);
const katakana = buildCharacters(kanaRanges.katakana);
const kanji = buildCharacters(kanjiRanges);

const payload = {
  hiragana,
  katakana,
  kanji,
  ranges: {
    hiragana: kanaRanges.hiragana,
    katakana: kanaRanges.katakana,
    kanji: kanjiRanges,
  },
};

writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${OUTPUT} with ${hiragana.length} hiragana, ${katakana.length} katakana, ${kanji.length} kanji.`);
