import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface unexpected UI failures in dev tooling.
    console.error('UI error boundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center px-6"
          style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
        >
          <div className="max-w-lg text-center">
            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Please refresh the page. If this keeps happening, contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
