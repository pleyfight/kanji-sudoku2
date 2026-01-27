// Puzzle Type Definitions

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface PuzzleWord {
    word: string;       // The word (kanji + kana)
    reading: string;    // Hiragana reading
    meaning: string;    // English meaning
    jlpt: number;       // JLPT level (5, 4, 3, 2, 1, 0 for archaic)
}

export interface PuzzleDefinition {
    id: number;                    // Unique puzzle ID (1001, 2001, etc.)
    difficulty: Difficulty;        // Difficulty level
    title: string;                 // Puzzle theme/title
    symbols: string[];             // 9 unique symbols for this puzzle
    template: string[];            // 9 strings describing the solved rows
    revealed: boolean[][];         // 9Ã—9 map of pre-filled cells
    solution: number[][];          // 9Ã—9 solved grid (1-9 indices)
    vocabulary: PuzzleWord[];      // Words that can be formed
    description?: string;          // Optional description
    sentenceHints?: {
        rows: string[];
        columns: string[];
    };
}

export interface CellData {
    symbol: string;     // The character in this cell
    isKana: boolean;    // true = hiragana/katakana (fixed), false = kanji (blank to fill)
    isRevealed: boolean; // true = shown at start, false = user must fill
}

export interface Puzzle {
    id: number;                    // Unique puzzle ID (1001, 2001, etc.)
    difficulty: Difficulty;        // Difficulty level
    title: string;                 // Puzzle theme/title
    symbols: string[];             // 9 unique symbols for this puzzle
    grid: CellData[][];            // 9×9 grid with cell data
    solution: number[][];          // 9×9 solved grid (1-9 indices)
    vocabulary: PuzzleWord[];      // Words that can be formed
    description?: string;          // Optional description
    sentenceHints?: {
        rows: string[];
        columns: string[];
    };
}

// Puzzle ID ranges by difficulty
export const PUZZLE_ID_RANGES = {
    easy: { min: 1001, max: 11000 },
    medium: { min: 11001, max: 21000 },
    hard: { min: 21001, max: 31000 },
    expert: { min: 31001, max: 41000 },
};

// Helper to check if a character is kana
export function isKana(char: string): boolean {
    const code = char.charCodeAt(0);
    // Hiragana: 3040-309F, Katakana: 30A0-30FF
    return (code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF);
}

// Helper to create a cell
export function createCell(symbol: string, isRevealed: boolean): CellData {
    return {
        symbol,
        isKana: isKana(symbol),
        isRevealed,
    };
}

// Helper to get difficulty from puzzle ID
export function getDifficultyFromId(id: number): Difficulty {
    if (id >= 1001 && id <= 1999) return 'easy';
    if (id >= 2001 && id <= 2999) return 'medium';
    if (id >= 3001 && id <= 3999) return 'hard';
    if (id >= 4001 && id <= 4999) return 'expert';
    return 'easy';
}
