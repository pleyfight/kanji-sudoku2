// ScoreBoard Component
import React from 'react';

interface ScoreBoardProps {
    score: number;
    hintsRemaining: number;
    hintsUsed: number;
    wordsFound: number;
    language: 'en' | 'ja';
    variant?: 'panel' | 'sidebar';
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
    score,
    hintsRemaining,
    hintsUsed,
    wordsFound,
    language,
    variant = 'sidebar',
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

    if (variant === 'panel') {
        return (
            <div className="surface-panel rounded-xl px-5 py-3">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                        <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
                            {labels[language].score}
                        </span>
                        <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
                            {score.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-px h-10" style={{ background: 'var(--border-subtle)' }} />
                    <div className="flex flex-col items-center">
                        <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
                            {labels[language].words}
                        </span>
                        <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--success)' }}>
                            {wordsFound}
                        </span>
                    </div>
                    <div className="w-px h-10" style={{ background: 'var(--border-subtle)' }} />
                    <div className="flex flex-col items-center">
                        <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
                            {labels[language].hints}
                        </span>
                        <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                            {hintsRemaining}
                            {hintsUsed > 0 && (
                                <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>
                                    -{hintsUsed}
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3 text-xs">
            <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-muted)' }}>{labels[language].score}</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{score.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-muted)' }}>{labels[language].words}</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{wordsFound}</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--text-muted)' }}>{labels[language].hints}</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                    {hintsRemaining}
                    {hintsUsed > 0 && (
                        <span className="text-[10px] ml-1" style={{ color: 'var(--text-muted)' }}>-{hintsUsed}</span>
                    )}
                </span>
            </div>
        </div>
    );
};
