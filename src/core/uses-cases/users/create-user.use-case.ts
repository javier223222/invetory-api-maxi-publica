import { User } from "@core/entities";
import { IUserRepository } from "@core/ports";
import { CreateUserDto } from "@core/shared/dtos/create-user.dto";
import { NotFoundError,BadRequestError } from "@core/shared/errors";
export class CreateUserUseCase {
    constructor(private userRepository: IUserRepository) {}
    async execute(userData: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new BadRequestError(`User with email ${userData.email} already exists`, `Usuario con email ${userData.email} ya existe`);
        }
        const newUser = new User();
        Object.assign(newUser, userData);
        return this.userRepository.save(newUser);
    }
}
