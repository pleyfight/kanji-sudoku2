// ScoreBoard Component with Liquid Glass styling
import React from 'react';

interface ScoreBoardProps {
    score: number;
    hintsRemaining: number;
    hintsUsed: number;
    wordsFound: number;
    language: 'en' | 'ja';
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
    score,
    hintsRemaining,
    hintsUsed,
    wordsFound,
    language,
}) => {
    const labels = {
        en: {
            score: 'Score',
            hints: 'Hints',
            words: 'Words',
        },
        ja: {
            score: 'スコア',
            hints: 'ヒント',
            words: '単語',
        },
    };

    return (
        <div className="glass px-5 py-3">
            <div className="flex items-center gap-6">
                {/* Score */}
                <div className="flex flex-col items-center">
                    <span
                        className="text-xs uppercase tracking-wider font-medium"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {labels[language].score}
                    </span>
                    <span
                        className="text-2xl font-bold tabular-nums"
                        style={{ color: 'var(--accent)' }}
                    >
                        {score.toLocaleString()}
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-black/10 dark:bg-white/10" />

                {/* Words Found */}
                <div className="flex flex-col items-center">
                    <span
                        className="text-xs uppercase tracking-wider font-medium"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {labels[language].words}
                    </span>
                    <span
                        className="text-2xl font-bold tabular-nums"
                        style={{ color: 'var(--success)' }}
                    >
                        {wordsFound}
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-black/10 dark:bg-white/10" />

                {/* Hints */}
                <div className="flex flex-col items-center">
                    <span
                        className="text-xs uppercase tracking-wider font-medium"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {labels[language].hints}
                    </span>
                    <span
                        className="text-2xl font-bold tabular-nums"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {hintsRemaining}
                        {hintsUsed > 0 && (
                            <span
                                className="text-sm ml-1"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                -{hintsUsed}
                            </span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};
