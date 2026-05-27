import AppError from "@shared/errors/AppError";
import Category from "../typeorm/entities/Category";
import CategoriesRepository from "../typeorm/repositories/CategoriesRepository";

interface IRequest {
    id: string;
}

class ShowCategoryService {
    public async execute({ id }: IRequest): Promise<Category> {
        const category = await CategoriesRepository.findOne({
            where: { id },
        });

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        return category;
    }
}

export default ShowCategoryService;
