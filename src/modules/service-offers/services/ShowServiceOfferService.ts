import AppError from "@shared/errors/AppError";
import ServiceOffer from "../typeorm/entities/ServiceOffer";
import ServiceOffersRepository from "../typeorm/repositories/ServiceOffersRepository";

interface IRequest {
    id: string;
}

class ShowServiceOfferService {
    public async execute({ id }: IRequest): Promise<ServiceOffer> {
        const serviceOffer = await ServiceOffersRepository.findOne({
            where: { id },
            relations: {
                provider: true,
                category: true,
            },
        });

        if (!serviceOffer) {
            throw new AppError("Service offer not found", 404);
        }

        return serviceOffer;
    }
}

export default ShowServiceOfferService;
