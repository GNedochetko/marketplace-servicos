import { UserRole } from "../typeorm/entities/User";

export default interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}