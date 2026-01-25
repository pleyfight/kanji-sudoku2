// HintModal Component - Shows meaning-based hints without revealing the answer
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
            noHints: 'No hints available',
        },
        ja: {
            title: 'ヒント',
            meaning: '意味',
            reading: '読み方',
            close: 'わかった！',
            noHints: 'ヒントがありません',
        },
    };

    return (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
            <div
                className="bg-paper rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <svg
                        className="w-6 h-6 text-indigo"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    <h3 className="text-xl font-bold text-ink">
                        {labels[language].title}
                    </h3>
                </div>

                {/* Hint Content */}
                <div className="space-y-3 mb-6">
                    <div className="bg-indigo/10 rounded-lg p-4">
                        <span className="text-xs text-indigo/70 uppercase tracking-wide block mb-1">
                            {labels[language].meaning}
                        </span>
                        <p className="text-lg text-ink font-medium">
                            {hint.meaning}
                        </p>
                    </div>

                    {hint.reading && (
                        <div className="bg-ink/5 rounded-lg p-4">
                            <span className="text-xs text-ink/50 uppercase tracking-wide block mb-1">
                                {labels[language].reading}
                            </span>
                            <p className="text-lg text-ink font-serif">
                                {hint.reading}
                            </p>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-indigo text-paper rounded-lg font-medium hover:bg-indigo/90 transition-colors"
                >
                    {labels[language].close}
                </button>
            </div>
        </div>
    );
};
