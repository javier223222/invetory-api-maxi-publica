import { Car } from "core/entities/car.entity";
import { ICarRepository } from "core/ports/car.repository.port";
import { CreateCarDto } from "core/shared/dtos/create-car.dto";

export class CreateCarUseCase{
    constructor(private carRepository:ICarRepository){}
    async execute(data:CreateCarDto):Promise<Car>{
        const newCar = new Car();
        Object.assign(newCar,data);
        return this.carRepository.save(newCar);
    }
}