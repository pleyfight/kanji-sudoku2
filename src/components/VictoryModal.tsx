// Victory Modal with Liquid Glass styling
import React from 'react';
import { formatTime } from '../lib/gameState';

interface VictoryModalProps {
    isOpen: boolean;
    score: number;
    elapsedTime: number;
    wordsFound: number;
    hintsUsed: number;
    onNewGame: () => void;
    language: 'en' | 'ja';
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
    isOpen,
    score,
    elapsedTime,
    wordsFound,
    hintsUsed,
    onNewGame,
    language,
}) => {
    if (!isOpen) return null;

    const labels = {
        en: {
            title: 'Congratulations!',
            subtitle: 'Puzzle completed',
            score: 'Score',
            time: 'Time',
            words: 'Words',
            hints: 'Hints',
            newGame: 'Play Again',
        },
        ja: {
            title: 'おめでとう！',
            subtitle: 'パズル完成',
            score: 'スコア',
            time: '時間',
            words: '単語',
            hints: 'ヒント',
            newGame: 'もう一度',
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-lg" />

            <div className="relative w-full max-w-sm rounded-2xl p-8 text-center surface-panel">
                {/* Celebration Icon */}
                <div className="text-6xl mb-4">🎉</div>

                {/* Title */}
                <h2
                    className="text-2xl font-bold mb-1"
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

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {/* Score */}
                    <div className="surface-muted rounded-xl p-4">
                        <span
                            className="text-xs uppercase tracking-wider block mb-1"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {labels[language].score}
                        </span>
                        <span
                            className="text-2xl font-bold"
                            style={{ color: 'var(--accent)' }}
                        >
                            {score.toLocaleString()}
                        </span>
                    </div>

                    {/* Time */}
                    <div className="surface-muted rounded-xl p-4">
                        <span
                            className="text-xs uppercase tracking-wider block mb-1"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {labels[language].time}
                        </span>
                        <span
                            className="text-2xl font-bold font-mono"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {formatTime(elapsedTime)}
                        </span>
                    </div>

                    {/* Words */}
                    <div className="surface-muted rounded-xl p-4">
                        <span
                            className="text-xs uppercase tracking-wider block mb-1"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {labels[language].words}
                        </span>
                        <span
                            className="text-2xl font-bold"
                            style={{ color: 'var(--success)' }}
                        >
                            {wordsFound}
                        </span>
                    </div>

                    {/* Hints */}
                    <div className="surface-muted rounded-xl p-4">
                        <span
                            className="text-xs uppercase tracking-wider block mb-1"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {labels[language].hints}
                        </span>
                        <span
                            className="text-2xl font-bold"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {hintsUsed}
                        </span>
                    </div>
                </div>

                {/* New Game Button */}
                <button
                    onClick={onNewGame}
                    className="w-full py-4 rounded-xl font-semibold text-lg"
                    style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                >
                    {labels[language].newGame}
                </button>
            </div>
        </div>
    );
};
