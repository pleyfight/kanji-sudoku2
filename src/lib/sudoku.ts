import { type Puzzle, type Difficulty, type CellData } from '../data/puzzles/types';

/**
 * Check if a cell is editable (kanji blank, not revealed).
 */
export function isCellEditable(cellData: CellData): boolean {
    return !cellData.isKana && !cellData.isRevealed;
}

/**
 * Build the expert mode slots (kanji that are revealed on the board).
 * In expert mode, the player must match input against these slots.
 */
export function buildExpertSlots(puzzle: Puzzle): string[] {
    if (puzzle.difficulty !== 'expert') {
        return [];
    }
    const slots: string[] = Array.from({ length: 9 }, () => '');
    const used = new Set<string>();
    let index = 0;

    // Scan board for revealed kanji (non-kana) to populate slots
    puzzle.grid.forEach((row) => {
        row.forEach((cell) => {
            if (cell.isRevealed && !cell.isKana && !used.has(cell.symbol) && index < slots.length) {
                slots[index] = cell.symbol;
                used.add(cell.symbol);
                index += 1;
            }
        });
    });
    return slots;
}

/**
 * Resolve the display symbol for a cell value.
 * in non-expert mode: value 1 maps to puzzle.symbols[0]
 * in expert mode: value 1 maps to expertSlots[0] (or override)
 */
export function resolveSymbol(
    value: number | null,
    difficulty: Difficulty,
    puzzle: Puzzle,
    expertSlots: string[],
    slotsOverride?: string[]
): string | null {
    if (!puzzle || value === null) return null;
    if (value < 1) return null;

    const symbols = difficulty === 'expert' ? (slotsOverride ?? expertSlots) : puzzle.symbols;
    return symbols[value - 1] ?? null;
}

/**
 * Check if a cell value matches the solution.
 * Handles expert mode redirection logic.
 */
export function isCellCorrect(
    value: number | null,
    row: number,
    col: number,
    puzzle: Puzzle,
    expertSlots: string[],
    slotsOverride?: string[]
): boolean {
    if (!puzzle) return false;

    // Kana cells are always considered "correct" as they are fixed
    if (puzzle.grid[row][col].isKana) {
        return true;
    }

    const actual = resolveSymbol(value, puzzle.difficulty, puzzle, expertSlots, slotsOverride);

    // Expected symbol comes directly from solution index -> puzzle symbols
    // The solution grid contains 0-based indices into puzzle.symbols
    const solutionIndex = puzzle.solution[row][col];
    const expected = puzzle.symbols[solutionIndex];

    return Boolean(actual && expected && actual === expected);
}

/**
 * Check if the entire board is filled and correct according to the solution.
 */
export function isBoardComplete(
    board: (number | null)[][],
    puzzle: Puzzle,
    expertSlots: string[]
): boolean {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (!isCellCorrect(board[r][c], r, c, puzzle, expertSlots)) {
                return false;
            }
        }
    }
    return true;
}
