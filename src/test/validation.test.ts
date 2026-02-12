import { describe, it, expect } from 'vitest';
import { isCellValid } from '../lib/validation';

// Helper: creates an empty 9x9 board
function emptyBoard(): (number | null)[][] {
    return Array.from({ length: 9 }, () => Array(9).fill(null));
}

describe('isCellValid', () => {
    it('returns true for null value (empty cell)', () => {
        const board = emptyBoard();
        expect(isCellValid(board, 0, 0, null, 'easy')).toBe(true);
    });

    it('returns true when no conflicts exist', () => {
        const board = emptyBoard();
        board[0][0] = 1;
        expect(isCellValid(board, 0, 0, 1, 'easy')).toBe(true);
    });

    it('detects row conflict', () => {
        const board = emptyBoard();
        board[0][0] = 5;
        board[0][5] = 5; // Same value in same row
        expect(isCellValid(board, 0, 5, 5, 'easy')).toBe(false);
    });

    it('detects column conflict', () => {
        const board = emptyBoard();
        board[0][0] = 3;
        board[5][0] = 3; // Same value in same column
        expect(isCellValid(board, 5, 0, 3, 'easy')).toBe(false);
    });

    it('detects 3x3 box conflict', () => {
        const board = emptyBoard();
        board[0][0] = 7;
        board[1][1] = 7; // Same value in same 3x3 box
        expect(isCellValid(board, 1, 1, 7, 'easy')).toBe(false);
    });

    it('does not flag conflict across different boxes', () => {
        const board = emptyBoard();
        board[0][0] = 7;
        board[4][4] = 7; // Different row, column, and box
        expect(isCellValid(board, 4, 4, 7, 'easy')).toBe(true);
    });

    it('always returns true in expert mode (validation skipped)', () => {
        const board = emptyBoard();
        board[0][0] = 5;
        board[0][5] = 5; // Row conflict — but expert mode ignores it
        expect(isCellValid(board, 0, 5, 5, 'expert')).toBe(true);
    });

    it('validates correctly for all non-expert difficulties', () => {
        const board = emptyBoard();
        board[0][0] = 2;
        board[0][3] = 2; // Row conflict

        expect(isCellValid(board, 0, 3, 2, 'easy')).toBe(false);
        expect(isCellValid(board, 0, 3, 2, 'medium')).toBe(false);
        expect(isCellValid(board, 0, 3, 2, 'hard')).toBe(false);
    });

    it('handles edge cells correctly (corners and edges)', () => {
        const board = emptyBoard();
        // Place a value in bottom-right corner
        board[8][8] = 9;
        expect(isCellValid(board, 8, 8, 9, 'easy')).toBe(true);

        // Add conflict in same box (bottom-right 3x3)
        board[7][7] = 9;
        expect(isCellValid(board, 8, 8, 9, 'easy')).toBe(false);
    });
});
