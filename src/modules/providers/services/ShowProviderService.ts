import AppError from "@shared/errors/AppError";
import Provider from "../typeorm/entities/Provider";
import ProvidersRepository from "../typeorm/repositories/ProvidersRepository";

interface IRequest {
    id: string;
}

class ShowProviderService {
    public async execute({ id }: IRequest): Promise<Provider> {
        const provider = await ProvidersRepository.findOne({
            where: { id },
            relations: {
                user: true,
                service_offers: true,
            },
        });

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        return provider;
    }
}

export default ShowProviderService;
