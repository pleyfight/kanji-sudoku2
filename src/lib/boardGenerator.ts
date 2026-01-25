// Board Generator - Creates Sudoku boards with Kanji that form valid words
import { ALL_COMPOUND_WORDS, type CompoundWord } from '../data/compoundWords';

export type KanjiBoard = (string | null)[][];
export type NumericBoard = (number | null)[][];

export interface GameBoard {
    kanjiSet: string[];           // The 9 unique Kanji for this game
    solvedBoard: NumericBoard;    // Solved puzzle (numbers 1-9)
    puzzleBoard: NumericBoard;    // Puzzle with blanks (numbers or null)
    possibleWords: CompoundWord[]; // Words that can be formed with this set
}

export interface BoardConfig {
    difficulty: 'easy' | 'medium' | 'hard';
    preferredCategories?: string[];  // Optional: prioritize certain word categories
}

// Find Kanji sets that can form multiple valid words
function findValidKanjiSets(): string[][] {
    // Pre-defined good kanji sets that form many words
    const predefinedSets: string[][] = [
        // Days of week + nature
        ['日', '月', '火', '水', '木', '金', '土', '天', '人'],
        // Time-focused
        ['今', '日', '月', '年', '週', '前', '後', '朝', '夜'],
        // Nature-focused  
        ['山', '川', '海', '空', '風', '雨', '花', '木', '火'],
        // People-focused
        ['人', '男', '女', '子', '父', '母', '友', '先', '生'],
        // Direction/Place
        ['上', '下', '左', '右', '中', '外', '前', '後', '内'],
        // Size/Quality
        ['大', '小', '長', '短', '高', '低', '新', '古', '多'],
        // Numbers
        ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
        // Body
        ['目', '耳', '口', '手', '足', '心', '体', '頭', '顔'],
        // School/Work
        ['学', '校', '教', '室', '会', '社', '仕', '事', '業'],
        // Mixed common
        ['日', '本', '人', '国', '大', '中', '小', '年', '月'],
        // Nature elements
        ['天', '地', '水', '火', '風', '雷', '山', '川', '海'],
        // Actions
        ['行', '来', '見', '聞', '読', '書', '言', '思', '知'],
        // Life concepts
        ['生', '死', '命', '心', '愛', '夢', '力', '気', '魂'],
    ];

    return predefinedSets;
}

// Check what words can be formed with a given kanji set
function findPossibleWords(kanjiSet: string[]): CompoundWord[] {
    const kanjiSetChars = new Set(kanjiSet);

    return ALL_COMPOUND_WORDS.filter(compound => {
        // Check if all characters in the word are in our set
        for (const char of compound.word) {
            if (!kanjiSetChars.has(char)) {
                return false;
            }
        }
        return true;
    });
}

// Shuffle array in place
function shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Check if a number is valid in a position (standard Sudoku rules)
function isValid(board: NumericBoard, row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

// Solve the board using backtracking
function solve(board: NumericBoard, randomize = false): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === null) {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                const candidates = randomize ? shuffle(nums) : nums;

                for (const num of candidates) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solve(board, randomize)) return true;
                        board[row][col] = null;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Generate a new empty board
function generateEmptyBoard(): NumericBoard {
    return Array.from({ length: 9 }, () => Array(9).fill(null));
}

// Remove cells based on difficulty
function createPuzzle(solved: NumericBoard, difficulty: 'easy' | 'medium' | 'hard'): NumericBoard {
    const puzzle = solved.map(row => [...row]);

    // Number of cells to remove
    const removeCounts = {
        easy: 30,
        medium: 45,
        hard: 55
    };

    let attempts = removeCounts[difficulty];

    while (attempts > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] !== null) {
            puzzle[row][col] = null;
            attempts--;
        }
    }

    return puzzle;
}

// Main board generation function
export function generateGameBoard(config: BoardConfig): GameBoard {
    const kanjiSets = findValidKanjiSets();

    // Pick a random kanji set
    const kanjiSet = shuffle(kanjiSets)[0];

    // Find words that can be formed with this set
    const possibleWords = findPossibleWords(kanjiSet);

    // Generate a solved Sudoku board
    const solvedBoard = generateEmptyBoard();
    solve(solvedBoard, true);

    // Create puzzle by removing cells
    const puzzleBoard = createPuzzle(solvedBoard, config.difficulty);

    return {
        kanjiSet,
        solvedBoard,
        puzzleBoard,
        possibleWords
    };
}

// Convert numeric board to kanji display
export function boardToKanji(board: NumericBoard, kanjiSet: string[]): KanjiBoard {
    return board.map(row =>
        row.map(num => num ? kanjiSet[num - 1] : null)
    );
}

// Validate a complete board
export function validateBoard(current: NumericBoard, solved: NumericBoard): boolean {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (current[i][j] !== solved[i][j]) return false;
        }
    }
    return true;
}

// Find words formed in the current board state
export function findFormedWords(
    board: NumericBoard,
    kanjiSet: string[],
    possibleWords: CompoundWord[]
): { word: CompoundWord; cells: { row: number; col: number }[]; direction: 'row' | 'col' }[] {
    const foundWords: { word: CompoundWord; cells: { row: number; col: number }[]; direction: 'row' | 'col' }[] = [];

    const checkLine = (line: (number | null)[], isRow: boolean, index: number) => {
        // Convert to kanji string
        const lineStr = line.map(v => v ? kanjiSet[v - 1] : '?').join('');

        // Check each possible word
        for (const compound of possibleWords) {
            const idx = lineStr.indexOf(compound.word);
            if (idx !== -1) {
                const cells: { row: number; col: number }[] = [];
                for (let i = 0; i < compound.word.length; i++) {
                    if (isRow) {
                        cells.push({ row: index, col: idx + i });
                    } else {
                        cells.push({ row: idx + i, col: index });
                    }
                }
                foundWords.push({
                    word: compound,
                    cells,
                    direction: isRow ? 'row' : 'col'
                });
            }
        }
    };

    // Check rows
    for (let r = 0; r < 9; r++) {
        checkLine(board[r], true, r);
    }

    // Check columns
    for (let c = 0; c < 9; c++) {
        const colData: (number | null)[] = [];
        for (let r = 0; r < 9; r++) {
            colData.push(board[r][c]);
        }
        checkLine(colData, false, c);
    }

    // Remove duplicates
    const seen = new Set<string>();
    return foundWords.filter(f => {
        const key = `${f.word.word}-${f.cells.map(c => `${c.row},${c.col}`).join('|')}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
