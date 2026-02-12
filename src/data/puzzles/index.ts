// Puzzle Index - Aggregates all puzzles and provides lookup functions
// Enhanced with skip scoring: skipped puzzles are deprioritized in future selections
//
// IMPORTANT: Call initializePuzzles() before using any lookup functions.
// All lookups throw if puzzles have not been initialized.

import { loadPuzzlesAsync } from './loader';
import { type Puzzle, type Difficulty } from './types';
import { safeStorage } from '../../lib/safeStorage';
import { logger } from '../../lib/logger';

// Internal state — populated by initializePuzzles()
let allPuzzles: Puzzle[] = [];
let puzzleMap = new Map<number, Puzzle>();
const puzzlesByDifficulty: Record<Difficulty, Puzzle[]> = {
    easy: [],
    medium: [],
    hard: [],
    expert: [],
};
let _isReady = false;

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

function assertReady(): void {
    if (!_isReady) {
        throw new Error('[Kudoku] Puzzles not initialized. Call initializePuzzles() first.');
    }
}

/**
 * Initialize puzzles by fetching from public/data/puzzles/.
 * Must be called (and awaited) before any lookup functions.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export async function initializePuzzles(): Promise<void> {
    if (_isReady) return;

    const puzzles = await loadPuzzlesAsync();
    allPuzzles = puzzles;
    puzzleMap = new Map<number, Puzzle>();

    // Reset difficulty buckets
    puzzlesByDifficulty.easy = [];
    puzzlesByDifficulty.medium = [];
    puzzlesByDifficulty.hard = [];
    puzzlesByDifficulty.expert = [];

    // Build puzzle maps
    allPuzzles.forEach((p) => {
        puzzleMap.set(p.id, p);
        puzzlesByDifficulty[p.difficulty].push(p);
    });

    // Load skip scores from localStorage
    loadSkipScores();

    _isReady = true;

    // Log puzzle counts per difficulty for verification
    logger.info('puzzles', 'Puzzle pool initialized', {
        easy: puzzlesByDifficulty.easy.length,
        medium: puzzlesByDifficulty.medium.length,
        hard: puzzlesByDifficulty.hard.length,
        expert: puzzlesByDifficulty.expert.length,
    });
}

/** Check if puzzles have been loaded and are ready for use. */
export function isPuzzlesReady(): boolean {
    return _isReady;
}

// Get puzzle by ID
export function getPuzzleById(id: number): Puzzle | undefined {
    assertReady();
    return puzzleMap.get(id);
}

// Get all puzzles for a difficulty
export function getPuzzlesByDifficulty(difficulty: Difficulty): Puzzle[] {
    assertReady();
    return puzzlesByDifficulty[difficulty] ?? puzzlesByDifficulty.easy;
}

// Get a random puzzle for a difficulty (uses weighted shuffle bag)
export function getRandomPuzzle(difficulty: Difficulty): Puzzle {
    assertReady();
    const pool = getPuzzlesByDifficulty(difficulty);
    if (pool.length === 0) {
        throw new Error(`No puzzles available for difficulty: ${difficulty}`);
    }

    // Reshuffle if bag is empty or exhausted
    if (shuffleBags[difficulty].length !== pool.length || shuffleIndices[difficulty] >= shuffleBags[difficulty].length) {
        shuffleBags[difficulty] = weightedShuffle(pool);
        shuffleIndices[difficulty] = 0;
        logger.info('puzzles', `Reshuffled ${difficulty} bag`, { count: pool.length });
    }

    const puzzle = shuffleBags[difficulty][shuffleIndices[difficulty]];
    shuffleIndices[difficulty] += 1;
    return puzzle;
}

// Get puzzle count by difficulty
export function getPuzzleCount(difficulty: Difficulty): number {
    assertReady();
    return getPuzzlesByDifficulty(difficulty).length;
}

// Get all puzzle IDs for a difficulty
export function getPuzzleIds(difficulty: Difficulty): number[] {
    assertReady();
    return getPuzzlesByDifficulty(difficulty).map(p => p.id);
}

// Check if a puzzle ID exists
export function puzzleExists(id: number): boolean {
    assertReady();
    return puzzleMap.has(id);
}

// Re-export types
export * from './types';
