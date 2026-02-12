// MobileBottomNav - Bottom navigation bar for mobile devices
// 3-tab layout: Home, Play, Profile
import React from 'react';

export type MobileView = 'home' | 'game' | 'login' | 'profile' | 'leaderboard' | 'settings';

interface MobileBottomNavProps {
    activeView: MobileView;
    onNavigate: (view: MobileView) => void;
}

const NAV_ITEMS: { view: MobileView; icon: string; label: string }[] = [
    { view: 'home', icon: 'grid_view', label: 'Home' },
    { view: 'game', icon: 'extension', label: 'Play' },
    { view: 'profile', icon: 'person', label: 'Profile' },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    activeView,
    onNavigate,
}) => {
    // Map leaderboard/settings/login to their parent tab
    const getActiveTab = (): MobileView => {
        if (activeView === 'login' || activeView === 'leaderboard' || activeView === 'settings') return 'home';
        return activeView;
    };

    const activeTab = getActiveTab();

    return (
        <nav className="mobile-bottom-nav">
            {NAV_ITEMS.map((item) => (
                <button
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    className={`mobile-nav-item ${activeTab === item.view ? 'active' : ''}`}
                >
                    <span className="material-symbols-outlined mobile-nav-icon">
                        {item.icon}
                    </span>
                    {activeTab === item.view && <span className="mobile-nav-dot" />}
                </button>
            ))}
        </nav>
    );
};
