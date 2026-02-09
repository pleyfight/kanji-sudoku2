// Hints hook - extracted from useGameState following SRP
// Manages hint availability and usage

import { useState, useCallback } from 'react';
import type { Difficulty } from '../data/puzzles';

// Hints configuration - extracted from gameState.ts
export const HINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
    easy: 10,
    medium: 5,
    hard: 3,
    expert: 10,
};

export interface HintsState {
    hintsRemaining: number;
    hintsUsed: number;
}

export interface HintsActions {
    useHint: () => boolean; // Returns true if hint was available
    resetHints: (difficulty: Difficulty) => void;
}

/**
 * Hook for managing hint availability.
 * Extracted from useGameState to follow Single Responsibility Principle.
 * 
 * Note: The actual hint content generation remains in useGameState
 * as it requires puzzle context. This hook only manages the count.
 * 
 * @param initialDifficulty - Starting difficulty for hint count
 */
export function useHints(initialDifficulty: Difficulty = 'easy'): [HintsState, HintsActions] {
    const [hintsRemaining, setHintsRemaining] = useState(HINTS_BY_DIFFICULTY[initialDifficulty]);
    const [hintsUsed, setHintsUsed] = useState(0);

    const useHint = useCallback((): boolean => {
        if (hintsRemaining <= 0) {
            return false;
        }
        setHintsRemaining(prev => prev - 1);
        setHintsUsed(prev => prev + 1);
        return true;
    }, [hintsRemaining]);

    const resetHints = useCallback((difficulty: Difficulty) => {
        setHintsRemaining(HINTS_BY_DIFFICULTY[difficulty]);
        setHintsUsed(0);
    }, []);

    const state: HintsState = {
        hintsRemaining,
        hintsUsed,
    };

    const actions: HintsActions = {
        useHint,
        resetHints,
    };

    return [state, actions];
}
