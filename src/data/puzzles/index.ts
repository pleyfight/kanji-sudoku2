// Puzzle Index - Aggregates all puzzles and provides lookup functions
// Enhanced with skip scoring: skipped puzzles are deprioritized in future selections

import { loadPuzzles } from './loader';
import { type Puzzle, type Difficulty } from './types';
import { safeStorage } from '../../lib/safeStorage';

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

// Shuffle bag state - cycles through all puzzles before repeating
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

// Skip scores - higher score = more likely to be skipped, push to end of shuffle
// Persisted in localStorage to survive page refresh
const SKIP_SCORES_KEY = 'kudoko_skip_scores';
let skipScores: Record<number, number> = {};

function loadSkipScores(): void {
    const stored = safeStorage.getJSON<Record<number, number>>(SKIP_SCORES_KEY);
    skipScores = stored ?? {};
}

function saveSkipScores(): void {
    safeStorage.setJSON(SKIP_SCORES_KEY, skipScores);
}

// Mark a puzzle as skipped (increases its score, pushes it to end of future shuffles)
export function markPuzzleSkipped(puzzleId: number): void {
    skipScores[puzzleId] = (skipScores[puzzleId] ?? 0) + 1;
    saveSkipScores();
}

// Get skip score for a puzzle (0 = never skipped)
export function getSkipScore(puzzleId: number): number {
    return skipScores[puzzleId] ?? 0;
}

// Weighted shuffle: puzzles with lower skip scores come first
function weightedShuffle(items: Puzzle[]): Puzzle[] {
    // Create array of [puzzle, weight] where weight = 1 / (1 + skipScore)
    // Higher skip score = lower weight = later in shuffle
    const weighted = items.map(p => ({
        puzzle: p,
        weight: 1 / (1 + (skipScores[p.id] ?? 0)),
        random: Math.random(),
    }));

    // Sort by: weight (desc) then random (for tie-breaking)
    // This puts low-skip-score puzzles first, with randomization among equals
    weighted.sort((a, b) => {
        const weightDiff = b.weight - a.weight;
        if (Math.abs(weightDiff) > 0.001) return weightDiff;
        return a.random - b.random;
    });

    return weighted.map(w => w.puzzle);
}

// Initialize skip scores from localStorage
loadSkipScores();

// Build puzzle maps
ALL_PUZZLES.forEach((p) => {
    puzzleMap.set(p.id, p);
    puzzlesByDifficulty[p.difficulty].push(p);
});

// Log puzzle counts per difficulty for verification
console.log('[Kudoko] Puzzle Pool Isolation:');
console.log(`  Easy: ${puzzlesByDifficulty.easy.length} puzzles (IDs: ${puzzlesByDifficulty.easy[0]?.id}-${puzzlesByDifficulty.easy[puzzlesByDifficulty.easy.length - 1]?.id})`);
console.log(`  Medium: ${puzzlesByDifficulty.medium.length} puzzles (IDs: ${puzzlesByDifficulty.medium[0]?.id}-${puzzlesByDifficulty.medium[puzzlesByDifficulty.medium.length - 1]?.id})`);
console.log(`  Hard: ${puzzlesByDifficulty.hard.length} puzzles (IDs: ${puzzlesByDifficulty.hard[0]?.id}-${puzzlesByDifficulty.hard[puzzlesByDifficulty.hard.length - 1]?.id})`);
console.log(`  Expert: ${puzzlesByDifficulty.expert.length} puzzles (IDs: ${puzzlesByDifficulty.expert[0]?.id}-${puzzlesByDifficulty.expert[puzzlesByDifficulty.expert.length - 1]?.id})`);

// Get puzzle by ID
export function getPuzzleById(id: number): Puzzle | undefined {
    return puzzleMap.get(id);
}

// Get all puzzles for a difficulty
export function getPuzzlesByDifficulty(difficulty: Difficulty): Puzzle[] {
    return puzzlesByDifficulty[difficulty] ?? puzzlesByDifficulty.easy;
}

// Get a random puzzle for a difficulty (uses weighted shuffle bag)
export function getRandomPuzzle(difficulty: Difficulty): Puzzle {
    const pool = getPuzzlesByDifficulty(difficulty);
    if (pool.length === 0) {
        throw new Error(`No puzzles available for difficulty: ${difficulty}`);
    }

    // Reshuffle if bag is empty or exhausted
    if (shuffleBags[difficulty].length !== pool.length || shuffleIndices[difficulty] >= shuffleBags[difficulty].length) {
        shuffleBags[difficulty] = weightedShuffle(pool);
        shuffleIndices[difficulty] = 0;
        console.log(`[Kudoko] Reshuffled ${difficulty} bag (${pool.length} puzzles)`);
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

