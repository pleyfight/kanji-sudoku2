// Enhanced Cell Component - Supports kana (fixed) and kanji (editable) cells
import React from 'react';
import type { CellData } from '../data/puzzles';

interface CellProps {
  value: number | null;
  row: number;
  col: number;
  cellData: CellData;
  isSelected: boolean;
  isValid: boolean;
  notes: number[];
  symbols: string[];
  onClick: () => void;
  isPaused?: boolean;
}

export const Cell: React.FC<CellProps> = ({
  value,
  row,
  col,
  cellData,
  isSelected,
  isValid,
  notes,
  symbols,
  onClick,
  isPaused = false,
}) => {
  const isRightBorder = (col + 1) % 3 === 0 && col !== 8;
  const isBottomBorder = (row + 1) % 3 === 0 && row !== 8;

  const isKana = cellData.isKana;
  const isRevealed = cellData.isRevealed;
  const isEditable = !isKana && !isRevealed;

  const displaySymbol = isKana
    ? cellData.symbol
    : value !== null
      ? symbols[value - 1]
      : null;

  if (isPaused) {
    return (
      <div
        className={`
          relative w-full h-full aspect-square flex items-center justify-center
          ${isRightBorder ? 'border-r-[3px]' : 'border-r'}
          ${isBottomBorder ? 'border-b-[3px]' : 'border-b'}
        `}
        style={{
          background: 'var(--bg-panel-muted)',
          borderRightColor: 'var(--grid-line)',
          borderBottomColor: 'var(--grid-line)',
        }}
      >
        <span style={{ color: 'var(--text-muted)' }} className="text-xl">?</span>
      </div>
    );
  }

  return (
    <div
      onClick={isEditable ? onClick : undefined}
      className={`
        sudoku-cell relative w-full h-full aspect-square select-none transition-all duration-200
        ${isRightBorder ? 'border-r-[3px]' : 'border-r'}
        ${isBottomBorder ? 'border-b-[3px]' : 'border-b'}
        ${isEditable ? 'cursor-pointer' : 'cursor-default'}
        ${isSelected ? 'cell-selected' : isEditable ? 'hover:bg-[var(--cell-hover)]' : ''}
      `}
      style={{
        borderRightColor: 'var(--grid-line)',
        borderBottomColor: 'var(--grid-line)',
        background: isSelected
          ? 'var(--cell-selected)'
          : !isValid && value !== null
            ? 'color-mix(in srgb, var(--error) 10%, transparent)'
            : isKana
              ? 'color-mix(in srgb, var(--grid-line) 4%, transparent)'
              : 'var(--cell-bg)',
      }}
    >
      {displaySymbol !== null ? (
        <span
          className={`
            text-2xl sm:text-3xl md:text-4xl leading-none
            transition-all duration-200
            ${isKana ? 'font-normal' : 'kanji-cell'}
          `}
          style={{
            color: !isValid && !isRevealed
              ? 'var(--error)'
              : isKana
                ? 'var(--cell-given)'
                : isRevealed
                  ? 'var(--text-primary)'
                  : 'var(--cell-user)',
          }}
        >
          {displaySymbol}
        </span>
      ) : (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num} className="flex items-center justify-center">
              <span
                className="text-[6px] sm:text-[8px] md:text-[10px] kanji-cell"
                style={{
                  color: notes.includes(num) ? 'var(--text-muted)' : 'transparent'
                }}
              >
                {symbols[num - 1]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
