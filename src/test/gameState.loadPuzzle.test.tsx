import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Puzzle } from '../data/puzzles/types';

const {
    mockInitializePuzzles,
    mockGetRandomPuzzle,
    mockGetPuzzleById,
    mockMarkPuzzleSkipped,
} = vi.hoisted(() => ({
    mockInitializePuzzles: vi.fn(),
    mockGetRandomPuzzle: vi.fn(),
    mockGetPuzzleById: vi.fn(),
    mockMarkPuzzleSkipped: vi.fn(),
}));

vi.mock('../data/puzzles', () => ({
    initializePuzzles: mockInitializePuzzles,
    getRandomPuzzle: mockGetRandomPuzzle,
    getPuzzleById: mockGetPuzzleById,
    markPuzzleSkipped: mockMarkPuzzleSkipped,
}));

function makePuzzle(id: number): Puzzle {
    return {
        id,
        difficulty: 'easy',
        title: `Puzzle ${id}`,
        symbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        grid: Array.from({ length: 9 }, () =>
            Array.from({ length: 9 }, () => ({
                symbol: '1',
                isKana: false,
                isRevealed: true,
            }))
        ),
        solution: Array.from({ length: 9 }, () => Array(9).fill(0)),
        vocabulary: [],
    };
}

describe('useGameState loadPuzzle input guard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInitializePuzzles.mockResolvedValue(undefined);
        mockGetRandomPuzzle.mockReturnValue(makePuzzle(1001));
        mockGetPuzzleById.mockReturnValue(makePuzzle(1001));
    });

    it('rejects invalid puzzle IDs before lookup', async () => {
        const { useGameState } = await import('../lib/gameState');
        const { result } = renderHook(() => useGameState());

        await waitFor(() => {
            expect(result.current[0].isLoading).toBe(false);
        });

        expect(result.current[1].loadPuzzle(0)).toBe(false);
        expect(result.current[1].loadPuzzle(-10)).toBe(false);
        expect(result.current[1].loadPuzzle(1.5)).toBe(false);
        expect(result.current[1].loadPuzzle(Number.NaN)).toBe(false);

        expect(mockGetPuzzleById).not.toHaveBeenCalled();
    });

    it('accepts valid positive safe-integer IDs', async () => {
        const { useGameState } = await import('../lib/gameState');
        const { result } = renderHook(() => useGameState());

        await waitFor(() => {
            expect(result.current[0].isLoading).toBe(false);
        });

        let loaded = false;
        act(() => {
            loaded = result.current[1].loadPuzzle(1001);
        });

        expect(loaded).toBe(true);
        expect(mockGetPuzzleById).toHaveBeenCalledWith(1001);
    });
});
