import { Request, Response, NextFunction } from 'express';
import { GetAvailableYearsUseCase } from '@core/uses-cases/years';
import { ResponseSuccess } from '@api/dtos';
import { YearRangeDto } from '@core/shared/dtos';

export class YearController {
    public getAvailableYears = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getAvailableYearsUseCase = new GetAvailableYearsUseCase();
            const years = await getAvailableYearsUseCase.execute();

            const response: ResponseSuccess<YearRangeDto> = {
                status: 200,
                message: "Available years retrieved successfully",
                data: years
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
