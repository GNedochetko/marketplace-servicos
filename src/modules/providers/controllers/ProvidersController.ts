import { Request, Response } from "express";
import CreateProviderService from "../services/CreateProviderService";
import ListProvidersService from "../services/ListProvidersService";
import ShowProviderService from "../services/ShowProviderService";
import UpdateProviderService from "../services/UpdateProviderService";

interface ProviderParams {
    id: string;
}

class ProvidersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { user_id, bio, phone, availability } = request.body;

        const createProvider = new CreateProviderService();

        const provider = await createProvider.execute({
            user_id,
            bio,
            phone,
            availability,
        });

        return response.status(201).json(provider);
    }

    public async index(request: Request, response: Response): Promise<Response> {
        const listProviders = new ListProvidersService();

        const providers = await listProviders.execute();

        return response.status(200).json(providers);
    }

    public async show(request: Request<ProviderParams>, response: Response): Promise<Response> {
        const { id } = request.params;

        const showProvider = new ShowProviderService();

        const provider = await showProvider.execute({ id });

        return response.status(200).json(provider);
    }

    public async update(request: Request<ProviderParams>, response: Response): Promise<Response> {
        const { id } = request.params;
        const { user_id, bio, phone, availability } = request.body;

        const updateProvider = new UpdateProviderService();

        const provider = await updateProvider.execute({
            id,
            user_id,
            bio,
            phone,
            availability,
        });

        return response.status(200).json(provider);
    }
}

export default ProvidersController;
