import { describe, it, expect } from 'vitest';
import {
    isCellEditable,
    buildExpertSlots,
    resolveSymbol,
    isCellCorrect,
    isBoardComplete
} from '../lib/sudoku';
import type { Puzzle, CellData, Difficulty } from '../data/puzzles/types';

// Helper to create a minimal puzzle mock
function createMockPuzzle(difficulty: Difficulty = 'easy'): Puzzle {
    const symbols = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return {
        id: 1001,
        difficulty,
        title: 'Test',
        symbols,
        grid: Array.from({ length: 9 }, () =>
            Array.from({ length: 9 }, () => ({
                symbol: '1',
                isKana: false,
                isRevealed: false
            }))
        ),
        solution: Array.from({ length: 9 }, () => Array(9).fill(0)), // 0-based index to symbols[0] ('1')
        vocabulary: []
    };
}

// Helper to create a cell
function createCell(config: Partial<CellData> = {}): CellData {
    return {
        symbol: '1',
        isKana: false,
        isRevealed: false,
        ...config
    };
}

describe('isCellEditable', () => {
    it('returns true for hidden kanji cell', () => {
        expect(isCellEditable(createCell({ isKana: false, isRevealed: false }))).toBe(true);
    });

    it('returns false for revealed kanji cell', () => {
        expect(isCellEditable(createCell({ isKana: false, isRevealed: true }))).toBe(false);
    });

    it('returns false for kana cell (even if hidden - though validation logic usually prevents hiding kana)', () => {
        expect(isCellEditable(createCell({ isKana: true, isRevealed: false }))).toBe(false);
    });
});

describe('buildExpertSlots', () => {
    it('returns empty array for non-expert difficulty', () => {
        const p = createMockPuzzle('easy');
        expect(buildExpertSlots(p)).toEqual([]);
    });

    it('populates slots from revealed non-kana cells', () => {
        const p = createMockPuzzle('expert');
        // Set some revealed cells
        p.grid[0][0] = { symbol: 'A', isKana: false, isRevealed: true };
        p.grid[0][1] = { symbol: 'B', isKana: false, isRevealed: true };
        // Duplicate symbol should be ignored
        p.grid[0][2] = { symbol: 'A', isKana: false, isRevealed: true };
        // Kana should be ignored
        p.grid[0][3] = { symbol: 'C', isKana: true, isRevealed: true };

        const slots = buildExpertSlots(p);
        expect(slots[0]).toBe('A');
        expect(slots[1]).toBe('B');
        expect(slots[2]).toBe(''); // Only 2 unique symbols found
        expect(slots.length).toBe(9);
    });
});

describe('resolveSymbol', () => {
    const p = createMockPuzzle('easy');
    const expertP = createMockPuzzle('expert');
    const expertSlots = ['A', 'B', 'C', '', '', '', '', '', ''];

    it('returns null for null value or invalid index', () => {
        expect(resolveSymbol(null, 'easy', p, [])).toBeNull();
        expect(resolveSymbol(0, 'easy', p, [])).toBeNull();
    });

    it('returns directly from puzzle symbols for non-expert', () => {
        // Value 1 -> index 0 -> '1'
        expect(resolveSymbol(1, 'easy', p, [])).toBe('1');
        // Value 9 -> index 8 -> '9'
        expect(resolveSymbol(9, 'easy', p, [])).toBe('9');
    });

    it('maps through expertSlots for expert difficulty', () => {
        // Value 1 -> expertSlots[0] -> 'A'
        expect(resolveSymbol(1, 'expert', expertP, expertSlots)).toBe('A');
        // Value 2 -> expertSlots[1] -> 'B'
        expect(resolveSymbol(2, 'expert', expertP, expertSlots)).toBe('B');
    });

    it('uses slotsOverride if provided (expert mode)', () => {
        const override = ['X', 'Y', 'Z', '', '', '', '', '', ''];
        expect(resolveSymbol(1, 'expert', expertP, expertSlots, override)).toBe('X');
    });
});

describe('isCellCorrect', () => {
    const p = createMockPuzzle('easy');
    // Solution is all 0s (index 0 -> symbol '1')

    it('returns true for kana cell (always correct)', () => {
        p.grid[0][0].isKana = true;
        expect(isCellCorrect(null, 0, 0, p, [])).toBe(true);
        p.grid[0][0].isKana = false; // Reset
    });

    it('returns true when value resolves to expected symbol', () => {
        // Expected is '1' (solution index 0)
        // Check with value 1 -> resolves to '1'
        expect(isCellCorrect(1, 0, 0, p, [])).toBe(true);
    });

    it('returns false when value resolves to wrong symbol', () => {
        // Value 2 -> resolves to '2', expected '1'
        expect(isCellCorrect(2, 0, 0, p, [])).toBe(false);
    });

    it('returns false when value is null', () => {
        expect(isCellCorrect(null, 0, 0, p, [])).toBe(false);
    });
});

describe('isBoardComplete', () => {
    const p = createMockPuzzle('easy');

    it('returns false if any cell is incorrect', () => {
        const board = Array.from({ length: 9 }, () => Array(9).fill(1)); // All 1s (correct)
        board[0][0] = 2; // Make one incorrect
        expect(isBoardComplete(board, p, [])).toBe(false);
    });

    it('returns true if all cells are correct', () => {
        const board = Array.from({ length: 9 }, () => Array(9).fill(1)); // All 1s (correct)
        expect(isBoardComplete(board, p, [])).toBe(true);
    });
});
