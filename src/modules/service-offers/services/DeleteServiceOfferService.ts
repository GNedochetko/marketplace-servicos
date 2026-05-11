import AppError from "@shared/errors/AppError";
import { AppDataSource } from "@shared/typeorm/data-source";
import ServiceOffer from "../typeorm/entities/ServiceOffer";

interface IRequest {
    id: string;
}

export default class DeleteServiceOfferService {
    public async execute({ id }: IRequest): Promise<void> {
        const serviceOfferRepository = AppDataSource.getRepository(ServiceOffer);

        const serviceOffer = await serviceOfferRepository.findOneBy({ id });

        if (!serviceOffer) {
            throw new AppError("Service offer not found.", 404);
        }

        await serviceOfferRepository.remove(serviceOffer);
    }
}
