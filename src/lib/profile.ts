import type { Difficulty } from '../data/puzzles';
import { safeStorage } from './safeStorage';

const PROFILE_STORAGE_KEY = 'kanjiSudoku_profile_v1';
const HISTORY_STORAGE_KEY = 'kanjiSudoku_profile_history_v1';
const MAX_HISTORY_ENTRIES = 200;
const DEFAULT_DISPLAY_NAME = 'Player';

export interface UserProfileData {
    displayName: string;
    avatarDataUrl: string | null;
    memberSinceISO: string;
}

export interface PuzzleHistoryEntry {
    id: string;
    puzzleId: number;
    difficulty: Difficulty;
    elapsedTime: number;
    score: number;
    hintsUsed: number;
    completedAt: string;
}

export interface PuzzleHistoryInput {
    puzzleId: number;
    difficulty: Difficulty;
    elapsedTime: number;
    score: number;
    hintsUsed: number;
    completedAt?: string;
}

function isDifficulty(value: unknown): value is Difficulty {
    return value === 'easy' || value === 'medium' || value === 'hard' || value === 'expert';
}

function isValidDateString(value: string): boolean {
    return Number.isFinite(new Date(value).getTime());
}

function isUserProfileData(value: unknown): value is UserProfileData {
    if (!value || typeof value !== 'object') return false;
    const maybeProfile = value as Partial<UserProfileData>;
    const hasValidDisplayName = typeof maybeProfile.displayName === 'string' && maybeProfile.displayName.trim().length > 0;
    const hasValidAvatar =
        maybeProfile.avatarDataUrl === null ||
        typeof maybeProfile.avatarDataUrl === 'string';
    const hasValidMemberSince = typeof maybeProfile.memberSinceISO === 'string' && isValidDateString(maybeProfile.memberSinceISO);
    return hasValidDisplayName && hasValidAvatar && hasValidMemberSince;
}

function isPuzzleHistoryEntry(value: unknown): value is PuzzleHistoryEntry {
    if (!value || typeof value !== 'object') return false;
    const entry = value as Partial<PuzzleHistoryEntry>;
    return (
        typeof entry.id === 'string' &&
        entry.id.length > 0 &&
        Number.isInteger(entry.puzzleId) &&
        (entry.puzzleId ?? 0) > 0 &&
        isDifficulty(entry.difficulty) &&
        Number.isInteger(entry.elapsedTime) &&
        (entry.elapsedTime ?? -1) >= 0 &&
        Number.isInteger(entry.score) &&
        (entry.score ?? 0) >= 0 &&
        Number.isInteger(entry.hintsUsed) &&
        (entry.hintsUsed ?? 0) >= 0 &&
        typeof entry.completedAt === 'string' &&
        isValidDateString(entry.completedAt)
    );
}

function isPuzzleHistoryArray(value: unknown): value is PuzzleHistoryEntry[] {
    return Array.isArray(value) && value.every(isPuzzleHistoryEntry);
}

function createDefaultProfile(): UserProfileData {
    return {
        displayName: DEFAULT_DISPLAY_NAME,
        avatarDataUrl: null,
        memberSinceISO: new Date().toISOString(),
    };
}

export function loadUserProfileData(): UserProfileData {
    const storedProfile = safeStorage.getValidatedJSON<UserProfileData>(PROFILE_STORAGE_KEY, isUserProfileData);
    if (storedProfile) {
        return storedProfile;
    }

    const fallbackProfile = createDefaultProfile();
    safeStorage.setJSON(PROFILE_STORAGE_KEY, fallbackProfile);
    return fallbackProfile;
}

export function saveUserProfileData(profile: UserProfileData): void {
    safeStorage.setJSON(PROFILE_STORAGE_KEY, profile);
}

export function loadPuzzleHistory(): PuzzleHistoryEntry[] {
    const history = safeStorage.getValidatedJSON<PuzzleHistoryEntry[]>(HISTORY_STORAGE_KEY, isPuzzleHistoryArray);
    if (!history) return [];

    return [...history]
        .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
        .slice(0, MAX_HISTORY_ENTRIES);
}

export function savePuzzleHistory(history: PuzzleHistoryEntry[]): void {
    safeStorage.setJSON(HISTORY_STORAGE_KEY, history.slice(0, MAX_HISTORY_ENTRIES));
}

export function appendPuzzleHistoryEntry(
    history: PuzzleHistoryEntry[],
    input: PuzzleHistoryInput
): PuzzleHistoryEntry[] {
    const completedAt = input.completedAt ?? new Date().toISOString();
    const normalizedElapsedTime = Math.max(0, Math.floor(input.elapsedTime));
    const normalizedScore = Math.max(0, Math.floor(input.score));
    const normalizedHintsUsed = Math.max(0, Math.floor(input.hintsUsed));
    const id = `${input.puzzleId}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

    const newEntry: PuzzleHistoryEntry = {
        id,
        puzzleId: input.puzzleId,
        difficulty: input.difficulty,
        elapsedTime: normalizedElapsedTime,
        score: normalizedScore,
        hintsUsed: normalizedHintsUsed,
        completedAt,
    };

    return [newEntry, ...history].slice(0, MAX_HISTORY_ENTRIES);
}
