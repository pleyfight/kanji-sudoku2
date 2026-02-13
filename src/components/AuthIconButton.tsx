interface AuthIconButtonProps {
    isAuthenticated: boolean;
    onClick?: () => void;
}

export function AuthIconButton({ isAuthenticated, onClick }: AuthIconButtonProps) {
    const icon = isAuthenticated ? 'account_circle' : 'login';
    const label = isAuthenticated ? 'Profile' : 'Login';

    return (
        <button
            onClick={onClick}
            className="h-10 w-10 inline-flex items-center justify-center rounded-full border leading-none shrink-0"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}
            aria-label={label}
            title={label}
        >
            <span className="material-symbols-outlined block text-[20px]">{icon}</span>
        </button>
    );
}
