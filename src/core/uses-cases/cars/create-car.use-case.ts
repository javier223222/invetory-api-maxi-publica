import { Car } from "core/entities/car.entity";
import { ICarRepository } from "core/ports/car.repository.port";
import { CreateCarDto } from "core/shared/dtos/create-car.dto";
import { logger } from "@infrastructure/services";

export class CreateCarUseCase{
    constructor(private carRepository:ICarRepository){}
    
    async execute(data:CreateCarDto):Promise<Car>{
        try {
            logger.debug('Creating new car', {
                marca: data.marca,
                modelo: data.modelo,
                precio: data.precio,
            });

            const startTime = Date.now();
            const newCar = new Car();
            Object.assign(newCar,data);
            const savedCar = await this.carRepository.save(newCar);
            const duration = Date.now() - startTime;

            logger.info('Car created successfully', {
                carId: savedCar.id?.toString(),
                marca: savedCar.marca,
                modelo: savedCar.modelo,
                duration: `${duration}ms`,
            });

            return savedCar;
        } catch (error) {
            logger.error('Failed to create car', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                data,
            });
            throw error;
        }
    }
}