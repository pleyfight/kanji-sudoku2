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
            className="app-icon-circle-btn"
            aria-label={label}
            title={label}
        >
            <span className="material-symbols-outlined app-icon-circle-glyph" aria-hidden="true">
                {icon}
            </span>
        </button>
    );
}
