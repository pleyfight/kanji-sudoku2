// KanjiHoverBox - Mobile-only kanji selection popup
// Appears when tapping a blank cell in Easy, Medium, Hard modes
// Clamped dynamically to stay inside the viewport
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

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
    const [popupPosition, setPopupPosition] = useState<{ left: number; top: number } | null>(null);
    const computePopupPosition = useCallback(() => {
        if (!selectedCell) return null;

        const popupEl = boxRef.current;
        if (!popupEl) return null;

        let anchorX = window.innerWidth / 2;
        let anchorY = window.innerHeight / 2;

        const selectedCellEl = document.querySelector('.sudoku-cell.cell-selected') as HTMLElement | null;
        if (selectedCellEl) {
            const selectedCellRect = selectedCellEl.getBoundingClientRect();
            anchorX = selectedCellRect.left + selectedCellRect.width / 2;
            anchorY = selectedCellRect.top + selectedCellRect.height / 2;
        } else {
            const boardEl = document.querySelector('.mobile-grid-container, .sudoku-grid') as HTMLElement | null;
            if (boardEl) {
                const boardRect = boardEl.getBoundingClientRect();
                anchorX = boardRect.left + boardRect.width / 2;
                anchorY = boardRect.top + boardRect.height / 2;
            }
        }

        const popupRect = popupEl.getBoundingClientRect();
        const margin = 12;
        const maxLeft = Math.max(margin, window.innerWidth - popupRect.width - margin);
        const maxTop = Math.max(margin, window.innerHeight - popupRect.height - margin);
        const left = Math.min(Math.max(anchorX - popupRect.width / 2, margin), maxLeft);
        const top = Math.min(Math.max(anchorY - popupRect.height / 2, margin), maxTop);

        return { left, top };
    }, [selectedCell]);

    useLayoutEffect(() => {
        if (!selectedCell) return;
        const rafId = window.requestAnimationFrame(() => {
            const nextPosition = computePopupPosition();
            if (nextPosition) {
                setPopupPosition(nextPosition);
            }
        });
        return () => window.cancelAnimationFrame(rafId);
    }, [selectedCell, computePopupPosition, isNoteMode, language, kanjiList.length]);

    useEffect(() => {
        if (!selectedCell) return;

        const handleViewportChange = () => {
            const nextPosition = computePopupPosition();
            if (nextPosition) {
                setPopupPosition(nextPosition);
            }
        };
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', handleViewportChange);

        const viewport = window.visualViewport;
        viewport?.addEventListener('resize', handleViewportChange);
        viewport?.addEventListener('scroll', handleViewportChange);

        return () => {
            window.removeEventListener('resize', handleViewportChange);
            window.removeEventListener('orientationchange', handleViewportChange);
            viewport?.removeEventListener('resize', handleViewportChange);
            viewport?.removeEventListener('scroll', handleViewportChange);
        };
    }, [selectedCell, computePopupPosition]);

    if (!selectedCell) return null;

    const l = labels[language];

    return (
        <>
            {/* Backdrop - tap to close */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            />

            {/* Hover Box — dynamically clamped to the visible viewport */}
            <div
                ref={boxRef}
                className="kanji-hover-popup"
                style={{
                    position: 'fixed',
                    top: popupPosition?.top ?? -10000,
                    left: popupPosition?.left ?? -10000,
                    transform: 'none',
                    zIndex: 50,
                    padding: '16px',
                    borderRadius: '12px',
                    maxWidth: 'min(280px, calc(100vw - 24px))',
                    maxHeight: 'calc(100vh - 24px)',
                    width: '280px',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                    overflowY: 'auto',
                    visibility: popupPosition ? 'visible' : 'hidden',
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
