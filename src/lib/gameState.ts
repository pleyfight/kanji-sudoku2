// Game State Management - Refactored with Extracted Hooks
// Following SRP: Timer, Score, and Hints logic extracted to dedicated hooks
// These hooks can be composed for full decomposition in the future
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getRandomPuzzle,
    getPuzzleById,
    markPuzzleSkipped
} from '../data/puzzles';
import type { Puzzle, Difficulty, CellData } from '../data/puzzles';

// Configuration and utilities from extracted hooks
import { formatTime } from '../hooks/useTimer';
import { SCORE_CONFIG } from '../hooks/useScore';
import { HINTS_BY_DIFFICULTY } from '../hooks/useHints';
import { safeStorage } from './safeStorage';

export type { Difficulty };
export type Language = 'en' | 'ja';
// Re-export formatTime for external consumers
export { formatTime };

export interface GameState {
    // Puzzle info
    puzzle: Puzzle | null;
    puzzleId: number | null;

    // Board state (number indices 1-9, or null for empty)
    currentBoard: (number | null)[][];
    notes: number[][][];  // Notes for each cell

    // Game progress
    difficulty: Difficulty;
    isComplete: boolean;
    isPaused: boolean;

    // Timer
    elapsedTime: number;  // in seconds

    // Score
    score: number;
    foundWords: { word: string; meaning: string; reading: string; cells: { row: number; col: number }[] }[];

    // Hints
    hintsRemaining: number;
    hintsUsed: number;

    // Expert mode slots
    expertSlots: string[];
    isFailed: boolean;

    // Settings
    language: Language;
    isNoteMode: boolean;

    // Selection
    selectedCell: { row: number; col: number } | null;
}

export interface GameActions {
    // Game control
    startNewGame: (difficulty?: Difficulty) => void;
    loadPuzzle: (id: number) => boolean;
    restartPuzzle: () => void;
    togglePause: () => void;

    // Cell actions
    selectCell: (row: number, col: number) => void;
    deselectCell: () => void;
    inputValue: (num: number) => void;
    inputSymbol: (symbol: string) => void;
    deleteValue: () => void;
    toggleNoteMode: () => void;

    // Hints
    requestHint: () => { meaning: string; reading: string } | null;

    // Validation
    checkSolution: () => boolean;

    // Settings
    setLanguage: (lang: Language) => void;
    setDifficulty: (diff: Difficulty) => void;
}

// Check if a cell is editable (kanji blank, not revealed)
function isCellEditable(cellData: CellData): boolean {
    return !cellData.isKana && !cellData.isRevealed;
}

