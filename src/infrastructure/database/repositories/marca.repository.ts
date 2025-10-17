import { IMarcaRepository } from "core/ports";
import { Marca } from "core/entities";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";

export class MarcaRepository implements IMarcaRepository {
    private readonly repository: Repository<Marca>;

    constructor() {
        this.repository = AppDataSource.getRepository(Marca);
    }

    async findAll(): Promise<Marca[]> {
        return this.repository.find({
            order: {
                nombre: 'ASC'
            }
        });
    }

    async findById(id: string): Promise<Marca | null> {
        return this.repository.findOne({
            where: { id } as any
        });
    }
}
