import Category from "../typeorm/entities/Category";
import CategoriesRepository from "../typeorm/repositories/CategoriesRepository";

class ListCategoriesService {
    public async execute(): Promise<Category[]> {
        return CategoriesRepository.find({
            order: {
                name: "ASC",
            },
        });
    }
}

export default ListCategoriesService;