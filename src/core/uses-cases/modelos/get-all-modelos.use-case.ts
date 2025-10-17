import { IModeloRepository } from "../../ports";
import { Modelo } from "../../entities";

export class GetAllModelosUseCase {
    constructor(private readonly modeloRepository: IModeloRepository) {}

    async execute(): Promise<Modelo[]> {
        return this.modeloRepository.findAll();
    }
}
