import AppError from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import CreateUserDTO from "../dtos/CreateUserDTO";
import User, { UserRole } from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";

class CreateUserService {
    public async execute({ name, email, password, role }: CreateUserDTO): Promise<User> {
        const emailExists = await UsersRepository.findOne({
            where: { email },
        });

        if (emailExists) {
            throw new AppError("Email already exists");
        }

        const hashedPassword = await hash(password, 8);

        const user = UsersRepository.create({
            name,
            email,
            password: hashedPassword,
            role: role ?? UserRole.CLIENT,
        });

        await UsersRepository.save(user);

        return user;
    }
}

export default CreateUserService;
