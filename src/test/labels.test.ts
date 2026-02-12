import { describe, it, expect } from 'vitest';
import { LABELS, getLabels, type Language } from '../lib/labels';

describe('LABELS', () => {
    it('has entries for both supported languages', () => {
        expect(LABELS).toHaveProperty('en');
        expect(LABELS).toHaveProperty('ja');
    });

    it('en and ja have identical keys', () => {
        const enKeys = Object.keys(LABELS.en).sort();
        const jaKeys = Object.keys(LABELS.ja).sort();
        expect(enKeys).toEqual(jaKeys);
    });

    it('no label value is empty string', () => {
        for (const lang of ['en', 'ja'] as Language[]) {
            for (const [key, value] of Object.entries(LABELS[lang])) {
                expect(value, `${lang}.${key} should not be empty`).not.toBe('');
            }
        }
    });
});

describe('getLabels', () => {
    it('returns English labels for "en"', () => {
        const labels = getLabels('en');
        expect(labels.title).toBe('Kudoku');
    });

    it('returns Japanese labels for "ja"', () => {
        const labels = getLabels('ja');
        expect(labels.title).toBe('漢字数独');
    });

    it('returned object matches LABELS entry', () => {
        expect(getLabels('en')).toBe(LABELS.en);
        expect(getLabels('ja')).toBe(LABELS.ja);
    });
});
