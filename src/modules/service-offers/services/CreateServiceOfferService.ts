import AppError from "@shared/errors/AppError";
import CategoriesRepository from "@modules/categories/typeorm/repositories/CategoriesRepository";
import ProvidersRepository from "@modules/providers/typeorm/repositories/ProvidersRepository";
import CreateServiceOfferDTO from "../dtos/CreateServiceOfferDTO";
import ServiceOffer from "../typeorm/entities/ServiceOffer";
import ServiceOffersRepository from "../typeorm/repositories/ServiceOffersRepository";

class CreateServiceOfferService {
    public async execute({
        provider_id,
        category_id,
        title,
        description,
        price,
        availability,
    }: CreateServiceOfferDTO): Promise<ServiceOffer> {
        const provider = await ProvidersRepository.findOne({
            where: { id: provider_id },
        });

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        const category = await CategoriesRepository.findOne({
            where: { id: category_id },
        });

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        const serviceOffer = ServiceOffersRepository.create({
            provider_id,
            category_id,
            title,
            description,
            price,
            availability: availability ?? null,
        });

        await ServiceOffersRepository.save(serviceOffer);

        return serviceOffer;
    }
}

export default CreateServiceOfferService;
