import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import type { Difficulty } from '../data/puzzles';
import { formatTime } from '../hooks/useTimer';
import type { PuzzleHistoryEntry, UserProfileData } from '../lib/profile';

interface ProfilePageProps {
    onNavigateHome: () => void;
    onStartGame: () => void;
    onOpenPuzzle: (puzzleId: number) => void;
    profile: UserProfileData;
    puzzleHistory: PuzzleHistoryEntry[];
    onUpdateProfile: (profile: UserProfileData) => void;
}

type SidebarAction = 'home' | 'play' | 'history' | 'none';
type TrendFilter = Difficulty | 'all';

interface SidebarItem {
    label: string;
    icon: string;
    action: SidebarAction;
    isActive?: boolean;
}

interface ChartPoint {
    x: number;
    y: number;
}

interface ChartPaths {
    linePath: string;
    areaPath: string;
    points: ChartPoint[];
}

interface WeeklyTrend {
    series: number[];
    labels: string[];
}

const MAX_AVATAR_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
};

const SIDEBAR_ITEMS: SidebarItem[] = [
    { label: 'Dashboard', icon: 'dashboard', action: 'home' },
    { label: 'Play Game', icon: 'play_circle', action: 'play' },
    { label: 'Profile', icon: 'account_circle', action: 'none', isActive: true },
    { label: 'Puzzle History', icon: 'history', action: 'history' },
];

const TREND_FILTERS: { label: string; value: TrendFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Hard', value: 'hard' },
  { label: 'Medium', value: 'medium' },
  { label: 'Easy', value: 'easy' },
  { label: 'Expert', value: 'expert' },
];

interface XpTier {
    name: string;
    threshold: number;
}

const XP_TIERS: XpTier[] = [
    { name: 'Rookie', threshold: 0 },
    { name: 'Apprentice', threshold: 2_000 },
    { name: 'Skilled', threshold: 6_000 },
    { name: 'Expert', threshold: 12_000 },
    { name: 'Master', threshold: 22_000 },
];

