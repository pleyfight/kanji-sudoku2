// Puzzle Index - Aggregates all puzzles and provides lookup functions

import { EASY_PUZZLES } from './easyPuzzles';
import { MEDIUM_PUZZLES } from './mediumPuzzles';
import { HARD_PUZZLES } from './hardPuzzles';
import { EXPERT_PUZZLES } from './expertPuzzles';
import { type Puzzle, type Difficulty } from './types';

// All puzzles combined
export const ALL_PUZZLES: Puzzle[] = [
    ...EASY_PUZZLES,
    ...MEDIUM_PUZZLES,
    ...HARD_PUZZLES,
    ...EXPERT_PUZZLES,
];

// Puzzle map for quick lookup by ID
const puzzleMap = new Map<number, Puzzle>();
ALL_PUZZLES.forEach(p => puzzleMap.set(p.id, p));

// Get puzzle by ID
export function getPuzzleById(id: number): Puzzle | undefined {
    return puzzleMap.get(id);
}

// Get all puzzles for a difficulty
export function getPuzzlesByDifficulty(difficulty: Difficulty): Puzzle[] {
    switch (difficulty) {
        case 'easy': return EASY_PUZZLES;
        case 'medium': return MEDIUM_PUZZLES;
        case 'hard': return HARD_PUZZLES;
        case 'expert': return EXPERT_PUZZLES;
        default: return EASY_PUZZLES;
    }
}

// Get a random puzzle for a difficulty
export function getRandomPuzzle(difficulty: Difficulty): Puzzle {
    const puzzles = getPuzzlesByDifficulty(difficulty);
    const index = Math.floor(Math.random() * puzzles.length);
    return puzzles[index];
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
