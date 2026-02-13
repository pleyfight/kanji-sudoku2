import { useMemo } from 'react';

interface ProfilePageProps {
    onNavigateHome: () => void;
    onStartGame: () => void;
}

type SidebarAction = 'home' | 'play' | 'none';

interface SidebarItem {
    label: string;
    icon: string;
    action: SidebarAction;
    isActive?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
    { label: 'Dashboard', icon: 'dashboard', action: 'home' },
    { label: 'Play Game', icon: 'play_circle', action: 'play' },
    { label: 'Profile', icon: 'account_circle', action: 'none', isActive: true },
    { label: 'Leaderboard', icon: 'leaderboard', action: 'none' },
    { label: 'Full History', icon: 'history', action: 'none' },
];

const STAT_CARDS = [
    { label: 'Puzzles Solved', value: '1,284', note: '+12%', noteTone: 'positive', icon: 'extension' },
    { label: 'Current Streak', value: '15 Days', note: 'Personal Best', noteTone: 'neutral', icon: 'local_fire_department' },
    { label: 'Best Time (Hard)', value: '12:45', note: '', noteTone: 'neutral', icon: 'timer' },
    { label: 'Avg Accuracy', value: '98.2%', note: 'Expert Level', noteTone: 'positive', icon: 'target' },
] as const;

const RECENT_HIGHLIGHTS = [
    { label: 'Last Match', value: '2 Hours Ago' },
    { label: 'Time', value: '12:12' },
    { label: 'Mistakes', value: '0' },
    { label: 'XP Earned', value: '1,450 XP' },
    { label: 'Global Speed', value: '92%' },
] as const;

const ACTIVITY_GRID = [
    [5, 4, 1, 0, 3, 4, 5, 2, 1, 3, 4, 5, 2, 4],
    [4, 3, 1, 0, 4, 5, 3, 1, 0, 2, 4, 5, 3, 5],
    [2, 2, 0, 1, 4, 5, 2, 1, 2, 3, 5, 4, 3, 4],
    [5, 4, 2, 0, 3, 4, 4, 1, 1, 2, 4, 4, 5, 5],
] as const;

interface ChartPoint {
    x: number;
    y: number;
}

interface ChartPaths {
    linePath: string;
    areaPath: string;
    points: ChartPoint[];
}

function buildChartPaths(series: number[]): ChartPaths {
    const width = 640;
    const height = 250;
    const padX = 24;
    const padY = 18;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const stepX = (width - padX * 2) / (series.length - 1);

    const points = series.map((value, index) => {
        const x = padX + index * stepX;
        const y = height - padY - ((value - min) / range) * (height - padY * 2);
        return { x, y };
    });

    const linePath = points
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

    return { linePath, areaPath, points };
}

