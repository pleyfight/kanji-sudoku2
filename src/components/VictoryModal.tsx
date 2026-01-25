// Victory Modal - Shows when the puzzle is completed
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
            subtitle: 'You completed the puzzle!',
            score: 'Final Score',
            time: 'Time',
            words: 'Words Found',
            hints: 'Hints Used',
            newGame: 'Play Again',
        },
        ja: {
            title: 'おめでとう！',
            subtitle: 'パズルを完成させました！',
            score: '最終スコア',
            time: '時間',
            words: '発見した単語',
            hints: '使用したヒント',
            newGame: 'もう一度プレイ',
        },
    };

    return (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
            <div className="bg-paper rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all animate-bounce-in">
                {/* Celebration Icon */}
                <div className="text-6xl mb-4">🎉</div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-ink mb-2">
                    {labels[language].title}
                </h2>
                <p className="text-ink/60 mb-6">
                    {labels[language].subtitle}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Score */}
                    <div className="bg-indigo/10 rounded-xl p-4">
                        <span className="text-xs text-indigo/70 uppercase tracking-wide block">
                            {labels[language].score}
                        </span>
                        <span className="text-3xl font-bold text-indigo">
                            {score.toLocaleString()}
                        </span>
                    </div>

                    {/* Time */}
                    <div className="bg-ink/5 rounded-xl p-4">
                        <span className="text-xs text-ink/50 uppercase tracking-wide block">
                            {labels[language].time}
                        </span>
                        <span className="text-3xl font-bold text-ink font-mono">
                            {formatTime(elapsedTime)}
                        </span>
                    </div>

                    {/* Words */}
                    <div className="bg-cinnabar/10 rounded-xl p-4">
                        <span className="text-xs text-cinnabar/70 uppercase tracking-wide block">
                            {labels[language].words}
                        </span>
                        <span className="text-3xl font-bold text-cinnabar">
                            {wordsFound}
                        </span>
                    </div>

                    {/* Hints */}
                    <div className="bg-ink/5 rounded-xl p-4">
                        <span className="text-xs text-ink/50 uppercase tracking-wide block">
                            {labels[language].hints}
                        </span>
                        <span className="text-3xl font-bold text-ink">
                            {hintsUsed}
                        </span>
                    </div>
                </div>

                {/* New Game Button */}
                <button
                    onClick={onNewGame}
                    className="w-full py-4 bg-indigo text-paper rounded-xl font-bold text-lg hover:bg-indigo/90 transition-colors shadow-lg"
                >
                    {labels[language].newGame}
                </button>
            </div>
        </div>
    );
};
