import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../core/shared/errors';
import { ErrorResponse } from 'api/dtos';
import { logger } from '@infrastructure/services';
import { config } from '../../config';

export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Errores HTTP conocidos (4xx)
    if (error instanceof HttpError) {
        // Log de advertencia para errores del cliente
        logger.warn(`HTTP Error: ${error.status} - ${error.message}`, {
            status: error.status,
            name: error.name,
            message: error.message,
            customMessage: error.customMessage,
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userId: (req as any).user?.id || 'anonymous',
        });

        const errorResponse: ErrorResponse = {
            status: error.status,
            name: error.name,
            message: error.message,   
            customMessage: error.customMessage
        };

        return res.status(error.status).json(errorResponse);
    }

    // Errores no controlados (500)
    logger.error('Unhandled Error', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        ip: req.ip,
        userId: (req as any).user?.id || 'anonymous',
    });
    
    const internalErrorResponse: ErrorResponse = {
        status: 500,
        name: "Internal Server Error",
        message: "An unexpected error occurred on the server",
        customMessage: "Error interno del servidor",
        // Incluir stack trace solo en desarrollo
        ...(config.isDevelopment && { stack: error.stack }),
    };
    
    return res.status(500).json(internalErrorResponse);
};