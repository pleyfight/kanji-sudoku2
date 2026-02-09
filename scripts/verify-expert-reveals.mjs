// Quick verification of expert puzzle reveals
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'src', 'puzzle-data');
const filePath = join(DATA_DIR, 'expert.json');
const puzzles = JSON.parse(readFileSync(filePath, 'utf8'));

function isKana(char) {
    const code = char.codePointAt(0);
    return (code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff);
}

// Sample a few puzzles
const samples = [puzzles[0], puzzles[100], puzzles[500], puzzles[1000], puzzles[5000]];

console.log('Verifying expert puzzle reveals:');
console.log('================================');

for (const p of samples) {
    const chars = p.template.join('').split('');
    const kanaCount = chars.filter(isKana).length;
    const kanjiCount = 81 - kanaCount;
    const revealedTotal = p.revealed.flat().filter(x => x).length;

    // Count how many revealed are kanji vs kana
    let revealedKanji = 0;
    let revealedKana = 0;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (p.revealed[r][c]) {
                const char = p.template[r][c];
                if (isKana(char)) {
                    revealedKana++;
                } else {
                    revealedKanji++;
                }
            }
        }
    }

    console.log(`ID ${p.id}: ${kanaCount} kana in grid, ${kanjiCount} kanji in grid`);
    console.log(`  → ${revealedTotal} total revealed (${revealedKana} kana + ${revealedKanji} kanji)`);
}
