import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs/promises';
import { CarRepository } from '../../infrastructure/database/repositories/car.repository';
import { CreateCarUseCase,FindCarByIdUseCase,FindCarsUseCase,UpdateCarUseCase,UpdatePhotosUseCase,DeleteCarUseCase} from '@core/uses-cases/cars';
import { CreateCarDto } from '../../core/shared/dtos/create-car.dto';
import { ResponseSuccess} from '@api/dtos'; 
import { Car } from '@core/entities';
import { BadRequestError } from '@core/shared/errors/bad-request-error';

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
            


            const response: ResponseSuccess<Car> = {
                status: 201,
                message: "Carro creado exitosamente.",
                data: newCar
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
    public updatePhoto = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            
            if (!req.file) {
                throw new BadRequestError('No se ha subido ningún archivo de imagen.');
            }

           
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const photoUrl = `${baseUrl}/uploads/cars/${req.file.filename}`;


            const updatePhotosUseCase: UpdatePhotosUseCase = new UpdatePhotosUseCase(this.carRepository);
            const updatedCarEntity: Car = await updatePhotosUseCase.execute({ carId: id, photoUrl });

            
            const response: ResponseSuccess<Car> = {
                status: 200,
                message: "Foto del carro subida y actualizada exitosamente.",
                data: updatedCarEntity
            };



            
            res.status(200).json(response);

        } catch (error) {
            
            if (req.file) {
                await fs.unlink(req.file.path).catch(err => 
                    console.error("Error al eliminar archivo huérfano en updatePhoto:", err)
                );
            }
            
            
            next(error);
        }
    }

    public findById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
           
            const findCarByIdUseCase:FindCarByIdUseCase = new FindCarByIdUseCase(this.carRepository);
            const car:Car = await findCarByIdUseCase.execute(id);
           
            const response: ResponseSuccess<Car> = {
                status: 200,
                message: "Carro encontrado exitosamente.",
                data: car
            };

            res.status(200).json(response);
        }catch (error) {
            next(error);
        }
    }
    public async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filters={
                marca: req.query.marca as string | undefined,
                modelo: req.query.modelo as string | undefined,
                año: req.query.anio ? parseInt(req.query.anio as string) : undefined,
                color: req.query.color as string | undefined,
                precioMin: req.query.precioMin ? parseFloat(req.query.precioMin as string) : undefined,
                precioMax: req.query.precioMax ? parseFloat(req.query.precioMax as string) : undefined,


            }
            const pagination={
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            }
            const findCarsUseCase:FindCarsUseCase = new FindCarsUseCase(this.carRepository);
            const result = await findCarsUseCase.execute(filters, pagination);
           
            
            let paginationResponse={
                items: result.items,
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
                hasNext: result.hasNext,
                hasPrev: result.hasPrev
            }

            const response: ResponseSuccess<typeof paginationResponse> = {
                status: 200,
                message: "Carros obtenidos exitosamente.",
                data: paginationResponse
            };
            res.status(200).json(response);

        }catch (error) {
            next(error);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (req.body.anio){
                req.body.año = parseInt(req.body.anio);
                delete req.body.anio;
            }
            const carData: Partial<Car> = req.body;
            

            const useCase = new UpdateCarUseCase(this.carRepository);
            const updatedCar = await useCase.execute(id, carData);
            const responseDto : ResponseSuccess<Car> = {
                status: 200,
                message: "Carro actualizado exitosamente.",
                data: updatedCar
            }

            res.status(200).json(responseDto);
        } catch (error) {
            next(error);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const { id } = req.params;  
            const deleteCarUseCase = new DeleteCarUseCase(this.carRepository);
            await deleteCarUseCase.execute(id);
            const response: ResponseSuccess<null> = {
                status: 200,
                message: "Carro con id " + id + " eliminado exitosamente.",
                data: null
            };
            res.status(200).json(response);

        }catch(error){
            next(error);
        }
    }


    
}