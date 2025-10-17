import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs/promises';
import { CarRepository } from '../../infrastructure/database/repositories/car.repository';
import { CreateCarUseCase,FindCarByIdUseCase} from 'core/uses-cases';
import { CreateCarDto } from '../../core/shared/dtos/create-car.dto';
import { ResponseSuccess } from '@api/dtos'; 
import { Car } from '@core/entities';
import { CarResponse } from '@api/dtos';
export class CarController {
    
    private readonly carRepository: CarRepository;

    constructor() {
        this.carRepository = new CarRepository();
    }

    
    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const carData: CreateCarDto = {
                marca: req.body.marca,
                modelo: req.body.modelo,
                año: parseInt(req.body.anio),
                precio: parseFloat(req.body.precio),
                kilometraje: parseInt(req.body.kilometraje),
                email: req.body.email,
                telefono: req.body.telefono,
                color: req.body.color,
                
            };

           
            if (req.file) {
                const baseUrl = `${req.protocol}://${req.get('host')}`;
                carData.fotografia = `${baseUrl}/uploads/cars/${req.file.filename}`;
            }

            
            const createCarUseCase:CreateCarUseCase = new CreateCarUseCase(this.carRepository);
            const newCar:Car = await createCarUseCase.execute(carData);
            const carResponse:CarResponse={
                id: newCar.id.toString(),
                marca: newCar.marca,
                modelo: newCar.modelo,
                año: newCar.año,
                precio: newCar.precio,
                kilometraje: newCar.kilometraje,
                color: newCar.color,
                email: newCar.email,
                telefono: newCar.telefono,
                foto: newCar.fotografia


            }


            const response: ResponseSuccess<CarResponse> = {
                status: 201,
                message: "Carro creado exitosamente.",
                data: carResponse
            };

            res.status(201).json(response);

        } catch (error) {
            
            if (req.file) {
                
                await fs.unlink(req.file.path).catch(err => {
                    
                    console.error("Error al intentar eliminar archivo huérfano:", err);
                });
            }
            
            
            next(error);
        }
    }

    public findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
           
            const findCarByIdUseCase:FindCarByIdUseCase = new FindCarByIdUseCase(this.carRepository);
            const car:Car = await findCarByIdUseCase.execute(id);
            const carResponse:CarResponse={
                id: car.id.toString(),
                marca: car.marca,
                modelo: car.modelo,
                año: car.año,
                precio: car.precio,
                kilometraje: car.kilometraje,
                color: car.color,
                email: car.email,
                telefono: car.telefono,
                foto: car.fotografia


            }
            const response: ResponseSuccess<CarResponse> = {
                status: 200,
                message: "Carro encontrado exitosamente.",
                data: carResponse
            };

            res.status(200).json(response);
        }catch (error) {
            next(error);
        }
    }
    

    
}