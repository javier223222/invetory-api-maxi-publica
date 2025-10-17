import { Request, Response, NextFunction } from 'express';
import { MarcaRepository } from '@infrastructure/database/repositories';
import { GetAllMarcasUseCase } from '@core/uses-cases/marcas';
import { ResponseSuccess } from '@api/dtos';
import { Marca } from '@core/entities';

export class MarcaController {
    private readonly marcaRepository: MarcaRepository;

    constructor() {
        this.marcaRepository = new MarcaRepository();
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getAllMarcasUseCase = new GetAllMarcasUseCase(this.marcaRepository);
            const marcas = await getAllMarcasUseCase.execute();

            const response: ResponseSuccess<Marca[]> = {
                status: 200,
                message: "Brands retrieved successfully",
                data: marcas
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
