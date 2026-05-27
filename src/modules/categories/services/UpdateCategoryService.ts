import AppError from "@shared/errors/AppError";
import UpdateCategoryDTO from "../dtos/UpdateCategoryDTO";
import Category from "../typeorm/entities/Category";
import CategoriesRepository from "../typeorm/repositories/CategoriesRepository";

interface IRequest extends UpdateCategoryDTO {
    id: string;
}

class UpdateCategoryService{
    public async execute({id, name, description}: IRequest): Promise<Category>{
        const category = await CategoriesRepository.findOne({
            where: {id},
        });

        if(!category){
            throw new AppError("Category not found", 404);
        }

        if(name && name != category.name){
            const categoryWithSameName = await CategoriesRepository.findOne({
                where: {name},
            })

            if(categoryWithSameName && categoryWithSameName.id != id){
                throw new AppError("Category already exists");
            }

            category.name = name;
        }

        if(description != undefined){
            category.description = description;
        }

        await CategoriesRepository.save(category);

        return category
    }
}

export default UpdateCategoryService