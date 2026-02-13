export interface ShortcutKey {
    label: string;
    key: string;
}

interface GameQuickShortcutsProps {
    shortcutKeys: ShortcutKey[];
    onOpenRules: () => void;
    onOpenVocabulary: () => void;
    puzzleWordsCount: number;
}

export function GameQuickShortcuts({
    shortcutKeys,
    onOpenRules,
    onOpenVocabulary,
    puzzleWordsCount,
}: GameQuickShortcutsProps) {
    return (
        <aside className="hidden xl:flex flex-col">
            <div className="sidebar-section">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onOpenRules}
                        className="w-full px-3 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wide"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)', background: 'var(--bg-panel)' }}
                    >
                        How to Play
                    </button>
                    <button
                        onClick={onOpenVocabulary}
                        className="w-full px-3 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wide"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)', background: 'var(--bg-panel)' }}
                    >
                        Vocabulary ({puzzleWordsCount})
                    </button>
                </div>
            </div>
            <div className="sidebar-section">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                    Quick Shortcuts
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
        </aside>
    );
}
