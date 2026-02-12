import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger, getSessionId } from '../lib/logger';

describe('logger', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('getSessionId', () => {
        it('returns an 8-character hex string', () => {
            const id = getSessionId();
            expect(id).toMatch(/^[0-9a-f]{1,8}$/);
        });

        it('returns the same ID across multiple calls (stable per session)', () => {
            expect(getSessionId()).toBe(getSessionId());
        });
    });

    describe('logger.info', () => {
        it('calls console.log with structured prefix', () => {
            const spy = vi.spyOn(console, 'log').mockImplementation(() => { });
            logger.info('game', 'test message');
            expect(spy).toHaveBeenCalledWith(
                '[Kudoku:game]',
                'test message',
                '',
            );
        });

        it('passes data when provided', () => {
            const spy = vi.spyOn(console, 'log').mockImplementation(() => { });
            logger.info('puzzles', 'loaded', { count: 50 });
            expect(spy).toHaveBeenCalledWith(
                '[Kudoku:puzzles]',
                'loaded',
                { count: 50 },
            );
        });
    });

    describe('logger.warn', () => {
        it('calls console.warn with structured prefix', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            logger.warn('storage', 'quota exceeded');
            expect(spy).toHaveBeenCalledWith(
                '[Kudoku:storage]',
                'quota exceeded',
                '',
            );
        });
    });

    describe('logger.error', () => {
        it('calls console.error with structured prefix', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            logger.error('init', 'failed to boot', { error: 'timeout' });
            expect(spy).toHaveBeenCalledWith(
                '[Kudoku:init]',
                'failed to boot',
                { error: 'timeout' },
            );
        });
    });

    describe('logger.debug', () => {
        it('calls console.debug with structured prefix', () => {
            const spy = vi.spyOn(console, 'debug').mockImplementation(() => { });
            logger.debug('validation', 'checking cell', { row: 0, col: 1 });
            expect(spy).toHaveBeenCalledWith(
                '[Kudoku:validation]',
                'checking cell',
                { row: 0, col: 1 },
            );
        });
    });
});
