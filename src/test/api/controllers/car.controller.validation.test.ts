import { Request, Response, NextFunction } from 'express';
import { createCarSchema } from '@api/dtos/car.validation';
import { validate } from '@api/middlewares/validation.middleware';
import { BadRequestError } from '@core/shared/errors';

describe('CarController - Validation Integration Tests', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            body: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();

        jest.clearAllMocks();
    });

    describe('Create Car Validation', () => {
        it('should pass validation with all valid fields', () => {
            mockRequest.body = {
                marca: 'Toyota',
                modelo: 'Corolla',
                anio: '2023',
                precio: '25000',
                kilometraje: '15000',
                email: 'vendedor@example.com',
                telefono: '9611879041',
                color: 'Rojo'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(); 
        });

        it('should reject negative price with proper error message', () => {
            mockRequest.body = {
                marca: 'Toyota',
                modelo: 'Corolla',
                anio: '2023',
                precio: '-1000',
                kilometraje: '15000',
                email: 'test@example.com',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
            
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('precio');
            expect(error.message).toContain('El precio debe ser un valor positivo.');
            expect(error.customMessage).toContain('Errores de validación');
        });

        it('should reject kilometraje less than 100', () => {
            mockRequest.body = {
                marca: 'Honda',
                modelo: 'Civic',
                anio: '2023',
                precio: '25000',
                kilometraje: '50',
                email: 'test@example.com',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('kilometraje');
            expect(error.message).toContain('El kilometraje debe ser mayor a 100.');
        });

        it('should reject multiple validation errors (negative price and low kilometraje)', () => {
            mockRequest.body = {
                marca: 'Ford',
                modelo: 'Focus',
                anio: '2023',
                precio: '-5000',
                kilometraje: '50',
                email: 'test@example.com',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            
            
            expect(error.message).toContain('precio - El precio debe ser un valor positivo.');
            expect(error.message).toContain('kilometraje - El kilometraje debe ser mayor a 100.');
            expect(error.customMessage).toContain('Errores de validación');
            
            
            const expectedResponse = {
                status: 400,
                name: 'Bad Request',
                message: error.message,
                customMessage: error.customMessage
            };
            
            expect(expectedResponse.status).toBe(400);
            expect(expectedResponse.name).toBe('Bad Request');
        });

        it('should reject año less than 1900', () => {
            mockRequest.body = {
                marca: 'Chevrolet',
                modelo: 'Malibu',
                anio: '1850',
                precio: '20000',
                kilometraje: '15000',
                email: 'test@example.com',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('El año debe ser mayor a 1900.');
        });

        it('should reject invalid email format', () => {
            mockRequest.body = {
                marca: 'Nissan',
                modelo: 'Sentra',
                anio: '2023',
                precio: '22000',
                kilometraje: '10000',
                email: 'invalid-email',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('El formato del email no es válido.');
        });

        it('should reject invalid phone format', () => {
            mockRequest.body = {
                marca: 'Mazda',
                modelo: 'CX-5',
                anio: '2023',
                precio: '28000',
                kilometraje: '12000',
                email: 'test@example.com',
                telefono: '123'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('El teléfono debe tener el formato');
        });

        it('should reject missing required fields', () => {
            mockRequest.body = {
                marca: 'BMW',
                
                anio: '2023',
                precio: '45000',
                
                email: 'test@example.com',
            
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('modelo');
            expect(error.message).toContain('kilometraje');
            expect(error.message).toContain('telefono');
        });

        it('should reject marca with less than 2 characters', () => {
            mockRequest.body = {
                marca: 'T',
                modelo: 'Corolla',
                anio: '2023',
                precio: '25000',
                kilometraje: '15000',
                email: 'test@example.com',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('La marca debe tener al menos 2 caracteres.');
        });

        it('should accept boundary values (minimum valid values)', () => {
            mockRequest.body = {
                marca: 'VW',
                modelo: 'Up',
                anio: '1900',
                precio: '0.01',
                kilometraje: '100',
                email: 'a@b.c',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith(); 
        });

        it('should format error message like API response', () => {
            mockRequest.body = {
                marca: 'Toyota',
                modelo: 'Corolla',
                anio: '2023',
                precio: '-1000',
                kilometraje: '50',
                email: 'test@example.com',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            const error = (mockNext as jest.Mock).mock.calls[0][0];
            
            
            const apiResponse = {
                status: 400,
                name: 'Bad Request',
                message: error.message,
                customMessage: error.customMessage
            };

           
            expect(apiResponse).toEqual({
                status: 400,
                name: 'Bad Request',
                message: expect.stringContaining('precio - El precio debe ser un valor positivo.'),
                customMessage: expect.stringContaining('Errores de validación: precio - El precio debe ser un valor positivo., kilometraje - El kilometraje debe ser mayor a 100.')
            });
        });

        it('should handle zero price (edge case)', () => {
            mockRequest.body = {
                marca: 'Toyota',
                modelo: 'Corolla',
                anio: '2023',
                precio: '0',
                kilometraje: '15000',
                email: 'test@example.com',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('El precio debe ser un valor positivo.');
        });

        it('should handle zero kilometraje (edge case)', () => {
            mockRequest.body = {
                marca: 'Honda',
                modelo: 'Civic',
                anio: '2023',
                precio: '25000',
                kilometraje: '0',
                email: 'test@example.com',
                telefono: '9611879041'
            };

            const validationMiddleware = validate(createCarSchema, 'body');
            validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalledTimes(1);
            const error = (mockNext as jest.Mock).mock.calls[0][0];
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toContain('El kilometraje debe ser mayor a 100.');
        });
    });
});
