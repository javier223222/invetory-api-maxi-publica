import { IUserRepository } from "../../ports";
import { LoginDto, LoginResponseDto } from "../../shared/dtos";
import { UnauthorizedError } from "../../shared/errors";
import * as jwt from 'jsonwebtoken';
import { config } from "../../../config";

export class LoginUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(loginDto: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = loginDto;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials', 'Credenciales inválidas');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials', 'Credenciales inválidas');
        }

        
        const token = jwt.sign(
            { 
                id: user.id.toString(), 
                email: user.email 
            },
            config.jwtSecret,
            { expiresIn: config.jwtExpiration } as jwt.SignOptions
        );

        return {
            token,
            user: {
                id: user.id.toString(),
                email: user.email
            }
        };
    }
}
