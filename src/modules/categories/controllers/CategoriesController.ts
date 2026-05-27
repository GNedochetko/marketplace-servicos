import { Request, Response } from "express";
import CreateCategoryService from "../services/CreateCategoryService";
import ListCategoriesService from "../services/ListCategoriesService";
import ShowCategoryService from "../services/ShowCategoryService";
import UpdateCategoryService from "../services/UpdateCategoryService";

interface CategoryParams {
    id: string;
}

class CategoriesController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, description } = request.body;

        const createCategory = new CreateCategoryService();

        const category = await createCategory.execute({
            name,
            description,
        });

        return response.status(201).json(category);
    }

    public async index(request: Request, response: Response): Promise<Response> {
        const listCategories = new ListCategoriesService();

        const categories = await listCategories.execute();

        return response.json(categories);
    }

    public async show(request: Request<CategoryParams>, response: Response): Promise<Response> {
        const { id } = request.params;

        const showCategory = new ShowCategoryService();

        const category = await showCategory.execute({ id });

        return response.status(200).json(category);
    }

    public async update(request: Request<CategoryParams>, response: Response): Promise<Response>{
        const { id } = request.params;
        const {name, description} = request.body;

        const updateCategory = new UpdateCategoryService();

        const category = await updateCategory.execute({
            id,
            name,
            description,
        })

        return response.status(200).json(category);
    }
}

export default CategoriesController;
