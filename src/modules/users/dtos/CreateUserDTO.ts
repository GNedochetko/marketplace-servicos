import { UserRole } from "../typeorm/entities/User";

export default interface CreateUserDTO{
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}