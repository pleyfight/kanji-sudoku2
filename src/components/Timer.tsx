// Timer Component with Liquid Glass styling
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
        <div className="flex items-center gap-3 glass px-5 py-3">
            <div className="flex items-center gap-2">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span
                    className="text-2xl font-mono font-semibold tabular-nums"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {formatTime(elapsedTime)}
                </span>
            </div>

            <button
                onClick={onTogglePause}
                className={`
          px-4 py-1.5 text-sm font-medium transition-all border-2
          ${isPaused
                        ? 'bg-black text-white dark:bg-white dark:text-black border-primary'
                        : 'bg-primary text-secondary border-primary hover:-translate-y-0.5'}
        `}
                style={{
                    borderColor: 'var(--border-primary)',
                    color: isPaused ? 'var(--text-inverse)' : 'var(--text-primary)'
                }}
            >
                {isPaused ? labels[language].resume : labels[language].pause}
            </button>
        </div>
    );
};
