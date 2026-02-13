// KanjiHoverBox - Mobile-only kanji selection popup
// Appears when tapping a blank cell in Easy, Medium, Hard modes
// Positioned absolutely over the grid, not fixed to viewport
import React, { useMemo, useRef } from 'react';

interface KanjiHoverBoxProps {
    kanjiList: string[];
    onSelect: (index: number) => void;
    onDelete: () => void;
    onClose: () => void;
    selectedCell: { row: number; col: number } | null;
    isNoteMode: boolean;
    onNoteToggle: () => void;
    language: 'en' | 'ja';
}

const labels = {
    en: { notes: 'Notes', delete: 'Delete' },
    ja: { notes: 'メモ', delete: '削除' },
};

export const KanjiHoverBox: React.FC<KanjiHoverBoxProps> = ({
    kanjiList,
    onSelect,
    onDelete,
    onClose,
    selectedCell,
    isNoteMode,
    onNoteToggle,
    language,
}) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const topPos = useMemo(() => {
        if (!selectedCell) return null;
        const gridEl = document.querySelector('.mobile-grid-container');
        if (!gridEl) return null;
        const gridRect = gridEl.getBoundingClientRect();
        return gridRect.top + window.scrollY + gridRect.height / 2;
    }, [selectedCell]);

    if (!selectedCell || topPos === null) return null;

    const l = labels[language];

    return (
        <>
            {/* Backdrop - tap to close */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            />

            {/* Hover Box — positioned absolutely in page flow, centered over grid */}
            <div
                ref={boxRef}
                className="kanji-hover-popup"
                style={{
                    position: 'absolute',
                    top: topPos,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 50,
                    padding: '16px',
                    borderRadius: '12px',
                    maxWidth: '88vw',
                    width: '280px',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                }}
            >
                {/* Selected cell indicator */}
                <div className="text-center text-xs mb-3 font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Row {selectedCell.row + 1}, Col {selectedCell.col + 1}
                </div>

                {/* Kanji Grid - 3×3 */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {kanjiList.map((kanji, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(index + 1)}
                            className="aspect-square flex items-center justify-center text-2xl rounded-lg border transition-all active:scale-95"
                            style={{
                                borderColor: 'var(--border-subtle)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                fontFamily: "'Noto Serif JP', Georgia, serif",
                            }}
                        >
                            {kanji}
                        </button>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                    {/* Note toggle */}
                    <button
                        onClick={onNoteToggle}
                        className="flex-1 py-2.5 px-3 text-xs font-bold rounded-lg border"
                        style={{
                            borderColor: 'var(--border-subtle)',
                            background: isNoteMode ? 'var(--accent)' : 'var(--bg-secondary)',
                            color: isNoteMode ? 'var(--accent-contrast)' : 'var(--text-primary)',
                        }}
                    >
                        📝 {l.notes}
                    </button>

                    {/* Delete */}
                    <button
                        onClick={onDelete}
                        className="flex-1 py-2.5 px-3 text-xs font-bold rounded-lg border transition-all active:scale-95"
                        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    >
                        ⌫ {l.delete}
                    </button>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="py-2.5 px-4 text-xs font-bold rounded-lg"
                        style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                    >
                        ✕
                    </button>
                </div>
            </div>
        </>
    );
};
