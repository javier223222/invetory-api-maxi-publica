import { Car } from '../../entities/car.entity';
import { ICarRepository } from '../../ports/car.repository.port';
import { NotFoundError,BadRequestError } from '@core/shared/errors';
import { ObjectId } from 'mongodb';


export class UpdateCarUseCase {
    
    constructor(private readonly carRepository: ICarRepository) {}

    async execute(id: string, carData: Partial<Car>): Promise<Car> {
        
        if (!ObjectId.isValid(id)) {
            throw new BadRequestError(`The ID '${id}' is not a valid ObjectId`, `El ID '${id}' no es un ObjectId válido`);
        }

        const updatedCar = await this.carRepository.update(id, carData);

        if (!updatedCar) {
            throw new NotFoundError(`Car with ID '${id}' not found for update`, `El auto con el ID '${id}' no fue encontrado para actualizar`);
        }

        return updatedCar;
    }
}