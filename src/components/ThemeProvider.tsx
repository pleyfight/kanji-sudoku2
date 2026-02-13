// Theme Provider - Manages light/dark/auto theme modes
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { safeStorage } from '../lib/safeStorage';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'kudoko_theme';

// Uses browser/device local time.
function shouldUseDarkByTime(): boolean {
    const hour = new Date().getHours();
    // Dark mode between 6 PM (18:00) and 6 AM (06:00)
    return hour >= 18 || hour < 6;
}

function getMsUntilNextThemeBoundary(now: Date = new Date()): number {
    const next = new Date(now);
    const hour = now.getHours();
    const nextBoundaryHour = hour < 6 ? 6 : hour < 18 ? 18 : 30;
    next.setHours(nextBoundaryHour, 0, 0, 0);
    return Math.max(1, next.getTime() - now.getTime());
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load saved preference or default to 'auto'
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const saved = safeStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'auto') {
            return saved;
        }
        return 'auto';
    });

    // Track actual dark state (resolved from mode)
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (mode === 'auto') {
            return shouldUseDarkByTime();
        }
        return mode === 'dark';
    });

    // Update mode and persist
    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
        safeStorage.setItem(STORAGE_KEY, newMode);
    }, []);

    // Effect to update isDark when mode changes or device time crosses 06:00/18:00.
    useEffect(() => {
        const updateDarkState = () => {
            if (mode === 'light') {
                setIsDark(false);
            } else if (mode === 'dark') {
                setIsDark(true);
            } else {
                setIsDark(shouldUseDarkByTime());
            }
        };

        updateDarkState();

        let timeoutId: number | undefined;
        if (mode === 'auto') {
            const scheduleNextUpdate = () => {
                timeoutId = window.setTimeout(() => {
                    updateDarkState();
                    scheduleNextUpdate();
                }, getMsUntilNextThemeBoundary());
            };
            scheduleNextUpdate();
        }

        return () => {
            if (timeoutId) window.clearTimeout(timeoutId);
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
