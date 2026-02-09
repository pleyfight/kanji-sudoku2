// GameBoard component - extracted from AppContent following SRP
// Handles board rendering, pause overlay, and cell grid

import React, { useRef, useState } from 'react';
import { Cell } from './Cell';
import type { GameState, GameActions } from '../lib/gameState';
import type { CellPosition } from '../lib/types';

interface GameBoardProps {
    state: GameState;
    actions: GameActions;
    isMobile: boolean;
    labels: { paused: string };
    isCellValid: (position: CellPosition, val: number | null) => boolean;
    onCellClick: (position: CellPosition) => void;
}

/**
 * GameBoard component - renders the Sudoku grid with cells.
 * Extracted from AppContent to follow Single Responsibility Principle.
 */
export const GameBoard: React.FC<GameBoardProps> = ({
    state,
    actions,
    isMobile,
    labels,
    isCellValid,
    onCellClick,
}) => {
    const [mobileExpertInput, setMobileExpertInput] = useState('');
    const mobileExpertInputRef = useRef<HTMLInputElement>(null);

    const displaySymbols = state.puzzle?.symbols || [];

    const handleCellClick = (position: CellPosition) => {
        actions.selectCell(position.row, position.col);
        onCellClick(position);

        // Expert mode: focus input on mobile
        if (isMobile && state.difficulty === 'expert') {
            const cellData = state.puzzle?.grid[position.row][position.col];
            if (cellData && !cellData.isRevealed && !cellData.isKana) {
                setTimeout(() => mobileExpertInputRef.current?.focus(), 50);
            }
        }
    };

    const handleExpertInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMobileExpertInput(value);
        if (value.length > 0) {
            const lastChar = value[value.length - 1];
            actions.inputSymbol(lastChar);
            setMobileExpertInput('');
        }
    };

    return (
        <div className="flex-shrink-0 relative min-w-0 w-full max-w-[min(90vw,420px)] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[600px] mx-auto lg:mx-0">

            {/* Pause overlay */}
            {state.isPaused && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-paper/90 backdrop-blur-none border-2 border-primary">
                    <div className="text-center">
                        <div className="text-5xl mb-3">⏸️</div>
                        <p className="text-lg font-medium text-ink">
                            {labels.paused}
                        </p>
                    </div>
                </div>
            )}

            {/* Board Grid */}
            <div className="glass overflow-hidden grid grid-cols-9 w-full aspect-square">
                {state.currentBoard.map((rowArr, rowIndex) =>
                    rowArr.map((val, colIndex) => {
                        const position: CellPosition = { row: rowIndex, col: colIndex };
                        return (
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
                                isValid={isCellValid(position, val)}
                                notes={state.notes[rowIndex][colIndex]}
                                symbols={displaySymbols}
                                isPaused={state.isPaused}
                                onClick={() => handleCellClick(position)}
                            />
                        );
                    })
                )}
            </div>

            {/* Mobile Expert Input */}
            {isMobile && state.difficulty === 'expert' && state.selectedCell && (
                <div className="flex justify-center mt-2">
                    <input
                        ref={mobileExpertInputRef}
                        type="text"
                        inputMode="text"
                        value={mobileExpertInput}
                        onChange={handleExpertInput}
                        placeholder="漢字を入力..."
                        className="w-48 px-4 py-3 text-xl text-center border-2 rounded-none font-serif"
                        style={{
                            borderColor: 'var(--border-primary)',
                            backgroundColor: 'var(--bg-primary)',
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
    );
};
