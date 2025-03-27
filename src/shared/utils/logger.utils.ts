type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${level.toUpperCase()}] ${message} ${args.length ? JSON.stringify(args) : ''}`;
    }

    info(message: string, ...args: any[]): void {
        console.log(this.formatMessage('info', message, ...args));
    }

    warn(message: string, ...args: any[]): void {
        console.warn(this.formatMessage('warn', message, ...args));
    }

    error(message: string, ...args: any[]): void {
        console.error(this.formatMessage('error', message, ...args));
    }

    debug(message: string, ...args: any[]): void {
        console.debug(this.formatMessage('debug', message, ...args));
    }
}

export const logger = new Logger();
