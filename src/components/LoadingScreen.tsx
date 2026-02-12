import type { AppLabels } from '../lib/labels';

interface LoadingScreenProps {
    labels: AppLabels;
}

export function LoadingScreen({ labels }: LoadingScreenProps) {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
        >
            <div className="text-center">
                <div className="text-4xl mb-4" style={{ animation: 'pulse 2s ease-in-out infinite' }}>漢</div>
                <p className="text-lg font-medium">{labels.loading}</p>
            </div>
        </div>
    );
}
