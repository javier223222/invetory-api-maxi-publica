import { IModeloRepository } from "core/ports";
import { Modelo } from "core/entities";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { ObjectId } from "mongodb";

export class ModeloRepository implements IModeloRepository {
    private readonly repository: Repository<Modelo>;

    constructor() {
        this.repository = AppDataSource.getRepository(Modelo);
    }

    async findAll(): Promise<Modelo[]> {
        return this.repository.find({
            order: {
                nombre: 'ASC'
            }
        });
    }

    async findByMarcaId(marcaId: string): Promise<Modelo[]> {
        return this.repository.find({
            where: { 
                marcaId: new ObjectId(marcaId) 
            } as any,
            order: {
                nombre: 'ASC'
            }
        });
    }

    async findById(id: string): Promise<Modelo | null> {
        return this.repository.findOne({
            where: { id } as any
        });
    }
}
