import { Request, Response, NextFunction } from 'express';
import { ModeloRepository } from '@infrastructure/database/repositories';
import { GetModelosByMarcaUseCase, GetAllModelosUseCase } from '@core/uses-cases/modelos';
import { ResponseSuccess } from '@api/dtos';
import { Modelo } from '@core/entities';

export class ModeloController {
    private readonly modeloRepository: ModeloRepository;

    constructor() {
        this.modeloRepository = new ModeloRepository();
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getAllModelosUseCase = new GetAllModelosUseCase(this.modeloRepository);
            const modelos = await getAllModelosUseCase.execute();

            const response: ResponseSuccess<Modelo[]> = {
                status: 200,
                message: "Models retrieved successfully",
                data: modelos
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public getByMarca = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { marcaId } = req.params;

            const getModelosByMarcaUseCase = new GetModelosByMarcaUseCase(this.modeloRepository);
            const modelos = await getModelosByMarcaUseCase.execute(marcaId);

            const response: ResponseSuccess<Modelo[]> = {
                status: 200,
                message: "Models retrieved successfully",
                data: modelos
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
