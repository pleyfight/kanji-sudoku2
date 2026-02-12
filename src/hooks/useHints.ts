// Hints configuration — used by gameState.ts for hint count initialization.
// The useHints hook was extracted but never integrated; only HINTS_BY_DIFFICULTY is kept.

import type { Difficulty } from '../data/puzzles';

export const HINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
    easy: 10,
    medium: 5,
    hard: 3,
    expert: 10,
};
