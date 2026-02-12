import { Timer } from './Timer';
import { Settings } from './Settings';
import type { Difficulty } from '../data/puzzles';
import type { Language, AppLabels } from '../lib/labels';

interface GameHeaderProps {
    difficulty: Difficulty;
    elapsedTime: number;
    isPaused: boolean;
    language: Language;
    labels: AppLabels;
    onBackToMenu: () => void;
    onDifficultyChange: (diff: Difficulty) => void;
    onTogglePause: () => void;
    onLanguageChange: (lang: Language) => void;
}

export function GameHeader({
    difficulty,
    elapsedTime,
    isPaused,
    language,
    labels,
    onBackToMenu,
    onDifficultyChange,
    onTogglePause,
    onLanguageChange,
}: GameHeaderProps) {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

    return (
        <header className="border-b border-black/10 dark:border-white/10 bg-[var(--bg-panel)] sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <button
                        onClick={onBackToMenu}
                        className="font-serif text-2xl italic font-bold tracking-tight"
                        style={{ color: 'var(--accent)' }}
                    >
                        Kudoku
                    </button>
                    <nav className="flex items-center space-x-6 text-sm font-semibold h-full">
                        {difficulties.map((diff) => (
                            <button
                                key={diff}
                                onClick={() => onDifficultyChange(diff)}
                                className={`${difficulty === diff ? 'tab-active' : 'tab-inactive'} py-5`}
                            >
                                {labels[diff]}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <Timer
                        elapsedTime={elapsedTime}
                        isPaused={isPaused}
                        onTogglePause={onTogglePause}
                        language={language}
                        variant="header"
                    />
                    <Settings
                        language={language}
                        onLanguageChange={onLanguageChange}
                    />
                </div>
            </div>
        </header>
    );
}
