import { useRef, useState } from 'react';
import { Cell } from './Cell';
import type { Puzzle } from '../data/puzzles';
import type { GameActions, GameState } from '../lib/gameState';
import type { AppLabels } from '../lib/labels';

interface GameBoardPanelProps {
    state: GameState;
    actions: GameActions;
    puzzle: Puzzle;
    labels: AppLabels;
    isMobile: boolean;
    puzzleWordsCount: number;
    isCellValid: (row: number, col: number, value: number | null) => boolean;
    onOpenRules: () => void;
    onOpenVocabulary: () => void;
    onHintRequest: () => void;
    onNewGame: () => void;
    onRestartGame: () => void;
    onShowMobileKanjiBox: () => void;
}

export function GameBoardPanel({
    state,
    actions,
    puzzle,
    labels,
    isMobile,
    puzzleWordsCount,
    isCellValid,
    onOpenRules,
    onOpenVocabulary,
    onHintRequest,
    onNewGame,
    onRestartGame,
    onShowMobileKanjiBox,
}: GameBoardPanelProps) {
    const [mobileExpertInput, setMobileExpertInput] = useState('');
    const mobileExpertInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-center">
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    {labels.puzzle} #{state.puzzleId}
                </span>
                <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    ({puzzle.title})
                </div>
            </div>

            <div className="w-full flex items-center justify-center gap-2 sm:gap-3">
                <button
                    onClick={onOpenRules}
                    className="px-3 sm:px-4 py-2 rounded-full border text-[11px] sm:text-xs font-bold uppercase tracking-wide"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)', background: 'var(--bg-panel)' }}
                >
                    How to Play
                </button>
                <button
                    onClick={onOpenVocabulary}
                    className="px-3 sm:px-4 py-2 rounded-full border text-[11px] sm:text-xs font-bold uppercase tracking-wide"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)', background: 'var(--bg-panel)' }}
                >
                    Vocabulary ({puzzleWordsCount})
                </button>
            </div>

            <div
                className="relative w-full"
                style={{ width: 'min(96vw, 620px)', maxWidth: 'min(620px, calc(100vh - 260px))' }}
            >
                {state.isPaused && (
                    <div
                        className="absolute inset-0 z-10 flex items-center justify-center rounded-xl"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}
                    >
                        <div className="text-center">
                            <div className="text-5xl mb-3">⏸️</div>
                            <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                                {labels.paused}
                            </p>
                        </div>
                    </div>
                )}
                <div className="sudoku-grid w-full aspect-square shadow-[0_0_60px_rgba(0,0,0,0.25)]">
                    {state.currentBoard.map((rowArr, rowIndex) =>
                        rowArr.map((value, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                row={rowIndex}
                                col={colIndex}
                                value={value}
                                cellData={puzzle.grid[rowIndex][colIndex]}
                                isSelected={
                                    state.selectedCell?.row === rowIndex &&
                                    state.selectedCell?.col === colIndex
                                }
                                isValid={isCellValid(rowIndex, colIndex, value)}
                                notes={state.notes[rowIndex][colIndex]}
                                symbols={puzzle.symbols}
                                isPaused={state.isPaused}
                                onClick={() => {
                                    actions.selectCell(rowIndex, colIndex);
                                    const cellData = puzzle.grid[rowIndex][colIndex];
                                    if (isMobile && !cellData.isRevealed && !cellData.isKana) {
                                        if (state.difficulty === 'expert') {
                                            setTimeout(() => mobileExpertInputRef.current?.focus(), 50);
                                        } else {
                                            onShowMobileKanjiBox();
                                        }
                                    }
                                }}
                            />
                        ))
                    )}
                </div>

                {isMobile && state.difficulty === 'expert' && state.selectedCell && (
                    <div className="flex justify-center mt-2">
                        <input
                            ref={mobileExpertInputRef}
                            type="text"
                            inputMode="text"
                            value={mobileExpertInput}
                            onChange={(event) => {
                                const nextValue = event.target.value;
                                setMobileExpertInput(nextValue);
                                if (nextValue.length > 0) {
                                    actions.inputSymbol(nextValue[nextValue.length - 1]);
                                    setMobileExpertInput('');
                                }
                            }}
                            placeholder="漢字を入力..."
                            className="w-48 px-4 py-3 text-lg text-center border rounded-sm kanji-cell"
                            style={{
                                borderColor: 'var(--border-subtle)',
                                backgroundColor: 'var(--bg-panel)',
                                color: 'var(--text-primary)',
                            }}
                            lang="ja"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                        />
                    </div>
                )}
            </div>

            <div className="w-full max-w-[620px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-6" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={actions.toggleNoteMode}
                        className="action-btn flex items-center gap-2"
                        style={state.isNoteMode ? { color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)' } : undefined}
                    >
                        <span className="material-symbols-outlined text-[14px]">edit_note</span>
                        {labels.pencilMode}
                    </button>
                    <button
                        onClick={onHintRequest}
                        className="action-btn flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
                        {labels.hint} ({state.hintsRemaining})
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onNewGame}
                        className="action-btn"
                    >
                        {labels.newGame}
                    </button>
                    <button
                        onClick={onRestartGame}
                        className="action-btn"
                        style={{ color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)' }}
                    >
                        {labels.restartGame}
                    </button>
                </div>
            </div>
        </div>
    );
}
