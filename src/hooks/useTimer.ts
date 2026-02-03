// Timer hook - extracted from useGameState following SRP
// Manages game timer state and pause functionality

import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
    elapsedTime: number;
    isPaused: boolean;
}

export interface TimerActions {
    togglePause: () => void;
    resetTimer: () => void;
    setIsPaused: (paused: boolean) => void;
}

interface UseTimerOptions {
    /** Whether the timer should be running (game active, not complete/failed) */
    isActive: boolean;
}

/**
 * Hook for managing game timer.
 * Extracted from useGameState to follow Single Responsibility Principle.
 * 
 * @param options.isActive - Timer only runs when active (not paused, not complete)
 */
export function useTimer({ isActive }: UseTimerOptions): [TimerState, TimerActions] {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Timer effect - runs when active and not paused
    useEffect(() => {
        if (isActive && !isPaused) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isActive, isPaused]);

    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setElapsedTime(0);
        setIsPaused(false);
    }, []);

    const state: TimerState = {
        elapsedTime,
        isPaused,
    };

    const actions: TimerActions = {
        togglePause,
        resetTimer,
        setIsPaused,
    };

    return [state, actions];
}

/**
 * Format time as MM:SS
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
