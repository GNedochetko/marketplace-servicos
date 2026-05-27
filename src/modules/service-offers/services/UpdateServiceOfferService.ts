import AppError from "@shared/errors/AppError";
import CategoriesRepository from "@modules/categories/typeorm/repositories/CategoriesRepository";
import ProvidersRepository from "@modules/providers/typeorm/repositories/ProvidersRepository";
import UpdateServiceOfferDTO from "../dtos/UpdateServiceOfferDTO";
import ServiceOffer from "../typeorm/entities/ServiceOffer";
import ServiceOffersRepository from "../typeorm/repositories/ServiceOffersRepository";

interface IRequest extends UpdateServiceOfferDTO {
    id: string;
}

class UpdateServiceOfferService {
    public async execute({
        id,
        provider_id,
        category_id,
        title,
        description,
        price,
        availability,
    }: IRequest): Promise<ServiceOffer> {
        const serviceOffer = await ServiceOffersRepository.findOne({
            where: { id },
        });

        if (!serviceOffer) {
            throw new AppError("Service offer not found", 404);
        }

        if (provider_id !== undefined) {
            const provider = await ProvidersRepository.findOne({
                where: { id: provider_id },
            });

            if (!provider) {
                throw new AppError("Provider not found", 404);
            }

            serviceOffer.provider_id = provider_id;
        }

        if (category_id !== undefined) {
            const category = await CategoriesRepository.findOne({
                where: { id: category_id },
            });

            if (!category) {
                throw new AppError("Category not found", 404);
            }

            serviceOffer.category_id = category_id;
        }

        if (title !== undefined) {
            serviceOffer.title = title;
        }

        if (description !== undefined) {
            serviceOffer.description = description;
        }

        if (price !== undefined) {
            serviceOffer.price = price;
        }

        if (availability !== undefined) {
            serviceOffer.availability = availability;
        }

        await ServiceOffersRepository.save(serviceOffer);

        return serviceOffer;
    }
}

export default UpdateServiceOfferService;
