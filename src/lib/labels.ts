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
    howToPlay: string;
    quickShortcuts: string;
    pencilMode: string;
    hint: string;
    restartGame: string;
    kanjiKeypad: string;
    gameStats: string;
    clearCell: string;
    checkSolution: string;
    lookingGood: string;
    mistakesToFix: string;
    switchDifficulty: string;
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
        howToPlay: 'How to Play',
        quickShortcuts: 'Quick Shortcuts',
        pencilMode: 'Pencil Mode',
        hint: 'Hint',
        restartGame: 'Restart Game',
        kanjiKeypad: 'Kanji Keypad',
        gameStats: 'Game Stats',
        clearCell: 'Clear Cell',
        checkSolution: 'Check Solution',
        lookingGood: 'Looking good so far.',
        mistakesToFix: 'There are mistakes to fix.',
        switchDifficulty: 'Switch Difficulty?',
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
        howToPlay: '遊び方',
        quickShortcuts: 'ショートカット',
        pencilMode: 'メモモード',
        hint: 'ヒント',
        restartGame: 'リスタート',
        kanjiKeypad: '漢字キーパッド',
        gameStats: 'ゲーム統計',
        clearCell: 'セルをクリア',
        checkSolution: '解答チェック',
        lookingGood: '今のところ正解です。',
        mistakesToFix: '修正すべき箇所があります。',
        switchDifficulty: '難易度を変更しますか？',
    },
};

/**
 * Get labels for the specified language.
 */
export function getLabels(language: Language): AppLabels {
    return LABELS[language];
}
