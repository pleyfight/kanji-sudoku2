import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Puzzle } from '../data/puzzles/types';

const {
    mockLoadPuzzlesAsync,
    mockGetJSON,
    mockSetJSON,
} = vi.hoisted(() => ({
    mockLoadPuzzlesAsync: vi.fn(),
    mockGetJSON: vi.fn(),
    mockSetJSON: vi.fn(),
}));

vi.mock('../data/puzzles/loader', () => ({
    loadPuzzlesAsync: mockLoadPuzzlesAsync,
}));

vi.mock('../lib/safeStorage', () => ({
    safeStorage: {
        getJSON: mockGetJSON,
        setJSON: mockSetJSON,
    },
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

describe('puzzle skip score sanitization', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        mockLoadPuzzlesAsync.mockResolvedValue([makePuzzle(1001)]);
    });

    it('sanitizes persisted skip scores and only keeps valid puzzle IDs', async () => {
        mockGetJSON.mockReturnValue({
            1001: 999,
            1002: 7,
            abc: 5,
            '1.5': 3,
            '': 2,
        });

        const puzzles = await import('../data/puzzles');
        await puzzles.initializePuzzles();

        expect(puzzles.getSkipScore(1001)).toBe(100);
        expect(puzzles.getSkipScore(1002)).toBe(0);
    });

    it('ignores skip updates for invalid puzzle IDs', async () => {
        mockGetJSON.mockReturnValue(null);

        const puzzles = await import('../data/puzzles');
        await puzzles.initializePuzzles();

        puzzles.markPuzzleSkipped(9999);

        expect(mockSetJSON).not.toHaveBeenCalled();
    });
});
