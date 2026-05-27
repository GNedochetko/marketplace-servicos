import AppError from "@shared/errors/AppError";
import UsersRepository from "@modules/users/typeorm/repositories/UsersRepository";
import { UserRole } from "@modules/users/typeorm/entities/User";
import CreateProviderDTO from "../dtos/CreateProviderDTO";
import Provider from "../typeorm/entities/Provider";
import ProvidersRepository from "../typeorm/repositories/ProvidersRepository";

class CreateProviderService {
    public async execute({ user_id, bio, phone, availability }: CreateProviderDTO): Promise<Provider> {
        const user = await UsersRepository.findOne({
            where: { id: user_id },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (user.role !== UserRole.PROVIDER) {
            throw new AppError("User must have provider role");
        }

        const providerExists = await ProvidersRepository.findOne({
            where: { user_id },
        });

        if (providerExists) {
            throw new AppError("Provider profile already exists for this user");
        }

        const provider = ProvidersRepository.create({
            user_id,
            bio: bio ?? null,
            phone: phone ?? null,
            availability: availability ?? null,
        });

        await ProvidersRepository.save(provider);

        return provider;
    }
}

export default CreateProviderService;
