import { Car } from "@core/entities";
import { ICarRepository } from "@core/ports";
import { NotFoundError,BadRequestError } from "@core/shared/errors";
import { ObjectId } from "mongodb";
export class FindCarByIdUseCase {
    constructor(private carRepository: ICarRepository) {}

    async execute(id: string): Promise<Car> {
        if(!ObjectId.isValid(id)){
           throw new BadRequestError(`El ID '${id}' no es un ObjectId válido.`);
        }
        const car = await this.carRepository.findById(id);
        if (!car) {
            throw new NotFoundError(`Carro con ID ${id} no encontrado.`);
        }
        return car;
    }
}