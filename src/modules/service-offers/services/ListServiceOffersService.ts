import ServiceOffer from "../typeorm/entities/ServiceOffer";
import ServiceOffersRepository from "../typeorm/repositories/ServiceOffersRepository";

class ListServiceOffersService {
    public async execute(): Promise<ServiceOffer[]> {
        return ServiceOffersRepository.find({
            relations: {
                provider: true,
                category: true,
            },
            order: {
                title: "ASC",
            },
        });
    }
}

export default ListServiceOffersService;
