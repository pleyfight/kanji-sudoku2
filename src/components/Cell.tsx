// Enhanced Cell Component with Kanji input support
import React from 'react';

interface CellProps {
  value: number | null;
  row: number;
  col: number;
  isInitial: boolean;
  isSelected: boolean;
  isValid: boolean;
  isPartOfWord: boolean;
  notes: number[];
  kanjiList: string[];
  onClick: () => void;
  isPaused?: boolean;
}

export const Cell: React.FC<CellProps> = ({
  value,
  row,
  col,
  isInitial,
  isSelected,
  isValid,
  isPartOfWord,
  notes,
  kanjiList,
  onClick,
  isPaused = false,
}) => {
  // Determine borders based on 3x3 grid
  const borderRight = (col + 1) % 3 === 0 && col !== 8
    ? 'border-r-2 border-r-ink'
    : 'border-r border-r-ink/30';
  const borderBottom = (row + 1) % 3 === 0 && row !== 8
    ? 'border-b-2 border-b-ink'
    : 'border-b border-b-ink/30';

  // Show blur overlay when paused
  if (isPaused) {
    return (
      <div
        className={`
          relative w-full h-full aspect-square flex items-center justify-center
          ${borderRight} ${borderBottom}
          bg-ink/10
        `}
      >
        <span className="text-ink/20 text-xl">?</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full h-full aspect-square flex items-center justify-center 
        cursor-pointer select-none transition-all duration-200
        ${borderRight} ${borderBottom}
        ${isSelected
          ? 'bg-indigo/20 ring-2 ring-indigo ring-inset'
          : 'hover:bg-ink/5'}
        ${isPartOfWord && !isSelected ? 'bg-cinnabar/10' : ''}
        ${!isValid ? 'bg-cinnabar/20' : ''}
      `}
    >
      {value !== null ? (
        <span className={`
          text-2xl sm:text-3xl md:text-4xl leading-none font-serif
          transition-transform duration-200
          ${isInitial ? 'font-bold text-ink' : 'font-normal'}
          ${!isInitial && isValid ? 'text-indigo' : ''}
          ${!isValid ? 'text-cinnabar animate-shake' : ''}
        `}>
          {kanjiList[value - 1]}
        </span>
      ) : (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num} className="flex items-center justify-center">
              <span className={`
                text-[6px] sm:text-[8px] md:text-[10px] font-sans
                ${notes.includes(num) ? 'text-ink/70' : 'text-transparent'}
              `}>
                {kanjiList[num - 1]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Word highlight indicator */}
      {isPartOfWord && value !== null && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-cinnabar rounded-bl" />
      )}
    </div>
  );
};
