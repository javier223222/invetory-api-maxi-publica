import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod'; 
import { BadRequestError } from 'core/shared/errors';

type RequestLocation = 'body' | 'query' | 'params';

export const validate = (schema: ZodType, location: RequestLocation = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req[location];
            
            schema.parse(data);
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((err) => 
                    `${err.path.join('.')} - ${err.message}`
                );
                const englishMessage = messages.join(", ");
                const spanishMessage = `Errores de validación: ${messages.join(", ")}`;
                next(new BadRequestError(englishMessage, spanishMessage));
            } else {
                next(new BadRequestError('Validation error', 'Error de validación'));
            }
        }
    };