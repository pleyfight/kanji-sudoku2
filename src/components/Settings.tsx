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
            autoHint: 'Uses device local time (dark 6PM-6AM)',
            language: 'Language',
        },
        ja: {
            settings: '設定',
            theme: 'テーマ',
            light: 'ライト',
            dark: 'ダーク',
            auto: '自動',
            autoHint: '端末のローカル時刻を使用（18時〜6時はダーク）',
            language: '言語',
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
            <button
                onClick={() => setIsOpen(true)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border leading-none shrink-0"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}
                aria-label={l.settings}
            >
                <span className="material-symbols-outlined block text-[20px]">settings</span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    <div
                        className="relative w-full max-w-sm rounded-2xl p-6 surface-panel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {l.settings}
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-lg"
                                style={{ color: 'var(--text-muted)' }}
                                aria-label={l.settings}
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                                {l.theme}
                            </label>
                            <div className="flex gap-2">
                                {themeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setMode(option.value)}
                                        className="flex-1 py-2 px-3 rounded-xl text-sm font-medium"
                                        style={
                                            mode === option.value
                                                ? { background: 'var(--accent)', color: 'var(--accent-contrast)' }
                                                : { border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }
                                        }
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

                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                                {l.language}
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onLanguageChange('en')}
                                    className="flex-1 py-2 px-3 rounded-xl text-sm font-medium"
                                    style={
                                        language === 'en'
                                            ? { background: 'var(--accent)', color: 'var(--accent-contrast)' }
                                            : { border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }
                                    }
                                >
                                    🇺🇸 English
                                </button>
                                <button
                                    onClick={() => onLanguageChange('ja')}
                                    className="flex-1 py-2 px-3 rounded-xl text-sm font-medium font-serif"
                                    style={
                                        language === 'ja'
                                            ? { background: 'var(--accent)', color: 'var(--accent-contrast)' }
                                            : { border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }
                                    }
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
