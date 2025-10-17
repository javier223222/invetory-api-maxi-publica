import { CreateCarUseCase } from '@core/uses-cases/cars/create-car.use-case';
import { ICarRepository } from '@core/ports/car.repository.port';
import { CreateCarDto } from '@core/shared/dtos/create-car.dto';
import { Car } from '@core/entities/car.entity';

describe('CreateCarUseCase', () => {
    let createCarUseCase: CreateCarUseCase;
    let mockCarRepository: jest.Mocked<ICarRepository>;

    beforeEach(() => {
        mockCarRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            updatePhoto: jest.fn(),
            updatePhotos: jest.fn(),
        } as jest.Mocked<ICarRepository>;

        createCarUseCase = new CreateCarUseCase(mockCarRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        it('should create a car successfully with all required fields', async () => {
            const createCarDto: CreateCarDto = {
                marca: 'Toyota',
                modelo: 'Corolla',
                año: 2023,
                precio: 25000,
                kilometraje: 15000,
                email: 'vendedor@example.com',
                telefono: '9611879041',
                color: 'Rojo',
                fotografia: 'http://localhost:3000/uploads/cars/photo.jpg'
            };

            const expectedCar = new Car();
            Object.assign(expectedCar, {
                ...createCarDto,
                id: '507f1f77bcf86cd799439011',
                fechaDeAlta: new Date(),
                fechaDeModificacion: new Date(),
                fechaDeEliminacion: null
            });

            mockCarRepository.save.mockResolvedValue(expectedCar);

            const result = await createCarUseCase.execute(createCarDto);

            expect(mockCarRepository.save).toHaveBeenCalledTimes(1);
            expect(mockCarRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    marca: createCarDto.marca,
                    modelo: createCarDto.modelo,
                    año: createCarDto.año,
                    precio: createCarDto.precio,
                    kilometraje: createCarDto.kilometraje,
                    email: createCarDto.email,
                    telefono: createCarDto.telefono,
                    color: createCarDto.color,
                    fotografia: createCarDto.fotografia
                })
            );
            expect(result).toEqual(expectedCar);
            expect(result.marca).toBe('Toyota');
            expect(result.modelo).toBe('Corolla');
            expect(result.año).toBe(2023);
        });

        it('should create a car successfully without optional fields', async () => {
            const createCarDto: CreateCarDto = {
                marca: 'Honda',
                modelo: 'Civic',
                año: 2024,
                precio: 30000,
                kilometraje: 5000,
                email: 'test@example.com',
                telefono: '9612345678'
            };

            const expectedCar = new Car();
            Object.assign(expectedCar, {
                ...createCarDto,
                id: '507f1f77bcf86cd799439012',
                color: null,
                fotografia: null,
                fechaDeAlta: new Date(),
                fechaDeModificacion: new Date(),
                fechaDeEliminacion: null
            });

            mockCarRepository.save.mockResolvedValue(expectedCar);

            const result = await createCarUseCase.execute(createCarDto);

            expect(mockCarRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedCar);
            expect(result.color).toBeNull();
            expect(result.fotografia).toBeNull();
        });

        it('should create a car with minimum valid values', async () => {
            const createCarDto: CreateCarDto = {
                marca: 'Ford',
                modelo: 'Focus',
                año: 1900,
                precio: 0,
                kilometraje: 100,
                email: 'min@test.com',
                telefono: '9611111111'
            };

            const expectedCar = new Car();
            Object.assign(expectedCar, {
                ...createCarDto,
                id: '507f1f77bcf86cd799439013'
            });

            mockCarRepository.save.mockResolvedValue(expectedCar);

            const result = await createCarUseCase.execute(createCarDto);

            expect(result.año).toBe(1900);
            expect(result.precio).toBe(0);
            expect(result.kilometraje).toBe(100);
        });

        it('should propagate repository errors', async () => {
            const createCarDto: CreateCarDto = {
                marca: 'Tesla',
                modelo: 'Model 3',
                año: 2024,
                precio: 45000,
                kilometraje: 1000,
                email: 'error@test.com',
                telefono: '9619999999'
            };

            const error = new Error('Database connection failed');
            mockCarRepository.save.mockRejectedValue(error);

            await expect(createCarUseCase.execute(createCarDto)).rejects.toThrow('Database connection failed');
            expect(mockCarRepository.save).toHaveBeenCalledTimes(1);
        });

        it('should handle special characters in text fields', async () => {
            const createCarDto: CreateCarDto = {
                marca: 'Mercedes-Benz',
                modelo: 'C-Class',
                año: 2023,
                precio: 50000,
                kilometraje: 10000,
                email: 'special+test@example.com',
                telefono: '961-187-9041',
                color: 'Azul Metálico'
            };

            const expectedCar = new Car();
            Object.assign(expectedCar, {
                ...createCarDto,
                id: '507f1f77bcf86cd799439014'
            });

            mockCarRepository.save.mockResolvedValue(expectedCar);

            const result = await createCarUseCase.execute(createCarDto);

            expect(result.marca).toBe('Mercedes-Benz');
            expect(result.color).toBe('Azul Metálico');
            expect(result.telefono).toBe('961-187-9041');
        });
    });
});
