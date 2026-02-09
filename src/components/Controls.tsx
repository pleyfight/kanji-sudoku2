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
  layout?: 'panel' | 'sidebar';
  showActions?: boolean;
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
  layout = 'panel',
  showActions = true,
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
      if (difficulty !== 'expert' && e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.altKey) {
        const num = parseInt(e.key);
        onInput(num);
        e.preventDefault();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement !== inputRef.current) {
          onDelete();
          e.preventDefault();
        }
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
  const isSidebar = layout === 'sidebar';

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Keyboard input for expert mode */}
      {showKeyboardInput && (
        <div className="mb-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleKeyInput}
            placeholder={labels[language].inputPlaceholder}
            className="w-full px-4 py-3 text-lg text-center kanji-cell rounded-sm border focus:outline-none"
            style={{
              color: 'var(--text-primary)',
              background: 'var(--bg-panel)',
              borderColor: 'var(--border-subtle)',
            }}
            lang="ja"
          />
        </div>
      )}

      {/* Kanji buttons grid */}
      {showKanjiGrid && (
        <div className={`grid ${isSidebar ? 'grid-cols-3 gap-2' : 'grid-cols-5 gap-2'}`}>
          {kanjiList.map((kanji, index) => (
            <button
              key={index}
              onClick={() => onInput(index + 1)}
              className={`kanji-key ${isSidebar ? '' : 'shadow-sm'}`}
            >
              <span className="text-xl md:text-2xl kanji-cell">
                {kanji}
              </span>
              {!isSidebar && (
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {index + 1}
                </span>
              )}
            </button>
          ))}

          {/* Delete button */}
          {!isSidebar && (
            <button
              onClick={onDelete}
              className="kanji-key"
              style={{ color: 'var(--error)' }}
            >
              <span className="material-symbols-outlined text-2xl">backspace</span>
            </button>
          )}
        </div>
      )}

      {/* Control buttons row */}
      {showActions && (
        <div className="flex justify-center gap-3">
          {difficulty !== 'expert' && (
            <button
              onClick={onNoteToggle}
              className="action-btn flex items-center gap-2"
              style={isNoteMode ? { color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)' } : undefined}
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              <span>{labels[language].noteMode}</span>
            </button>
          )}

          <button
            onClick={onHint}
            disabled={hintsRemaining <= 0}
            className="action-btn flex items-center gap-2"
            style={{
              opacity: hintsRemaining > 0 ? 1 : 0.5,
              cursor: hintsRemaining > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
            <span>{labels[language].hint}</span>
            <span className="text-[10px]">({hintsRemaining})</span>
          </button>
        </div>
      )}
    </div>
  );
};
