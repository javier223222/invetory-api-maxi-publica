import {Request, Response, NextFunction} from 'express';
import { UserRepository } from '@infrastructure/database/repositories';
import { User } from '@core/entities';
import { CreateUserUseCase, LoginUseCase } from '@core/uses-cases/users';
import { ResponseSuccess} from '@api/dtos'; 
import { BadRequestError } from '@core/shared/errors/bad-request-error';

export class UserController {
    private readonly userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }

    public login = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const loginUseCase = new LoginUseCase(this.userRepository);
            const result = await loginUseCase.execute({ email, password });

            const response: ResponseSuccess<typeof result> = {
                status: 200,
                message: "Login exitoso.",
                data: result
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public create=async(req:Request, res:Response, next:NextFunction)=>{
        try{
            const { email, password} = req.body;
            if(!email || !password){
                throw new BadRequestError("Email and password are required.");

            }

            const createUserCase:CreateUserUseCase = new CreateUserUseCase(this.userRepository);
            const newUser = await createUserCase.execute({email, password});
            newUser.password = "";
            const response: ResponseSuccess<User> = {
                status:201,
                message:"User created successfully.",

                data: newUser
            };
            res.status(201).json(response);
            

        }catch(error){
            next(error);
        }

    }
}