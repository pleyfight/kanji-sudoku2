export interface ShortcutKey {
    label: string;
    key: string;
}

interface GameQuickShortcutsProps {
    shortcutKeys: ShortcutKey[];
}

export function GameQuickShortcuts({ shortcutKeys }: GameQuickShortcutsProps) {
    return (
        <aside className="hidden xl:flex flex-col">
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
