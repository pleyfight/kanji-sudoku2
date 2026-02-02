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
}

export const WordList: React.FC<WordListProps> = ({
    foundWords,
    language,
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

    return (
        <div className="glass p-4 h-[180px] flex flex-col">
            <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 flex-shrink-0"
                style={{ color: 'var(--success)' }}
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
                {labels[language].title} ({foundWords.length})
            </h3>

            <div className="flex-1 overflow-y-auto min-h-0">
                {foundWords.length > 0 ? (
                    <ul className="space-y-2">
                        {foundWords.map((item, i) => (
                            <li
                                key={`${item.word.word}-${i}`}
                                className="flex items-center gap-3 p-2 border border-primary bg-primary"
                                style={{ borderColor: 'var(--border-primary)' }}
                            >
                                <span
                                    className="text-lg kanji-cell"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {item.word.word}
                                </span>
                                <div className="flex flex-col min-w-0">
                                    <span
                                        className="text-sm truncate"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        {item.word.meaning}
                                    </span>
                                    <span
                                        className="text-xs"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {item.word.reading}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p
                            className="text-sm text-center"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {labels[language].empty}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
