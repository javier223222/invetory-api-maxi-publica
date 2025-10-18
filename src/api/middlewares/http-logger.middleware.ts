import { Request, Response, NextFunction } from 'express';
import { logger } from '@infrastructure/services';

/**
 * Middleware de Logging HTTP
 * Registra todas las peticiones HTTP con información detallada
 */
export const httpLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
        const duration = Date.now() - startTime;
        logger.logRequest(req, res, duration);
        return originalJson(body);
    };

    res.on('finish', () => {
        if (!res.headersSent || res.statusCode >= 300) {
            const duration = Date.now() - startTime;
            logger.logRequest(req, res, duration);
        }
    });

    next();
};
