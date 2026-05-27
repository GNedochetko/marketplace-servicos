import { AppDataSource } from "@shared/typeorm/data-source";
import ServiceOffer from "../entities/ServiceOffer";

const ServiceOffersRepository = AppDataSource.getRepository(ServiceOffer);

export default ServiceOffersRepository;
