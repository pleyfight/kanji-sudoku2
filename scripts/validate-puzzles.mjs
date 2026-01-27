import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const puzzleDir = join(process.cwd(), 'src', 'puzzle-data');
const sentenceDir = join(process.cwd(), 'src', 'data', 'sentences');
const sentenceRowPath = join(sentenceDir, 'rows.json');
const sentenceColumnPath = join(sentenceDir, 'columns.json');
const files = readdirSync(puzzleDir).filter((name) => name.endsWith('.json'));

const puzzles = [];
const ID_RANGES = {
    easy: { min: 1001, max: 11000 },
    medium: { min: 11001, max: 21000 },
    hard: { min: 21001, max: 31000 },
    expert: { min: 31001, max: 41000 },
};

function isKana(char) {
    const code = char.codePointAt(0);
    return (code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff);
}

for (const file of files) {
    const data = JSON.parse(readFileSync(join(puzzleDir, file), 'utf8'));
    const entries = Array.isArray(data) ? data : [data];
    for (const entry of entries) {
        puzzles.push({
            file,
            ...entry,
        });
    }
}

if (puzzles.length === 0) {
    console.error('Puzzle validation failed: no puzzles found.');
    process.exit(1);
}

const errors = [];
const seenIds = new Set();
const seenSignatures = new Set();
const sentencePools = (() => {
    try {
        const rows = JSON.parse(readFileSync(sentenceRowPath, 'utf8'));
        const columns = JSON.parse(readFileSync(sentenceColumnPath, 'utf8'));
        if (!Array.isArray(rows) || !Array.isArray(columns)) {
            throw new Error('Sentence pools must be arrays.');
        }
        return {
            rows: new Set(rows),
            columns: new Set(columns),
        };
    } catch (error) {
        throw new Error(`Sentence pools missing or invalid: ${error.message}`);
    }
})();

