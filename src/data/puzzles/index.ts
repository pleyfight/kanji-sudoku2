// Puzzle Index - Aggregates all puzzles and provides lookup functions

import { loadPuzzles } from './loader';
import { type Puzzle, type Difficulty } from './types';

// All puzzles combined
export const ALL_PUZZLES: Puzzle[] = loadPuzzles();

// Puzzle map for quick lookup by ID
const puzzleMap = new Map<number, Puzzle>();
const puzzlesByDifficulty: Record<Difficulty, Puzzle[]> = {
    easy: [],
    medium: [],
    hard: [],
    expert: [],
};
const shuffleBags: Record<Difficulty, Puzzle[]> = {
    easy: [],
    medium: [],
    hard: [],
    expert: [],
};
const shuffleIndices: Record<Difficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0,
};

function shuffle<T>(items: T[]): T[] {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

ALL_PUZZLES.forEach((p) => {
    puzzleMap.set(p.id, p);
    puzzlesByDifficulty[p.difficulty].push(p);
});

// Get puzzle by ID
export function getPuzzleById(id: number): Puzzle | undefined {
    return puzzleMap.get(id);
}

// Get all puzzles for a difficulty
export function getPuzzlesByDifficulty(difficulty: Difficulty): Puzzle[] {
    return puzzlesByDifficulty[difficulty] ?? puzzlesByDifficulty.easy;
}

// Get a random puzzle for a difficulty
export function getRandomPuzzle(difficulty: Difficulty): Puzzle {
    const pool = getPuzzlesByDifficulty(difficulty);
    if (pool.length === 0) {
        throw new Error(`No puzzles available for difficulty: ${difficulty}`);
    }

    if (shuffleBags[difficulty].length !== pool.length || shuffleIndices[difficulty] >= shuffleBags[difficulty].length) {
        shuffleBags[difficulty] = shuffle(pool);
        shuffleIndices[difficulty] = 0;
    }

    const puzzle = shuffleBags[difficulty][shuffleIndices[difficulty]];
    shuffleIndices[difficulty] += 1;
    return puzzle;
}

// Get puzzle count by difficulty
export function getPuzzleCount(difficulty: Difficulty): number {
    return getPuzzlesByDifficulty(difficulty).length;
}

// Get all puzzle IDs for a difficulty
export function getPuzzleIds(difficulty: Difficulty): number[] {
    return getPuzzlesByDifficulty(difficulty).map(p => p.id);
}

// Check if a puzzle ID exists
export function puzzleExists(id: number): boolean {
    return puzzleMap.has(id);
}

// Re-export types
export * from './types';
