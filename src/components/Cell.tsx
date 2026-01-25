import React from 'react';

interface CellProps {
  value: number | null;
  row: number;
  col: number;
  isInitial: boolean;
  isSelected: boolean;
  isValid: boolean; // False if it conflicts with standard Sudoku rules
  isPartOfWord: boolean; // True if part of a discovered dictionary word
  notes: number[];
  kanjiList: string[];
  onClick: () => void;
}

const HIRAGANA_NOTES = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け'];

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
}) => {
  // Determine borders based on 3x3 grid
  const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-ink' : 'border-r border-r-ink/30';
  const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-ink' : 'border-b border-b-ink/30';

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full h-full aspect-square flex items-center justify-center cursor-pointer select-none
        transition-colors duration-200
        ${borderRight} ${borderBottom}
        ${isSelected ? 'bg-indigo/20' : 'hover:bg-ink/5'}
        ${isPartOfWord && !isSelected ? 'bg-cinnabar/10' : ''}
        ${!isValid ? 'text-cinnabar' : 'text-ink'}
      `}
    >
      {value !== null ? (
        <span className={`
          text-3xl md:text-4xl leading-none
          ${isInitial ? 'font-bold' : 'font-normal'}
          ${!isInitial && isValid ? 'text-indigo' : ''}
          font-serif
        `}>
          {kanjiList[value - 1]}
        </span>
      ) : (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
          {HIRAGANA_NOTES.map((char, index) => (
            <div key={index} className="flex items-center justify-center">
              <span className="text-[8px] md:text-[10px] text-ink/60 font-sans">
                {notes.includes(index + 1) ? char : ''}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Selection indicator (corner) if needed, but background is enough */}
    </div>
  );
};
