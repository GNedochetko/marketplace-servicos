import Provider from "../typeorm/entities/Provider";
import ProvidersRepository from "../typeorm/repositories/ProvidersRepository";

class ListProvidersService {
    public async execute(): Promise<Provider[]> {
        return ProvidersRepository.find({
            relations: {
                user: true,
            },
            order: {
                created_at: "DESC",
            },
        });
    }
}

export default ListProvidersService;
