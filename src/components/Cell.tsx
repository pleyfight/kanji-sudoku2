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
  // Determine borders based on 3x3 grid
  const isRightBorder = (col + 1) % 3 === 0 && col !== 8;
  const isBottomBorder = (row + 1) % 3 === 0 && row !== 8;

  // Is this a fixed kana cell?
  const isKana = cellData.isKana;
  const isRevealed = cellData.isRevealed;
  const isEditable = !isKana && !isRevealed;

  // Get display symbol
  const displaySymbol = isKana
    ? cellData.symbol
    : value !== null
      ? symbols[value - 1]
      : null;

  // Show blur overlay when paused
  if (isPaused) {
    return (
      <div
        className={`
          relative w-full h-full aspect-square flex items-center justify-center
          ${isRightBorder ? 'border-r-2 border-r-black/20 dark:border-r-white/20' : 'border-r border-r-black/10 dark:border-r-white/10'}
          ${isBottomBorder ? 'border-b-2 border-b-black/20 dark:border-b-white/20' : 'border-b border-b-black/10 dark:border-b-white/10'}
        `}
        style={{ background: 'var(--bg-glass)' }}
      >
        <span style={{ color: 'var(--text-muted)' }} className="text-xl">?</span>
      </div>
    );
  }

  return (
    <div
      onClick={isEditable ? onClick : undefined}
      className={`
        relative w-full h-full aspect-square flex items-center justify-center 
        select-none transition-all duration-200
        ${isRightBorder ? 'border-r-2 border-primary' : 'border-r border-primary'}
        ${isBottomBorder ? 'border-b-2 border-primary' : 'border-b border-primary'}
        ${isEditable ? 'cursor-pointer' : 'cursor-default'}
        ${isSelected ? 'z-10 bg-accent/10' : isEditable ? 'hover:bg-black/5 dark:hover:bg-white/10' : ''}
      `}
      style={{
        borderColor: 'var(--border-primary)',
        backgroundColor: isSelected
          ? 'rgba(59, 130, 246, 0.15)'
          : !isValid && value !== null
            ? 'var(--error)'
            : isKana
              ? 'var(--bg-secondary)'
              : 'transparent',
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
                ? 'var(--text-muted)'  // Kana is muted
                : isRevealed
                  ? 'var(--text-primary)'  // Revealed kanji is primary
                  : 'var(--accent)',  // User-entered kanji is accent
          }}
        >
          {displaySymbol}
        </span>
      ) : (
        // Empty cell - show notes
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
