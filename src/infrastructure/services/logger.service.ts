import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { config } from '../../config';

/**
 * Servicio de Logging Profesional usando Winston
 * Implementa el patrón Singleton para una única instancia de logger
 */
export class Logger {
    private static instance: Logger;
    private logger: winston.Logger;

    private constructor() {
        this.logger = this.createLogger();
    }

    /**
     * Obtener la única instancia del Logger (Singleton)
     */
    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Crear y configurar el logger de Winston
     */
    private createLogger(): winston.Logger {
        // Formato personalizado para consola
        const consoleFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                return `${timestamp} [${level}]: ${message} ${metaStr}`;
            })
        );

        // Formato para archivos (JSON estructurado)
        const fileFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.json()
        );

        // Transports (destinos de logs)
        const transports: winston.transport[] = [];

        // Console transport (siempre activo)
        transports.push(
            new winston.transports.Console({
                format: consoleFormat,
                level: config.isDevelopment ? 'debug' : 'info',
            })
        );

        if (!config.isTest) {
            transports.push(
                new DailyRotateFile({
                    filename: path.join('logs', 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    format: fileFormat,
                    maxSize: '20m',
                    maxFiles: '14d',
                    zippedArchive: true,
                })
            );

            transports.push(
                new DailyRotateFile({
                    filename: path.join('logs', 'combined-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    format: fileFormat,
                    maxSize: '20m',
                    maxFiles: '14d',
                    zippedArchive: true,
                })
            );

            transports.push(
                new DailyRotateFile({
                    filename: path.join('logs', 'http-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    level: 'http',
                    format: fileFormat,
                    maxSize: '20m',
                    maxFiles: '7d',
                    zippedArchive: true,
                })
            );
        }

        return winston.createLogger({
            levels: winston.config.npm.levels,
            transports,
            exitOnError: false,
        });
    }

    /**
     * Log nivel ERROR (errores que requieren atención)
     */
    public error(message: string, meta?: Record<string, any>): void {
        this.logger.error(message, meta);
    }

    /**
     * Log nivel WARN (advertencias que no detienen la ejecución)
     */
    public warn(message: string, meta?: Record<string, any>): void {
        this.logger.warn(message, meta);
    }

    /**
     * Log nivel INFO (información general)
     */
    public info(message: string, meta?: Record<string, any>): void {
        this.logger.info(message, meta);
    }

    /**
     * Log nivel HTTP (requests HTTP)
     */
    public http(message: string, meta?: Record<string, any>): void {
        this.logger.http(message, meta);
    }

    /**
     * Log nivel DEBUG (información detallada para debugging)
     */
    public debug(message: string, meta?: Record<string, any>): void {
        this.logger.debug(message, meta);
    }

    /**
     * Log de request HTTP con información estructurada
     */
    public logRequest(req: any, res: any, duration: number): void {
        const meta = {
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            userId: req.user?.id || 'anonymous',
        };

        const message = `${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
            this.error(message, meta);
        } else if (res.statusCode >= 400) {
            this.warn(message, meta);
        } else {
            this.http(message, meta);
        }
    }

    /**
     * Log de error con stack trace
     */
    public logError(error: Error, context?: Record<string, any>): void {
        this.error(error.message, {
            stack: error.stack,
            name: error.name,
            ...context,
        });
    }

    /**
     * Log de operación de base de datos
     */
    public logDatabaseOperation(operation: string, collection: string, duration: number, success: boolean): void {
        const meta = {
            operation,
            collection,
            duration: `${duration}ms`,
            success,
        };

        if (success) {
            this.debug(`DB Operation: ${operation} on ${collection}`, meta);
        } else {
            this.warn(`DB Operation Failed: ${operation} on ${collection}`, meta);
        }
    }

    /**
     * Resetear instancia (útil para tests)
     */
    public static reset(): void {
        if (Logger.instance) {
            Logger.instance.logger.close();
            Logger.instance = null as any;
        }
    }
}

// Exportar instancia singleton por defecto
export const logger = Logger.getInstance();