export function ProfilePage({ onNavigateHome, onStartGame }: ProfilePageProps) {
    const chart = useMemo(() => buildChartPaths([9, 10, 16, 11, 13, 8, 12, 18]), []);

    const onSidebarClick = (action: SidebarAction) => {
        if (action === 'home') onNavigateHome();
        if (action === 'play') onStartGame();
    };

    return (
        <div className="profile-page">
            <aside className="profile-sidebar">
                <button type="button" className="profile-brand" onClick={onNavigateHome}>
                    <span className="profile-brand-mark" aria-hidden="true">
                        <span className="material-symbols-outlined">grid_view</span>
                    </span>
                    <span className="profile-brand-text">
                        <strong>Kudoku</strong>
                        <small>Kanji Sudoku</small>
                    </span>
                </button>

                <nav className="profile-nav" aria-label="Profile navigation">
                    {SIDEBAR_ITEMS.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            className={`profile-nav-item${item.isActive ? ' is-active' : ''}`}
                            onClick={() => onSidebarClick(item.action)}
                        >
                            <span className="material-symbols-outlined profile-nav-icon" aria-hidden="true">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button type="button" className="profile-new-game-btn" onClick={onStartGame}>
                    New Game
                </button>
            </aside>

            <div className="profile-main">
                <header className="profile-topbar">
                    <label className="profile-search" aria-label="Search profile history">
                        <span className="material-symbols-outlined" aria-hidden="true">search</span>
                        <input type="text" placeholder="Search history or rankings" />
                    </label>

                    <div className="profile-userbar">
                        <button type="button" className="profile-icon-btn" aria-label="Notifications">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="profile-notification-dot" />
                        </button>
                        <div className="profile-user-chip">
                            <div className="profile-user-copy">
                                <strong>KanjiMaster77</strong>
                                <small>Expert Rank</small>
                            </div>
                            <div className="profile-user-avatar" aria-hidden="true">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="profile-content">
                    <section className="profile-hero">
                        <div className="profile-hero-main">
                            <div className="profile-avatar-block" aria-hidden="true">
                                <span className="profile-avatar-dot" />
                            </div>
                            <div className="profile-identity">
                                <h1>
                                    KanjiMaster77
                                    <span className="material-symbols-outlined profile-verified" aria-hidden="true">verified</span>
                                </h1>
                                <p>Expert Rank • Member since October 2023</p>
                                <div className="profile-pills">
                                    <span className="profile-pill profile-pill-global">
                                        <span className="material-symbols-outlined" aria-hidden="true">north_east</span>
                                        Top 1% Global
                                    </span>
                                    <span className="profile-pill profile-pill-pro">
                                        <span className="material-symbols-outlined" aria-hidden="true">workspace_premium</span>
                                        Pro Tier
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="profile-edit-btn">Edit Profile</button>
                    </section>

                    <section className="profile-stats-grid" aria-label="Performance summary">
                        {STAT_CARDS.map((card) => (
                            <article key={card.label} className="profile-stat-card">
                                <div className="profile-stat-head">
                                    <span>{card.label}</span>
                                    <span className="material-symbols-outlined" aria-hidden="true">{card.icon}</span>
                                </div>
                                <div className="profile-stat-value">{card.value}</div>
                                {card.note ? (
                                    <span className={`profile-stat-note tone-${card.noteTone}`}>{card.note}</span>
                                ) : null}
                            </article>
                        ))}
                    </section>

                    <section className="profile-section">
                        <div className="profile-section-header">
                            <h2>Performance Analytics</h2>
                            <span className="profile-section-rule" />
                        </div>

                        <div className="profile-analytics-grid">
                            <article className="profile-panel profile-chart-panel">
                                <header className="profile-panel-header">
                                    <div>
                                        <h3>Completion Trends</h3>
                                        <p>Average time (minutes) per difficulty tier</p>
                                    </div>
                                    <div className="profile-chart-chips">
                                        <span className="is-active">Hard</span>
                                        <span>Medium</span>
                                    </div>
                                </header>

                                <div className="profile-chart-wrap">
                                    <svg
                                        viewBox="0 0 640 250"
                                        className="profile-chart-svg"
                                        role="img"
                                        aria-label="Completion trend over four weeks"
                                    >
                                        <defs>
                                            <linearGradient id="profileChartFill" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="color-mix(in srgb, var(--accent) 22%, transparent)" />
                                                <stop offset="100%" stopColor="transparent" />
                                            </linearGradient>
                                        </defs>
                                        <line x1="24" x2="616" y1="60" y2="60" className="profile-chart-grid-line" />
                                        <line x1="24" x2="616" y1="110" y2="110" className="profile-chart-grid-line" />
                                        <line x1="24" x2="616" y1="160" y2="160" className="profile-chart-grid-line" />
                                        <line x1="24" x2="616" y1="232" y2="232" className="profile-chart-grid-line is-strong" />
                                        <path d={chart.areaPath} fill="url(#profileChartFill)" />
                                        <path d={chart.linePath} className="profile-chart-line" />
                                        {chart.points.map((point, index) => (
                                            index === 2 || index === 4 || index === 7 ? (
                                                <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="5" className="profile-chart-point" />
                                            ) : null
                                        ))}
                                    </svg>
                                </div>

                                <footer className="profile-chart-axis">
                                    <span>Week 1</span>
                                    <span>Week 2</span>
                                    <span>Week 3</span>
                                    <span>Week 4</span>
                                </footer>
                            </article>

                            <article className="profile-panel profile-activity-panel">
                                <header className="profile-panel-header">
                                    <h3>Activity Calendar</h3>
                                    <span className="material-symbols-outlined" aria-hidden="true">calendar_month</span>
                                </header>

                                <div className="profile-activity-grid">
                                    {ACTIVITY_GRID.map((row, rowIndex) => (
                                        <div key={`row-${rowIndex}`} className="profile-activity-row">
                                            {row.map((cell, cellIndex) => (
                                                <span
                                                    key={`cell-${rowIndex}-${cellIndex}`}
                                                    className="profile-activity-cell"
                                                    style={{ opacity: cell === 0 ? 0.14 : 0.25 + cell * 0.13 }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="profile-activity-legend">
                                    <span>Less active</span>
                                    <div>
                                        {[1, 2, 3, 4].map((level) => (
                                            <span key={level} style={{ opacity: 0.2 + level * 0.18 }} />
                                        ))}
                                    </div>
                                    <span>More active</span>
                                </div>

                                <div className="profile-xp-block">
                                    <small>Current Activity Score</small>
                                    <div className="profile-xp-line">
                                        <strong>2,450 XP</strong>
                                        <span>Master Tier</span>
                                    </div>
                                    <div className="profile-xp-progress" role="presentation">
                                        <div />
                                    </div>
                                </div>
                            </article>
                        </div>
                    </section>

                    <section className="profile-section">
                        <div className="profile-section-header">
                            <h2>Recent Activity &amp; Highlights</h2>
                            <button type="button" className="profile-history-link">Full Match History</button>
                        </div>

                        <div className="profile-recent-grid">
                            {RECENT_HIGHLIGHTS.map((item) => (
                                <article key={item.label} className="profile-recent-card">
                                    <small>{item.label}</small>
                                    <strong>{item.value}</strong>
                                </article>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
