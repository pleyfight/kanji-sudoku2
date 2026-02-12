import { describe, it, expect } from 'vitest';
import { formatTime } from '../hooks/useTimer';

describe('formatTime', () => {
    it('formats 0 seconds', () => {
        expect(formatTime(0)).toBe('00:00');
    });

    it('formats seconds under a minute', () => {
        expect(formatTime(5)).toBe('00:05');
        expect(formatTime(59)).toBe('00:59');
    });

    it('formats exactly one minute', () => {
        expect(formatTime(60)).toBe('01:00');
    });

    it('formats minutes and seconds', () => {
        expect(formatTime(90)).toBe('01:30');
        expect(formatTime(125)).toBe('02:05');
    });

    it('formats over an hour', () => {
        expect(formatTime(3600)).toBe('60:00');
        expect(formatTime(3661)).toBe('61:01');
    });

    it('pads single digits with leading zero', () => {
        expect(formatTime(61)).toBe('01:01');
        expect(formatTime(9)).toBe('00:09');
    });
});
