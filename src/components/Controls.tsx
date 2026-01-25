// Enhanced Controls Component with keyboard input support for Hard mode
import React, { useState, useRef, useEffect } from 'react';

interface ControlsProps {
  kanjiList: string[];
  onInput: (num: number) => void;
  onDelete: () => void;
  onNoteToggle: () => void;
  onHint: () => void;
  isNoteMode: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  hintsRemaining: number;
  language: 'en' | 'ja';
}

export const Controls: React.FC<ControlsProps> = ({
  kanjiList,
  onInput,
  onDelete,
  onNoteToggle,
  onHint,
  isNoteMode,
  difficulty,
  hintsRemaining,
  language,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const labels = {
    en: {
      noteMode: 'Note Mode',
      on: 'ON',
      off: 'OFF',
      hint: 'Hint',
      delete: 'DEL',
      inputPlaceholder: 'Type kanji...',
      hardModeHint: 'Type kanji or click buttons',
    },
    ja: {
      noteMode: 'メモモード',
      on: 'オン',
      off: 'オフ',
      hint: 'ヒント',
      delete: '削除',
      inputPlaceholder: '漢字を入力...',
      hardModeHint: '漢字を入力するかボタンをクリック',
    },
  };

  // Handle keyboard input for hard mode
  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Check if the input matches any kanji in our set
    if (value) {
      const lastChar = value[value.length - 1];
      const index = kanjiList.indexOf(lastChar);
      if (index !== -1) {
        onInput(index + 1);
        setInputValue('');
      }
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9 for quick input
      if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.altKey) {
        const num = parseInt(e.key);
        onInput(num);
        e.preventDefault();
      }
      // Delete/Backspace for deletion
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement !== inputRef.current) {
          onDelete();
          e.preventDefault();
        }
      }
      // N for note mode toggle
      if (e.key === 'n' || e.key === 'N') {
        onNoteToggle();
        e.preventDefault();
      }
      // H for hint
      if (e.key === 'h' || e.key === 'H') {
        onHint();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInput, onDelete, onNoteToggle, onHint]);

  const showKeyboardInput = difficulty === 'hard';

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {/* Keyboard input for hard mode */}
      {showKeyboardInput && (
        <div className="mb-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleKeyInput}
            placeholder={labels[language].inputPlaceholder}
            className="w-full px-4 py-3 text-xl text-center font-serif 
              bg-paper border-2 border-indigo/30 rounded-lg
              focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/20
              placeholder:text-ink/30"
            lang="ja"
          />
          <p className="text-xs text-ink/50 text-center mt-1">
            {labels[language].hardModeHint}
          </p>
        </div>
      )}

      {/* Kanji buttons grid */}
      <div className="grid grid-cols-5 gap-2">
        {kanjiList.map((kanji, index) => (
          <button
            key={index}
            onClick={() => onInput(index + 1)}
            className="
              aspect-square flex flex-col items-center justify-center
              bg-paper border border-ink/20 rounded-lg shadow-sm
              hover:bg-indigo/10 hover:border-indigo active:bg-indigo/20
              transition-all hover:scale-105
            "
          >
            <span className="text-xl md:text-2xl font-serif text-ink">
              {kanji}
            </span>
            <span className="text-[10px] text-ink/40 font-sans">
              {index + 1}
            </span>
          </button>
        ))}

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="
            aspect-square flex items-center justify-center
            bg-paper border border-ink/20 rounded-lg shadow-sm
            hover:bg-cinnabar/10 hover:border-cinnabar active:bg-cinnabar/20
            text-cinnabar transition-all
          "
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
            />
          </svg>
        </button>
      </div>

      {/* Control buttons row */}
      <div className="flex justify-center gap-3">
        {/* Note mode toggle */}
        <button
          onClick={onNoteToggle}
          className={`
            px-4 py-2 rounded-full border transition-all flex items-center gap-2
            ${isNoteMode
              ? 'bg-ink text-paper border-ink'
              : 'bg-transparent text-ink border-ink/30 hover:border-ink'}
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="text-sm">{labels[language].noteMode}</span>
          <span className="text-xs opacity-70">
            {isNoteMode ? labels[language].on : labels[language].off}
          </span>
        </button>

        {/* Hint button */}
        <button
          onClick={onHint}
          disabled={hintsRemaining <= 0}
          className={`
            px-4 py-2 rounded-full border transition-all flex items-center gap-2
            ${hintsRemaining > 0
              ? 'bg-transparent text-ink border-ink/30 hover:border-indigo hover:text-indigo'
              : 'bg-ink/10 text-ink/30 border-ink/10 cursor-not-allowed'}
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span className="text-sm">{labels[language].hint}</span>
          <span className="text-xs opacity-70">({hintsRemaining})</span>
        </button>
      </div>
    </div>
  );
};
