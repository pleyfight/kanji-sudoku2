// Word List Panel - Fixed height, shows puzzle vocabulary
import React from 'react';

interface WordInfo {
    word: string;
    reading: string;
    meaning: string;
}

interface WordListProps {
    foundWords: { word: WordInfo; cells: { row: number; col: number }[]; direction: 'row' | 'col' }[];
    language: 'en' | 'ja';
    variant?: 'panel' | 'sidebar';
}

export const WordList: React.FC<WordListProps> = ({
    foundWords,
    language,
    variant = 'panel',
}) => {
    const labels = {
        en: {
            title: 'Vocabulary',
            empty: 'Complete the puzzle to learn these words...',
        },
        ja: {
            title: '語彙',
            empty: 'パズルを完成して単語を学びましょう...',
        },
    };

    const wrapperClass = variant === 'sidebar'
        ? 'sidebar-section'
        : 'surface-panel rounded-xl p-4 h-[180px] flex flex-col';

    return (
        <div className={wrapperClass}>
            <h3
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
                style={{ color: 'var(--text-muted)' }}
            >
                <span className="material-symbols-outlined text-sm" style={{ color: 'var(--accent)' }}>menu_book</span>
                {labels[language].title} ({foundWords.length})
            </h3>

            <div className="flex-1 overflow-y-auto min-h-0">
                {foundWords.length > 0 ? (
                    <ul className="space-y-2">
                        {foundWords.map((item, i) => (
                            <li
                                key={`${item.word.word}-${i}`}
                                className="flex items-center gap-3 p-2 rounded-md"
                                style={{ background: 'var(--bg-secondary)' }}
                            >
                                <span className="text-lg kanji-cell" style={{ color: 'var(--text-primary)' }}>
                                    {item.word.word}
                                </span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                                        {item.word.meaning}
                                    </span>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        {item.word.reading}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                            {labels[language].empty}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
