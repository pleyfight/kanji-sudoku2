import React, { useState } from 'react';

interface LoginPageProps {
    language: 'en' | 'ja';
    onLogin: () => void;
    onContinueAsGuest: () => void;
    settingsSlot?: React.ReactNode;
    authSlot?: React.ReactNode;
}

const LABELS = {
    en: {
        brand: 'Kudoku',
        howToPlay: 'How to Play',
        emailOrUsername: 'Email or Username',
        emailPlaceholder: 'Enter your credentials',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        forgotPassword: 'Forgot Password?',
        login: 'Login',
        orContinue: 'Or Continue With',
        continueGoogle: 'Continue with Google',
        continueDiscord: 'Continue with Discord',
        newHere: 'New to Kudoku?',
        createAccount: 'Create an Account',
        terms: 'Terms',
        privacy: 'Privacy',
        contact: 'Contact',
        continueGuest: 'Continue as Guest',
    },
    ja: {
        brand: '漢字数独',
        howToPlay: '遊び方',
        emailOrUsername: 'メールまたはユーザー名',
        emailPlaceholder: '認証情報を入力',
        password: 'パスワード',
        passwordPlaceholder: '••••••••',
        forgotPassword: 'パスワードを忘れた場合',
        login: 'ログイン',
        orContinue: 'または',
        continueGoogle: 'Googleで続行',
        continueDiscord: 'Discordで続行',
        newHere: '初めてですか？',
        createAccount: 'アカウント作成',
        terms: '利用規約',
        privacy: 'プライバシー',
        contact: 'お問い合わせ',
        continueGuest: 'ゲストとして続行',
    },
};

export function LoginPage({
    language,
    onLogin,
    onContinueAsGuest,
    settingsSlot,
    authSlot,
}: LoginPageProps) {
    const t = LABELS[language];
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!identifier.trim() || !password.trim()) return;
        onLogin();
    };

    return (
        <div className="auth-login">
            <div className="auth-login-kanji" aria-hidden="true">道</div>

            <header className="auth-login-header">
                <button className="auth-login-brand" onClick={onContinueAsGuest}>
                    <div className="auth-login-brand-icon">
                        <span className="material-symbols-outlined text-lg">grid_view</span>
                    </div>
                    <span className="auth-login-brand-text">{t.brand}</span>
                </button>
                <div className="auth-login-header-actions">
                    <button className="auth-login-header-link" onClick={onContinueAsGuest}>
                        {t.howToPlay}
                    </button>
                    {settingsSlot}
                    {authSlot}
                </div>
            </header>

            <main className="auth-login-main">
                <section className="auth-login-shell">
                    <div className="auth-login-logo">
                        <span className="material-symbols-outlined text-2xl">grid_view</span>
                    </div>
                    <h1 className="auth-login-title">K U D O K U</h1>

                    <form className="auth-login-form" onSubmit={handleSubmit}>
                        <div className="auth-login-field">
                            <label className="auth-login-label" htmlFor="identifier">
                                {t.emailOrUsername}
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                value={identifier}
                                onChange={(event) => setIdentifier(event.target.value)}
                                placeholder={t.emailPlaceholder}
                                className="auth-login-input"
                                autoComplete="username"
                            />
                        </div>

                        <div className="auth-login-field">
                            <div className="auth-login-field-row">
                                <label className="auth-login-label" htmlFor="password">
                                    {t.password}
                                </label>
                                <button type="button" className="auth-login-inline-link">
                                    {t.forgotPassword}
                                </button>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder={t.passwordPlaceholder}
                                className="auth-login-input"
                                autoComplete="current-password"
                            />
                        </div>

                        <button type="submit" className="auth-login-submit">
                            {t.login}
                        </button>

                        <div className="auth-login-divider">
                            <span>{t.orContinue}</span>
                        </div>

                        <button type="button" className="auth-login-social">
                            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>{t.continueGoogle}</span>
                        </button>

                        <button type="button" className="auth-login-social">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                                <path d="M20.317 4.37a19.77 19.77 0 00-4.885-1.515.074.074 0 00-.078.037 17.5 17.5 0 00-.608 1.249 18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.249.077.077 0 00-.078-.037A19.74 19.74 0 003.68 4.37a.07.07 0 00-.032.028C.533 9.046-.32 13.58.1 18.058a.082.082 0 00.031.056c2.053 1.508 4.041 2.423 5.993 3.029a.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106 12.3 12.3 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.011c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.198.373.292a.077.077 0 01-.007.128c-.598.343-1.22.644-1.873.891a.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.029c1.961-.607 3.95-1.522 6.002-3.029a.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.548-13.661a.062.062 0 00-.031-.028z" />
                            </svg>
                            <span>{t.continueDiscord}</span>
                        </button>
                    </form>

                    <button type="button" className="auth-login-guest" onClick={onContinueAsGuest}>
                        {t.continueGuest}
                    </button>

                    <div className="auth-login-footer">
                        <p>
                            {t.newHere} <button type="button" className="auth-login-accent-link">{t.createAccount}</button>
                        </p>
                        <div className="auth-login-legal">
                            <button type="button">{t.terms}</button>
                            <button type="button">{t.privacy}</button>
                            <button type="button">{t.contact}</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
