// KanjiHoverBox - Mobile-only kanji selection popup
// Appears when tapping a blank cell in Easy, Medium, Hard modes
import React from 'react';

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
    if (!selectedCell) return null;

    const l = labels[language];

    return (
        <>
            {/* Backdrop - tap to close */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
                style={{ backgroundColor: 'transparent' }}
            />

            {/* Hover Box */}
            <div
                className="fixed left-1/2 -translate-x-1/2 z-50 p-3 border-2 shadow-hard bg-[#f5f0eb] dark:bg-[#2a2a2a]"
                style={{
                    bottom: '10vh',
                    borderColor: 'var(--border-primary)',
                    maxWidth: '90vw',
                    width: '320px',
                }}
            >
                {/* Selected cell indicator */}
                <div className="text-center text-xs mb-2 text-[#666] dark:text-[#999]">
                    Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
                </div>

                {/* Kanji Grid - 5 columns */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                    {kanjiList.map((kanji, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(index + 1)}
                            className="aspect-square text-2xl font-serif border-2 transition-all active:scale-95 bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white"
                            style={{ borderColor: 'var(--border-primary)' }}
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
                        className={`flex-1 py-2 px-3 text-sm font-bold border-2 transition-all ${isNoteMode
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white'
                            }`}
                        style={{ borderColor: 'var(--border-primary)' }}
                    >
                        📝 {l.notes}
                    </button>

                    {/* Delete */}
                    <button
                        onClick={onDelete}
                        className="flex-1 py-2 px-3 text-sm font-bold border-2 bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white transition-all active:scale-95"
                        style={{ borderColor: 'var(--border-primary)' }}
                    >
                        ⌫ {l.delete}
                    </button>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="py-2 px-4 text-sm font-bold border-2 bg-black text-white dark:bg-white dark:text-black transition-all active:scale-95"
                        style={{ borderColor: 'var(--border-primary)' }}
                    >
                        ✕
                    </button>
                </div>
            </div>
        </>
    );
};
