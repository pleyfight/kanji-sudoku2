// Timer Component - Displays elapsed time with pause/resume
import React from 'react';
import { formatTime } from '../lib/gameState';

interface TimerProps {
    elapsedTime: number;
    isPaused: boolean;
    onTogglePause: () => void;
    language: 'en' | 'ja';
}

export const Timer: React.FC<TimerProps> = ({
    elapsedTime,
    isPaused,
    onTogglePause,
    language,
}) => {
    const labels = {
        en: { pause: 'Pause', resume: 'Resume' },
        ja: { pause: '一時停止', resume: '再開' },
    };

    return (
        <div className="flex items-center gap-3 bg-paper border border-ink/20 rounded-lg px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2">
                <svg
                    className="w-5 h-5 text-ink/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span className="text-2xl font-mono font-bold text-ink tabular-nums">
                    {formatTime(elapsedTime)}
                </span>
            </div>

            <button
                onClick={onTogglePause}
                className={`
          px-3 py-1 rounded text-sm font-medium transition-colors
          ${isPaused
                        ? 'bg-indigo text-paper hover:bg-indigo/80'
                        : 'bg-ink/10 text-ink hover:bg-ink/20'}
        `}
            >
                {isPaused ? labels[language].resume : labels[language].pause}
            </button>
        </div>
    );
};
