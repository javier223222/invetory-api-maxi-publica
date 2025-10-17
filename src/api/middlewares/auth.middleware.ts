import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UnauthorizedError } from 'core/shared/errors';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedError('Token not provided', 'Token no proporcionado');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError('Token not provided', 'Token no proporcionado');
        }

        const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
        req.user = decoded;

        next();
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            next(new UnauthorizedError('Invalid token', 'Token inválido'));
        } else if (error.name === 'TokenExpiredError') {
            next(new UnauthorizedError('Token expired', 'Token expirado'));
        } else {
            next(error);
        }
    }
};
