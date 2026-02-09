// Centralized labels/i18n constants
// Extracted from App.tsx for reusability and SRP

export type Language = 'en' | 'ja';

export interface AppLabels {
    title: string;
    subtitle: string;
    easy: string;
    medium: string;
    hard: string;
    expert: string;
    newGame: string;
    loading: string;
    paused: string;
    puzzle: string;
    goToPuzzle: string;
}

export const LABELS: Record<Language, AppLabels> = {
    en: {
        title: 'Kudoku',
        subtitle: 'Learn Japanese through puzzles',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        expert: 'Expert',
        newGame: 'New Game',
        loading: 'Loading...',
        paused: 'Paused',
        puzzle: 'Puzzle',
        goToPuzzle: 'Go to #',
    },
    ja: {
        title: '漢字数独',
        subtitle: 'パズルで学ぶ日本語',
        easy: '簡単',
        medium: '普通',
        hard: '難しい',
        expert: '達人',
        newGame: '新規ゲーム',
        loading: '読み込み中...',
        paused: '一時停止中',
        puzzle: 'パズル',
        goToPuzzle: '番号へ',
    },
};

/**
 * Get labels for the specified language.
 */
export function getLabels(language: Language): AppLabels {
    return LABELS[language];
}
