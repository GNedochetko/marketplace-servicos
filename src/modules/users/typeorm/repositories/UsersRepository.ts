import { AppDataSource } from "@shared/typeorm/data-source";
import User from "../entities/User";

const UsersRepository = AppDataSource.getRepository(User);

export default UsersRepository;