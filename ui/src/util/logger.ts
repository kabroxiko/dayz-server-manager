// Enhanced logger for UI components with environment-based configuration
import { environment } from '../environments/environment';

// eslint-disable-next-line no-shadow
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    IMPORTANT = 2,
    WARN = 3,
    ERROR = 4,
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const LogLevelNames = [
    'DEBUG    ',
    'INFO     ',
    'IMPORTANT',
    'WARN     ',
    'ERROR    ',
];

// eslint-disable-next-line @typescript-eslint/naming-convention
const LogLevelColors = [
    'color: #888', // DEBUG - gray
    'color: #333', // INFO - dark gray
    'color: #000; font-weight: bold', // IMPORTANT - black bold
    'color: #ff6600', // WARN - orange
    'color: #cc0000', // ERROR - red
];

export class Logger {
    public readonly MAX_CONTEXT_LENGTH = 12;
    private context: string;
    private minLevel: LogLevel;

    constructor(context: string, minLevel?: LogLevel) {
        this.context = context;
        // In production, only show WARN and ERROR by default
        this.minLevel = minLevel ?? (environment.production ? LogLevel.WARN : LogLevel.DEBUG);
    }

    private formatContext(context: string): string {
        if (context.length <= this.MAX_CONTEXT_LENGTH) {
            return context.padEnd(this.MAX_CONTEXT_LENGTH, ' ');
        }
        return context.slice(0, this.MAX_CONTEXT_LENGTH);
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.minLevel;
    }

    public log(level: LogLevel, msg: string, ...data: any[]): void {
        if (!this.shouldLog(level)) {
            return;
        }

        const date = new Date().toISOString();
        const fmt = `@${date} | ${LogLevelNames[level]} | ${this.formatContext(this.context)} | ${msg}`;

        switch (level) {
            case LogLevel.DEBUG:
                console.log(`%c${fmt}`, LogLevelColors[level], ...data);
                break;
            case LogLevel.INFO:
                console.log(`%c${fmt}`, LogLevelColors[level], ...data);
                break;
            case LogLevel.IMPORTANT:
                console.log(`%c${fmt}`, LogLevelColors[level], ...data);
                break;
            case LogLevel.WARN:
                console.warn(`%c${fmt}`, LogLevelColors[level], ...data);
                break;
            case LogLevel.ERROR:
                console.error(`%c${fmt}`, LogLevelColors[level], ...data);
                break;
        }
    }

    public debug(msg: string, ...data: any[]): void {
        this.log(LogLevel.DEBUG, msg, ...data);
    }

    public info(msg: string, ...data: any[]): void {
        this.log(LogLevel.INFO, msg, ...data);
    }

    public important(msg: string, ...data: any[]): void {
        this.log(LogLevel.IMPORTANT, msg, ...data);
    }

    public warn(msg: string, ...data: any[]): void {
        this.log(LogLevel.WARN, msg, ...data);
    }

    public error(msg: string, ...data: any[]): void {
        this.log(LogLevel.ERROR, msg, ...data);
    }

    public setMinLevel(level: LogLevel): void {
        this.minLevel = level;
    }
}

// Global logger factory
export const createLogger = (context: string, minLevel?: LogLevel): Logger => {
    return new Logger(context, minLevel);
};

// Default app logger
export const appLogger = createLogger('APP');

// Export convenience methods for quick usage
export const logDebug = (context: string, msg: string, ...data: any[]): void => {
    createLogger(context).debug(msg, ...data);
};

export const logInfo = (context: string, msg: string, ...data: any[]): void => {
    createLogger(context).info(msg, ...data);
};

export const logWarn = (context: string, msg: string, ...data: any[]): void => {
    createLogger(context).warn(msg, ...data);
};

export const logError = (context: string, msg: string, ...data: any[]): void => {
    createLogger(context).error(msg, ...data);
}; 