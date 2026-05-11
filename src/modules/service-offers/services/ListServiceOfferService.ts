import { AppDataSource } from "@shared/typeorm/data-source";
import ServiceOffer from "../typeorm/entities/ServiceOffer";

export default class ListServiceOfferService {
    public async execute(): Promise<ServiceOffer[]> {
        const serviceOfferRepository = AppDataSource.getRepository(ServiceOffer);

        return await serviceOfferRepository.find();
    }
}
