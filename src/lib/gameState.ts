// Game State Management - Timer, Score, Difficulty, and Language
import { useState, useEffect, useCallback, useRef } from 'react';
import type { NumericBoard, GameBoard } from './boardGenerator';
import { generateGameBoard, validateBoard, findFormedWords } from './boardGenerator';
import type { CompoundWord } from '../data/compoundWords';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'en' | 'ja';

export interface GameState {
    // Board state
    gameBoard: GameBoard | null;
    currentBoard: NumericBoard;
    initialBoard: NumericBoard;
    notes: number[][][];

    // Game progress
    difficulty: Difficulty;
    isComplete: boolean;
    isPaused: boolean;

    // Timer
    elapsedTime: number;  // in seconds

    // Score
    score: number;
    foundWords: { word: CompoundWord; cells: { row: number; col: number }[]; direction: 'row' | 'col' }[];

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
    togglePause: () => void;

    // Cell actions
    selectCell: (row: number, col: number) => void;
    inputValue: (num: number) => void;
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
    },
    wordBonus: {
        2: 50,   // 2-character word
        3: 100,  // 3-character word
        4: 200,  // 4+ character word
    },
    hintPenalty: 25,
    timeBonus: {
        easy: { threshold: 300, bonus: 100 },      // Under 5 min
        medium: { threshold: 600, bonus: 200 },    // Under 10 min
        hard: { threshold: 900, bonus: 500 },      // Under 15 min
    },
};

const HINTS_BY_DIFFICULTY = {
    easy: 10,
    medium: 5,
    hard: 3,
};

