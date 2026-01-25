// LanguageToggle Component - Switch between English and Japanese UI
import React from 'react';

interface LanguageToggleProps {
    language: 'en' | 'ja';
    onToggle: (lang: 'en' | 'ja') => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
    language,
    onToggle,
}) => {
    return (
        <div className="flex items-center gap-1 bg-paper border border-ink/20 rounded-lg p-1 shadow-sm">
            <button
                onClick={() => onToggle('en')}
                className={`
          px-3 py-1.5 rounded text-sm font-medium transition-colors
          ${language === 'en'
                        ? 'bg-ink text-paper'
                        : 'text-ink/60 hover:text-ink hover:bg-ink/5'}
        `}
            >
                EN
            </button>
            <button
                onClick={() => onToggle('ja')}
                className={`
          px-3 py-1.5 rounded text-sm font-medium transition-colors font-serif
          ${language === 'ja'
                        ? 'bg-ink text-paper'
                        : 'text-ink/60 hover:text-ink hover:bg-ink/5'}
        `}
            >
                日本語
            </button>
        </div>
    );
};
