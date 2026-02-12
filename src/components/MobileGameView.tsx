// MobileGameView - Vertical stacked game layout for mobile screens
// Matches reference designs: 13.png, screen2.png, screen3.png
import React, { useRef } from 'react';
import { Cell } from './Cell';
import { formatTime } from '../lib/gameState';
import { isCellValid } from '../lib/validation';
import type { GameState, GameActions } from '../lib/gameState';
import type { AppLabels } from '../lib/labels';
import type { Difficulty } from '../data/puzzles';

interface MobileGameViewProps {
    state: GameState;
    actions: GameActions;
    labels: AppLabels;
    onBackToMenu: () => void;
    onCheckSolution: () => void;
    onRestartGame: () => void;
    solutionStatus: 'idle' | 'correct' | 'incorrect';
    onSettingsOpen: () => void;
    onProfileOpen: () => void;
    onCellClick: (row: number, col: number) => void;
}

export const MobileGameView: React.FC<MobileGameViewProps> = ({
    state,
    actions,
    labels,
    onBackToMenu,
    onCheckSolution,
    onRestartGame,
    solutionStatus,
    onSettingsOpen,
    onProfileOpen,
    onCellClick,
}) => {
    const puzzle = state.puzzle;
    const displaySymbols = puzzle?.symbols || [];
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
    const gridContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="mobile-game-view">
            {/* Header — constrained to screen width */}
            <header className="mobile-game-header">
                <button
                    onClick={onBackToMenu}
                    className="mobile-game-title"
                >
                    Kudoku
                </button>
                <div className="mobile-game-header-right">
                    <div className="mobile-timer-pill">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span>
                        <span className="mobile-timer-text">{formatTime(state.elapsedTime)}</span>
                    </div>
                    <button onClick={onSettingsOpen} className="mobile-icon-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
                    </button>
                    <button onClick={onProfileOpen} className="mobile-icon-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>account_circle</span>
                    </button>
                </div>
            </header>

            {/* Difficulty Tabs */}
            <nav className="mobile-difficulty-tabs">
                {difficulties.map((diff) => (
                    <button
                        key={diff}
                        onClick={() => actions.setDifficulty(diff)}
                        className={`mobile-diff-tab ${state.difficulty === diff ? 'active' : ''}`}
                    >
                        {labels[diff]}
                    </button>
                ))}
            </nav>

            {/* === PUZZLE FIRST — this is what the user should see immediately === */}

            {/* Sudoku Grid */}
            <div className="mobile-grid-container" ref={gridContainerRef}>
                {state.isPaused && (
                    <div className="mobile-pause-overlay">
                        <div className="text-center">
                            <div className="text-4xl mb-2">⏸️</div>
                            <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                                {labels.paused}
                            </p>
                        </div>
                    </div>
                )}
                <div className="sudoku-grid w-full aspect-square">
                    {state.currentBoard.map((rowArr, rowIndex) =>
                        rowArr.map((val, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                row={rowIndex}
                                col={colIndex}
                                value={val}
                                cellData={state.puzzle!.grid[rowIndex][colIndex]}
                                isSelected={
                                    state.selectedCell?.row === rowIndex &&
                                    state.selectedCell?.col === colIndex
                                }
                                isValid={isCellValid(state.currentBoard, rowIndex, colIndex, val, state.difficulty)}
                                notes={state.notes[rowIndex][colIndex]}
                                symbols={displaySymbols}
                                isPaused={state.isPaused}
                                onClick={() => onCellClick(rowIndex, colIndex)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Action Buttons Row — all equal width */}
            <div className="mobile-action-row">
                <button
                    onClick={actions.toggleNoteMode}
                    className={`mobile-action-btn ${state.isNoteMode ? 'active' : ''}`}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    <span>Pencil</span>
                </button>
                <button onClick={() => { actions.requestHint(); }} className="mobile-action-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lightbulb</span>
                    <span>Hint</span>
                </button>
                <button onClick={() => actions.startNewGame()} className="mobile-action-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                    <span>New</span>
                </button>
                <button onClick={onRestartGame} className="mobile-action-btn restart">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restart_alt</span>
                    <span>Restart</span>
                </button>
            </div>

            {/* Check Solution Button */}
            <button
                onClick={onCheckSolution}
                className="mobile-check-solution-btn"
            >
                {labels.checkSolution}
            </button>

            {solutionStatus !== 'idle' && (
                <p
                    className="text-center text-sm font-semibold mt-2"
                    style={{ color: solutionStatus === 'correct' ? 'var(--success)' : 'var(--error)' }}
                >
                    {solutionStatus === 'correct' ? labels.lookingGood : labels.mistakesToFix}
                </p>
            )}

            {/* === BELOW CHECK SOLUTION: Stats, Vocabulary, How to Play === */}

            {/* Game Stats */}
            <div className="mobile-game-stats">
                <h3 className="mobile-stats-title">{labels.gameStats}</h3>
                <div className="mobile-stats-rows">
                    <div className="mobile-stat-row">
                        <span>Mistakes</span>
                        <span>
                            <strong>{state.hintsUsed}</strong>
                            <span style={{ color: 'var(--text-muted)' }}> / 3</span>
                        </span>
                    </div>
                    <div className="mobile-stat-row">
                        <span>Complexity</span>
                        <span><strong>{state.score}</strong></span>
                    </div>
                    <div className="mobile-stat-row">
                        <span>Puzzle ID</span>
                        <span><strong>#{state.puzzleId?.toLocaleString()}</strong></span>
                    </div>
                </div>
            </div>

            {/* Extra bottom padding for bottom nav */}
            <div style={{ paddingBottom: '80px' }} />
        </div>
    );
};
