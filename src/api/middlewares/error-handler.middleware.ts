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

        
        let customMsg: string;
        switch (error.status) {
            case 400: 
                customMsg = `Los datos enviados no son válidos. Por favor, revisa los siguientes errores: ${error.message}`;
                break;
            case 404: 
                customMsg = `No se pudo encontrar el recurso solicitado.`;
                break;
            case 401: 
                customMsg = `No tienes permiso para realizar esta acción.`;
                break;
            default:
                customMsg = "Ocurrió un error en la solicitud.";
        }
        const errorResponse: ErrorResponse = {
            status: error.status,
            name: error.name,
            message: error.message,   
            customMessage: customMsg, 
        };

        return res.status(error.status).json(errorResponse);
    }
    console.error("Error inesperado no controlado:", error);
    const internalErrorResponse: ErrorResponse = {
        status: 500,
        name: "Internal Server Error",
        message: "Ocurrió un error inesperado en el servidor.",
        customMessage: "Error interno. Por favor, contacte al administrador."
    };
    return res.status(500).json(internalErrorResponse);
};