function buildExpertSlots(puzzle: Puzzle): string[] {
    if (puzzle.difficulty !== 'expert') {
        return [];
    }
    const slots: string[] = Array.from({ length: 9 }, () => '');
    const used = new Set<string>();
    let index = 0;
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

// Custom hook for game state
export function useGameState(): [GameState, GameActions] {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [puzzleId, setPuzzleId] = useState<number | null>(null);
    const [currentBoard, setCurrentBoard] = useState<(number | null)[][]>([]);
    const [notes, setNotes] = useState<number[][][]>([]);

    const [difficulty, setDifficultyState] = useState<Difficulty>('easy');
    const [isComplete, setIsComplete] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef<number | null>(null);

    const [score, setScore] = useState(0);
    const [foundWords, setFoundWords] = useState<GameState['foundWords']>([]);

    const [hintsRemaining, setHintsRemaining] = useState(HINTS_BY_DIFFICULTY.easy);
    const [hintsUsed, setHintsUsed] = useState(0);

    const [expertSlots, setExpertSlots] = useState<string[]>([]);
    const [isFailed, setIsFailed] = useState(false);

    const [language, setLanguage] = useState<Language>('en');
    const [isNoteMode, setIsNoteMode] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

    const resolveSymbol = useCallback((value: number | null, slotsOverride?: string[]) => {
        if (!puzzle || value === null) return null;
        const symbols = difficulty === 'expert' ? (slotsOverride ?? expertSlots) : puzzle.symbols;
        return symbols[value - 1] ?? null;
    }, [puzzle, difficulty, expertSlots]);

    const expectedSymbolFor = useCallback((row: number, col: number) => {
        if (!puzzle) return null;
        return puzzle.symbols[puzzle.solution[row][col] - 1] ?? null;
    }, [puzzle]);

    const isCorrectValue = useCallback((
        value: number | null,
        row: number,
        col: number,
        slotsOverride?: string[]
    ) => {
        if (puzzle?.grid?.[row]?.[col]?.isKana) {
            return true;
        }
        const actual = resolveSymbol(value, slotsOverride);
        const expected = expectedSymbolFor(row, col);
        return Boolean(actual && expected && actual === expected);
    }, [resolveSymbol, expectedSymbolFor, puzzle]);

    // Timer effect
    useEffect(() => {
        if (!isPaused && !isComplete && !isFailed && puzzle) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isPaused, isComplete, isFailed, puzzle]);

    // Initialize a puzzle
    const initializePuzzle = useCallback((p: Puzzle) => {
        setPuzzle(p);
        setPuzzleId(p.id);
        setDifficultyState(p.difficulty);

        // Build current board from puzzle grid
        const slots = buildExpertSlots(p);
        const board: (number | null)[][] = p.grid.map((row) =>
            row.map((cell) => {
                if (!cell.isRevealed) {
                    return null;
                }
                if (p.difficulty === 'expert') {
                    if (cell.isKana) {
                        return p.symbols.indexOf(cell.symbol) + 1;
                    }
                    const slotIndex = slots.indexOf(cell.symbol);
                    if (slotIndex !== -1) {
                        return slotIndex + 1;
                    }
                }
                // Find index of this symbol
                return p.symbols.indexOf(cell.symbol) + 1;
            })
        );
        setCurrentBoard(board);
        setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));

        setIsComplete(false);
        setIsPaused(false);
        setElapsedTime(0);
        setScore(0);
        setFoundWords([]);
        setHintsRemaining(HINTS_BY_DIFFICULTY[p.difficulty]);
        setHintsUsed(0);
        setExpertSlots(slots);
        setIsFailed(false);
        setSelectedCell(null);
        setIsNoteMode(false);
    }, []);

    // Load puzzle by ID
    const loadPuzzle = useCallback((id: number): boolean => {
        const p = getPuzzleById(id);
        if (p) {
            initializePuzzle(p);
            return true;
        }
        return false;
    }, [initializePuzzle]);

    // Start new game (random puzzle for difficulty)
    // If skipping a puzzle (not completing it), mark it as skipped for deprioritization
    const startNewGame = useCallback((diff: Difficulty = difficulty) => {
        // Mark current puzzle as skipped if we're switching mid-game
        if (puzzleId && !isComplete) {
            markPuzzleSkipped(puzzleId);
            console.log(`[Kudoko] Marked puzzle #${puzzleId} as skipped`);
        }
        const p = getRandomPuzzle(diff);
        initializePuzzle(p);
    }, [difficulty, puzzleId, isComplete, initializePuzzle]);

    const restartPuzzle = useCallback(() => {
        if (!puzzle) return;
        initializePuzzle(puzzle);
    }, [puzzle, initializePuzzle]);

    // Initialize on mount - use ref to ensure this only runs once
    const hasInitialized = useRef(false);
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            // Use queueMicrotask to avoid synchronous setState warning
            queueMicrotask(() => {
                const p = getRandomPuzzle('easy');
                initializePuzzle(p);
            });
        }
    }, [initializePuzzle]);

    // Toggle pause
    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    // Select cell
    const selectCell = useCallback((row: number, col: number) => {
        if (!puzzle || isPaused) return;

        const cellData = puzzle.grid[row][col];
        // Only select editable cells (kanji blanks)
        if (isCellEditable(cellData)) {
            setSelectedCell({ row, col });
        }
    }, [puzzle, isPaused]);

    // Deselect cell
    const deselectCell = useCallback(() => {
        setSelectedCell(null);
    }, []);

    const applyValue = useCallback((
        row: number,
        col: number,
        num: number,
        slotsOverride?: string[]
    ): boolean => {
        if (!puzzle) return false;

        if (isNoteMode) {
            setNotes(prev => {
                const newNotes = prev.map(r => r.map(c => [...c]));
                const cellNotes = newNotes[row][col];
                if (cellNotes.includes(num)) {
                    newNotes[row][col] = cellNotes.filter(n => n !== num);
                } else {
                    newNotes[row][col] = [...cellNotes, num].sort();
                }
                return newNotes;
            });
            return false;
        }

        const slots = slotsOverride ?? expertSlots;
        const wasCorrect = isCorrectValue(currentBoard[row][col], row, col, slots);
        const isCorrect = isCorrectValue(num, row, col, slots);

        const newBoard = currentBoard.map(r => [...r]);
        newBoard[row][col] = num;
        setCurrentBoard(newBoard);

        let complete = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (!isCorrectValue(newBoard[r][c], r, c, slots)) {
                    complete = false;
                    break;
                }
            }
            if (!complete) break;
        }

        if (complete) {
            setIsComplete(true);
            const timeConfig = SCORE_CONFIG.timeBonus[difficulty];
            if (elapsedTime < timeConfig.threshold) {
                setScore(s => s + timeConfig.bonus);
            }
        }

        // Clear notes for this cell
        setNotes(prev => {
            const newNotes = prev.map(r => r.map(c => [...c]));
            newNotes[row][col] = [];
            return newNotes;
        });

        // Award points for correct placement
        if (isCorrect && !wasCorrect) {
            setScore(prev => prev + SCORE_CONFIG.correctCell[difficulty]);
        }

        return complete;
    }, [puzzle, isNoteMode, expertSlots, isCorrectValue, currentBoard, difficulty, elapsedTime]);

    // Input value
    const inputValue = useCallback((num: number) => {
        if (!selectedCell || !puzzle || isComplete || isFailed || isPaused) return;
        const { row, col } = selectedCell;

        const cellData = puzzle.grid[row][col];
        if (!isCellEditable(cellData)) return;

        applyValue(row, col, num);
    }, [selectedCell, puzzle, isComplete, isFailed, isPaused, applyValue]);

    const inputSymbol = useCallback((symbol: string) => {
        if (!selectedCell || !puzzle || isComplete || isFailed || isPaused || difficulty !== 'expert') return;
        const { row, col } = selectedCell;

        const cellData = puzzle.grid[row][col];
        if (!isCellEditable(cellData)) return;

        const trimmed = symbol.trim();
        if (!trimmed) return;

        let slots = expertSlots;
        let slotIndex = slots.indexOf(trimmed);
        if (slotIndex === -1) {
            const emptyIndex = slots.findIndex((entry) => entry.length === 0);
            if (emptyIndex === -1) {
                if (!isComplete) {
                    setIsFailed(true);
                }
                return;
            }
            slots = [...slots];
            slots[emptyIndex] = trimmed;
            setExpertSlots(slots);
            slotIndex = emptyIndex;
        }

        const completed = applyValue(row, col, slotIndex + 1, slots);

        if (slots.every((entry) => entry.length > 0) && !completed) {
            const slotSet = new Set(slots);
            const puzzleSet = new Set(puzzle.symbols);
            let mismatch = slotSet.size !== puzzleSet.size;
            if (!mismatch) {
                for (const symbolItem of puzzleSet) {
                    if (!slotSet.has(symbolItem)) {
                        mismatch = true;
                        break;
                    }
                }
            }
            if (mismatch) {
                setIsFailed(true);
            }
        }
    }, [selectedCell, puzzle, isComplete, isFailed, isPaused, difficulty, expertSlots, applyValue]);

    // Delete value
    const deleteValue = useCallback(() => {
        if (!selectedCell || !puzzle || isComplete || isFailed || isPaused) return;
        const { row, col } = selectedCell;

        const cellData = puzzle.grid[row][col];
        if (!isCellEditable(cellData)) return;

        setCurrentBoard(prev => {
            const newBoard = prev.map(r => [...r]);
            newBoard[row][col] = null;
            return newBoard;
        });
    }, [selectedCell, puzzle, isComplete, isFailed, isPaused]);

    // Toggle note mode
    const toggleNoteMode = useCallback(() => {
        if (isPaused) return;
        setIsNoteMode(prev => !prev);
    }, [isPaused]);

    // Request hint
    const requestHint = useCallback((): { meaning: string; reading: string } | null => {
        if (!selectedCell || !puzzle || hintsRemaining <= 0 || isFailed || isPaused) return null;
        const { row, col } = selectedCell;

        if (difficulty === 'expert') {
            // Get the correct character for this cell
            const correctValue = puzzle.solution[row][col];
            const correctSymbol = puzzle.symbols[correctValue - 1];

            // Get row/column sentence hints
            const rowHint = puzzle.sentenceHints?.rows?.[row] ?? '';
            const columnIndex = 8 - col;
            const colHint = puzzle.sentenceHints?.columns?.[columnIndex] ?? '';

            setHintsRemaining(prev => prev - 1);
            setHintsUsed(prev => prev + 1);
            setScore(prev => Math.max(0, prev - SCORE_CONFIG.hintPenalty));

            return {
                meaning: `The answer is: ${correctSymbol}\n\nRow ${row + 1}: ${rowHint}\nColumn ${col + 1}: ${colHint}`,
                reading: correctSymbol,
            };
        }

        const correctValue = puzzle.solution[row][col];
        if (correctValue === null) return null;

        const symbol = puzzle.symbols[correctValue - 1];

        // Find a related word from vocabulary
        const relatedWord = puzzle.vocabulary.find(w => w.word.includes(symbol));

        setHintsRemaining(prev => prev - 1);
        setHintsUsed(prev => prev + 1);
        setScore(prev => Math.max(0, prev - SCORE_CONFIG.hintPenalty));

        if (relatedWord) {
            return {
                meaning: relatedWord.meaning,
                reading: relatedWord.reading,
            };
        }

        return {
            meaning: `Think about this symbol...`,
            reading: '',
        };
    }, [selectedCell, puzzle, hintsRemaining, difficulty, isFailed, isPaused]);

    // Check solution
    const checkSolution = useCallback((): boolean => {
        if (!puzzle) return false;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (!isCorrectValue(currentBoard[r][c], r, c)) {
                    return false;
                }
            }
        }
        return true;
    }, [currentBoard, puzzle, isCorrectValue]);

    // Set language
    const setLanguageAction = useCallback((lang: Language) => {
        setLanguage(lang);
        safeStorage.setItem('kanjiSudoku_language', lang);
    }, []);

    // Set difficulty
    const setDifficulty = useCallback((diff: Difficulty) => {
        setDifficultyState(diff);
        startNewGame(diff);
    }, [startNewGame]);

    const state: GameState = {
        puzzle,
        puzzleId,
        currentBoard,
        notes,
        difficulty,
        isComplete,
        isPaused,
        elapsedTime,
        score,
        foundWords,
        hintsRemaining,
        hintsUsed,
        expertSlots,
        isFailed,
        language,
        isNoteMode,
        selectedCell,
    };

    const actions: GameActions = {
        startNewGame,
        loadPuzzle,
        restartPuzzle,
        togglePause,
        selectCell,
        deselectCell,
        inputValue,
        inputSymbol,
        deleteValue,
        toggleNoteMode,
        requestHint,
        checkSolution,
        setLanguage: setLanguageAction,
        setDifficulty,
    };

    return [state, actions];
}
