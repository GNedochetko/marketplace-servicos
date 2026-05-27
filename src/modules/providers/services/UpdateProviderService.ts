import AppError from "@shared/errors/AppError";
import UsersRepository from "@modules/users/typeorm/repositories/UsersRepository";
import { UserRole } from "@modules/users/typeorm/entities/User";
import UpdateProviderDTO from "../dtos/UpdateProviderDTO";
import Provider from "../typeorm/entities/Provider";
import ProvidersRepository from "../typeorm/repositories/ProvidersRepository";

interface IRequest extends UpdateProviderDTO {
    id: string;
}

class UpdateProviderService {
    public async execute({ id, user_id, bio, phone, availability }: IRequest): Promise<Provider> {
        const provider = await ProvidersRepository.findOne({
            where: { id },
        });

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        if (user_id !== undefined && user_id !== provider.user_id) {
            const user = await UsersRepository.findOne({
                where: { id: user_id },
            });

            if (!user) {
                throw new AppError("User not found", 404);
            }

            if (user.role !== UserRole.PROVIDER) {
                throw new AppError("User must have provider role");
            }

            const providerWithSameUser = await ProvidersRepository.findOne({
                where: { user_id },
            });

            if (providerWithSameUser && providerWithSameUser.id !== id) {
                throw new AppError("Provider profile already exists for this user");
            }

            provider.user_id = user_id;
        }

        if (bio !== undefined) {
            provider.bio = bio;
        }

        if (phone !== undefined) {
            provider.phone = phone;
        }

        if (availability !== undefined) {
            provider.availability = availability;
        }

        await ProvidersRepository.save(provider);

        return provider;
    }
}

export default UpdateProviderService;
