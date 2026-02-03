// Score hook - extracted from useGameState following SRP
// Manages game scoring, word bonuses, and time bonuses

import { useState, useCallback } from 'react';
import type { Difficulty } from '../data/puzzles';

// Scoring configuration - extracted from gameState.ts
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

export interface FoundWord {
    word: string;
    meaning: string;
    reading: string;
    cells: { row: number; col: number }[];
}

export interface ScoreState {
    score: number;
    foundWords: FoundWord[];
}

export interface ScoreActions {
    addPoints: (points: number) => void;
    subtractPoints: (points: number) => void;
    addCorrectCellPoints: (difficulty: Difficulty) => void;
    addWordBonus: (word: FoundWord) => void;
    applyTimeBonus: (difficulty: Difficulty, elapsedTime: number) => void;
    applyHintPenalty: () => void;
    resetScore: () => void;
}

/**
 * Hook for managing game score and found words.
 * Extracted from useGameState to follow Single Responsibility Principle.
 */
export function useScore(): [ScoreState, ScoreActions] {
    const [score, setScore] = useState(0);
    const [foundWords, setFoundWords] = useState<FoundWord[]>([]);

    const addPoints = useCallback((points: number) => {
        setScore(prev => prev + points);
    }, []);

    const subtractPoints = useCallback((points: number) => {
        setScore(prev => Math.max(0, prev - points));
    }, []);

    const addCorrectCellPoints = useCallback((difficulty: Difficulty) => {
        setScore(prev => prev + SCORE_CONFIG.correctCell[difficulty]);
    }, []);

    const addWordBonus = useCallback((word: FoundWord) => {
        setFoundWords(prev => [...prev, word]);
        const length = word.word.length;
        const bonus = SCORE_CONFIG.wordBonus[length] ?? 0;
        if (bonus > 0) {
            setScore(prev => prev + bonus);
        }
    }, []);

    const applyTimeBonus = useCallback((difficulty: Difficulty, elapsedTime: number) => {
        const config = SCORE_CONFIG.timeBonus[difficulty];
        if (elapsedTime < config.threshold) {
            setScore(prev => prev + config.bonus);
        }
    }, []);

    const applyHintPenalty = useCallback(() => {
        setScore(prev => Math.max(0, prev - SCORE_CONFIG.hintPenalty));
    }, []);

    const resetScore = useCallback(() => {
        setScore(0);
        setFoundWords([]);
    }, []);

    const state: ScoreState = {
        score,
        foundWords,
    };

    const actions: ScoreActions = {
        addPoints,
        subtractPoints,
        addCorrectCellPoints,
        addWordBonus,
        applyTimeBonus,
        applyHintPenalty,
        resetScore,
    };

    return [state, actions];
}
