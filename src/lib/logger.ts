// Structured client-side logger for Kudoku.
//
// Provides consistent taxonomy, session correlation, and structured payloads.
// All output is DEV-only by default (stripped from production builds via tree-shaking).
//
// Usage:
//   import { logger, LOG_EVENTS } from './logger';
//   logger.info('puzzles', LOG_EVENTS.PUZZLES_POOL_INITIALIZED, 'Loaded puzzle pool', { count: 100 });
//   logger.warn('storage', LOG_EVENTS.STORAGE_SET_FAILED, 'localStorage quota exceeded');
//   logger.error('game', LOG_EVENTS.PUZZLES_INIT_FAILED, 'Failed to load puzzles', { error: err });

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

/** Canonical log event names for client observability. */
export const LOG_EVENTS = {
    APP_UNHANDLED_ERROR: 'app.unhandled_error',
    APP_UNHANDLED_REJECTION: 'app.unhandled_rejection',
    APP_INIT_FAILURE: 'app.init_failure',
    GAME_PUZZLE_SKIPPED: 'game.puzzle_skipped',
    PUZZLES_POOL_INITIALIZED: 'puzzles.pool_initialized',
    PUZZLES_BAG_RESHUFFLED: 'puzzles.bag_reshuffled',
    PUZZLES_INIT_FAILED: 'puzzles.init_failed',
    STORAGE_GET_FAILED: 'storage.get_failed',
    STORAGE_SET_FAILED: 'storage.set_failed',
    STORAGE_REMOVE_FAILED: 'storage.remove_failed',
    STORAGE_PARSE_FAILED: 'storage.parse_failed',
    STORAGE_SCHEMA_INVALID: 'storage.schema_invalid',
    STORAGE_STRINGIFY_FAILED: 'storage.stringify_failed',
    UI_ERROR_BOUNDARY: 'ui.error_boundary',
} as const;

/** Event name taxonomy for structured log entries. */
export type LogEvent = typeof LOG_EVENTS[keyof typeof LOG_EVENTS];

/** Additional context shared across log events. */
export type LogContext = {
    feature?: string;
    puzzleId?: number;
    difficulty?: string;
    route?: string;
    source?: string;
    [key: string]: unknown;
};

/** Structured log entry */
export interface LogEntry {
    ts: string;          // ISO 8601 timestamp
    level: LogLevel;
    component: LogComponent;
    event: LogEvent;
    message: string;
    sessionId: string;   // Session-scoped ID for the browser tab
    correlationId: string; // Request/flow correlation (defaults to session)
    context?: LogContext;
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
    event: LogEvent,
    message: string,
    data?: Record<string, unknown>,
    context?: LogContext,
): LogEntry {
    return {
        ts: new Date().toISOString(),
        level,
        component,
        event,
        message,
        sessionId: SESSION_ID,
        correlationId: SESSION_ID,
        ...(context ? { context } : {}),
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
    console[fn](
        `[Kudoku:${entry.component}]`,
        entry.event,
        entry.message,
        entry.data ?? '',
        entry.context ?? '',
    );
}

/**
 * Structured logger for client-side observability.
 *
 * - `debug`, `info`, `warn` are DEV-only (no-op in production).
 * - `error` always emits (errors should be visible in production console).
 */
export const logger = {
    debug(
        component: LogComponent,
        event: LogEvent,
        message: string,
        data?: Record<string, unknown>,
        context?: LogContext,
    ): void {
        if (import.meta.env.DEV) {
            emit(createEntry('debug', component, event, message, data, context));
        }
    },

    info(
        component: LogComponent,
        event: LogEvent,
        message: string,
        data?: Record<string, unknown>,
        context?: LogContext,
    ): void {
        if (import.meta.env.DEV) {
            emit(createEntry('info', component, event, message, data, context));
        }
    },

    warn(
        component: LogComponent,
        event: LogEvent,
        message: string,
        data?: Record<string, unknown>,
        context?: LogContext,
    ): void {
        if (import.meta.env.DEV) {
            emit(createEntry('warn', component, event, message, data, context));
        }
    },

    error(
        component: LogComponent,
        event: LogEvent,
        message: string,
        data?: Record<string, unknown>,
        context?: LogContext,
    ): void {
        // Errors always emit — visible in production for debugging
        emit(createEntry('error', component, event, message, data, context));
    },
};
