import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'src', 'puzzle-data');
const SENTENCE_DIR = join(process.cwd(), 'src', 'data', 'sentences');
const ROW_SENTENCE_PATH = join(SENTENCE_DIR, 'rows.json');
const COLUMN_SENTENCE_PATH = join(SENTENCE_DIR, 'columns.json');
const TARGET_PER_DIFFICULTY = 10000;
const EXPERT_SLOT_REVEALS = 3;
const ID_RANGES = {
    easy: { min: 1001, max: 11000 },
    medium: { min: 11001, max: 21000 },
    hard: { min: 21001, max: 31000 },
    expert: { min: 31001, max: 41000 },
};

const DIFFICULTIES = Object.keys(ID_RANGES);
const REGENERATE_ALL = process.env.REGENERATE_ALL === '1';

function loadSentencePool(filePath, label) {
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`Sentence pool ${label} is missing or empty.`);
    }
    if (data.some((entry) => typeof entry !== 'string' || entry.length === 0)) {
        throw new Error(`Sentence pool ${label} must contain only non-empty strings.`);
    }
    return data;
}

const sentencePools = {
    rows: loadSentencePool(ROW_SENTENCE_PATH, 'rows'),
    columns: loadSentencePool(COLUMN_SENTENCE_PATH, 'columns'),
};

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

function shuffle(array, rng) {
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

function stripGeneratedSuffix(title) {
    if (typeof title !== 'string') {
        return '';
    }
    return title.replace(/\s+Generated\s+\d+(?:\s+Generated\s+\d+)*$/g, '').trim();
}

function normalizeTitle(title, id) {
    const base = stripGeneratedSuffix(title);
    if (typeof title === 'string' && title.includes('Generated')) {
        return base ? `${base} Generated ${id}` : `Generated ${id}`;
    }
    return base || `Puzzle ${id}`;
}

function buildBaseSolution() {
    const grid = [];
    for (let r = 0; r < 9; r += 1) {
        const row = [];
        for (let c = 0; c < 9; c += 1) {
            row.push(((r * 3 + Math.floor(r / 3) + c) % 9) + 1);
        }
        grid.push(row);
    }
    return grid;
}

function buildSudokuPermutations(rng) {
    const bands = shuffle([0, 1, 2], rng);
    const rows = bands.flatMap((band) =>
        shuffle([0, 1, 2], rng).map((offset) => band * 3 + offset)
    );
    const stacks = shuffle([0, 1, 2], rng);
    const cols = stacks.flatMap((stack) =>
        shuffle([0, 1, 2], rng).map((offset) => stack * 3 + offset)
    );
    return { rows, cols };
}

function buildLatinPermutations(rng) {
    const indices = Array.from({ length: 9 }, (_, i) => i);
    return {
        rows: shuffle(indices, rng),
        cols: shuffle(indices, rng),
    };
}

function permuteGrid(grid, rowPerm, colPerm) {
    return rowPerm.map((r) => colPerm.map((c) => grid[r][c]));
}

function buildSignature(template, symbols) {
    return `${symbols.join('|')}::${template.join('|')}`;
}

function buildTemplate(solution, symbols) {
    return solution.map((row) => row.map((value) => symbols[value - 1]).join(''));
}

function buildColumnStrings(templateRows) {
    const columns = [];
    for (let c = 8; c >= 0; c -= 1) {
        let column = '';
        for (let r = 0; r < 9; r += 1) {
            column += templateRows[r][c];
        }
        columns.push(column);
    }
    return columns;
}

function buildSentenceHints(title) {
    const base = stripGeneratedSuffix(title) || 'Expert';
    const rows = Array.from({ length: 9 }, (_, i) => `Row ${i + 1} hint: ${base} sentence ${i + 1}`);
    const columns = Array.from({ length: 9 }, (_, i) => `Column ${i + 1} hint: ${base} sentence ${i + 10}`);
    return { rows, columns };
}

function pickUnique(pool, count, rng) {
    if (pool.length < count) {
        throw new Error(`Sentence pool has ${pool.length} entries, need ${count}.`);
    }
    const chosen = new Set();
    let safety = 0;
    while (chosen.size < count) {
        if (safety > pool.length * 10) {
            throw new Error('Failed to pick unique sentences.');
        }
        const index = Math.floor(rng() * pool.length);
        chosen.add(pool[index]);
        safety += 1;
    }
    return Array.from(chosen);
}

function buildPoolSentenceHints(puzzleId) {
    const rows = pickUnique(
        sentencePools.rows,
        9,
        mulberry32(hashString(`rows-${puzzleId}`))
    );
    const columns = pickUnique(
        sentencePools.columns,
        9,
        mulberry32(hashString(`columns-${puzzleId}`))
    );
    return { rows, columns };
}

function isExpertTemplateValid(template) {
    if (!Array.isArray(template) || template.length !== 9) {
        return false;
    }
    const rowSet = new Set(template);
    if (rowSet.size !== 9) {
        return false;
    }
    const columns = buildColumnStrings(template);
    const columnSet = new Set(columns);
    if (columnSet.size !== 9) {
        return false;
    }
    for (const row of rowSet) {
        if (columnSet.has(row)) {
            return false;
        }
    }
    return true;
}

function generateExpertRevealMask(solution, symbols, rng) {
    const revealed = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => false));
    const positionsBySymbol = new Map();

    for (let r = 0; r < 9; r += 1) {
        for (let c = 0; c < 9; c += 1) {
            const symbol = symbols[solution[r][c] - 1];
            if (isKana(symbol)) {
                revealed[r][c] = true;
                continue;
            }
            if (!positionsBySymbol.has(symbol)) {
                positionsBySymbol.set(symbol, []);
            }
            positionsBySymbol.get(symbol).push([r, c]);
        }
    }

    const symbolList = shuffle(Array.from(positionsBySymbol.keys()), rng);
    const revealCount = Math.min(EXPERT_SLOT_REVEALS, symbolList.length);
    for (let i = 0; i < revealCount; i += 1) {
        const symbol = symbolList[i];
        const positions = positionsBySymbol.get(symbol) ?? [];
        if (positions.length === 0) {
            continue;
        }
        const [r, c] = positions[Math.floor(rng() * positions.length)];
        revealed[r][c] = true;
    }

    return revealed;
}

