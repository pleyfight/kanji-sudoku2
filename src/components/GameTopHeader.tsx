import { Settings } from './Settings';
import { Timer } from './Timer';
import type { Difficulty, Language } from '../lib/gameState';
import type { AppLabels } from '../lib/labels';

interface GameTopHeaderProps {
    difficulty: Difficulty;
    elapsedTime: number;
    isPaused: boolean;
    language: Language;
    labels: AppLabels;
    onBackToMenu: () => void;
    onDifficultyChange: (diff: Difficulty) => void;
    onTogglePause: () => void;
    onLanguageChange: (lang: Language) => void;
    authSlot?: React.ReactNode;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export function GameTopHeader({
    difficulty,
    elapsedTime,
    isPaused,
    language,
    labels,
    onBackToMenu,
    onDifficultyChange,
    onTogglePause,
    onLanguageChange,
    authSlot,
}: GameTopHeaderProps) {
    return (
        <header className="border-b border-black/10 dark:border-white/10 bg-[var(--bg-panel)] sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto">
                    <button
                        onClick={onBackToMenu}
                        className="font-serif text-2xl italic font-bold tracking-tight"
                        style={{ color: 'var(--accent)' }}
                    >
                        Kudoku
                    </button>
                    <nav className="flex items-center space-x-4 sm:space-x-6 text-sm font-semibold h-full whitespace-nowrap">
                        {DIFFICULTIES.map((diff) => (
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
                <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
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
                    {authSlot}
                </div>
            </div>
        </header>
    );
}
