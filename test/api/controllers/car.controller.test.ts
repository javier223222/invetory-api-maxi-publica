import { Request, Response, NextFunction } from 'express';
import { CarController } from '@api/controllers/car.controller';
import { CarRepository } from '@infrastructure/database/repositories/car.repository';
import { CreateCarUseCase } from '@core/uses-cases/cars';
import { Car } from '@core/entities';

jest.mock('@infrastructure/database/repositories/car.repository');
jest.mock('@core/uses-cases/cars');

describe('CarController - create', () => {
    let carController: CarController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let mockCarRepository: jest.Mocked<CarRepository>;

    beforeEach(() => {
        mockCarRepository = new CarRepository() as jest.Mocked<CarRepository>;
        carController = new CarController();
        
        mockRequest = {
            body: {},
            file: undefined,
            protocol: 'http',
            get: jest.fn().mockReturnValue('localhost:3000')
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();

        jest.clearAllMocks();
    });

    describe('create method', () => {
        it('should create a car successfully with all fields', async () => {
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

            mockRequest.file = {
                filename: 'car-12345.jpg',
                path: '/uploads/cars/car-12345.jpg',
                originalname: 'car.jpg',
                mimetype: 'image/jpeg',
                size: 1024
            } as Express.Multer.File;

            const mockCar = new Car();
            Object.assign(mockCar, {
                id: '507f1f77bcf86cd799439011',
                marca: 'Toyota',
                modelo: 'Corolla',
                año: 2023,
                precio: 25000,
                kilometraje: 15000,
                email: 'vendedor@example.com',
                telefono: '9611879041',
                color: 'Rojo',
                fotografia: 'http://localhost:3000/uploads/cars/car-12345.jpg',
                fechaDeAlta: new Date(),
                fechaDeModificacion: new Date(),
                fechaDeEliminacion: null
            });

            const mockExecute = jest.fn().mockResolvedValue(mockCar);
            (CreateCarUseCase as jest.Mock).mockImplementation(() => ({
                execute: mockExecute
            }));

            await carController.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockExecute).toHaveBeenCalledWith(
                expect.objectContaining({
                    marca: 'Toyota',
                    modelo: 'Corolla',
                    año: 2023,
                    precio: 25000,
                    kilometraje: 15000,
                    email: 'vendedor@example.com',
                    telefono: '9611879041',
                    color: 'Rojo',
                    fotografia: 'http://localhost:3000/uploads/cars/car-12345.jpg'
                })
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: 201,
                message: 'Carro creado exitosamente.',
                data: mockCar
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should create a car without optional fields', async () => {
            mockRequest.body = {
                marca: 'Honda',
                modelo: 'Civic',
                anio: '2024',
                precio: '30000',
                kilometraje: '5000',
                email: 'test@example.com',
                telefono: '9612345678'
            };

            const mockCar = new Car();
            Object.assign(mockCar, {
                id: '507f1f77bcf86cd799439012',
                marca: 'Honda',
                modelo: 'Civic',
                año: 2024,
                precio: 30000,
                kilometraje: 5000,
                email: 'test@example.com',
                telefono: '9612345678',
                color: undefined,
                fotografia: undefined,
                fechaDeAlta: new Date(),
                fechaDeModificacion: new Date()
            });

            const mockExecute = jest.fn().mockResolvedValue(mockCar);
            (CreateCarUseCase as jest.Mock).mockImplementation(() => ({
                execute: mockExecute
            }));

            await carController.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockExecute).toHaveBeenCalledWith(
                expect.objectContaining({
                    marca: 'Honda',
                    modelo: 'Civic',
                    año: 2024,
                    precio: 30000,
                    kilometraje: 5000,
                    email: 'test@example.com',
                    telefono: '9612345678'
                })
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should create a car with photo upload', async () => {
            mockRequest.body = {
                marca: 'Ford',
                modelo: 'Focus',
                anio: '2022',
                precio: '20000',
                kilometraje: '25000',
                email: 'ford@example.com',
                telefono: '9613456789'
            };

            mockRequest.file = {
                filename: 'car-67890.jpeg',
                path: '/uploads/cars/car-67890.jpeg',
                originalname: 'mycar.jpeg',
                mimetype: 'image/jpeg',
                size: 2048
            } as Express.Multer.File;

            const mockCar = new Car();
            Object.assign(mockCar, {
                id: '507f1f77bcf86cd799439013',
                fotografia: 'http://localhost:3000/uploads/cars/car-67890.jpeg'
            });

            const mockExecute = jest.fn().mockResolvedValue(mockCar);
            (CreateCarUseCase as jest.Mock).mockImplementation(() => ({
                execute: mockExecute
            }));

            await carController.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockExecute).toHaveBeenCalledWith(
                expect.objectContaining({
                    fotografia: 'http://localhost:3000/uploads/cars/car-67890.jpeg'
                })
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });

        it('should handle errors and call next middleware', async () => {
            mockRequest.body = {
                marca: 'Tesla',
                modelo: 'Model 3',
                anio: '2024',
                precio: '45000',
                kilometraje: '1000',
                email: 'error@test.com',
                telefono: '9619999999'
            };

            const error = new Error('Database error');
            const mockExecute = jest.fn().mockRejectedValue(error);
            (CreateCarUseCase as jest.Mock).mockImplementation(() => ({
                execute: mockExecute
            }));

            await carController.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(error);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        it('should parse numeric string fields correctly', async () => {
            mockRequest.body = {
                marca: 'Chevrolet',
                modelo: 'Spark',
                anio: '2021',
                precio: '15000.50',
                kilometraje: '30000',
                email: 'chevy@example.com',
                telefono: '9614567890'
            };

            const mockCar = new Car();
            const mockExecute = jest.fn().mockResolvedValue(mockCar);
            (CreateCarUseCase as jest.Mock).mockImplementation(() => ({
                execute: mockExecute
            }));

            await carController.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockExecute).toHaveBeenCalledWith(
                expect.objectContaining({
                    año: 2021,
                    precio: 15000.50,
                    kilometraje: 30000
                })
            );
        });

        it('should build correct photo URL with protocol and host', async () => {
            mockRequest.body = {
                marca: 'Nissan',
                modelo: 'Sentra',
                anio: '2023',
                precio: '22000',
                kilometraje: '12000',
                email: 'nissan@test.com',
                telefono: '9615678901'
            };

            mockRequest = {
                ...mockRequest,
                protocol: 'https',
                get: jest.fn().mockReturnValue('api.example.com')
            };
            mockRequest.file = {
                filename: 'car-photo.png',
                path: '/uploads/cars/car-photo.png',
                originalname: 'photo.png',
                mimetype: 'image/png',
                size: 1500
            } as Express.Multer.File;

            const mockCar = new Car();
            const mockExecute = jest.fn().mockResolvedValue(mockCar);
            (CreateCarUseCase as jest.Mock).mockImplementation(() => ({
                execute: mockExecute
            }));

            await carController.create(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockExecute).toHaveBeenCalledWith(
                expect.objectContaining({
                    fotografia: 'https://api.example.com/uploads/cars/car-photo.png'
                })
            );
        });
    });
});