function generateRevealMask(solution, symbols, difficulty, rng) {
    if (difficulty === 'expert') {
        return generateExpertRevealMask(solution, symbols, rng);
    }
    const targetCounts = {
        easy: 45,
        medium: 36,
        hard: 30,
    };
    const revealed = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => false));
    const kanaPositions = [];
    const emptyPositions = [];

    for (let r = 0; r < 9; r += 1) {
        for (let c = 0; c < 9; c += 1) {
            const symbol = symbols[solution[r][c] - 1];
            if (isKana(symbol)) {
                revealed[r][c] = true;
                kanaPositions.push([r, c]);
            } else {
                emptyPositions.push([r, c]);
            }
        }
    }

    const target = targetCounts[difficulty] ?? 30;
    let remaining = Math.max(0, target - kanaPositions.length);
    const shuffled = shuffle(emptyPositions, rng);
    for (let i = 0; i < shuffled.length && remaining > 0; i += 1) {
        const [r, c] = shuffled[i];
        revealed[r][c] = true;
        remaining -= 1;
    }

    return revealed;
}

function loadPuzzleFile(filePath) {
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    return Array.isArray(data) ? data : [data];
}

function writePuzzleFile(filePath, puzzles) {
    const sorted = puzzles.slice().sort((a, b) => a.id - b.id);
    writeFileSync(filePath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
}

const baseSolution = buildBaseSolution();
const globalSignatures = new Set();

for (const difficulty of DIFFICULTIES) {
    const filePath = join(DATA_DIR, `${difficulty}.json`);
    const basePool = loadPuzzleFile(filePath);
    const pool = difficulty === 'expert'
        ? basePool.filter((puzzle) => isExpertTemplateValid(puzzle.template))
        : basePool;
    if (pool.length === 0) {
        throw new Error(`No base puzzles found for ${difficulty}.`);
    }

    let existing = REGENERATE_ALL ? [] : pool.slice();
    if (!REGENERATE_ALL) {
        existing.forEach((puzzle) => {
            puzzle.title = normalizeTitle(puzzle.title, puzzle.id);
            if (difficulty === 'expert') {
                puzzle.sentenceHints = buildPoolSentenceHints(puzzle.id);
                puzzle.revealed = generateRevealMask(
                    puzzle.solution,
                    puzzle.symbols,
                    difficulty,
                    mulberry32(hashString(`${puzzle.id}-revealed`))
                );
            }
        });
    }

    const signatures = new Set(existing.map((puzzle) => buildSignature(puzzle.template, puzzle.symbols)));
    existing.forEach((puzzle) => {
        const signature = buildSignature(puzzle.template, puzzle.symbols);
        if (globalSignatures.has(signature)) {
            throw new Error(`Duplicate puzzle signature detected across difficulties: ${puzzle.id}.`);
        }
        globalSignatures.add(signature);
    });

    const maxId = existing.reduce((max, puzzle) => Math.max(max, puzzle.id), 0);
    let nextId = Math.max(maxId + 1, ID_RANGES[difficulty].min);
    const range = ID_RANGES[difficulty];

    if (nextId > range.max) {
        throw new Error(`No available IDs left for ${difficulty}.`);
    }

    const rng = mulberry32(hashString(difficulty));
    let poolIndex = 0;
    let safety = 0;

    while (existing.length < TARGET_PER_DIFFICULTY) {
        if (nextId > range.max) {
            throw new Error(`Exceeded ID range for ${difficulty}.`);
        }

        if (safety > 20000) {
            throw new Error(`Failed to generate enough unique puzzles for ${difficulty}.`);
        }

        const base = pool[poolIndex % pool.length];
        poolIndex += 1;
        const baseTitle = stripGeneratedSuffix(base.title);

        const { rows: rowPerm, cols: colPerm } = difficulty === 'expert'
            ? buildLatinPermutations(rng)
            : buildSudokuPermutations(rng);
        const symbolPerm = shuffle(base.symbols, rng);

        const solution = permuteGrid(baseSolution, rowPerm, colPerm);
        const template = buildTemplate(solution, symbolPerm);
        const signature = buildSignature(template, symbolPerm);
        const rowStrings = template.slice();
        const columnStrings = buildColumnStrings(template);

        if (signatures.has(signature) || globalSignatures.has(signature)) {
            safety += 1;
            continue;
        }

        if (difficulty === 'expert') {
            const rowSet = new Set(rowStrings);
            const columnSet = new Set(columnStrings);
            if (rowSet.size !== rowStrings.length || columnSet.size !== columnStrings.length) {
                safety += 1;
                continue;
            }
            let overlap = false;
            for (const row of rowSet) {
                if (columnSet.has(row)) {
                    overlap = true;
                    break;
                }
            }
            if (overlap) {
                safety += 1;
                continue;
            }
        }

        const revealed = generateRevealMask(solution, symbolPerm, difficulty, rng);

        existing.push({
            id: nextId,
            difficulty,
            title: `${baseTitle || 'Puzzle'} Generated ${nextId}`,
            symbols: symbolPerm,
            template,
            revealed,
            solution,
            vocabulary: base.vocabulary,
            description: base.description,
            sentenceHints: difficulty === 'expert'
                ? buildPoolSentenceHints(nextId)
                : base.sentenceHints,
        });

        signatures.add(signature);
        globalSignatures.add(signature);
        nextId += 1;
        safety += 1;
    }

    writePuzzleFile(filePath, existing);
}

console.log('Generated puzzles to target counts.');
