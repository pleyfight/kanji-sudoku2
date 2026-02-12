// MobileProfile - Profile screen for mobile devices
// Matches reference designs: 7.png (dark), 11.png (light)
import React from 'react';

interface MobileProfileProps {
    onSettingsOpen: () => void;
    onNavigateHome: () => void;
}

const MOCK_STATS = {
    puzzlesSolved: 1284,
    currentStreak: 12,
    bestTime: '2:41',
    accuracy: 98.4,
};

const MOCK_ACTIVITY = [
    [3, 4, 5, 2, 0, 1, 3, 5, 2, 4],
    [4, 5, 2, 0, 3, 1, 4, 2, 5, 3],
    [5, 3, 4, 1, 5, 0, 2, 4, 3, 5],
];

const MOCK_PERFORMANCE = [2, 3, 4, 3, 5, 4, 6, 7, 8, 7, 9, 8, 6, 5];

export const MobileProfile: React.FC<MobileProfileProps> = ({
    onSettingsOpen,
    onNavigateHome,
}) => {
    return (
        <div className="mobile-profile">
            {/* Header */}
            <header className="mobile-screen-header">
                <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
                    <div
                        className="w-8 h-8 flex items-center justify-center"
                        style={{ background: 'var(--accent)' }}
                    >
                        <span className="material-symbols-outlined text-sm" style={{ color: 'var(--accent-contrast)' }}>
                            grid_view
                        </span>
                    </div>
                </div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-primary)' }}>
                    Profile
                </span>
                <button onClick={onSettingsOpen} className="mobile-icon-btn">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </header>

            <main className="mobile-profile-content">
                {/* Avatar */}
                <div className="mobile-profile-avatar">
                    <div className="mobile-avatar-ring">
                        <div className="mobile-avatar-inner">
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-muted)' }}>
                                person
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <h2 className="mobile-profile-name">KanjiMaster77</h2>
                <span className="mobile-profile-badge">EXPERT</span>
                <p className="mobile-profile-subtitle">MASTER SINCE OCT 2023</p>

                {/* Stats Grid */}
                <div className="mobile-stats-grid">
                    <div className="mobile-stat-card">
                        <span className="mobile-stat-label">Puzzles Solved</span>
                        <span className="mobile-stat-value">{MOCK_STATS.puzzlesSolved.toLocaleString()}</span>
                    </div>
                    <div className="mobile-stat-card">
                        <span className="mobile-stat-label">Current Streak</span>
                        <span className="mobile-stat-value">
                            <span style={{ color: 'var(--accent)' }}>{MOCK_STATS.currentStreak}</span> Days
                        </span>
                    </div>
                    <div className="mobile-stat-card">
                        <span className="mobile-stat-label">Best Time</span>
                        <span className="mobile-stat-value">{MOCK_STATS.bestTime}</span>
                    </div>
                    <div className="mobile-stat-card">
                        <span className="mobile-stat-label">Accuracy</span>
                        <span className="mobile-stat-value">{MOCK_STATS.accuracy}%</span>
                    </div>
                </div>

                {/* Performance Analytics */}
                <div className="mobile-analytics-section">
                    <div className="mobile-analytics-header">
                        <span className="mobile-section-title">Performance Analytics</span>
                        <span className="mobile-analytics-period" style={{ color: 'var(--accent)' }}>Last 30 Days</span>
                    </div>
                    <div className="mobile-bar-chart">
                        {MOCK_PERFORMANCE.map((val, i) => (
                            <div
                                key={i}
                                className="mobile-bar"
                                style={{
                                    height: `${(val / 10) * 100}%`,
                                    opacity: 0.4 + (val / 10) * 0.6,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Daily Activity Heatmap */}
                <div className="mobile-analytics-section">
                    <span className="mobile-section-title">Daily Activity</span>
                    <div className="mobile-heatmap">
                        {MOCK_ACTIVITY.map((row, ri) => (
                            <div key={ri} className="mobile-heatmap-row">
                                {row.map((val, ci) => (
                                    <div
                                        key={ci}
                                        className="mobile-heatmap-cell"
                                        style={{
                                            opacity: val === 0 ? 0.1 : 0.2 + (val / 5) * 0.8,
                                            background: 'var(--accent)',
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
