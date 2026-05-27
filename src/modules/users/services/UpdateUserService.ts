import AppError from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import UpdateUserDTO from "../dtos/UpdateUserDTO";
import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";

interface IRequest extends UpdateUserDTO {
    id: string;
}

class UpdateUserService {
    public async execute({ id, name, email, password, role }: IRequest): Promise<User> {
        const user = await UsersRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (email && email !== user.email) {
            const userWithSameEmail = await UsersRepository.findOne({
                where: { email },
            });

            if (userWithSameEmail && userWithSameEmail.id !== id) {
                throw new AppError("Email already exists");
            }

            user.email = email;
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (password !== undefined) {
            user.password = await hash(password, 8);
        }

        if (role !== undefined) {
            user.role = role;
        }

        await UsersRepository.save(user);

        return user;
    }
}

export default UpdateUserService;
