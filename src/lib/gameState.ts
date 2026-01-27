// Game State Management - Now with Pre-designed Puzzles
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getRandomPuzzle,
    getPuzzleById
} from '../data/puzzles';
import type { Puzzle, Difficulty, CellData } from '../data/puzzles';

export type { Difficulty };
export type Language = 'en' | 'ja';

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
    togglePause: () => void;

    // Cell actions
    selectCell: (row: number, col: number) => void;
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

// Scoring constants
const SCORE_CONFIG = {
    correctCell: {
        easy: 10,
        medium: 20,
        hard: 30,
        expert: 50,
    },
    wordBonus: {
        2: 50,
        3: 100,
        4: 200,
    },
    hintPenalty: 25,
    timeBonus: {
        easy: { threshold: 300, bonus: 100 },
        medium: { threshold: 600, bonus: 200 },
        hard: { threshold: 900, bonus: 500 },
        expert: { threshold: 1200, bonus: 1000 },
    },
};

const HINTS_BY_DIFFICULTY = {
    easy: 10,
    medium: 5,
    hard: 3,
    expert: 10,
};

// Check if a cell is editable (kanji blank, not revealed)
function isCellEditable(cellData: CellData): boolean {
    return !cellData.isKana && !cellData.isRevealed;
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

    const [language, setLanguage] = useState<Language>('en');
    const [isNoteMode, setIsNoteMode] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

    const resolveSymbol = useCallback((value: number | null) => {
        if (!puzzle || value === null) return null;
        return puzzle.symbols[value - 1] ?? null;
    }, [puzzle]);

    const expectedSymbolFor = useCallback((row: number, col: number) => {
        if (!puzzle) return null;
        return puzzle.symbols[puzzle.solution[row][col] - 1] ?? null;
    }, [puzzle]);

    const isCorrectValue = useCallback((
        value: number | null,
        row: number,
        col: number
    ) => {
        if (puzzle?.grid?.[row]?.[col]?.isKana) {
            return true;
        }
        const actual = resolveSymbol(value);
        const expected = expectedSymbolFor(row, col);
        return Boolean(actual && expected && actual === expected);
    }, [resolveSymbol, expectedSymbolFor, puzzle]);

    // Timer effect
    useEffect(() => {
        if (!isPaused && !isComplete && puzzle) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isPaused, isComplete, puzzle]);

    // Initialize a puzzle
    const initializePuzzle = useCallback((p: Puzzle) => {
        setPuzzle(p);
        setPuzzleId(p.id);
        setDifficultyState(p.difficulty);

        // Build current board from puzzle grid
        const board: (number | null)[][] = p.grid.map((row) =>
            row.map((cell) => {
                if (!cell.isRevealed) {
                    return null;
                }
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
    const startNewGame = useCallback((diff: Difficulty = difficulty) => {
        const p = getRandomPuzzle(diff);
        initializePuzzle(p);
    }, [difficulty, initializePuzzle]);

    // Initialize on mount
    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    // Toggle pause
    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    // Select cell
    const selectCell = useCallback((row: number, col: number) => {
        if (!puzzle) return;

        const cellData = puzzle.grid[row][col];
        // Only select editable cells (kanji blanks)
        if (isCellEditable(cellData)) {
            setSelectedCell({ row, col });
        }
    }, [puzzle]);

    const applyValue = useCallback((
        row: number,
        col: number,
        num: number
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

        const wasCorrect = isCorrectValue(currentBoard[row][col], row, col);
        const isCorrect = isCorrectValue(num, row, col);

        const newBoard = currentBoard.map(r => [...r]);
        newBoard[row][col] = num;
        setCurrentBoard(newBoard);

        let complete = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (!isCorrectValue(newBoard[r][c], r, c)) {
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
    }, [puzzle, isNoteMode, isCorrectValue, currentBoard, difficulty, elapsedTime]);

    // Input value
    const inputValue = useCallback((num: number) => {
        if (!selectedCell || !puzzle || isComplete) return;
        const { row, col } = selectedCell;

        const cellData = puzzle.grid[row][col];
        if (!isCellEditable(cellData)) return;

        applyValue(row, col, num);
    }, [selectedCell, puzzle, isComplete, applyValue]);

    const inputSymbol = useCallback((symbol: string) => {
        if (!selectedCell || !puzzle || isComplete || difficulty !== 'expert') return;
        const { row, col } = selectedCell;

        const cellData = puzzle.grid[row][col];
        if (!isCellEditable(cellData)) return;

        const trimmed = symbol.trim();
        if (!trimmed) return;

        const index = puzzle.symbols.indexOf(trimmed);
        if (index === -1) return;

        applyValue(row, col, index + 1);
    }, [selectedCell, puzzle, isComplete, difficulty, applyValue]);

    // Delete value
    const deleteValue = useCallback(() => {
        if (!selectedCell || !puzzle || isComplete) return;
        const { row, col } = selectedCell;

        const cellData = puzzle.grid[row][col];
        if (!isCellEditable(cellData)) return;

        setCurrentBoard(prev => {
            const newBoard = prev.map(r => [...r]);
            newBoard[row][col] = null;
            return newBoard;
        });
    }, [selectedCell, puzzle, isComplete]);

    // Toggle note mode
    const toggleNoteMode = useCallback(() => {
        if (difficulty === 'expert') return;
        setIsNoteMode(prev => !prev);
    }, [difficulty]);

    // Request hint
    const requestHint = useCallback((): { meaning: string; reading: string } | null => {
        if (!selectedCell || !puzzle || hintsRemaining <= 0) return null;
        const { row, col } = selectedCell;

        if (difficulty === 'expert') {
            const rowHint = puzzle.sentenceHints?.rows?.[row] ?? `Row ${row + 1} hint unavailable.`;
            const columnIndex = 8 - col;
            const colHint = puzzle.sentenceHints?.columns?.[columnIndex] ?? `Column ${columnIndex + 1} hint unavailable.`;

            setHintsRemaining(prev => prev - 1);
            setHintsUsed(prev => prev + 1);
            setScore(prev => Math.max(0, prev - SCORE_CONFIG.hintPenalty));

            return {
                meaning: `Row ${row + 1}: ${rowHint}\nColumn ${columnIndex + 1}: ${colHint}`,
                reading: '',
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
    }, [selectedCell, puzzle, hintsRemaining, difficulty]);

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
        localStorage.setItem('kudoko_language', lang);
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
        language,
        isNoteMode,
        selectedCell,
    };

    const actions: GameActions = {
        startNewGame,
        loadPuzzle,
        togglePause,
        selectCell,
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

// Format time as MM:SS
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
