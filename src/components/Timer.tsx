// Timer Component with Liquid Glass styling
import React from 'react';
import { formatTime } from '../lib/gameState';

interface TimerProps {
    elapsedTime: number;
    isPaused: boolean;
    onTogglePause: () => void;
    language: 'en' | 'ja';
    variant?: 'header' | 'panel';
    showToggle?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
    elapsedTime,
    isPaused,
    onTogglePause,
    language,
    variant = 'panel',
    showToggle = true,
}) => {
    const labels = {
        en: { pause: 'Pause', resume: 'Resume' },
        ja: { pause: '一時停止', resume: '再開' },
    };

    const isHeader = variant === 'header';

    return (
        <div
            className={
                isHeader
                    ? 'flex items-center gap-3 px-4 py-1.5 rounded-full border'
                    : 'surface-panel flex items-center gap-3 rounded-xl px-5 py-3'
            }
            style={isHeader ? { borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' } : undefined}
        >
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ color: 'var(--text-muted)' }}>
                    timer
                </span>
                <span
                    className={`${isHeader ? 'text-lg' : 'text-2xl'} font-mono font-semibold tabular-nums`}
                    style={{ color: 'var(--text-primary)' }}
                >
                    {formatTime(elapsedTime)}
                </span>
            </div>

            {showToggle && (
                <button
                    onClick={onTogglePause}
                    className={
                        isHeader
                            ? 'rounded-full border px-2.5 py-1 text-xs font-semibold'
                            : 'px-4 py-1.5 rounded-xl text-sm font-medium'
                    }
                    style={{
                        color: isPaused ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                        borderColor: isPaused ? 'transparent' : 'var(--border-subtle)',
                        background: isPaused ? 'var(--accent)' : 'transparent',
                    }}
                >
                    {isHeader ? (
                        <span className="material-symbols-outlined text-sm">
                            {isPaused ? 'play_arrow' : 'pause'}
                        </span>
                    ) : (
                        <span>{isPaused ? labels[language].resume : labels[language].pause}</span>
                    )}
                </button>
            )}
        </div>
    );
};
