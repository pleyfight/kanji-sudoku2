# Complexity Notes

Date: 2026-02-13
Project: Kudoku

## Scope

This note tracks runtime and space complexity for key nontrivial paths:

- `gameState` mutation and verification paths in `src/lib/gameState.ts`
- puzzle selection paths in `src/data/puzzles/index.ts`
- board validation path in `src/lib/validation.ts`

## Definitions

- `n`: board dimension (`9` for Sudoku)
- `k`: symbol count (`9`)
- `m`: number of puzzles in a selected difficulty bucket

## Game State (`src/lib/gameState.ts`)

- `initializePuzzle`: `O(n^2 * k)` time, `O(n^2)` space
  - Maps full board and resolves symbol indexes.
  - Allocates a fresh board and notes grid.
- `applyValue`: `O(n^2)` time, `O(n^2)` space
  - Immutable board update plus full-board completion check.
  - Notes updates also copy grid slices.
- `checkSolution`: `O(n^2)` time, `O(1)` extra space
  - Full board scan using correctness helper.

## Puzzle Selection (`src/data/puzzles/index.ts`)

- `weightedShuffle`: `O(m log m)` time, `O(m)` space
  - Builds weighted tuples and sorts by weight + tiebreaker randomness.
- `getRandomPuzzle`: `O(1)` typical draw, `O(m log m)` on reshuffle, `O(m)` space for bag
  - Amortized draw across one full bag cycle is effectively `O(1)`.

## Board Validation (`src/lib/validation.ts`)

- `isCellValid`: `O(n)` time, `O(1)` space
  - Row + column + 3x3 box checks.
  - With fixed `n = 9`, this is bounded constant work per cell render.
