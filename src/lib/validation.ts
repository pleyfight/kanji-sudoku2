// Sudoku cell validation — pure function, no React dependencies.
// Complexity note:
//   n = 9 (board dimension, fixed)
//   Time: O(n) — checks row (9) + column (9) + box (9) = 27 comparisons max
//   Space: O(1) — no allocations
//   Hot path: called on every cell render; O(n) with n=9 is negligible

import type { Difficulty } from '../data/puzzles';

/**
 * Checks whether a cell value conflicts with any other cell in the same
 * row, column, or 3×3 box.  Returns true if the value is valid (no conflicts).
 *
 * Expert mode skips validation (all values accepted until solution check).
 */
export function isCellValid(
    board: (number | null)[][],
    row: number,
    col: number,
    value: number | null,
    difficulty: Difficulty,
): boolean {
    if (value === null) return true;
    if (difficulty === 'expert') return true;

    // Row check
    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === value) return false;
    }

    // Column check
    for (let i = 0; i < 9; i++) {
        if (i !== row && board[i][col] === value) return false;
    }

    // 3×3 box check
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const r = startRow + i;
            const c = startCol + j;
            if ((r !== row || c !== col) && board[r][c] === value) return false;
        }
    }

    return true;
}
