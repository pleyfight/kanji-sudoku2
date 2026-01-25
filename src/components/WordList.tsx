// Word List Panel - Shows discovered words with meanings
import React from 'react';
import type { CompoundWord } from '../data/compoundWords';

interface WordListProps {
    foundWords: { word: CompoundWord; cells: { row: number; col: number }[]; direction: 'row' | 'col' }[];
    language: 'en' | 'ja';
}

export const WordList: React.FC<WordListProps> = ({
    foundWords,
    language,
}) => {
    const labels = {
        en: {
            title: 'Discovered Words',
            empty: 'Form words horizontally or vertically...',
            row: 'Row',
            col: 'Column',
        },
        ja: {
            title: '発見した単語',
            empty: '横か縦に単語を作りましょう...',
            row: '行',
            col: '列',
        },
    };

    return (
        <div className="bg-paper border border-ink/20 p-4 rounded-lg shadow-sm min-h-[150px]">
            <h3 className="text-lg font-bold border-b border-ink/20 pb-2 mb-3 text-cinnabar flex items-center gap-2">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                </svg>
                {labels[language].title}
            </h3>

            {foundWords.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {foundWords.map((item, i) => (
                        <li
                            key={`${item.word.word}-${i}`}
                            className="flex items-start gap-2 p-2 bg-cinnabar/5 rounded"
                        >
                            <span className="text-xl font-serif text-ink font-bold">
                                {item.word.word}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-sm text-ink/80">
                                    {item.word.meaning}
                                </span>
                                <span className="text-xs text-ink/50">
                                    {item.word.reading} • {labels[language][item.direction]}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-ink/40 italic text-center py-4">
                    {labels[language].empty}
                </p>
            )}
        </div>
    );
};
