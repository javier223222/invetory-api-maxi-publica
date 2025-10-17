import { IMarcaRepository } from "../../ports";
import { Marca } from "../../entities";

export class GetAllMarcasUseCase {
    constructor(private readonly marcaRepository: IMarcaRepository) {}

    async execute(): Promise<Marca[]> {
        return this.marcaRepository.findAll();
    }
}