// Custom hook for game state
export function useGameState(): [GameState, GameActions] {
    const [gameBoard, setGameBoard] = useState<GameBoard | null>(null);
    const [currentBoard, setCurrentBoard] = useState<NumericBoard>([]);
    const [initialBoard, setInitialBoard] = useState<NumericBoard>([]);
    const [notes, setNotes] = useState<number[][][]>([]);

    const [difficulty, setDifficultyState] = useState<Difficulty>('easy');
    const [isComplete, setIsComplete] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef<number | null>(null);

    const [score, setScore] = useState(0);
    const [foundWords, setFoundWords] = useState<GameState['foundWords']>([]);
    const previousFoundWordsRef = useRef<Set<string>>(new Set());

    const [hintsRemaining, setHintsRemaining] = useState(HINTS_BY_DIFFICULTY.easy);
    const [hintsUsed, setHintsUsed] = useState(0);

    const [language, setLanguage] = useState<Language>('en');
    const [isNoteMode, setIsNoteMode] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

    // Timer effect
    useEffect(() => {
        if (!isPaused && !isComplete && gameBoard) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isPaused, isComplete, gameBoard]);

    // Word detection effect
    useEffect(() => {
        if (!gameBoard || currentBoard.length === 0) return;

        const words = findFormedWords(currentBoard, gameBoard.kanjiSet, gameBoard.possibleWords);
        setFoundWords(words);

        // Check for new words and award bonus
        const currentWordKeys = new Set(words.map(w => `${w.word.word}-${w.cells.map(c => `${c.row},${c.col}`).join('|')}`));

        words.forEach(w => {
            const key = `${w.word.word}-${w.cells.map(c => `${c.row},${c.col}`).join('|')}`;
            if (!previousFoundWordsRef.current.has(key)) {
                // New word found! Award bonus
                const wordLen = w.word.word.length;
                const bonus = wordLen >= 4
                    ? SCORE_CONFIG.wordBonus[4]
                    : SCORE_CONFIG.wordBonus[wordLen as 2 | 3] || 50;
                setScore(prev => prev + bonus);
            }
        });

        previousFoundWordsRef.current = currentWordKeys;
    }, [currentBoard, gameBoard]);

    // Start new game
    const startNewGame = useCallback((diff: Difficulty = difficulty) => {
        const newBoard = generateGameBoard({ difficulty: diff });

        setGameBoard(newBoard);
        setCurrentBoard(newBoard.puzzleBoard.map(row => [...row]));
        setInitialBoard(newBoard.puzzleBoard.map(row => [...row]));
        setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));

        setDifficultyState(diff);
        setIsComplete(false);
        setIsPaused(false);
        setElapsedTime(0);
        setScore(0);
        setFoundWords([]);
        previousFoundWordsRef.current = new Set();
        setHintsRemaining(HINTS_BY_DIFFICULTY[diff]);
        setHintsUsed(0);
        setSelectedCell(null);
        setIsNoteMode(false);
    }, [difficulty]);

    // Initialize on mount
    useEffect(() => {
        startNewGame();
    }, []);

    // Toggle pause
    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    // Select cell
    const selectCell = useCallback((row: number, col: number) => {
        setSelectedCell({ row, col });
    }, []);

    // Input value
    const inputValue = useCallback((num: number) => {
        if (!selectedCell || !gameBoard) return;
        const { row, col } = selectedCell;

        // Can't edit initial cells
        if (initialBoard[row][col] !== null) return;

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
        } else {
            const wasCorrect = currentBoard[row][col] === gameBoard.solvedBoard[row][col];
            const isCorrect = num === gameBoard.solvedBoard[row][col];

            setCurrentBoard(prev => {
                const newBoard = prev.map(r => [...r]);
                newBoard[row][col] = num;
                return newBoard;
            });

            // Clear notes for this cell
            setNotes(prev => {
                const newNotes = prev.map(r => r.map(c => [...c]));
                newNotes[row][col] = [];
                return newNotes;
            });

            // Award points for correct placement (only if wasn't already correct)
            if (isCorrect && !wasCorrect) {
                setScore(prev => prev + SCORE_CONFIG.correctCell[difficulty]);
            }

            // Check completion
            setCurrentBoard(prev => {
                const newBoard = prev.map(r => [...r]);
                newBoard[row][col] = num;

                if (validateBoard(newBoard, gameBoard.solvedBoard)) {
                    setIsComplete(true);
                    // Award time bonus
                    const timeConfig = SCORE_CONFIG.timeBonus[difficulty];
                    if (elapsedTime < timeConfig.threshold) {
                        setScore(s => s + timeConfig.bonus);
                    }
                }

                return newBoard;
            });
        }
    }, [selectedCell, initialBoard, isNoteMode, gameBoard, difficulty, elapsedTime, currentBoard]);

    // Delete value
    const deleteValue = useCallback(() => {
        if (!selectedCell) return;
        const { row, col } = selectedCell;

        if (initialBoard[row][col] !== null) return;

        setCurrentBoard(prev => {
            const newBoard = prev.map(r => [...r]);
            newBoard[row][col] = null;
            return newBoard;
        });
    }, [selectedCell, initialBoard]);

    // Toggle note mode
    const toggleNoteMode = useCallback(() => {
        setIsNoteMode(prev => !prev);
    }, []);

    // Request hint (meaning-based, not fill-in)
    const requestHint = useCallback((): { meaning: string; reading: string } | null => {
        if (!selectedCell || !gameBoard || hintsRemaining <= 0) return null;
        const { row, col } = selectedCell;

        // Get the correct value for this cell
        const correctValue = gameBoard.solvedBoard[row][col];
        if (correctValue === null) return null;

        // Get the kanji for this value
        const kanji = gameBoard.kanjiSet[correctValue - 1];

        // Find a word that uses this kanji
        const relatedWord = gameBoard.possibleWords.find(w => w.word.includes(kanji));

        setHintsRemaining(prev => prev - 1);
        setHintsUsed(prev => prev + 1);
        setScore(prev => Math.max(0, prev - SCORE_CONFIG.hintPenalty));

        if (relatedWord) {
            return {
                meaning: relatedWord.meaning,
                reading: relatedWord.reading,
            };
        }

        // Fallback: just indicate the kanji meaning
        return {
            meaning: `Think about "${kanji}"`,
            reading: '',
        };
    }, [selectedCell, gameBoard, hintsRemaining]);

    // Check solution
    const checkSolution = useCallback((): boolean => {
        if (!gameBoard) return false;
        return validateBoard(currentBoard, gameBoard.solvedBoard);
    }, [currentBoard, gameBoard]);

    // Set language
    const setLanguageAction = useCallback((lang: Language) => {
        setLanguage(lang);
        // Persist to localStorage
        localStorage.setItem('kanjiSudoku_language', lang);
    }, []);

    // Set difficulty
    const setDifficulty = useCallback((diff: Difficulty) => {
        setDifficultyState(diff);
        startNewGame(diff);
    }, [startNewGame]);

    const state: GameState = {
        gameBoard,
        currentBoard,
        initialBoard,
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
        togglePause,
        selectCell,
        inputValue,
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
