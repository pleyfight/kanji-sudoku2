// HintModal with Liquid Glass styling
import React from 'react';

interface HintModalProps {
    isOpen: boolean;
    hint: { meaning: string; reading: string } | null;
    onClose: () => void;
    language: 'en' | 'ja';
}

export const HintModal: React.FC<HintModalProps> = ({
    isOpen,
    hint,
    onClose,
    language,
}) => {
    if (!isOpen || !hint) return null;

    const labels = {
        en: {
            title: 'Hint',
            meaning: 'Meaning',
            reading: 'Reading',
            close: 'Got it!',
        },
        ja: {
            title: 'ヒント',
            meaning: '意味',
            reading: '読み方',
            close: 'わかった！',
        },
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

            <div
                className="relative w-full max-w-sm rounded-2xl p-6 surface-panel"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                        </svg>
                    </div>
                    <h3
                        className="text-xl font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {labels[language].title}
                    </h3>
                </div>

                {/* Hint Content */}
                <div className="space-y-3 mb-6">
                    <div className="surface-muted rounded-xl p-4">
                        <span
                            className="text-xs uppercase tracking-wider font-medium block mb-1"
                            style={{ color: 'var(--accent)' }}
                        >
                            {labels[language].meaning}
                        </span>
                        <p
                            className="text-lg font-medium"
                            style={{ color: 'var(--text-primary)', whiteSpace: 'pre-line' }}
                        >
                            {hint.meaning}
                        </p>
                    </div>

                    {hint.reading && (
                        <div className="surface-muted rounded-xl p-4">
                            <span
                                className="text-xs uppercase tracking-wider font-medium block mb-1"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                {labels[language].reading}
                            </span>
                            <p
                                className="text-lg kanji-cell"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {hint.reading}
                            </p>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl font-medium"
                    style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                >
                    {labels[language].close}
                </button>
            </div>
        </div>
    );
};
