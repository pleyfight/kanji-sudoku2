import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'src', 'puzzle-data');
const SENTENCE_DIR = join(process.cwd(), 'src', 'data', 'sentences');
const ROW_SENTENCE_PATH = join(SENTENCE_DIR, 'rows.json');
const COLUMN_SENTENCE_PATH = join(SENTENCE_DIR, 'columns.json');

const TARGET_PER_DIFFICULTY = Number.parseInt(process.env.TARGET_PER_DIFFICULTY ?? '10000', 10);
const EXPERT_REVEAL_COUNT = 9;
const ID_RANGES = {
  easy: { min: 1001, max: 11000 },
  medium: { min: 11001, max: 21000 },
  hard: { min: 21001, max: 31000 },
  expert: { min: 31001, max: 41000 },
};

const SUDOKU_DIFFICULTIES = ['easy', 'medium', 'hard'];
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

function permuteGrid(grid, rowPerm, colPerm) {
  return rowPerm.map((r) => colPerm.map((c) => grid[r][c]));
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

function buildSignature(template, symbols, difficulty) {
  if (difficulty === 'expert') {
    return template.join('|');
  }
  return `${symbols.join('|')}::${template.join('|')}`;
}

function buildSymbolsFromTemplate(templateRows) {
  const seen = new Set();
  const symbols = [];
  for (const row of templateRows) {
    for (const char of Array.from(row)) {
      if (!seen.has(char)) {
        seen.add(char);
        symbols.push(char);
      }
    }
  }
  return symbols;
}

function buildSolutionFromTemplate(templateRows, symbols) {
  const index = new Map(symbols.map((symbol, i) => [symbol, i + 1]));
  return templateRows.map((row) => Array.from(row).map((char) => {
    const mapped = index.get(char);
    if (!mapped) {
      throw new Error(`Symbol mapping missing for character: ${char}`);
    }
    return mapped;
  }));
}

function generateExpertRevealMask(rng) {
  const revealed = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => false));
  const positions = [];
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      positions.push([r, c]);
    }
  }
  const shuffled = shuffle(positions, rng);
  const revealCount = Math.min(EXPERT_REVEAL_COUNT, shuffled.length);
  for (let i = 0; i < revealCount; i += 1) {
    const [r, c] = shuffled[i];
    revealed[r][c] = true;
  }
  return revealed;
}

