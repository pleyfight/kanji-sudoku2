// MobileLeaderboard - Leaderboard screen for mobile devices
// Matches reference designs: 8.png (dark), 12.png (light)
import React, { useState } from 'react';

interface MobileLeaderboardProps {
    onBack: () => void;
}

type TimeFilter = 'daily' | 'weekly' | 'all-time';

const MOCK_TOP3 = [
    { rank: 2, name: 'K_Master', xp: 12450, avatar: '👤' },
    { rank: 1, name: 'Yuki_Sama', xp: 15820, avatar: '👑' },
    { rank: 3, name: 'Ryu_Jin', xp: 11200, avatar: '👤' },
];

const MOCK_RANKS = [
    { rank: 4, name: 'Hana_99', subtitle: '82 Daily Wins', xp: 9420 },
    { rank: 5, name: 'Ken_The_Great', subtitle: '75 Daily Wins', xp: 8100 },
    { rank: 6, name: 'Miki_Chan', subtitle: '68 Daily Wins', xp: 7950 },
    { rank: 7, name: 'Sato_San', subtitle: '64 Daily Wins', xp: 7200 },
    { rank: 8, name: 'Taro_Tan', subtitle: '59 Daily Wins', xp: 6800 },
];

const MOCK_USER = { rank: 42, name: 'Zen_Gamer', xp: 2450 };

export const MobileLeaderboard: React.FC<MobileLeaderboardProps> = ({ onBack }) => {
    const [filter, setFilter] = useState<TimeFilter>('weekly');
    const filters: { key: TimeFilter; label: string }[] = [
        { key: 'daily', label: 'DAILY' },
        { key: 'weekly', label: 'WEEKLY' },
        { key: 'all-time', label: 'ALL-TIME' },
    ];

    return (
        <div className="mobile-leaderboard">
            {/* Header */}
            <header className="mobile-lb-header">
                <button onClick={onBack} className="mobile-icon-btn">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Global Rankings</h1>
                <button className="mobile-icon-btn">
                    <span className="material-symbols-outlined">share</span>
                </button>
            </header>

            {/* Filter Tabs */}
            <nav className="mobile-lb-filters">
                {filters.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`mobile-lb-filter ${filter === f.key ? 'active' : ''}`}
                    >
                        {f.label}
                    </button>
                ))}
            </nav>

            {/* Podium */}
            <div className="mobile-podium">
                {MOCK_TOP3.map((player) => (
                    <div
                        key={player.rank}
                        className={`mobile-podium-entry ${player.rank === 1 ? 'first' : ''}`}
                    >
                        <div className={`mobile-podium-avatar ${player.rank === 1 ? 'gold-ring' : player.rank === 2 ? 'silver-ring' : 'bronze-ring'}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: player.rank === 1 ? '36px' : '28px', color: 'var(--text-muted)' }}>
                                person
                            </span>
                            <span className="mobile-podium-rank">{player.rank}</span>
                        </div>
                        <span className="mobile-podium-name">{player.name}</span>
                        <span className="mobile-podium-xp" style={{ color: 'var(--accent)' }}>
                            {player.xp.toLocaleString()} XP
                        </span>
                    </div>
                ))}
            </div>

            {/* Rankings List */}
            <div className="mobile-ranks-list">
                {MOCK_RANKS.map((player) => (
                    <div key={player.rank} className="mobile-rank-row">
                        <span className="mobile-rank-num">{player.rank}</span>
                        <div className="mobile-rank-avatar">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
                                person
                            </span>
                        </div>
                        <div className="mobile-rank-info">
                            <span className="mobile-rank-name">{player.name}</span>
                            <span className="mobile-rank-subtitle">{player.subtitle}</span>
                        </div>
                        <span className="mobile-rank-xp" style={{ color: 'var(--accent)' }}>
                            {player.xp.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* Your Rank Footer */}
            <div className="mobile-your-rank">
                <span className="mobile-your-rank-num">#{MOCK_USER.rank}</span>
                <div className="mobile-rank-avatar">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--accent-contrast)' }}>
                        person
                    </span>
                </div>
                <span className="mobile-your-rank-name">{MOCK_USER.name} (You)</span>
                <span className="mobile-your-rank-xp">
                    {MOCK_USER.xp.toLocaleString()} <span className="text-[10px] opacity-70">XP</span>
                </span>
            </div>
        </div>
    );
};
