import { Request, Response, NextFunction } from "express";
import CreateServiceOfferService from "../services/CreateServiceOfferService";
import ListServiceOfferService from "../services/ListServiceOfferService";
import DeleteServiceOfferService from "../services/DeleteServiceOfferService";
import ShowServiceOfferService from "../services/ShowServiceOfferService";
import UpdateServiceOfferService from "../services/UpdateServiceOfferService";

export default class ServiceOfferController {
    public async index(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
        try {
            const listServiceOfferService = new ListServiceOfferService();

            const serviceOffers = await listServiceOfferService.execute();

            return response.status(200).json(serviceOffers);
        } catch (error) {
            next(error);
        }
    }

    public async show(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
        try {
            const id = request.params.id as string;

            const showServiceOfferService = new ShowServiceOfferService();

            const serviceOffer = await showServiceOfferService.execute({ id });

            return response.status(200).json(serviceOffer);
        } catch (error) {
            next(error);
        }
    }

    public async create(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { title, description, category, price, provider_name, availability } = request.body;

            const createServiceOfferService = new CreateServiceOfferService();

            const serviceOffer = await createServiceOfferService.execute({
                title,
                description,
                category,
                price,
                provider_name,
                availability
            });

            return response.status(201).json(serviceOffer);
        } catch (error) {
            next(error);
        }
    }

    public async update(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
        try {
            const id = request.params.id as string;
            const { title, description, category, price, provider_name, availability } = request.body;

            const updateServiceOfferService = new UpdateServiceOfferService();

            const serviceOffer = await updateServiceOfferService.execute({
                id,
                title,
                description,
                category,
                price,
                provider_name,
                availability
            });

            return response.status(200).json(serviceOffer);
        } catch (error) {
            next(error);
        }
    }

    public async delete(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
        try {
            const id = request.params.id as string;

            const deleteServiceOfferService = new DeleteServiceOfferService();

            await deleteServiceOfferService.execute({ id });

            return response.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
