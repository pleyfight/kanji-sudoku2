import { useMemo, useState } from 'react';
import { type Difficulty } from '../lib/gameState';

interface HomeMenuProps {
    onSelectDifficulty: (diff: Difficulty) => void;
    language: 'en' | 'ja';
    settingsSlot?: React.ReactNode;
}

const LABELS = {
    en: {
        title: 'Kudoku',
        kicker: 'Logic & Tradition',
        subtitle: 'The minimalist Kanji-based Sudoku. Sharpen your mind with the ancient elegance of Japanese characters.',
        play: 'Play Now',
        daily: 'Daily Puzzle',
        leaderboard: 'Leaderboard',
        how: 'How to Play',
        choose: 'Choose a Difficulty',
        easy: 'Easy',
        easyDesc: 'Daily life vocabulary. Hint: Kanji + Meaning.',
        medium: 'Medium',
        mediumDesc: 'Abstract & Business terms. Hint: Meaning only.',
        hard: 'Hard',
        hardDesc: 'Complex concepts (N1). Hint: Meaning only.',
        expert: 'Expert',
        expertDesc: 'Archaic terms & Symbols. Deducible context.',
    },
    ja: {
        title: '漢字数独',
        kicker: '論理と伝統',
        subtitle: 'ミニマルな漢字数独。古来の美しさで思考を研ぎ澄ます。',
        play: 'プレイ',
        daily: 'デイリーパズル',
        leaderboard: 'ランキング',
        how: '遊び方',
        choose: '難易度を選ぶ',
        easy: '簡単',
        easyDesc: '日常生活の語彙。ヒント：漢字＋意味。',
        medium: '普通',
        mediumDesc: '抽象・ビジネス用語。ヒント：意味のみ。',
        hard: '難しい',
        hardDesc: '複雑な概念 (N1)。ヒント：意味のみ。',
        expert: '達人',
        expertDesc: '古語・記号。文脈から推測。',
    },
};

export function HomeMenu({ onSelectDifficulty, language, settingsSlot }: HomeMenuProps) {
    const t = LABELS[language];
    const [showPicker, setShowPicker] = useState(false);

    const cards = useMemo(() => ([
        { diff: 'easy' as const, title: t.easy, desc: t.easyDesc, color: 'var(--accent-easy)' },
        { diff: 'medium' as const, title: t.medium, desc: t.mediumDesc, color: 'var(--accent-medium)' },
        { diff: 'hard' as const, title: t.hard, desc: t.hardDesc, color: 'var(--accent-hard)' },
        { diff: 'expert' as const, title: t.expert, desc: t.expertDesc, color: 'var(--accent-expert)' },
    ]), [t]);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden">
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: 0.05 }}
            >
                <span className="text-[28rem] leading-none kanji-cell" style={{ color: 'var(--text-primary)' }}>智</span>
            </div>

            <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 flex items-center justify-center"
                        style={{ background: 'var(--accent)' }}
                    >
                        <span className="material-symbols-outlined" style={{ color: 'var(--accent-contrast)' }}>grid_view</span>
                    </div>
                    <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-primary)' }}>
                        {t.title}
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>
                        {t.how}
                    </button>
                    {settingsSlot}
                </div>
            </header>

            <main className="flex-1 w-full flex flex-col items-center justify-center px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase" style={{ color: 'var(--accent)' }}>
                        {t.kicker}
                    </span>
                    <h1 className="mt-4 text-6xl md:text-8xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {t.title}
                    </h1>
                    <p className="mt-6 text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
                        {t.subtitle}
                    </p>

                    {!showPicker && (
                        <div className="mt-10 flex flex-col items-center gap-6">
                            <button
                                onClick={() => setShowPicker(true)}
                                className="px-12 py-4 text-sm font-black tracking-[0.2em] uppercase"
                                style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                            >
                                {t.play}
                            </button>
                            <div className="flex items-center gap-6 text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>
                                <button>{t.daily}</button>
                                <span className="w-1 h-1 rounded-full" style={{ background: 'var(--text-muted)' }}></span>
                                <button>{t.leaderboard}</button>
                            </div>
                        </div>
                    )}
                </div>

                {showPicker && (
                    <section className="w-full max-w-4xl mt-16">
                        <h2 className="text-xs font-bold tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--text-muted)' }}>
                            {t.choose}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            {cards.map((card) => (
                                <button
                                    key={card.diff}
                                    onClick={() => onSelectDifficulty(card.diff)}
                                    className="group relative flex flex-col items-stretch text-left rounded-xl overflow-hidden surface-panel transition-transform hover:-translate-y-1"
                                >
                                    <div
                                        className="h-20 flex items-center justify-center"
                                        style={{ backgroundColor: card.color }}
                                    >
                                        <span className="text-4xl font-serif font-bold text-white">
                                            {card.title.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="p-6 flex-grow" style={{ background: 'var(--bg-panel)' }}>
                                        <h3 className="text-2xl font-bold mb-2 font-serif" style={{ color: 'var(--text-primary)' }}>
                                            {card.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                            {card.desc}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="w-full max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
                <span>© 2024 Kudoku. Redefining the classics.</span>
                <div className="flex items-center gap-6">
                    <a href="https://bsky.app/" target="_blank" rel="noreferrer">Bluesky</a>
                    <button>Discord</button>
                </div>
            </footer>
        </div>
    );
}
