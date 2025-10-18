import { CreateCarUseCase } from '@core/uses-cases/cars/create-car.use-case';
import { ICarRepository } from '@core/ports/car.repository.port';
import { CreateCarDto } from '@core/shared/dtos/create-car.dto';
import {Car} from '@core/entities/car.entity';
import { createCarSchema } from '@api/dtos/car.validation';
import { ZodError } from 'zod';

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

    describe('Validation Tests', () => {
        it('should reject negative price', () => {
            const invalidData = {
                marca: 'Toyota',
                modelo: 'Corolla',
                anio: 2023,
                precio: -1000,
                kilometraje: 15000,
                email: 'test@example.com',
                telefono: '9611879041'
            };

            expect(() => createCarSchema.parse(invalidData)).toThrow(ZodError);
            
            try {
                createCarSchema.parse(invalidData);
            } catch (error) {
                if (error instanceof ZodError) {
                    const priceError = error.issues.find(issue => issue.path[0] === 'precio');
                    expect(priceError).toBeDefined();
                    expect(priceError?.message).toBe('El precio debe ser un valor positivo.');
                }
            }
        });

        it('should reject kilometraje less than 100', () => {
            const invalidData = {
                marca: 'Honda',
                modelo: 'Civic',
                anio: 2023,
                precio: 25000,
                kilometraje: 50,
                email: 'test@example.com',
                telefono: '9611879041'
            };

            expect(() => createCarSchema.parse(invalidData)).toThrow(ZodError);
            
            try {
                createCarSchema.parse(invalidData);
            } catch (error) {
                if (error instanceof ZodError) {
                    const kmError = error.issues.find(issue => issue.path[0] === 'kilometraje');
                    expect(kmError).toBeDefined();
                    expect(kmError?.message).toBe('El kilometraje debe ser mayor a 100.');
                }
            }
        });

        it('should reject multiple validation errors (negative price and low kilometraje)', () => {
            const invalidData = {
                marca: 'Ford',
                modelo: 'Focus',
                anio: 2023,
                precio: -5000,
                kilometraje: 50,
                email: 'test@example.com',
                telefono: '9611879041'
            };

            try {
                createCarSchema.parse(invalidData);
                fail('Should have thrown ZodError');
            } catch (error) {
                if (error instanceof ZodError) {
                    expect(error.issues.length).toBeGreaterThanOrEqual(2);
                    
                    const priceError = error.issues.find(issue => issue.path[0] === 'precio');
                    const kmError = error.issues.find(issue => issue.path[0] === 'kilometraje');
                    
                    expect(priceError).toBeDefined();
                    expect(priceError?.message).toBe('El precio debe ser un valor positivo.');
                    
                    expect(kmError).toBeDefined();
                    expect(kmError?.message).toBe('El kilometraje debe ser mayor a 100.');
                    
                    const messages = error.issues.map(err => 
                        `${err.path.join('.')} - ${err.message}`
                    );
                    const expectedMessage = messages.join(", ");
                    expect(expectedMessage).toContain('precio - El precio debe ser un valor positivo.');
                    expect(expectedMessage).toContain('kilometraje - El kilometraje debe ser mayor a 100.');
                }
            }
        });

        it('should reject año less than 1900', () => {
            const invalidData = {
                marca: 'Chevrolet',
                modelo: 'Malibu',
                anio: 1850,
                precio: 20000,
                kilometraje: 15000,
                email: 'test@example.com',
                telefono: '9611879041'
            };

            try {
                createCarSchema.parse(invalidData);
                fail('Should have thrown ZodError');
            } catch (error) {
                if (error instanceof ZodError) {
                    const yearError = error.issues.find(issue => issue.path[0] === 'anio');
                    expect(yearError).toBeDefined();
                    expect(yearError?.message).toBe('El año debe ser mayor a 1900.');
                }
            }
        });

        it('should reject invalid email format', () => {
            const invalidData = {
                marca: 'Nissan',
                modelo: 'Sentra',
                anio: 2023,
                precio: 22000,
                kilometraje: 10000,
                email: 'invalid-email',
                telefono: '9611879041'
            };

            expect(() => createCarSchema.parse(invalidData)).toThrow(ZodError);
            
            try {
                createCarSchema.parse(invalidData);
            } catch (error) {
                if (error instanceof ZodError) {
                    const emailError = error.issues.find(issue => issue.path[0] === 'email');
                    expect(emailError).toBeDefined();
                    expect(emailError?.message).toBe('El formato del email no es válido.');
                }
            }
        });

        it('should reject invalid phone format', () => {
            const invalidData = {
                marca: 'Mazda',
                modelo: 'CX-5',
                anio: 2023,
                precio: 28000,
                kilometraje: 12000,
                email: 'test@example.com',
                telefono: '123'
            };

            expect(() => createCarSchema.parse(invalidData)).toThrow(ZodError);
            
            try {
                createCarSchema.parse(invalidData);
            } catch (error) {
                if (error instanceof ZodError) {
                    const phoneError = error.issues.find(issue => issue.path[0] === 'telefono');
                    expect(phoneError).toBeDefined();
                    expect(phoneError?.message).toBe('El teléfono debe tener el formato 961-187-9041 o 9611879041.');
                }
            }
        });

        it('should reject missing required fields', () => {
            const invalidData = {
                marca: 'BMW',
                anio: 2023,
                precio: 45000,
                email: 'test@example.com',
            };

            try {
                createCarSchema.parse(invalidData);
                fail('Should have thrown ZodError');
            } catch (error) {
                if (error instanceof ZodError) {
                    expect(error.issues.length).toBeGreaterThanOrEqual(3);
                    
                    const missingFields = error.issues.map(issue => issue.path[0]);
                    expect(missingFields).toContain('modelo');
                    expect(missingFields).toContain('kilometraje');
                    expect(missingFields).toContain('telefono');
                }
            }
        });

        it('should reject marca with less than 2 characters', () => {
            const invalidData = {
                marca: 'T',
                modelo: 'Corolla',
                anio: 2023,
                precio: 25000,
                kilometraje: 15000,
                email: 'test@example.com',
                telefono: '9611879041'
            };

            try {
                createCarSchema.parse(invalidData);
                fail('Should have thrown ZodError');
            } catch (error) {
                if (error instanceof ZodError) {
                    const marcaError = error.issues.find(issue => issue.path[0] === 'marca');
                    expect(marcaError).toBeDefined();
                    expect(marcaError?.message).toBe('La marca debe tener al menos 2 caracteres.');
                }
            }
        });

        it('should accept valid data (boundary test)', () => {
            const validData = {
                marca: 'VW',
                modelo: 'Up',
                anio: 1900,
                precio: 0.01,
                kilometraje: 100,
                email: 'a@b.c',
                telefono: '9611879041'
            };

            const result = createCarSchema.parse(validData);
            expect(result).toBeDefined();
            expect(result.marca).toBe('VW');
            expect(result.precio).toBe(0.01);
            expect(result.kilometraje).toBe(100);
        });
    });
});
