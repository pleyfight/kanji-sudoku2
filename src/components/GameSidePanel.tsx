import { WordList } from './WordList';
import type { Puzzle, Difficulty } from '../data/puzzles';
import type { Language, AppLabels } from '../lib/labels';

interface GameSidePanelProps {
    difficulty: Difficulty;
    puzzle: Puzzle | null;
    language: Language;
    labels: AppLabels;
}

export function GameSidePanel({
    difficulty,
    puzzle,
    language,
    labels,
}: GameSidePanelProps) {
    const shortcutKeys = [
        { label: 'Input', key: '1-9' },
        { label: 'Notes', key: 'N' },
        { label: 'Hint', key: 'H' },
        { label: 'Clear', key: 'Del' },
    ];

    return (
        <aside className="flex flex-col">
            <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                    {labels.howToPlay}
                </h3>
                <div className="text-xs leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                        Fill the 9x9 grid so that each row, column, and 3x3 box contains all Kanji from{' '}
                        <span className="font-bold" style={{ color: 'var(--accent)' }}>一</span> to{' '}
                        <span className="font-bold" style={{ color: 'var(--accent)' }}>九</span>.
                    </p>
                    <p>Click a cell to select it, then use the keypad or keyboard numbers 1-9 to input the Kanji.</p>
                </div>
            </div>
            <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                    {labels.quickShortcuts}
                </h3>
                <ul className="text-[11px] space-y-2" style={{ color: 'var(--text-muted)' }}>
                    {shortcutKeys.map((shortcut) => (
                        <li key={shortcut.label} className="flex justify-between">
                            <span>{shortcut.label}</span>
                            <kbd className="px-1 rounded border" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                                {shortcut.key}
                            </kbd>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sidebar-section">
                <div className="p-4 rounded border-l-2 text-[11px] leading-relaxed italic" style={{ color: 'var(--text-muted)', borderColor: 'var(--accent)', background: 'var(--bg-secondary)' }}>
                    "Zen is not some kind of excitement, but concentration on our usual everyday routine."
                </div>
            </div>
            {difficulty !== 'expert' && puzzle && (
                <WordList
                    foundWords={puzzle.vocabulary.map(w => ({
                        word: { word: w.word, reading: w.reading, meaning: w.meaning },
                        cells: [],
                        direction: 'row' as const,
                    }))}
                    language={language}
                    variant="sidebar"
                />
            )}
        </aside>
    );
}
