import { Request, Response } from "express";
import CreateServiceOfferService from "../services/CreateServiceOfferService";
import ListServiceOffersService from "../services/ListServiceOffersService";
import ShowServiceOfferService from "../services/ShowServiceOfferService";
import UpdateServiceOfferService from "../services/UpdateServiceOfferService";

interface ServiceOfferParams {
    id: string;
}

class ServiceOffersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const {
            provider_id,
            category_id,
            title,
            description,
            price,
            availability,
        } = request.body;

        const createServiceOffer = new CreateServiceOfferService();

        const serviceOffer = await createServiceOffer.execute({
            provider_id,
            category_id,
            title,
            description,
            price,
            availability,
        });

        return response.status(201).json(serviceOffer);
    }

    public async index(request: Request, response: Response): Promise<Response> {
        const listServiceOffers = new ListServiceOffersService();

        const serviceOffers = await listServiceOffers.execute();

        return response.status(200).json(serviceOffers);
    }

    public async show(request: Request<ServiceOfferParams>, response: Response): Promise<Response> {
        const { id } = request.params;

        const showServiceOffer = new ShowServiceOfferService();

        const serviceOffer = await showServiceOffer.execute({ id });

        return response.status(200).json(serviceOffer);
    }

    public async update(request: Request<ServiceOfferParams>, response: Response): Promise<Response> {
        const { id } = request.params;
        const {
            provider_id,
            category_id,
            title,
            description,
            price,
            availability,
        } = request.body;

        const updateServiceOffer = new UpdateServiceOfferService();

        const serviceOffer = await updateServiceOffer.execute({
            id,
            provider_id,
            category_id,
            title,
            description,
            price,
            availability,
        });

        return response.status(200).json(serviceOffer);
    }
}

export default ServiceOffersController;
