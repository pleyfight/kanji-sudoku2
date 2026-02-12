// Score configuration — used by gameState.ts for scoring calculations.
// The useScore hook was extracted but never integrated; only SCORE_CONFIG is kept.

import type { Difficulty } from '../data/puzzles';

export const SCORE_CONFIG = {
    correctCell: {
        easy: 10,
        medium: 20,
        hard: 30,
        expert: 50,
    } as Record<Difficulty, number>,
    wordBonus: {
        2: 50,
        3: 100,
        4: 200,
    } as Record<number, number>,
    hintPenalty: 25,
    timeBonus: {
        easy: { threshold: 300, bonus: 100 },
        medium: { threshold: 600, bonus: 200 },
        hard: { threshold: 900, bonus: 500 },
        expert: { threshold: 1200, bonus: 1000 },
    } as Record<Difficulty, { threshold: number; bonus: number }>,
};
