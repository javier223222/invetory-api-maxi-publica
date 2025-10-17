import { Marca } from "core/entities";

export interface IMarcaRepository {
    findAll(): Promise<Marca[]>;
    findById(id: string): Promise<Marca | null>;
}
