import { Car } from "@core/entities";
import { ICarRepository } from "@core/ports";
import { NotFoundError,BadRequestError } from "@core/shared/errors";
import { ObjectId } from "mongodb";

export class DeleteCarUseCase {
    constructor(private carRepository: ICarRepository) {}
    async execute(id: string): Promise<boolean> {
        if(!ObjectId.isValid(id)){
              throw new BadRequestError(`The ID '${id}' is not a valid ObjectId`, `El ID '${id}' no es un ObjectId válido`);
        }
        const deleted = await this.carRepository.delete(id);
        if (!deleted) {
            throw new NotFoundError(`Car with ID ${id} not found for deletion`, `Carro con ID ${id} no encontrado para eliminar`);
        }
        return deleted;
    }
}