function generateRevealMask(solution, symbols, difficulty, rng) {
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

function buildColumnTrie(columnPool) {
  const root = { children: new Map(), isWord: false };
  columnPool.forEach((sentence) => {
    let node = root;
    for (const char of Array.from(sentence)) {
      if (!node.children.has(char)) {
        node.children.set(char, { children: new Map(), isWord: false });
      }
      node = node.children.get(char);
    }
    node.isWord = true;
  });
  return root;
}

function buildRowIndex(rowEntries) {
  const rowsByPosChar = Array.from({ length: 9 }, () => new Map());
  rowEntries.forEach((entry, rowIndex) => {
    for (let c = 0; c < 9; c += 1) {
      const char = entry.chars[c];
      const map = rowsByPosChar[c];
      if (!map.has(char)) {
        map.set(char, []);
      }
      map.get(char).push(rowIndex);
    }
  });
  return rowsByPosChar;
}

function buildWordSquare(rowEntries, rowIndexByPos, columnTrie, rng) {
  const rows = [];
  const used = new Set();
  const columnNodes = Array.from({ length: 9 }, () => columnTrie);

  function candidateRowIndices() {
    let best = null;
    for (let c = 0; c < 9; c += 1) {
      const node = columnNodes[c];
      const chars = Array.from(node.children.keys());
      if (chars.length === 0) {
        return [];
      }
      const candidates = new Set();
      for (const char of chars) {
        const list = rowIndexByPos[c].get(char);
        if (!list) continue;
        list.forEach((idx) => candidates.add(idx));
      }
      if (!best || candidates.size < best.size) {
        best = candidates;
      }
    }
    return best ? Array.from(best) : [];
  }

  function backtrack(depth) {
    if (depth === 9) {
      return columnNodes.every((node) => node.isWord);
    }

    const candidates = shuffle(candidateRowIndices(), rng);
    for (const rowIndex of candidates) {
      if (used.has(rowIndex)) continue;
      const entry = rowEntries[rowIndex];
      const nextNodes = [];
      let valid = true;
      for (let c = 0; c < 9; c += 1) {
        const nextNode = columnNodes[c].children.get(entry.chars[c]);
        if (!nextNode) {
          valid = false;
          break;
        }
        nextNodes.push(nextNode);
      }
      if (!valid) continue;

      rows.push(entry.text);
      used.add(rowIndex);
      const prevNodes = columnNodes.slice();
      for (let c = 0; c < 9; c += 1) {
        columnNodes[c] = nextNodes[c];
      }

      if (backtrack(depth + 1)) {
        return true;
      }

      rows.pop();
      used.delete(rowIndex);
      for (let c = 0; c < 9; c += 1) {
        columnNodes[c] = prevNodes[c];
      }
    }

    return false;
  }

  return backtrack(0) ? rows : null;
}

function generateExpertPuzzles(globalSignatures) {
  const filePath = join(DATA_DIR, 'expert.json');
  const rng = mulberry32(hashString('expert')); 
  const rowEntries = sentencePools.rows.map((text) => ({ text, chars: Array.from(text) }));
  const columnSet = new Set(sentencePools.columns);
  const columnTrie = buildColumnTrie(sentencePools.columns);
  const rowIndexByPos = buildRowIndex(rowEntries);

  const puzzles = REGENERATE_ALL ? [] : loadPuzzleFile(filePath);
  const signatures = new Set(puzzles.map((puzzle) => buildSignature(puzzle.template, puzzle.symbols, 'expert')));
  puzzles.forEach((puzzle) => {
    globalSignatures.add(buildSignature(puzzle.template, puzzle.symbols, 'expert'));
  });
  const maxId = puzzles.reduce((max, puzzle) => Math.max(max, puzzle.id), 0);
  let nextId = Math.max(maxId + 1, ID_RANGES.expert.min);
  let attempts = 0;
  const maxAttempts = TARGET_PER_DIFFICULTY * 200;

  while (puzzles.length < TARGET_PER_DIFFICULTY) {
    if (nextId > ID_RANGES.expert.max) {
      throw new Error('Exceeded ID range for expert puzzles.');
    }
    if (attempts > maxAttempts) {
      throw new Error(`Failed to generate ${TARGET_PER_DIFFICULTY} expert puzzles.`);
    }

    const rows = buildWordSquare(rowEntries, rowIndexByPos, columnTrie, rng);
    attempts += 1;
    if (!rows) {
      continue;
    }

    const columns = buildColumnStrings(rows);
    if (!columns.every((column) => columnSet.has(column))) {
      continue;
    }

    const rowSet = new Set(rows);
    const columnSetLocal = new Set(columns);
    if (rowSet.size !== rows.length || columnSetLocal.size !== columns.length) {
      continue;
    }
    let overlap = false;
    for (const row of rowSet) {
      if (columnSetLocal.has(row)) {
        overlap = true;
        break;
      }
    }
    if (overlap) {
      continue;
    }

    const symbols = buildSymbolsFromTemplate(rows);
    const solution = buildSolutionFromTemplate(rows, symbols);
    const revealed = generateExpertRevealMask(rng);
    const signature = buildSignature(rows, symbols, 'expert');

    if (signatures.has(signature) || globalSignatures.has(signature)) {
      continue;
    }

    puzzles.push({
      id: nextId,
      difficulty: 'expert',
      title: `Expert Sentence Grid ${nextId}`,
      symbols,
      template: rows,
      revealed,
      solution,
      vocabulary: [],
      sentenceHints: {
        rows,
        columns,
      },
    });

    signatures.add(signature);
    globalSignatures.add(signature);
    nextId += 1;
    if (puzzles.length % 100 === 0) {
      console.log(`Expert puzzles: ${puzzles.length}/${TARGET_PER_DIFFICULTY}`);
    }
  }

  writePuzzleFile(filePath, puzzles);
}

const baseSolution = buildBaseSolution();
const globalSignatures = new Set();

generateExpertPuzzles(globalSignatures);

for (const difficulty of SUDOKU_DIFFICULTIES) {
  const filePath = join(DATA_DIR, `${difficulty}.json`);
  const basePool = loadPuzzleFile(filePath);
  if (basePool.length === 0) {
    throw new Error(`No base puzzles found for ${difficulty}.`);
  }

  let existing = REGENERATE_ALL ? [] : basePool.slice();
  if (!REGENERATE_ALL) {
    existing.forEach((puzzle) => {
      puzzle.title = normalizeTitle(puzzle.title, puzzle.id);
    });
  }

  const signatures = new Set(existing.map((puzzle) => buildSignature(puzzle.template, puzzle.symbols, difficulty)));
  existing.forEach((puzzle) => {
    const signature = buildSignature(puzzle.template, puzzle.symbols, difficulty);
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

    const base = basePool[poolIndex % basePool.length];
    poolIndex += 1;
    const baseTitle = stripGeneratedSuffix(base.title);

    const { rows: rowPerm, cols: colPerm } = buildSudokuPermutations(rng);
    const symbolPerm = shuffle(base.symbols, rng);

    const solution = permuteGrid(baseSolution, rowPerm, colPerm);
    const template = buildTemplate(solution, symbolPerm);
    const signature = buildSignature(template, symbolPerm, difficulty);

    if (signatures.has(signature) || globalSignatures.has(signature)) {
      safety += 1;
      continue;
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
      sentenceHints: base.sentenceHints,
    });

    signatures.add(signature);
    globalSignatures.add(signature);
    nextId += 1;
    safety += 1;
  }

  writePuzzleFile(filePath, existing);
}

console.log('Generated puzzles to target counts.');
