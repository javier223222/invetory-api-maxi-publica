import { Car } from "core/entities/car.entity";
import { CarFilterOptionsDto } from "core/shared/dtos/car-filter.dto";
import { PaginationOptionsDto } from "core/shared/dtos/pagination-options.dto";
import { PaginationResponseDto} from "core/shared/dtos/";

export interface ICarRepository{
    findAll(filters:CarFilterOptionsDto,pagination:PaginationOptionsDto):Promise<PaginationResponseDto<Car>>;
    findById(id:string):Promise<Car | null>;
    save(car:Car):Promise<Car>;
    update(id:string,car:Partial<Car>):Promise<Car | null>;
    updatePhotos(id:string,photosUrls:string):Promise<Car | null>;
    delete(id:string):Promise<boolean>;
}