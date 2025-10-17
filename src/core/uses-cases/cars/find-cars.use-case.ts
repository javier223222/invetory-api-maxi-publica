import { Car } from "@core/entities";
import { ICarRepository } from "@core/ports";
import { CarFilterOptionsDto,PaginationOptionsDto, PaginationResponseDto } from "@core/shared/dtos";


export class FindCarsUseCase {
    constructor(private carRepository: ICarRepository) {}
    async execute(filters: CarFilterOptionsDto,pagination: PaginationOptionsDto): Promise<PaginationResponseDto<Car>> {
        const cars: PaginationResponseDto<Car> = await this.carRepository.findAll(filters,pagination);
        return cars;
    }

    
}