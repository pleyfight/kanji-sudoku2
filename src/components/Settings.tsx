// Settings Panel - Theme, language, and game options
import React, { useState } from 'react';
import { useTheme, type ThemeMode } from './ThemeProvider';

interface SettingsProps {
    language: 'en' | 'ja';
    onLanguageChange: (lang: 'en' | 'ja') => void;
}

export const Settings: React.FC<SettingsProps> = ({
    language,
    onLanguageChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mode, setMode, isDark } = useTheme();

    const labels = {
        en: {
            settings: 'Settings',
            theme: 'Theme',
            light: 'Light',
            dark: 'Dark',
            auto: 'Auto',
            autoHint: 'Dark 6PM-6AM',
            language: 'Language',
            close: 'Close',
        },
        ja: {
            settings: '設定',
            theme: 'テーマ',
            light: 'ライト',
            dark: 'ダーク',
            auto: '自動',
            autoHint: '18時〜6時はダーク',
            language: '言語',
            close: '閉じる',
        },
    };

    const l = labels[language];

    const themeOptions: { value: ThemeMode; label: string }[] = [
        { value: 'light', label: l.light },
        { value: 'dark', label: l.dark },
        { value: 'auto', label: l.auto },
    ];

    return (
        <>
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-xl glass glass-hover transition-all hover:glow"
                aria-label={l.settings}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
                    />

                    {/* Panel */}
                    <div
                        className="relative w-full max-w-sm glass rounded-2xl p-6 animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {l.settings}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Theme Section */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                                {l.theme}
                            </label>
                            <div className="flex gap-2">
                                {themeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setMode(option.value)}
                                        className={`
                      flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all
                      ${mode === option.value
                                                ? 'bg-accent text-white shadow-lg'
                                                : 'glass-subtle glass-hover'}
                    `}
                                    >
                                        {option.value === 'light' && '☀️ '}
                                        {option.value === 'dark' && '🌙 '}
                                        {option.value === 'auto' && '🔄 '}
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            {mode === 'auto' && (
                                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                                    {l.autoHint} • {isDark ? '🌙' : '☀️'}
                                </p>
                            )}
                        </div>

                        {/* Language Section */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                                {l.language}
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onLanguageChange('en')}
                                    className={`
                    flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all
                    ${language === 'en'
                                            ? 'bg-accent text-white shadow-lg'
                                            : 'glass-subtle glass-hover'}
                  `}
                                >
                                    🇺🇸 English
                                </button>
                                <button
                                    onClick={() => onLanguageChange('ja')}
                                    className={`
                    flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all font-serif
                    ${language === 'ja'
                                            ? 'bg-accent text-white shadow-lg'
                                            : 'glass-subtle glass-hover'}
                  `}
                                >
                                    🇯🇵 日本語
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
