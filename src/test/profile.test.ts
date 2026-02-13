import { beforeEach, describe, expect, it } from 'vitest';
import {
    appendPuzzleHistoryEntry,
    loadPuzzleHistory,
    loadUserProfileData,
    savePuzzleHistory,
    saveUserProfileData,
    type PuzzleHistoryEntry,
} from '../lib/profile';

describe('profile storage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('creates and persists a default profile when none exists', () => {
        const profile = loadUserProfileData();

        expect(profile.displayName).toBe('Player');
        expect(profile.avatarDataUrl).toBeNull();
        expect(Number.isFinite(new Date(profile.memberSinceISO).getTime())).toBe(true);
    });

    it('saves and loads updated profile data', () => {
        const updatedProfile = {
            displayName: 'TestUser',
            avatarDataUrl: 'data:image/png;base64,test',
            memberSinceISO: '2025-01-01T00:00:00.000Z',
        };

        saveUserProfileData(updatedProfile);

        expect(loadUserProfileData()).toEqual(updatedProfile);
    });

    it('appends a puzzle completion entry with normalized numeric values', () => {
        const nextHistory = appendPuzzleHistoryEntry([], {
            puzzleId: 1234,
            difficulty: 'hard',
            elapsedTime: -99,
            score: -10,
            hintsUsed: -2,
            completedAt: '2025-01-15T12:30:00.000Z',
        });

        expect(nextHistory).toHaveLength(1);
        expect(nextHistory[0].puzzleId).toBe(1234);
        expect(nextHistory[0].difficulty).toBe('hard');
        expect(nextHistory[0].elapsedTime).toBe(0);
        expect(nextHistory[0].score).toBe(0);
        expect(nextHistory[0].hintsUsed).toBe(0);
        expect(nextHistory[0].completedAt).toBe('2025-01-15T12:30:00.000Z');
    });

    it('loads puzzle history sorted by most recent completion', () => {
        const unsortedHistory: PuzzleHistoryEntry[] = [
            {
                id: '1',
                puzzleId: 11,
                difficulty: 'easy',
                elapsedTime: 100,
                score: 900,
                hintsUsed: 1,
                completedAt: '2025-01-01T10:00:00.000Z',
            },
            {
                id: '2',
                puzzleId: 12,
                difficulty: 'medium',
                elapsedTime: 120,
                score: 800,
                hintsUsed: 0,
                completedAt: '2025-02-01T10:00:00.000Z',
            },
        ];

        savePuzzleHistory(unsortedHistory);

        const loadedHistory = loadPuzzleHistory();
        expect(loadedHistory).toHaveLength(2);
        expect(loadedHistory[0].id).toBe('2');
        expect(loadedHistory[1].id).toBe('1');
    });
});