function toIsoDay(date: Date): string {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    const year = normalized.getFullYear();
    const month = `${normalized.getMonth() + 1}`.padStart(2, '0');
    const day = `${normalized.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function startOfWeek(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    const dayOffset = (normalized.getDay() + 6) % 7;
    normalized.setDate(normalized.getDate() - dayOffset);
    return normalized;
}

function formatAbsoluteDateTime(isoDate: string): string {
    const parsed = new Date(isoDate);
    if (!Number.isFinite(parsed.getTime())) return 'Unknown date';
    return parsed.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function formatMemberSince(isoDate: string): string {
    const parsed = new Date(isoDate);
    if (!Number.isFinite(parsed.getTime())) return 'this year';
    return parsed.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function formatRelativeTime(isoDate: string): string {
    const parsed = new Date(isoDate);
    if (!Number.isFinite(parsed.getTime())) return 'Unknown';

    const diffMs = Date.now() - parsed.getTime();
    if (diffMs <= 0) return 'Just now';

    const diffMinutes = Math.floor(diffMs / 60_000);
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function computeCurrentStreak(history: PuzzleHistoryEntry[]): number {
    if (history.length === 0) return 0;

    const days = new Set(
        history.map((entry) => toIsoDay(new Date(entry.completedAt)))
    );

    const sortedDays = [...days].sort((a, b) => (a < b ? 1 : -1));
    const firstDay = sortedDays[0];
    if (!firstDay) return 0;

    let streak = 0;
    const cursor = new Date(`${firstDay}T00:00:00`);

    while (days.has(toIsoDay(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}

function buildWeeklyTrend(history: PuzzleHistoryEntry[], filter: TrendFilter): WeeklyTrend {
    const thisWeekStart = startOfWeek(new Date());
    const weekStarts = Array.from({ length: 4 }, (_, index) => {
        const start = new Date(thisWeekStart);
        start.setDate(thisWeekStart.getDate() - (3 - index) * 7);
        return start;
    });

    const series = weekStarts.map((weekStart) => {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        const entries = history.filter((entry) => {
            if (filter !== 'all' && entry.difficulty !== filter) {
                return false;
            }
            const completedAt = new Date(entry.completedAt);
            return completedAt >= weekStart && completedAt < weekEnd;
        });

        if (entries.length === 0) return 0;

        const totalSeconds = entries.reduce((sum, entry) => sum + entry.elapsedTime, 0);
        return Math.max(1, Math.round((totalSeconds / entries.length) / 60));
    });

    const labels = weekStarts.map((weekStart) => (
        weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    ));

    return { series, labels };
}

function buildActivityGrid(history: PuzzleHistoryEntry[], rows: number, columns: number): number[][] {
    const cells = rows * columns;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyCounts = new Map<string, number>();
    history.forEach((entry) => {
        const key = toIsoDay(new Date(entry.completedAt));
        dailyCounts.set(key, (dailyCounts.get(key) ?? 0) + 1);
    });

    const rawValues: number[] = [];
    for (let offset = cells - 1; offset >= 0; offset -= 1) {
        const day = new Date(today);
        day.setDate(today.getDate() - offset);
        rawValues.push(dailyCounts.get(toIsoDay(day)) ?? 0);
    }

    const maxValue = Math.max(...rawValues, 0);
    const levels = rawValues.map((value) => {
        if (value === 0 || maxValue === 0) return 0;
        return Math.max(1, Math.min(4, Math.round((value / maxValue) * 4)));
    });

    return Array.from({ length: rows }, (_, rowIndex) => (
        levels.slice(rowIndex * columns, rowIndex * columns + columns)
    ));
}

function buildChartPaths(series: number[]): ChartPaths {
    const width = 640;
    const height = 250;
    const padX = 24;
    const padY = 18;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const stepX = series.length > 1 ? (width - padX * 2) / (series.length - 1) : 0;

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

function getTierProgress(totalXp: number): { tierName: string; progressPercent: number } {
    let currentTier = XP_TIERS[0];
    let nextTier = XP_TIERS[1];

    for (let index = 0; index < XP_TIERS.length; index += 1) {
        const tier = XP_TIERS[index];
        if (tier.threshold <= totalXp) {
            currentTier = tier;
            nextTier = XP_TIERS[index + 1];
        }
    }

    if (!nextTier) {
        return { tierName: currentTier.name, progressPercent: 100 };
    }

    const tierSpan = nextTier.threshold - currentTier.threshold;
    const currentTierXp = Math.max(0, totalXp - currentTier.threshold);
    const progressPercent = Math.max(0, Math.min(100, Math.round((currentTierXp / tierSpan) * 100)));

    return {
        tierName: currentTier.name,
        progressPercent,
    };
}

export function ProfilePage({
    onNavigateHome,
    onStartGame,
    onOpenPuzzle,
    profile,
    puzzleHistory,
    onUpdateProfile,
}: ProfilePageProps) {
    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const historySectionRef = useRef<HTMLElement | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [showFullHistory, setShowFullHistory] = useState(false);
    const [trendFilter, setTrendFilter] = useState<TrendFilter>('all');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [draftDisplayName, setDraftDisplayName] = useState(profile.displayName);
    const [draftAvatarDataUrl, setDraftAvatarDataUrl] = useState<string | null>(profile.avatarDataUrl);
    const [editError, setEditError] = useState<string | null>(null);

    const orderedHistory = useMemo(() => (
        [...puzzleHistory].sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    ), [puzzleHistory]);

    const filteredHistory = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        if (!normalizedQuery) return orderedHistory;

        return orderedHistory.filter((entry) => {
            const searchable = [
                entry.puzzleId.toString(),
                `#${entry.puzzleId}`,
                DIFFICULTY_LABELS[entry.difficulty],
                formatAbsoluteDateTime(entry.completedAt),
            ]
                .join(' ')
                .toLowerCase();

            return searchable.includes(normalizedQuery);
        });
    }, [orderedHistory, searchQuery]);

    const visibleHistory = showFullHistory ? filteredHistory : filteredHistory.slice(0, 6);
    const latestEntry = orderedHistory[0];

    const puzzlesSolved = orderedHistory.length;
    const currentStreak = computeCurrentStreak(orderedHistory);
    const totalScore = orderedHistory.reduce((sum, entry) => sum + entry.score, 0);
    const averageScore = puzzlesSolved > 0 ? Math.round(totalScore / puzzlesSolved) : 0;
    const averageHintsUsed = puzzlesSolved > 0
        ? orderedHistory.reduce((sum, entry) => sum + entry.hintsUsed, 0) / puzzlesSolved
        : 0;
    const estimatedAccuracy = puzzlesSolved > 0
        ? Math.max(70, 100 - averageHintsUsed * 6)
        : 100;

    const puzzlesThisWeek = useMemo(() => {
        const weekStart = startOfWeek(new Date());
        return orderedHistory.filter((entry) => new Date(entry.completedAt) >= weekStart).length;
    }, [orderedHistory]);

    const bestHardTime = useMemo(() => {
        const hardRuns = orderedHistory.filter((entry) => entry.difficulty === 'hard');
        if (hardRuns.length === 0) return null;
        return Math.min(...hardRuns.map((entry) => entry.elapsedTime));
    }, [orderedHistory]);

    const trend = useMemo(() => buildWeeklyTrend(orderedHistory, trendFilter), [orderedHistory, trendFilter]);
    const chart = useMemo(() => buildChartPaths(trend.series), [trend.series]);
    const activityGrid = useMemo(() => buildActivityGrid(orderedHistory, 4, 14), [orderedHistory]);

    const activityScore = orderedHistory
        .slice(0, 30)
        .reduce((sum, entry) => sum + entry.score, 0);

    const { tierName, progressPercent } = getTierProgress(totalScore);

    const statCards = [
        {
            label: 'Puzzles Solved',
            value: puzzlesSolved.toLocaleString(),
            note: `${puzzlesThisWeek} this week`,
            noteTone: 'positive',
            icon: 'extension',
        },
        {
            label: 'Current Streak',
            value: `${currentStreak} Day${currentStreak === 1 ? '' : 's'}`,
            note: currentStreak > 0 ? 'Keep it going' : 'Start your streak',
            noteTone: 'neutral',
            icon: 'local_fire_department',
        },
        {
            label: 'Best Time (Hard)',
            value: bestHardTime !== null ? formatTime(bestHardTime) : '--:--',
            note: bestHardTime !== null ? 'Fastest clear' : 'Complete a hard puzzle',
            noteTone: bestHardTime !== null ? 'positive' : 'neutral',
            icon: 'timer',
        },
        {
            label: 'Avg Score',
            value: averageScore.toLocaleString(),
            note: `${estimatedAccuracy.toFixed(1)}% est. accuracy`,
            noteTone: averageScore >= 1000 ? 'positive' : 'neutral',
            icon: 'target',
        },
    ] as const;

    const recentHighlights = [
        { label: 'Last Match', value: latestEntry ? formatRelativeTime(latestEntry.completedAt) : 'No matches yet' },
        {
            label: 'Last Puzzle',
            value: latestEntry ? `#${latestEntry.puzzleId} (${DIFFICULTY_LABELS[latestEntry.difficulty]})` : '--',
        },
        { label: 'Last Time', value: latestEntry ? formatTime(latestEntry.elapsedTime) : '--:--' },
        { label: 'Last Score', value: latestEntry ? latestEntry.score.toLocaleString() : '0' },
        { label: 'Hints Used', value: latestEntry ? latestEntry.hintsUsed.toString() : '0' },
    ] as const;

    const openProfileEditor = () => {
        setDraftDisplayName(profile.displayName);
        setDraftAvatarDataUrl(profile.avatarDataUrl);
        setEditError(null);
        setIsEditingProfile(true);
    };

    const closeProfileEditor = () => {
        setIsEditingProfile(false);
        setEditError(null);
    };

    const handleProfileSave = () => {
        const trimmedName = draftDisplayName.trim();
        if (!trimmedName) {
            setEditError('Display name cannot be empty.');
            return;
        }

        onUpdateProfile({
            ...profile,
            displayName: trimmedName.slice(0, 28),
            avatarDataUrl: draftAvatarDataUrl,
        });
        setIsEditingProfile(false);
        setEditError(null);
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setEditError('Please choose an image file.');
            return;
        }

        if (file.size > MAX_AVATAR_FILE_SIZE_BYTES) {
            setEditError('Photo must be smaller than 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setDraftAvatarDataUrl(reader.result);
                setEditError(null);
            } else {
                setEditError('Failed to read selected photo.');
            }
        };
        reader.onerror = () => {
            setEditError('Failed to read selected photo.');
        };
        reader.readAsDataURL(file);
    };

    const onSidebarClick = (action: SidebarAction) => {
        if (action === 'home') {
            onNavigateHome();
            return;
        }
        if (action === 'play') {
            onStartGame();
            return;
        }
        if (action === 'history') {
            setShowFullHistory(true);
            historySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const jumpToHistory = () => {
        setShowFullHistory(true);
        historySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                    <label className="profile-search" aria-label="Search puzzle history">
                        <span className="material-symbols-outlined" aria-hidden="true">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search puzzle #, difficulty, or date"
                        />
                    </label>

                    <div className="profile-userbar">
                        <button
                            type="button"
                            className="profile-icon-btn"
                            aria-label="Jump to full puzzle history"
                            onClick={jumpToHistory}
                        >
                            <span className="material-symbols-outlined">history</span>
                        </button>
                        <div className="profile-user-chip">
                            <div className="profile-user-copy">
                                <strong>{profile.displayName}</strong>
                                <small>{tierName} Tier</small>
                            </div>
                            <div className="profile-user-avatar">
                                {profile.avatarDataUrl ? (
                                    <img
                                        src={profile.avatarDataUrl}
                                        alt={`${profile.displayName} avatar`}
                                        className="profile-avatar-image"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined" aria-hidden="true">person</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="profile-content">
                    <section className="profile-hero">
                        <div className="profile-hero-main">
                            <div className="profile-avatar-block">
                                {profile.avatarDataUrl ? (
                                    <img
                                        src={profile.avatarDataUrl}
                                        alt={`${profile.displayName} avatar`}
                                        className="profile-avatar-photo"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined" aria-hidden="true">person</span>
                                )}
                            </div>
                            <div className="profile-identity">
                                <h1>{profile.displayName}</h1>
                                <p>{tierName} Tier • Member since {formatMemberSince(profile.memberSinceISO)}</p>
                                <div className="profile-pills">
                                    <span className="profile-pill profile-pill-global">
                                        <span className="material-symbols-outlined" aria-hidden="true">history</span>
                                        {puzzlesSolved} puzzles completed
                                    </span>
                                    <span className="profile-pill profile-pill-pro">
                                        <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
                                        {currentStreak} day streak
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="profile-edit-btn" onClick={isEditingProfile ? closeProfileEditor : openProfileEditor}>
                            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </section>

                    {isEditingProfile ? (
                        <section className="profile-edit-form" aria-label="Edit profile form">
                            <div className="profile-edit-field">
                                <label className="profile-edit-label" htmlFor="profile-display-name">Display Name</label>
                                <input
                                    id="profile-display-name"
                                    type="text"
                                    value={draftDisplayName}
                                    onChange={(event) => setDraftDisplayName(event.target.value)}
                                    className="profile-edit-input"
                                    maxLength={28}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="profile-edit-field">
                                <span className="profile-edit-label">Profile Photo</span>
                                <div className="profile-edit-avatar-actions">
                                    <button
                                        type="button"
                                        className="profile-edit-photo-btn"
                                        onClick={() => avatarInputRef.current?.click()}
                                    >
                                        Upload Photo
                                    </button>
                                    <button
                                        type="button"
                                        className="profile-edit-remove-btn"
                                        onClick={() => setDraftAvatarDataUrl(null)}
                                    >
                                        Remove Photo
                                    </button>
                                </div>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            {editError ? <p className="profile-edit-error">{editError}</p> : null}

                            <div className="profile-edit-actions">
                                <button type="button" className="profile-edit-cancel" onClick={closeProfileEditor}>
                                    Cancel
                                </button>
                                <button type="button" className="profile-edit-save" onClick={handleProfileSave}>
                                    Save Changes
                                </button>
                            </div>
                        </section>
                    ) : null}

                    <section className="profile-stats-grid" aria-label="Performance summary">
                        {statCards.map((card) => (
                            <article key={card.label} className="profile-stat-card">
                                <div className="profile-stat-head">
                                    <span>{card.label}</span>
                                    <span className="material-symbols-outlined" aria-hidden="true">{card.icon}</span>
                                </div>
                                <div className="profile-stat-value">{card.value}</div>
                                <span className={`profile-stat-note tone-${card.noteTone}`}>{card.note}</span>
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
                                        <p>Average completion time (minutes) over the last four weeks</p>
                                    </div>
                                    <div className="profile-chart-chips">
                                        {TREND_FILTERS.map((item) => (
                                            <button
                                                key={item.value}
                                                type="button"
                                                className={item.value === trendFilter ? 'is-active' : ''}
                                                onClick={() => setTrendFilter(item.value)}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
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
                                        {chart.points.map((point) => (
                                            <circle
                                                key={`${point.x}-${point.y}`}
                                                cx={point.x}
                                                cy={point.y}
                                                r="5"
                                                className="profile-chart-point"
                                            />
                                        ))}
                                    </svg>
                                </div>

                                <footer className="profile-chart-axis">
                                    {trend.labels.map((label) => (
                                        <span key={label}>{label}</span>
                                    ))}
                                </footer>
                            </article>

                            <article className="profile-panel profile-activity-panel">
                                <header className="profile-panel-header">
                                    <h3>Activity Calendar</h3>
                                    <span className="material-symbols-outlined" aria-hidden="true">calendar_month</span>
                                </header>

                                <div className="profile-activity-grid">
                                    {activityGrid.map((row, rowIndex) => (
                                        <div key={`row-${rowIndex}`} className="profile-activity-row">
                                            {row.map((cellLevel, cellIndex) => (
                                                <span
                                                    key={`cell-${rowIndex}-${cellIndex}`}
                                                    className="profile-activity-cell"
                                                    style={{ opacity: cellLevel === 0 ? 0.12 : 0.24 + cellLevel * 0.17 }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="profile-activity-legend">
                                    <span>Less active</span>
                                    <div>
                                        {[1, 2, 3, 4].map((level) => (
                                            <span key={level} style={{ opacity: 0.18 + level * 0.2 }} />
                                        ))}
                                    </div>
                                    <span>More active</span>
                                </div>

                                <div className="profile-xp-block">
                                    <small>Current Activity Score</small>
                                    <div className="profile-xp-line">
                                        <strong>{activityScore.toLocaleString()} XP</strong>
                                        <span>{tierName} Tier</span>
                                    </div>
                                    <div className="profile-xp-progress" role="presentation">
                                        <div style={{ width: `${progressPercent}%` }} />
                                    </div>
                                </div>
                            </article>
                        </div>
                    </section>

                    <section className="profile-section" ref={historySectionRef}>
                        <div className="profile-section-header">
                            <h2>Recent Activity &amp; Highlights</h2>
                            <button
                                type="button"
                                className="profile-history-link"
                                onClick={() => setShowFullHistory((current) => !current)}
                            >
                                {showFullHistory ? 'Show Recent' : 'Full Match History'}
                            </button>
                        </div>

                        <div className="profile-recent-grid">
                            {recentHighlights.map((item) => (
                                <article key={item.label} className="profile-recent-card">
                                    <small>{item.label}</small>
                                    <strong>{item.value}</strong>
                                </article>
                            ))}
                        </div>

                        {visibleHistory.length === 0 ? (
                            <p className="profile-history-empty">
                                No puzzle history found yet. Complete a puzzle to see it here.
                            </p>
                        ) : (
                            <div className="profile-history-list">
                                {visibleHistory.map((entry) => (
                                    <article key={entry.id} className="profile-history-item">
                                        <div className="profile-history-main">
                                            <strong>Puzzle #{entry.puzzleId}</strong>
                                            <small>{DIFFICULTY_LABELS[entry.difficulty]} • {formatAbsoluteDateTime(entry.completedAt)}</small>
                                        </div>
                                        <div className="profile-history-stat">
                                            <small>Time</small>
                                            <strong>{formatTime(entry.elapsedTime)}</strong>
                                        </div>
                                        <div className="profile-history-stat">
                                            <small>Score</small>
                                            <strong>{entry.score.toLocaleString()}</strong>
                                        </div>
                                        <div className="profile-history-stat">
                                            <small>Hints</small>
                                            <strong>{entry.hintsUsed}</strong>
                                        </div>
                                        <button
                                            type="button"
                                            className="profile-history-open-btn"
                                            onClick={() => onOpenPuzzle(entry.puzzleId)}
                                        >
                                            Open
                                        </button>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
