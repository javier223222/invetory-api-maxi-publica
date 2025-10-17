import { IUserRepository } from "core/ports";
import { User } from "core/entities";
import { AppDataSource } from "../data-source";
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between, Like, IsNull, FindOptionsWhere } from "typeorm";
import { ObjectId } from "mongodb";
import { CarFilterOptionsDto,PaginationOptionsDto,PaginationResponseDto } from "core/shared/dtos";

export class UserRepository implements IUserRepository {
    private readonly repository: Repository<User>;
    constructor() {
        this.repository = AppDataSource.getMongoRepository(User);
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }
    async findById(id: string): Promise<User | null> {
        return this.repository.findOne({ where: { _id: new ObjectId(id) }  as any});
    }
    async save(user: User): Promise<User> {
        return this.repository.save(user);
    }
}