import { describe, it, expect } from 'vitest';
import {
    isKana,
    createCell,
    getDifficultyFromId,
    PUZZLE_ID_RANGES,
} from '../data/puzzles/types';

describe('isKana', () => {
    it('returns true for hiragana characters', () => {
        expect(isKana('あ')).toBe(true);  // U+3042
        expect(isKana('ん')).toBe(true);  // U+3093
        expect(isKana('き')).toBe(true);  // U+304D
    });

    it('returns true for katakana characters', () => {
        expect(isKana('ア')).toBe(true);  // U+30A2
        expect(isKana('ン')).toBe(true);  // U+30F3
        expect(isKana('カ')).toBe(true);  // U+30AB
    });

    it('returns false for kanji characters', () => {
        expect(isKana('漢')).toBe(false);
        expect(isKana('字')).toBe(false);
        expect(isKana('木')).toBe(false);
    });

    it('returns false for latin characters', () => {
        expect(isKana('a')).toBe(false);
        expect(isKana('Z')).toBe(false);
        expect(isKana('1')).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(isKana('')).toBe(false);
    });
});

describe('createCell', () => {
    it('creates a kanji cell (not kana, revealed)', () => {
        const cell = createCell('漢', true);
        expect(cell).toEqual({
            symbol: '漢',
            isKana: false,
            isRevealed: true,
        });
    });

    it('creates a kana cell (detected as kana)', () => {
        const cell = createCell('あ', true);
        expect(cell).toEqual({
            symbol: 'あ',
            isKana: true,
            isRevealed: true,
        });
    });

    it('creates unrevealed cell', () => {
        const cell = createCell('字', false);
        expect(cell.isRevealed).toBe(false);
    });

    it('treats kana as editable in expert mode', () => {
        const cell = createCell('あ', true, { treatKanaAsEditable: true });
        // In expert mode, kana cells are treated as editable (isKana = false)
        expect(cell.isKana).toBe(false);
    });
});

describe('getDifficultyFromId', () => {
    it('returns easy for IDs in easy range', () => {
        expect(getDifficultyFromId(PUZZLE_ID_RANGES.easy.min)).toBe('easy');
        expect(getDifficultyFromId(PUZZLE_ID_RANGES.easy.max)).toBe('easy');
        expect(getDifficultyFromId(5000)).toBe('easy');
    });

    it('returns medium for IDs in medium range', () => {
        expect(getDifficultyFromId(PUZZLE_ID_RANGES.medium.min)).toBe('medium');
        expect(getDifficultyFromId(PUZZLE_ID_RANGES.medium.max)).toBe('medium');
        expect(getDifficultyFromId(15000)).toBe('medium');
    });

    it('returns hard for IDs in hard range', () => {
        expect(getDifficultyFromId(PUZZLE_ID_RANGES.hard.min)).toBe('hard');
        expect(getDifficultyFromId(PUZZLE_ID_RANGES.hard.max)).toBe('hard');
        expect(getDifficultyFromId(25000)).toBe('hard');
    });

    it('returns expert for IDs in expert range', () => {
        expect(getDifficultyFromId(PUZZLE_ID_RANGES.expert.min)).toBe('expert');
        expect(getDifficultyFromId(PUZZLE_ID_RANGES.expert.max)).toBe('expert');
        expect(getDifficultyFromId(35000)).toBe('expert');
    });

    it('returns null for out-of-range IDs', () => {
        expect(getDifficultyFromId(0)).toBeNull();
        expect(getDifficultyFromId(1000)).toBeNull();
        expect(getDifficultyFromId(999999)).toBeNull();
        expect(getDifficultyFromId(-1)).toBeNull();
    });
});

describe('PUZZLE_ID_RANGES', () => {
    it('ranges are contiguous and non-overlapping', () => {
        const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;

        for (let i = 0; i < difficulties.length - 1; i++) {
            const current = PUZZLE_ID_RANGES[difficulties[i]];
            const next = PUZZLE_ID_RANGES[difficulties[i + 1]];
            // Current max + 1 should equal next min (contiguous)
            expect(current.max + 1).toBe(next.min);
        }
    });

    it('each range contains at least 1 ID', () => {
        for (const [, range] of Object.entries(PUZZLE_ID_RANGES)) {
            expect(range.max).toBeGreaterThanOrEqual(range.min);
        }
    });
});
