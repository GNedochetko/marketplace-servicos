import AppError from "@shared/errors/AppError";
import CreateCategoryDTO from "../dtos/CreateCategoryDTO";
import Category from "../typeorm/entities/Category";
import CategoriesRepository from "../typeorm/repositories/CategoriesRepository";

class CreateCategoryService {
    public async execute({ name, description }: CreateCategoryDTO): Promise<Category> {
        const categoryExists = await CategoriesRepository.findOne({
            where: { name },
        });

        if (categoryExists) {
            throw new AppError("Category already exists");
        }

        const category = CategoriesRepository.create({
            name,
            description: description ?? null,
        });

        await CategoriesRepository.save(category);

        return category;
    }
}

export default CreateCategoryService;