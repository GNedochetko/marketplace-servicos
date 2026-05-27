import AppError from "@shared/errors/AppError";
import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";

interface IRequest {
    id: string;
}

class ShowUserService {
    public async execute({ id }: IRequest): Promise<User> {
        const user = await UsersRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }
}

export default ShowUserService;
