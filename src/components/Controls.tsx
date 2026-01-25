import React from 'react';

interface ControlsProps {
  kanjiList: string[];
  onInput: (num: number) => void;
  onDelete: () => void;
  onNoteToggle: () => void;
  isNoteMode: boolean;
}

const HIRAGANA_NOTES = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け'];

export const Controls: React.FC<ControlsProps> = ({
  kanjiList,
  onInput,
  onDelete,
  onNoteToggle,
  isNoteMode,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {kanjiList.map((kanji, index) => (
          <button
            key={index}
            onClick={() => onInput(index + 1)}
            className="
              aspect-square flex flex-col items-center justify-center
              bg-paper border border-ink/20 rounded shadow-sm
              hover:bg-indigo/10 hover:border-indigo active:bg-indigo/20
              transition-all
            "
          >
            <span className="text-xl md:text-2xl font-serif text-ink">{kanji}</span>
            <span className="text-xs text-ink/50 font-sans">{HIRAGANA_NOTES[index]}</span>
          </button>
        ))}
        <button
          onClick={onDelete}
          className="
            aspect-square flex flex-col items-center justify-center
            bg-paper border border-ink/20 rounded shadow-sm
            hover:bg-cinnabar/10 hover:border-cinnabar active:bg-cinnabar/20
            text-cinnabar
          "
        >
          <span className="material-icons text-xl">DEL</span>
        </button>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onNoteToggle}
          className={`
            px-6 py-2 rounded-full border transition-all flex items-center gap-2
            ${isNoteMode 
              ? 'bg-ink text-paper border-ink' 
              : 'bg-transparent text-ink border-ink/30 hover:border-ink'}
          `}
        >
          <span>Note Mode</span>
          <span className="text-sm opacity-70">{isNoteMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
};
