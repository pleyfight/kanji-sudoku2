// Structured client-side logger for Kudoku.
//
// Provides consistent taxonomy, session correlation, and structured payloads.
// All output is DEV-only by default (stripped from production builds via tree-shaking).
//
// Usage:
//   import { logger } from './logger';
//   logger.info('puzzles', 'Loaded puzzle pool', { count: 100 });
//   logger.warn('storage', 'localStorage quota exceeded');
//   logger.error('game', 'Failed to load puzzles', { error: err });

// ─── Types ───────────────────────────────────────────────────────────────────

/** Log severity levels */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Component tags for log categorization */
export type LogComponent =
    | 'game'       // Game state, lifecycle
    | 'puzzles'    // Puzzle loading, selection, shuffling
    | 'storage'    // localStorage operations
    | 'ui'         // Rendering, user interactions
    | 'init'       // App initialization, startup
    | 'validation' // Input validation, solution checking
    | 'network';   // Fetch operations

/** Structured log entry */
export interface LogEntry {
    ts: string;          // ISO 8601 timestamp
    level: LogLevel;
    component: LogComponent;
    message: string;
    sessionId: string;   // Correlation ID for the browser session
    data?: Record<string, unknown>;
}

// ─── Session ID ──────────────────────────────────────────────────────────────

/** Generate a short random session ID (8 hex chars). */
function generateSessionId(): string {
    return Math.random().toString(16).slice(2, 10);
}

// One session ID per page load — survives SPA navigation but resets on refresh.
const SESSION_ID = generateSessionId();

/** Get the current session correlation ID. */
export function getSessionId(): string {
    return SESSION_ID;
}

// ─── Logger ──────────────────────────────────────────────────────────────────

function createEntry(
    level: LogLevel,
    component: LogComponent,
    message: string,
    data?: Record<string, unknown>,
): LogEntry {
    return {
        ts: new Date().toISOString(),
        level,
        component,
        message,
        sessionId: SESSION_ID,
        ...(data !== undefined ? { data } : {}),
    };
}

const LEVEL_FN: Record<LogLevel, 'debug' | 'log' | 'warn' | 'error'> = {
    debug: 'debug',
    info: 'log',
    warn: 'warn',
    error: 'error',
};

function emit(entry: LogEntry): void {
    const fn = LEVEL_FN[entry.level];
    // eslint-disable-next-line no-console
    console[fn](`[Kudoku:${entry.component}]`, entry.message, entry.data ?? '');
}

/**
 * Structured logger for client-side observability.
 *
 * - `debug`, `info`, `warn` are DEV-only (no-op in production).
 * - `error` always emits (errors should be visible in production console).
 */
export const logger = {
    debug(component: LogComponent, message: string, data?: Record<string, unknown>): void {
        if (import.meta.env.DEV) {
            emit(createEntry('debug', component, message, data));
        }
    },

    info(component: LogComponent, message: string, data?: Record<string, unknown>): void {
        if (import.meta.env.DEV) {
            emit(createEntry('info', component, message, data));
        }
    },

    warn(component: LogComponent, message: string, data?: Record<string, unknown>): void {
        if (import.meta.env.DEV) {
            emit(createEntry('warn', component, message, data));
        }
    },

    error(component: LogComponent, message: string, data?: Record<string, unknown>): void {
        // Errors always emit — visible in production for debugging
        emit(createEntry('error', component, message, data));
    },
};
