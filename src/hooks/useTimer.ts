// Timer utilities — formatTime is used by VictoryModal, Timer, and gameState.
// The useTimer hook was extracted but never integrated; only formatTime is kept.

/**
 * Format time as MM:SS
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
