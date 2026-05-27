import { AppDataSource } from "@shared/typeorm/data-source";
import Category from "../entities/Category";

const CategoriesRepository = AppDataSource.getRepository(Category);

export default CategoriesRepository;