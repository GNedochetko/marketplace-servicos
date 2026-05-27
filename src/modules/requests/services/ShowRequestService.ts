import AppError from "@shared/errors/AppError";
import Request from "../typeorm/entities/Request";
import RequestsRepository from "../typeorm/repositories/RequestsRepository";

interface IRequest {
    id: string;
}

class ShowRequestService {
    public async execute({ id }: IRequest): Promise<Request> {
        const serviceRequest = await RequestsRepository.findOne({
            where: { id },
            relations: {
                client: true,
                provider: true,
                service_offer: true,
                review: true,
            },
        });

        if (!serviceRequest) {
            throw new AppError("Request not found", 404);
        }

        return serviceRequest;
    }
}

export default ShowRequestService;
