import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod'; 
import { BadRequestError } from 'core/shared/errors';

type RequestLocation = 'body' | 'query' | 'params';

export const validate = (schema: ZodType, location: RequestLocation = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const { marca, modelo, anio, precio, kilometraje, email, telefono, color } = req[location];
            console.log("Data to validate:", { marca, modelo, anio, precio, kilometraje, email, telefono, color });
            schema.parse({ marca, modelo, anio: parseInt(anio), precio: parseInt(precio), kilometraje: parseInt(kilometraje), email, telefono, color });
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((err) => 
                    `${err.path.join('.')} - ${err.message}`
                );
                next(new BadRequestError(messages.join(", ")));
            } else {
                next(new BadRequestError('Error de validación'));
            }
        }
    };