// KanjiHoverBox - Mobile-only kanji selection popup
// Appears when tapping a blank cell in Easy, Medium, Hard modes
// Clamped dynamically to stay inside the viewport
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface KanjiHoverBoxProps {
    kanjiList: string[];
    onSelect: (index: number) => void;
    onClose: () => void;
    selectedCell: { row: number; col: number } | null;
    isNoteMode: boolean;
    onNoteToggle: () => void;
    language: 'en' | 'ja';
}

const labels = {
    en: { notes: 'Notes' },
    ja: { notes: 'メモ' },
};

type PopupLayout = {
    row: number;
    col: number;
    left: number;
    top: number;
    fromX: number;
    fromY: number;
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export const KanjiHoverBox: React.FC<KanjiHoverBoxProps> = ({
    kanjiList,
    onSelect,
    onClose,
    selectedCell,
    isNoteMode,
    onNoteToggle,
    language,
}) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [popupLayout, setPopupLayout] = useState<PopupLayout | null>(null);
    const [pressedAction, setPressedAction] = useState<'notes' | 'close' | null>(null);

    const computePopupLayout = useCallback((): PopupLayout | null => {
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
        const targetCenterX = anchorX;
        const targetCenterY = window.innerHeight * 0.48;
        const maxLeft = Math.max(margin, window.innerWidth - popupRect.width - margin);
        const maxTop = Math.max(margin, window.innerHeight - popupRect.height - margin);
        const left = clamp(targetCenterX - popupRect.width / 2, margin, maxLeft);
        const top = clamp(targetCenterY - popupRect.height / 2, margin, maxTop);
        const finalCenterX = left + popupRect.width / 2;
        const finalCenterY = top + popupRect.height / 2;

        return {
            row: selectedCell.row,
            col: selectedCell.col,
            left,
            top,
            fromX: anchorX - finalCenterX,
            fromY: anchorY - finalCenterY,
        };
    }, [selectedCell]);

    useLayoutEffect(() => {
        if (!selectedCell) return;
        const rafId = window.requestAnimationFrame(() => {
            const nextLayout = computePopupLayout();
            if (nextLayout) {
                setPopupLayout(nextLayout);
            }
        });
        return () => window.cancelAnimationFrame(rafId);
    }, [selectedCell, computePopupLayout]);

    useEffect(() => {
        if (!selectedCell) return;

        const handleViewportChange = () => {
            const nextLayout = computePopupLayout();
            if (nextLayout) {
                setPopupLayout(nextLayout);
            }
        };
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', handleViewportChange);

        const viewport = window.visualViewport;
        viewport?.addEventListener('resize', handleViewportChange);

        return () => {
            window.removeEventListener('resize', handleViewportChange);
            window.removeEventListener('orientationchange', handleViewportChange);
            viewport?.removeEventListener('resize', handleViewportChange);
        };
    }, [selectedCell, computePopupLayout]);

    useEffect(() => {
        if (!selectedCell) return;

        const closeOnScroll = () => {
            onClose();
        };
        window.addEventListener('scroll', closeOnScroll, { passive: true });
        window.addEventListener('touchmove', closeOnScroll, { passive: true });

        const viewport = window.visualViewport;
        viewport?.addEventListener('scroll', closeOnScroll);

        return () => {
            window.removeEventListener('scroll', closeOnScroll);
            window.removeEventListener('touchmove', closeOnScroll);
            viewport?.removeEventListener('scroll', closeOnScroll);
        };
    }, [selectedCell, onClose]);

    if (!selectedCell) return null;

    const l = labels[language];
    const notesPressed = pressedAction === 'notes';
    const closePressed = pressedAction === 'close';
    const clearPressedAction = () => setPressedAction(null);
    const hasCurrentLayout = popupLayout?.row === selectedCell.row && popupLayout?.col === selectedCell.col;

    return (
        <div
            key={`${selectedCell.row}-${selectedCell.col}`}
            ref={boxRef}
            className="kanji-hover-popup"
            style={{
                position: 'fixed',
                top: hasCurrentLayout ? popupLayout.top : -10000,
                left: hasCurrentLayout ? popupLayout.left : -10000,
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
                visibility: hasCurrentLayout ? 'visible' : 'hidden',
                touchAction: 'manipulation',
                ['--kanji-from-x' as string]: `${hasCurrentLayout ? popupLayout.fromX : 0}px`,
                ['--kanji-from-y' as string]: `${hasCurrentLayout ? popupLayout.fromY : 0}px`,
            } as React.CSSProperties}
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
                <button
                    onPointerDown={() => setPressedAction('notes')}
                    onPointerUp={clearPressedAction}
                    onPointerCancel={clearPressedAction}
                    onPointerLeave={clearPressedAction}
                    onClick={onNoteToggle}
                    className="flex-1 py-2.5 px-3 text-xs font-bold rounded-lg border"
                    style={{
                        borderColor: 'var(--border-subtle)',
                        background: notesPressed
                            ? '#facc15'
                            : isNoteMode
                                ? 'var(--accent)'
                                : 'var(--bg-secondary)',
                        color: notesPressed
                            ? '#111827'
                            : isNoteMode
                                ? 'var(--accent-contrast)'
                                : 'var(--text-primary)',
                    }}
                >
                    📝 {l.notes}
                </button>

                <button
                    onPointerDown={() => setPressedAction('close')}
                    onPointerUp={clearPressedAction}
                    onPointerCancel={clearPressedAction}
                    onPointerLeave={clearPressedAction}
                    onClick={onClose}
                    className="py-2.5 px-4 text-xs font-bold rounded-lg"
                    style={{
                        background: closePressed ? '#facc15' : 'var(--accent)',
                        color: closePressed ? '#111827' : 'var(--accent-contrast)',
                    }}
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
