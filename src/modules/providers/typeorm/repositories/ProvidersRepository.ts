import { AppDataSource } from "@shared/typeorm/data-source";
import Provider from "../entities/Provider";

const ProvidersRepository = AppDataSource.getRepository(Provider);

export default ProvidersRepository;
