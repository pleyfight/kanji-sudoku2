// MobileLogin - Login screen for mobile devices
// Matches reference designs: 5.png, 6.png (dark), 10.png, 15.png (light)
import React, { useState } from 'react';

interface MobileLoginProps {
    onLogin: () => void;
    onNavigateHome: () => void;
    settingsSlot?: React.ReactNode;
}

export const MobileLogin: React.FC<MobileLoginProps> = ({
    onLogin,
    onNavigateHome,
    settingsSlot,
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="mobile-login">
            {/* Header */}
            <header className="mobile-login-header">
                <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
                    <div
                        className="w-8 h-8 flex items-center justify-center"
                        style={{ background: 'var(--accent)' }}
                    >
                        <span className="material-symbols-outlined text-sm" style={{ color: 'var(--accent-contrast)' }}>
                            grid_view
                        </span>
                    </div>
                    <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-primary)' }}>
                        Kudoku
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
                        How to Play
                    </button>
                    {settingsSlot}
                </div>
            </header>

            {/* Login Form */}
            <main className="mobile-login-content">
                <div className="mobile-login-branding">
                    <div
                        className="w-16 h-16 flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'var(--accent)' }}
                    >
                        <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--accent-contrast)' }}>
                            grid_view
                        </span>
                    </div>
                    <h1 className="text-lg font-bold tracking-[0.4em] uppercase" style={{ color: 'var(--text-primary)' }}>
                        K U D O K U
                    </h1>
                </div>

                <div className="mobile-login-form">
                    <div className="mobile-input-group">
                        <label className="mobile-input-label">Email or Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mobile-input"
                        />
                    </div>

                    <div className="mobile-input-group">
                        <label className="mobile-input-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mobile-input"
                        />
                    </div>

                    <button
                        onClick={onLogin}
                        className="mobile-login-btn"
                    >
                        LOGIN
                    </button>

                    <button className="mobile-forgot-link">
                        FORGOT PASSWORD?
                    </button>

                    <div className="mobile-divider">
                        <div className="mobile-divider-line" />
                        <span className="mobile-divider-text">OR</span>
                        <div className="mobile-divider-line" />
                    </div>

                    <button className="mobile-social-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>CONTINUE WITH GOOGLE</span>
                    </button>

                    <button className="mobile-social-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                        </svg>
                        <span>CONTINUE WITH DISCORD</span>
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="mobile-login-footer">
                <span style={{ color: 'var(--text-muted)' }}>NEW HERE?</span>
                {' '}
                <button style={{ color: 'var(--accent)', fontWeight: 700 }}>SIGN UP</button>
            </footer>
        </div>
    );
};
