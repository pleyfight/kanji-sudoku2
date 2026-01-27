// Failure Modal with Liquid Glass styling
import React from 'react';

interface FailureModalProps {
    isOpen: boolean;
    onRetry: () => void;
    onNewGame: () => void;
    language: 'en' | 'ja';
}

export const FailureModal: React.FC<FailureModalProps> = ({
    isOpen,
    onRetry,
    onNewGame,
    language,
}) => {
    if (!isOpen) return null;

    const labels = {
        en: {
            title: 'Out of Slots',
            subtitle: 'All 9 slots are used with the wrong set of kanji.',
            retry: 'Retry Puzzle',
            newGame: 'New Puzzle',
        },
        ja: {
            title: 'スロット不足',
            subtitle: '9つのスロットが誤った漢字で埋まりました。',
            retry: '再挑戦',
            newGame: '新しいパズル',
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg animate-fade-in" />

            {/* Panel */}
            <div className="relative w-full max-w-sm glass rounded-3xl p-8 text-center animate-slide-up">
                {/* Icon */}
                <div className="text-6xl mb-4">??</div>

                {/* Title */}
                <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {labels[language].title}
                </h2>
                <p
                    className="text-sm mb-6"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {labels[language].subtitle}
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onRetry}
                        className="w-full py-3 rounded-xl font-semibold transition-all hover:shadow-xl active:scale-98"
                        style={{ background: 'var(--error)', color: 'white' }}
                    >
                        {labels[language].retry}
                    </button>
                    <button
                        onClick={onNewGame}
                        className="w-full py-3 rounded-xl font-medium transition-all glass glass-hover"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {labels[language].newGame}
                    </button>
                </div>
            </div>
        </div>
    );
};
