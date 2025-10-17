import { User } from "core/entities";
export interface IUserRepository{
    findByEmail(email:string):Promise<User | null>;
    findById(id:string):Promise<User | null>;
    save(user:User):Promise<User>;
}