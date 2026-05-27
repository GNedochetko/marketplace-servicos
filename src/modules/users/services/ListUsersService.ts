import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";

class ListUsersService {
    public async execute(): Promise<User[]> {
        return UsersRepository.find({
            order: {
                name: "ASC",
            },
        });
    }
}

export default ListUsersService;
