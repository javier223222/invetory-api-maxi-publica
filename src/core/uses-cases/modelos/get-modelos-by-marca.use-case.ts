import { IModeloRepository } from "../../ports";
import { Modelo } from "../../entities";
import { BadRequestError } from "../../shared/errors";
import { ObjectId } from "mongodb";

export class GetModelosByMarcaUseCase {
    constructor(private readonly modeloRepository: IModeloRepository) {}

    async execute(marcaId: string): Promise<Modelo[]> {
        if (!ObjectId.isValid(marcaId)) {
            throw new BadRequestError(
                `The marcaId '${marcaId}' is not a valid ObjectId`,
                `El marcaId '${marcaId}' no es un ObjectId válido`
            );
        }

        return this.modeloRepository.findByMarcaId(marcaId);
    }
}
