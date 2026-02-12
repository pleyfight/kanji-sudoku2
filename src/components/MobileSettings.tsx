// MobileSettings - Settings screen for mobile devices
// Matches reference designs: 9.png (dark), 14.png (light)
import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';

interface MobileSettingsProps {
    onClose: () => void;
}

export const MobileSettings: React.FC<MobileSettingsProps> = ({
    onClose,
}) => {
    const { mode, setMode } = useTheme();
    const [showMistakes, setShowMistakes] = useState(true);
    const [highlightConflicts, setHighlightConflicts] = useState(true);
    const [displayTimer, setDisplayTimer] = useState(true);
    const [email] = useState('player@kudoku.com');
    const [displayName, setDisplayName] = useState('ZenMaster99');

    return (
        <div className="mobile-settings">
            {/* Header */}
            <header className="mobile-settings-header">
                <div>
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        SETTINGS
                    </h1>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-1" style={{ color: 'var(--text-muted)' }}>
                        Personalize Your Experience
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="mobile-server-badge">
                        <span className="mobile-server-dot" />
                        SERVER: ONLINE
                    </span>
                    <button onClick={onClose} className="mobile-icon-btn">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>

            <main className="mobile-settings-content">
                {/* Account Section */}
                <section className="mobile-settings-section">
                    <h2 className="mobile-settings-section-title">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>account_circle</span>
                        ACCOUNT
                    </h2>
                    <div className="mobile-settings-card">
                        <div className="mobile-settings-field">
                            <label className="mobile-settings-label">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="mobile-settings-input"
                            />
                        </div>
                        <div className="mobile-settings-field">
                            <label className="mobile-settings-label">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="mobile-settings-input"
                            />
                        </div>
                        <button className="mobile-change-password-btn">
                            CHANGE PASSWORD
                        </button>
                    </div>
                </section>

                {/* Gameplay Section */}
                <section className="mobile-settings-section">
                    <h2 className="mobile-settings-section-title">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>extension</span>
                        GAMEPLAY
                    </h2>
                    <div className="mobile-settings-card">
                        <div className="mobile-toggle-row">
                            <div>
                                <span className="mobile-toggle-title">Show Mistakes</span>
                                <span className="mobile-toggle-desc">Highlight incorrect Kanji placement immediately</span>
                            </div>
                            <button
                                onClick={() => setShowMistakes(!showMistakes)}
                                className={`mobile-toggle ${showMistakes ? 'on' : ''}`}
                            >
                                <span className="mobile-toggle-knob" />
                            </button>
                        </div>
                        <div className="mobile-toggle-row">
                            <div>
                                <span className="mobile-toggle-title">Highlight Conflicts</span>
                                <span className="mobile-toggle-desc">Dim matching characters in same row/col</span>
                            </div>
                            <button
                                onClick={() => setHighlightConflicts(!highlightConflicts)}
                                className={`mobile-toggle ${highlightConflicts ? 'on' : ''}`}
                            >
                                <span className="mobile-toggle-knob" />
                            </button>
                        </div>
                        <div className="mobile-toggle-row">
                            <div>
                                <span className="mobile-toggle-title">Display Timer</span>
                                <span className="mobile-toggle-desc">Show elapsed time during gameplay</span>
                            </div>
                            <button
                                onClick={() => setDisplayTimer(!displayTimer)}
                                className={`mobile-toggle ${displayTimer ? 'on' : ''}`}
                            >
                                <span className="mobile-toggle-knob" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="mobile-settings-section">
                    <h2 className="mobile-settings-section-title">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>palette</span>
                        APPEARANCE
                    </h2>
                    <div className="mobile-settings-card">
                        <div className="mobile-settings-row">
                            <div className="mobile-settings-field" style={{ flex: 1 }}>
                                <label className="mobile-settings-label">Theme Mode</label>
                                <select
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'auto')}
                                    className="mobile-settings-select"
                                >
                                    <option value="light">Light Mode</option>
                                    <option value="dark">Dark Mode</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>
                            <div className="mobile-settings-field" style={{ flex: 1 }}>
                                <label className="mobile-settings-label">Kanji Font</label>
                                <select className="mobile-settings-select">
                                    <option value="noto-serif">Noto Serif</option>
                                    <option value="noto-sans">Noto Sans</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Actions */}
            <footer className="mobile-settings-footer">
                <button onClick={onClose} className="mobile-discard-btn">
                    DISCARD
                </button>
                <button onClick={onClose} className="mobile-save-btn">
                    SAVE ALL CHANGES
                </button>
            </footer>
        </div>
    );
};
