import AppError from "@shared/errors/AppError";
import { AppDataSource } from "@shared/typeorm/data-source";
import ServiceOffer from "../typeorm/entities/ServiceOffer";

interface IRequest {
    id: string;
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    provider_name?: string;
    availability?: string;
}

export default class UpdateServiceOfferService {
    public async execute({ id, title, description, category, price, provider_name, availability }: IRequest): Promise<ServiceOffer> {
        const serviceOfferRepository = AppDataSource.getRepository(ServiceOffer);

        const serviceOffer = await serviceOfferRepository.findOneBy({ id });

        if (!serviceOffer) {
            throw new AppError("Service offer not found.", 404);
        }

        serviceOffer.title = title ?? serviceOffer.title;
        serviceOffer.description = description ?? serviceOffer.description;
        serviceOffer.category = category ?? serviceOffer.category;
        serviceOffer.price = price ?? serviceOffer.price;
        serviceOffer.provider_name = provider_name ?? serviceOffer.provider_name;
        serviceOffer.availability = availability ?? serviceOffer.availability;

        await serviceOfferRepository.save(serviceOffer);

        return serviceOffer;
    }
}
