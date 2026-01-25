// ScoreBoard Component - Displays current score and stats
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
            words: 'Words Found',
        },
        ja: {
            score: 'スコア',
            hints: 'ヒント',
            words: '発見した単語',
        },
    };

    return (
        <div className="bg-paper border border-ink/20 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
                {/* Score */}
                <div className="flex flex-col">
                    <span className="text-xs text-ink/60 uppercase tracking-wide">
                        {labels[language].score}
                    </span>
                    <span className="text-2xl font-bold text-indigo tabular-nums">
                        {score.toLocaleString()}
                    </span>
                </div>

                {/* Words Found */}
                <div className="flex flex-col">
                    <span className="text-xs text-ink/60 uppercase tracking-wide">
                        {labels[language].words}
                    </span>
                    <span className="text-2xl font-bold text-cinnabar tabular-nums">
                        {wordsFound}
                    </span>
                </div>

                {/* Hints */}
                <div className="flex flex-col">
                    <span className="text-xs text-ink/60 uppercase tracking-wide">
                        {labels[language].hints}
                    </span>
                    <span className="text-2xl font-bold text-ink tabular-nums">
                        {hintsRemaining}
                        {hintsUsed > 0 && (
                            <span className="text-sm text-ink/40 ml-1">(-{hintsUsed})</span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};
