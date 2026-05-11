import AppError from "@shared/errors/AppError";
import { AppDataSource } from "@shared/typeorm/data-source";
import ServiceOffer from "../typeorm/entities/ServiceOffer";

interface IRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  provider_name: string;
  availability: string;
}

export default class CreateServiceOfferService {
    public async execute({ title, description, category, price, provider_name, availability }: IRequest): Promise<ServiceOffer> {
        const serviceOfferRepository = AppDataSource.getRepository(ServiceOffer);

        const serviceOfferExists = await serviceOfferRepository.findOne({ where: { title, provider_name } });

        if (serviceOfferExists) {
            throw new AppError("Service offer with this title already exists for this provider.", 400);
        }

        const serviceOffer = serviceOfferRepository.create({
            title,
            description,
            category,
            price,
            provider_name,
            availability
        });

        await serviceOfferRepository.save(serviceOffer);

        return serviceOffer;
    }
}
