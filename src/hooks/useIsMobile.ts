// Custom hook for mobile device detection
// Extracted from App.tsx following SRP

import { useState, useEffect } from 'react';

/**
 * Detects if the current device is mobile.
 * Uses both screen width and touch capability heuristics.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}
