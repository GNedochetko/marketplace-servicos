import { AppDataSource } from "@shared/typeorm/data-source";
import Request from "../entities/Request";

const RequestsRepository = AppDataSource.getRepository(Request);

export default RequestsRepository;
