// Script to update reveal masks on existing expert puzzles
// Ensures each expert puzzle has exactly 9 kanji revealed (plus all kana)

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'src', 'puzzle-data');
const EXPERT_REVEAL_COUNT = 9;

function mulberry32(seed) {
    return function rng() {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffle(array, rng = Math.random) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function isKana(char) {
    const code = char.codePointAt(0);
    return (code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff);
}

function generateExpertRevealMask(templateRows, rng) {
    const revealed = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => false));
    const kanjiPositions = [];

    // First pass: mark all kana as revealed, collect kanji positions
    for (let r = 0; r < 9; r += 1) {
        for (let c = 0; c < 9; c += 1) {
            const char = templateRows[r][c];
            if (isKana(char)) {
                revealed[r][c] = true; // Kana are always revealed
            } else {
                kanjiPositions.push([r, c]);
            }
        }
    }

    // Reveal exactly EXPERT_REVEAL_COUNT kanji
    const shuffled = shuffle(kanjiPositions, rng);
    const revealCount = Math.min(EXPERT_REVEAL_COUNT, shuffled.length);
    for (let i = 0; i < revealCount; i += 1) {
        const [r, c] = shuffled[i];
        revealed[r][c] = true;
    }
    return revealed;
}

// Load expert puzzles
const filePath = join(DATA_DIR, 'expert.json');
const puzzles = JSON.parse(readFileSync(filePath, 'utf8'));

console.log(`Updating ${puzzles.length} expert puzzles...`);

let updated = 0;
for (const puzzle of puzzles) {
    // Create RNG seeded by puzzle ID for reproducibility
    const rng = mulberry32(puzzle.id);

    // Generate new reveal mask with at least 9 kanji
    puzzle.revealed = generateExpertRevealMask(puzzle.template, rng);
    updated += 1;

    if (updated % 1000 === 0) {
        console.log(`Updated ${updated}/${puzzles.length}...`);
    }
}

// Write back
const sorted = puzzles.slice().sort((a, b) => a.id - b.id);
writeFileSync(filePath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');

console.log(`Done! Updated ${updated} expert puzzles with new reveal masks.`);
