import { describe, it, expect, beforeEach } from 'vitest';
import { safeStorage } from '../lib/safeStorage';

describe('safeStorage', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('getItem / setItem', () => {
        it('stores and retrieves a string', () => {
            safeStorage.setItem('key1', 'hello');
            expect(safeStorage.getItem('key1')).toBe('hello');
        });

        it('returns null for non-existent key', () => {
            expect(safeStorage.getItem('nonexistent')).toBeNull();
        });
    });

    describe('removeItem', () => {
        it('removes a stored item', () => {
            safeStorage.setItem('key2', 'value');
            safeStorage.removeItem('key2');
            expect(safeStorage.getItem('key2')).toBeNull();
        });

        it('does not throw for non-existent key', () => {
            expect(() => safeStorage.removeItem('nonexistent')).not.toThrow();
        });
    });

    describe('setJSON / getJSON', () => {
        it('stores and retrieves a JSON object', () => {
            const data = { score: 100, level: 'easy' };
            safeStorage.setJSON('game', data);
            expect(safeStorage.getJSON('game')).toEqual(data);
        });

        it('handles arrays', () => {
            const arr = [1, 2, 3];
            safeStorage.setJSON('arr', arr);
            expect(safeStorage.getJSON('arr')).toEqual([1, 2, 3]);
        });

        it('returns null for non-existent key', () => {
            expect(safeStorage.getJSON('missing')).toBeNull();
        });

        it('returns null for invalid JSON', () => {
            safeStorage.setItem('bad', '{not valid json');
            expect(safeStorage.getJSON('bad')).toBeNull();
        });
    });

    describe('getValidatedJSON', () => {
        const isNumberRecord = (data: unknown): data is Record<string, number> =>
            typeof data === 'object' && data !== null && !Array.isArray(data);

        it('returns validated data when validator passes', () => {
            const data = { a: 1, b: 2 };
            safeStorage.setJSON('valid', data);
            expect(safeStorage.getValidatedJSON('valid', isNumberRecord)).toEqual(data);
        });

        it('returns null when validator rejects', () => {
            safeStorage.setJSON('arr', [1, 2, 3]);
            // Array fails the isNumberRecord validator
            expect(safeStorage.getValidatedJSON('arr', isNumberRecord)).toBeNull();
        });

        it('returns null for non-existent key', () => {
            expect(safeStorage.getValidatedJSON('missing', isNumberRecord)).toBeNull();
        });

        it('returns null for invalid JSON', () => {
            safeStorage.setItem('bad', '{{invalid');
            expect(safeStorage.getValidatedJSON('bad', isNumberRecord)).toBeNull();
        });
    });
});