for (const puzzle of puzzles) {
    const label = `${puzzle.file}#${puzzle.id}`;

    if (!puzzle.difficulty) {
        errors.push(`${label} missing difficulty.`);
    } else if (!ID_RANGES[puzzle.difficulty]) {
        errors.push(`${label} difficulty is invalid.`);
    }
    if (typeof puzzle.title !== 'string' || puzzle.title.length === 0) {
        errors.push(`${label} missing title.`);
    }
    if (!Number.isInteger(puzzle.id)) {
        errors.push(`${label} id is missing or not an integer.`);
    }

    if (seenIds.has(puzzle.id)) {
        errors.push(`${label} duplicate puzzle id.`);
    } else {
        seenIds.add(puzzle.id);
    }

    const { symbols, template, revealed, solution } = puzzle;
    const symbolSet = new Set(Array.isArray(symbols) ? symbols : []);
    if (Array.isArray(symbols) && Array.isArray(template)) {
        const signature = `${symbols.join('|')}::${template.join('|')}`;
        if (seenSignatures.has(signature)) {
            errors.push(`${label} duplicates another puzzle's symbols/template signature.`);
        } else {
            seenSignatures.add(signature);
        }
    }

    if (!Array.isArray(symbols)) {
        errors.push(`${label} symbols is missing or not an array.`);
    } else {
        const expectedMin = puzzle.difficulty === 'expert' ? 1 : 9;
        const expectedMax = puzzle.difficulty === 'expert' ? 81 : 9;
        if (symbols.length < expectedMin || symbols.length > expectedMax) {
            errors.push(`${label} symbols length ${symbols.length}, expected ${expectedMin}-${expectedMax}.`);
        }
        if (symbolSet.size !== symbols.length) {
            errors.push(`${label} symbols contain duplicates.`);
        }
        if (symbols.some((symbol) => typeof symbol !== 'string' || symbol.length === 0)) {
            errors.push(`${label} symbols must be non-empty strings.`);
        }
    }

    if (puzzle.difficulty && ID_RANGES[puzzle.difficulty]) {
        const range = ID_RANGES[puzzle.difficulty];
        if (Number.isInteger(puzzle.id) && (puzzle.id < range.min || puzzle.id > range.max)) {
            errors.push(`${label} id is outside the expected range for ${puzzle.difficulty}.`);
        }
    }

    if (!Array.isArray(template)) {
        errors.push(`${label} template is missing or not an array.`);
    }

    if (Array.isArray(template) && template.length !== 9) {
        errors.push(`${label} template has ${template.length} rows, expected 9.`);
    }

    const rows = Array.isArray(template)
        ? template.map((row, r) => {
            if (typeof row !== 'string') {
                errors.push(`${label} template row ${r} is not a string.`);
                return [];
            }
            return Array.from(row);
        })
        : [];
    for (let r = 0; r < rows.length; r += 1) {
        const row = rows[r];
        if (row.length !== 9) {
            errors.push(`${label} row ${r} length ${row.length}, expected 9.`);
            continue;
        }
        if (row.some((symbol) => !symbolSet.has(symbol))) {
            errors.push(`${label} row ${r} contains symbols not in the symbol list.`);
        }
        if (puzzle.difficulty !== 'expert' && new Set(row).size !== 9) {
            errors.push(`${label} row ${r} has duplicate symbols.`);
        }
    }

    for (let c = 0; c < 9; c += 1) {
        const column = rows.map((row) => row[c]).filter(Boolean);
        if (column.length !== 9) {
            errors.push(`${label} column ${c} length ${column.length}, expected 9.`);
            continue;
        }
        if (column.some((symbol) => !symbolSet.has(symbol))) {
            errors.push(`${label} column ${c} contains symbols not in the symbol list.`);
        }
        if (puzzle.difficulty !== 'expert' && new Set(column).size !== 9) {
            errors.push(`${label} column ${c} has duplicate symbols.`);
        }
    }

    const rowStrings = rows.map((row) => row.join(''));
    const columnStrings = [];
    for (let c = 8; c >= 0; c -= 1) {
        columnStrings.push(rows.map((row) => row[c]).join(''));
    }

    if (!Array.isArray(revealed)) {
        errors.push(`${label} revealed is missing or not an array.`);
    } else if (revealed.length !== 9) {
        errors.push(`${label} revealed has ${revealed.length} rows, expected 9.`);
    } else {
        for (let r = 0; r < 9; r += 1) {
            if (!revealed[r] || revealed[r].length !== 9) {
                const length = revealed[r] ? revealed[r].length : 0;
                errors.push(`${label} revealed row ${r} length ${length}, expected 9.`);
                continue;
            }
            for (let c = 0; c < 9; c += 1) {
                const symbol = rows[r]?.[c];
                if (typeof revealed[r][c] !== 'boolean') {
                    errors.push(`${label} revealed value at row ${r}, col ${c} is not boolean.`);
                    continue;
                }
                if (puzzle.difficulty !== 'expert' && symbol && isKana(symbol) && !revealed[r][c]) {
                    errors.push(`${label} kana not revealed at row ${r}, col ${c}.`);
                }
            }
        }
    }

    if (!Array.isArray(solution)) {
        errors.push(`${label} solution is missing or not an array.`);
    } else if (solution.length !== 9) {
        errors.push(`${label} solution has ${solution.length} rows, expected 9.`);
    } else {
        for (let r = 0; r < 9; r += 1) {
            if (!solution[r] || solution[r].length !== 9) {
                const length = solution[r] ? solution[r].length : 0;
                errors.push(`${label} solution row ${r} length ${length}, expected 9.`);
                continue;
            }
            for (let c = 0; c < 9; c += 1) {
                const value = solution[r][c];
                const maxValue = puzzle.difficulty === 'expert' ? symbols.length : 9;
                if (value < 1 || value > maxValue) {
                    errors.push(`${label} solution value out of range at row ${r}, col ${c}.`);
                    continue;
                }
                const symbol = rows[r]?.[c];
                if (!symbol) {
                    errors.push(`${label} missing template symbol at row ${r}, col ${c}.`);
                    continue;
                }
                const expected = symbols.indexOf(symbol) + 1;
                if (expected !== value) {
                    errors.push(`${label} solution mismatch at row ${r}, col ${c}.`);
                }
            }
        }
    }

    if (puzzle.difficulty !== 'expert' && Array.isArray(solution) && solution.length === 9) {
        for (let boxRow = 0; boxRow < 3; boxRow += 1) {
            for (let boxCol = 0; boxCol < 3; boxCol += 1) {
                const values = [];
                for (let r = 0; r < 3; r += 1) {
                    for (let c = 0; c < 3; c += 1) {
                        const rowIndex = boxRow * 3 + r;
                        const colIndex = boxCol * 3 + c;
                        const value = solution[rowIndex]?.[colIndex];
                        if (Number.isInteger(value)) {
                            values.push(value);
                        }
                    }
                }
                if (values.length !== 9 || new Set(values).size !== 9) {
                    errors.push(`${label} 3x3 box (${boxRow + 1}, ${boxCol + 1}) has duplicate values.`);
                }
            }
        }
    }

    if (!Array.isArray(puzzle.vocabulary)) {
        errors.push(`${label} vocabulary is missing or not an array.`);
    } else {
        puzzle.vocabulary.forEach((entry, index) => {
            if (!entry || typeof entry !== 'object') {
                errors.push(`${label} vocabulary entry ${index} is not an object.`);
                return;
            }
            if (typeof entry.word !== 'string') {
                errors.push(`${label} vocabulary entry ${index} missing word.`);
            }
            if (typeof entry.reading !== 'string') {
                errors.push(`${label} vocabulary entry ${index} missing reading.`);
            }
            if (typeof entry.meaning !== 'string') {
                errors.push(`${label} vocabulary entry ${index} missing meaning.`);
            }
            if (!Number.isInteger(entry.jlpt) || entry.jlpt < 0 || entry.jlpt > 5) {
                errors.push(`${label} vocabulary entry ${index} jlpt out of range.`);
            }
        });
    }

    if (puzzle.difficulty === 'expert') {
        const sentenceHints = puzzle.sentenceHints;
        if (!sentenceHints || typeof sentenceHints !== 'object') {
            errors.push(`${label} sentenceHints is missing for expert puzzle.`);
        } else {
            const { rows: hintRows, columns: hintColumns } = sentenceHints;
            if (!Array.isArray(hintRows) || hintRows.length !== 9) {
                errors.push(`${label} sentenceHints.rows must have 9 entries.`);
            } else if (hintRows.some((hint) => typeof hint !== 'string' || hint.length === 0)) {
                errors.push(`${label} sentenceHints.rows must be non-empty strings.`);
            }
            if (!Array.isArray(hintColumns) || hintColumns.length !== 9) {
                errors.push(`${label} sentenceHints.columns must have 9 entries.`);
            } else if (hintColumns.some((hint) => typeof hint !== 'string' || hint.length === 0)) {
                errors.push(`${label} sentenceHints.columns must be non-empty strings.`);
            }
            if (Array.isArray(hintRows)) {
                hintRows.forEach((hint, index) => {
                    if (!sentencePools.rows.has(hint)) {
                        errors.push(`${label} sentenceHints.rows[${index}] not found in rows sentence pool.`);
                    }
                    if (hint !== rowStrings[index]) {
                        errors.push(`${label} sentenceHints.rows[${index}] does not match template row.`);
                    }
                });
            }
            if (Array.isArray(hintColumns)) {
                hintColumns.forEach((hint, index) => {
                    if (!sentencePools.columns.has(hint)) {
                        errors.push(`${label} sentenceHints.columns[${index}] not found in columns sentence pool.`);
                    }
                    if (hint !== columnStrings[index]) {
                        errors.push(`${label} sentenceHints.columns[${index}] does not match template column.`);
                    }
                });
            }
        }

        rowStrings.forEach((rowSentence, index) => {
            if (!sentencePools.rows.has(rowSentence)) {
                errors.push(`${label} template row ${index} not found in rows sentence pool.`);
            }
        });
        columnStrings.forEach((columnSentence, index) => {
            if (!sentencePools.columns.has(columnSentence)) {
                errors.push(`${label} template column ${index} not found in columns sentence pool.`);
            }
        });

        const rowSet = new Set(rowStrings);
        const columnSet = new Set(columnStrings);
        if (rowSet.size !== rowStrings.length) {
            errors.push(`${label} expert rows must form 9 unique sentences.`);
        }
        if (columnSet.size !== columnStrings.length) {
            errors.push(`${label} expert columns must form 9 unique sentences.`);
        }
        for (const rowSentence of rowSet) {
            if (columnSet.has(rowSentence)) {
                errors.push(`${label} expert row/column sentences must be distinct.`);
                break;
            }
        }

    }
}

if (errors.length) {
    console.error('Puzzle validation failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(`Puzzle validation passed (${puzzles.length} puzzles).`);
