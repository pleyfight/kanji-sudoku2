// Theme Provider - Manages light/dark/auto theme modes
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'kudoko_theme';

// Check if we should use dark mode based on current time
function shouldUseDarkByTime(): boolean {
    const hour = new Date().getHours();
    // Dark mode between 6 PM (18:00) and 6 AM (06:00)
    return hour >= 18 || hour < 6;
}

// Check system preference
function getSystemPreference(): boolean {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load saved preference or default to 'auto'
    const [mode, setModeState] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'light' || saved === 'dark' || saved === 'auto') {
                return saved;
            }
        }
        return 'auto';
    });

    // Track actual dark state (resolved from mode)
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (mode === 'auto') {
            return shouldUseDarkByTime() || getSystemPreference();
        }
        return mode === 'dark';
    });

    // Update mode and persist
    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem(STORAGE_KEY, newMode);
    }, []);

    // Effect to update isDark when mode changes or time passes
    useEffect(() => {
        const updateDarkState = () => {
            if (mode === 'light') {
                setIsDark(false);
            } else if (mode === 'dark') {
                setIsDark(true);
            } else {
                // Auto mode - check time and system preference
                setIsDark(shouldUseDarkByTime() || getSystemPreference());
            }
        };

        updateDarkState();

        // For auto mode, check every minute
        let interval: number | undefined;
        if (mode === 'auto') {
            interval = window.setInterval(updateDarkState, 60000);
        }

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (mode === 'auto') {
                updateDarkState();
            }
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            if (interval) clearInterval(interval);
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [mode]);

    // Apply dark class to document
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ mode, isDark, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => { // eslint-disable-line react-refresh/only-export-components
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
