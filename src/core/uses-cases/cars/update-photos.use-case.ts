import { Car } from '../../entities/car.entity';
import { ICarRepository } from '../../ports/car.repository.port';
import { BadRequestError, NotFoundError } from '../../shared/errors';
import { ObjectId } from 'mongodb';
import { FileService } from '../../../infrastructure/services/file.service';
import { UpdatePhotosDto } from '@core/shared/dtos/update-photos-dto';

export class UpdatePhotosUseCase {

    private readonly fileService: FileService;

    constructor(private readonly carRepository: ICarRepository) {
        this.fileService = new FileService();
    }

    async execute(data: UpdatePhotosDto): Promise<Car> {
        const { carId, photoUrl } = data;

        if (!ObjectId.isValid(carId)) {
            throw new BadRequestError(`The carId '${carId}' is not a valid ObjectId`, `El carId '${carId}' no es un ObjectId válido`);
        }

        const existingCar = await this.carRepository.findById(carId);
        if (!existingCar) {
            throw new NotFoundError(`Car with ID '${carId}' not found`, `El auto con el ID '${carId}' no fue encontrado`);
        }
        const oldPhotoUrl = existingCar.fotografia; 

        const updatedCar = await this.carRepository.updatePhotos(carId, photoUrl);
        if (!updatedCar) {
            throw new NotFoundError("Error trying to update car photos", "Error al intentar actualizar las fotos del auto");
        }

       
        if (oldPhotoUrl) {
            await this.fileService.deleteLocalFile(oldPhotoUrl);
        }

        return updatedCar;
    }
}