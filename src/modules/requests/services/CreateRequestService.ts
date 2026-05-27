import AppError from "@shared/errors/AppError";
import ProvidersRepository from "@modules/providers/typeorm/repositories/ProvidersRepository";
import ServiceOffersRepository from "@modules/service-offers/typeorm/repositories/ServiceOffersRepository";
import { UserRole } from "@modules/users/typeorm/entities/User";
import UsersRepository from "@modules/users/typeorm/repositories/UsersRepository";
import CreateRequestDTO from "../dtos/CreateRequestDTO";
import Request, { RequestStatus } from "../typeorm/entities/Request";
import RequestsRepository from "../typeorm/repositories/RequestsRepository";

class CreateRequestService {
    public async execute({
        client_id,
        provider_id,
        service_offer_id,
        notes,
    }: CreateRequestDTO): Promise<Request> {
        const client = await UsersRepository.findOne({
            where: { id: client_id },
        });

        if (!client) {
            throw new AppError("Client not found", 404);
        }

        if (client.role !== UserRole.CLIENT) {
            throw new AppError("User must have client role");
        }

        const provider = await ProvidersRepository.findOne({
            where: { id: provider_id },
        });

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        const serviceOffer = await ServiceOffersRepository.findOne({
            where: { id: service_offer_id },
        });

        if (!serviceOffer) {
            throw new AppError("Service offer not found", 404);
        }

        if (serviceOffer.provider_id !== provider_id) {
            throw new AppError("Service offer does not belong to this provider");
        }

        const serviceRequest = RequestsRepository.create({
            client_id,
            provider_id,
            service_offer_id,
            notes: notes ?? null,
            status: RequestStatus.PENDING,
        });

        await RequestsRepository.save(serviceRequest);

        return serviceRequest;
    }
}

export default CreateRequestService;
