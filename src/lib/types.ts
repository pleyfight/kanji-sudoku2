// Core game types and value objects
// Following Clean Code principles: eliminate primitive obsession

/**
 * Represents a position on the Sudoku board.
 * Value object - immutable, used to eliminate row/col data clumps.
 */
export type CellPosition = Readonly<{
    row: number;
    col: number;
}>;

/**
 * Creates a CellPosition with validation.
 */
export function createCellPosition(row: number, col: number): CellPosition {
    if (row < 0 || row > 8 || col < 0 || col > 8) {
        throw new Error(`Invalid cell position: (${row}, ${col})`);
    }
    return { row, col };
}

/**
 * Checks if two positions are equal.
 */
export function positionsEqual(a: CellPosition | null, b: CellPosition | null): boolean {
    if (a === null || b === null) return a === b;
    return a.row === b.row && a.col === b.col;
}
