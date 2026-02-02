import { type Difficulty } from '../lib/gameState';

interface HomeMenuProps {
    onSelectDifficulty: (diff: Difficulty) => void;
    language: 'en' | 'ja';
}

const LABELS = {
    en: {
        title: 'Kudoko',
        subtitle: 'The Daily Kanji Logic Puzzle',
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
        subtitle: '日刊漢字ロジックパズル',
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

export function HomeMenu({ onSelectDifficulty, language }: HomeMenuProps) {
    const t = LABELS[language];

    const cards: { diff: Difficulty; title: string; desc: string; color: string; accent: string }[] = [
        { diff: 'easy', title: t.easy, desc: t.easyDesc, color: 'var(--accent-easy)', accent: 'bg-blue-100 dark:text-black' },
        { diff: 'medium', title: t.medium, desc: t.mediumDesc, color: 'var(--accent-medium)', accent: 'bg-green-100 dark:text-black' },
        { diff: 'hard', title: t.hard, desc: t.hardDesc, color: 'var(--accent-hard)', accent: 'bg-yellow-100 dark:text-black' },
        { diff: 'expert', title: t.expert, desc: t.expertDesc, color: 'var(--accent-expert)', accent: 'bg-red-100 dark:text-black' },
    ];

    return (
        <div className="w-full max-w-4xl p-4 flex flex-col items-center animate-fade-in">
            {/* Title Section */}
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
                {t.title}
            </h1>
            <p className="text-lg md:text-xl font-sans mb-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                {t.subtitle}
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {cards.map((card) => (
                    <button
                        key={card.diff}
                        onClick={() => onSelectDifficulty(card.diff)}
                        className="group relative flex flex-col items-stretch text-left border-3 border-black dark:border-white shadow-sm hover:shadow-hard transition-all duration-200 transform hover:-translate-y-1"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-primary)',
                        }}
                    >
                        {/* Card Header (Color Block) */}
                        <div
                            className={`h-24 flex items-center justify-center border-b-3 ${card.accent}`}
                            style={{
                                borderBottomColor: 'var(--border-primary)',
                                backgroundColor: card.color
                            }}
                        >
                            {/* Icon Placeholder or just Initials */}
                            <span className="text-4xl font-serif font-bold text-white drop-shadow-md">
                                {card.title.charAt(0)}
                            </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-grow bg-white dark:bg-zinc-900">
                            <h2 className="text-2xl font-bold mb-2 font-serif" style={{ color: 'var(--text-primary)' }}>
                                {card.title}
                            </h2>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {card.desc}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
