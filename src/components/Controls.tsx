// Controls Component with Liquid Glass styling
import React, { useState, useRef, useEffect } from 'react';

interface ControlsProps {
  kanjiList: string[];
  onInput: (num: number) => void;
  onInputSymbol?: (symbol: string) => void;
  onDelete: () => void;
  onNoteToggle: () => void;
  onHint: () => void;
  isNoteMode: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  hintsRemaining: number;
  language: 'en' | 'ja';
  hideMobileKanjiGrid?: boolean; // Hide kanji grid on mobile for Easy/Medium/Hard
}

export const Controls: React.FC<ControlsProps> = ({
  kanjiList,
  onInput,
  onInputSymbol,
  onDelete,
  onNoteToggle,
  onHint,
  isNoteMode,
  difficulty,
  hintsRemaining,
  language,
  hideMobileKanjiGrid = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const labels = {
    en: {
      noteMode: 'Notes',
      hint: 'Hint',
      inputPlaceholder: 'Type kanji...',
    },
    ja: {
      noteMode: 'メモ',
      hint: 'ヒント',
      inputPlaceholder: '漢字を入力...',
    },
  };

  const isJapaneseChar = (char: string) => {
    const code = char.codePointAt(0);
    if (code === undefined) return false;
    if ([0x3005, 0x3007, 0x303b].includes(code)) return true; // 々, 〇, 〻
    if ((code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff)) {
      return true;
    }
    if ((code >= 0x3400 && code <= 0x4dbf) || (code >= 0x4e00 && code <= 0x9fff)) {
      return true;
    }
    if ((code >= 0xf900 && code <= 0xfaff) || (code >= 0x20000 && code <= 0x2ebef)) {
      return true;
    }
    return false;
  };

  // Handle keyboard input for expert mode
  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const lastChar = value[value.length - 1];
      if (difficulty === 'expert') {
        if (isJapaneseChar(lastChar)) {
          onInputSymbol?.(lastChar);
          setInputValue('');
        }
        return;
      }
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
      // Skip if user is typing in an input field
      const activeElement = document.activeElement;
      const isTypingInInput = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;

      if (difficulty !== 'expert' && e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.altKey && !isTypingInInput) {
        const num = parseInt(e.key);
        onInput(num);
        e.preventDefault();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTypingInInput) {
        onDelete();
        e.preventDefault();
      }
      if (difficulty !== 'expert' && (e.key === 'n' || e.key === 'N')) {
        onNoteToggle();
        e.preventDefault();
      }
      if (e.key === 'h' || e.key === 'H') {
        onHint();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInput, onInputSymbol, onDelete, onNoteToggle, onHint, difficulty]);

  const showKeyboardInput = difficulty === 'expert';
  const showKanjiGrid = difficulty !== 'expert';

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {/* Keyboard input for expert mode */}
      {showKeyboardInput && (
        <div className="mb-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleKeyInput}
            placeholder={labels[language].inputPlaceholder}
            className="w-full px-4 py-3 text-xl text-center kanji-cell border-2 border-primary bg-primary text-primary focus:outline-none focus:ring-0"
            style={{
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              background: 'var(--bg-primary)',
            }}
            lang="ja"
          />
        </div>
      )}

      {/* Kanji buttons grid - hide on mobile when hideMobileKanjiGrid is true */}
      {showKanjiGrid && !hideMobileKanjiGrid && (
        <div className="grid grid-cols-5 gap-2">
          {kanjiList.map((kanji, index) => (
            <button
              key={index}
              onClick={() => onInput(index + 1)}
              className="
                aspect-square flex flex-col items-center justify-center
                border-2 border-primary bg-primary
                transition-all hover:-translate-y-1 hover:shadow-hard active:translate-y-0
              "
              style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}
            >
              <span
                className="text-xl md:text-2xl kanji-cell"
                style={{ color: 'var(--text-primary)' }}
              >
                {kanji}
              </span>
              <span
                className="text-[10px]"
                style={{ color: 'var(--text-muted)' }}
              >
                {index + 1}
              </span>
            </button>
          ))}

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="
              aspect-square flex items-center justify-center
              border-2 border-primary bg-primary
              transition-all hover:-translate-y-1 hover:shadow-hard active:translate-y-0
            "
            style={{ color: 'var(--error)', borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Control buttons row */}
      <div className="flex justify-center gap-3">
        {difficulty !== 'expert' && (
          <button
            onClick={onNoteToggle}
            className={`
              px-5 py-2.5 font-medium transition-all flex items-center gap-2 border-2
              ${isNoteMode
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-primary text-secondary hover:-translate-y-0.5 hover:shadow-sm'}
            `}
            style={{
              borderColor: 'var(--border-primary)',
              color: isNoteMode ? 'var(--text-inverse)' : 'var(--text-primary)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-sm">{labels[language].noteMode}</span>
          </button>
        )}

        {/* Hint button */}
        <button
          onClick={onHint}
          disabled={hintsRemaining <= 0}
          className={`
            px-5 py-2.5 font-medium transition-all flex items-center gap-2 border-2
            ${hintsRemaining > 0
              ? 'bg-primary hover:-translate-y-0.5 hover:shadow-sm'
              : 'bg-gray-100 opacity-50 cursor-not-allowed'}
          `}
          style={{
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)'
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
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
