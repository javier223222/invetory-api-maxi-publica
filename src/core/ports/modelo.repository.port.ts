import { Modelo } from "core/entities";

export interface IModeloRepository {
    findAll(): Promise<Modelo[]>;
    findByMarcaId(marcaId: string): Promise<Modelo[]>;
    findById(id: string): Promise<Modelo | null>;
}
