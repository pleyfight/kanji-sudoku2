// Puzzle Type Definitions

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface PuzzleWord {
    word: string;       // The word (kanji + kana)
    reading: string;    // Hiragana reading
    meaning: string;    // English meaning
    jlpt: number;       // JLPT level (5, 4, 3, 2, 1, 0 for archaic)
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
}

// Puzzle ID ranges by difficulty
export const PUZZLE_ID_RANGES = {
    easy: { min: 1001, max: 1999 },
    medium: { min: 2001, max: 2999 },
    hard: { min: 3001, max: 3999 },
    expert: { min: 4001, max: 4999 },
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
