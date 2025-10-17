import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../core/shared/errors';
import { ErrorResponse } from 'api/dtos';

export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof HttpError) {
        const errorResponse: ErrorResponse = {
            status: error.status,
            name: error.name,
            message: error.message,   
            customMessage: error.customMessage
        };

        return res.status(error.status).json(errorResponse);
    }

    console.error("Error inesperado no controlado:", error);
    
    const internalErrorResponse: ErrorResponse = {
        status: 500,
        name: "Internal Server Error",
        message: "An unexpected error occurred on the server",
        customMessage: "Error interno del servidor"
    };
    
    return res.status(500).json(internalErrorResponse);
};