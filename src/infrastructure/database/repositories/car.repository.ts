import { ICarRepository } from "core/ports";
import { Car } from "core/entities/car.entity";
import { AppDataSource } from "../data-source";
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between, Like, IsNull, FindOptionsWhere } from "typeorm";
import { ObjectId } from "mongodb";
import { CarFilterOptionsDto,PaginationOptionsDto,PaginationResponseDto } from "core/shared/dtos";

export class CarRepository implements ICarRepository {
    private readonly repository: Repository<Car>;
    constructor() {
        this.repository = AppDataSource.getMongoRepository(Car);
    }
    async findAll(filters: CarFilterOptionsDto, pagination: PaginationOptionsDto): Promise<PaginationResponseDto<Car>> {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const whereClause: FindOptionsWhere<Car> = { fechaDeEliminacion: IsNull() };

        if (filters.marca) {
            whereClause.marca = Like(`%${filters.marca}%`);
        }
        if (filters.modelo) {
            whereClause.modelo = Like(`%${filters.modelo}%`);
        }
        if (filters.año) {
            whereClause.año = filters.año;
        }
        if (filters.color) {
            whereClause.color = Like(`%${filters.color}%`);
        }
        if (filters.precioMin && filters.precioMax) {
            whereClause.precio = Between(filters.precioMin, filters.precioMax);
        } else if (filters.precioMin) {
            whereClause.precio = MoreThanOrEqual(filters.precioMin);
        } else if (filters.precioMax) {
            whereClause.precio = LessThanOrEqual(filters.precioMax);
        }

        const [data, total] = await this.repository.findAndCount({
            where: whereClause,
            take: limit,
            skip: skip,
            order: {
                fechaDeAlta: 'DESC'
            }
        });
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            data,
            pagination:{
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev
                
            }

        }
    }
    async findById(id: string): Promise<Car | null> {

       let result  =await this.repository.findOne({
        where:{
            _id: new ObjectId(id),
            fechaDeEliminacion: null
        } as any
            

       }) ;
       const car = result ? result : null;
           

       

       return car;
    }

    async save(car: Car): Promise<Car> {
        
        return await this.repository.save(car);
    }

    async update(id: string, carData: Partial<Car>): Promise<Car | null> {
        const carToUpdate = await this.findById(id);
        if (!carToUpdate) {
            return null;
        }
        
        Object.assign(carToUpdate, carData);
        return this.repository.save(carToUpdate);
    }

    async updatePhotos(id: string, photosUrls: string): Promise<Car | null> {
        const carToUpdate = await this.findById(id);
        if (!carToUpdate) {
            return null;
        }

        carToUpdate.fotografia = photosUrls;
        return this.repository.save(carToUpdate);
    }
    async delete(id: string): Promise<boolean> {
        const carToDelete = await this.findById(id);
        if (!carToDelete) {
            return false;
        }

        carToDelete.fechaDeEliminacion = new Date();
        await this.repository.save(carToDelete);
        return true;
    }
}