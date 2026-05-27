import AppError from "@shared/errors/AppError";
import UpdateRequestStatusDTO from "../dtos/UpdateRequestStatusDTO";
import Request from "../typeorm/entities/Request";
import RequestsRepository from "../typeorm/repositories/RequestsRepository";

interface IRequest extends UpdateRequestStatusDTO {
    id: string;
}

class UpdateRequestStatusService {
    public async execute({ id, status }: IRequest): Promise<Request> {
        const serviceRequest = await RequestsRepository.findOne({
            where: { id },
        });

        if (!serviceRequest) {
            throw new AppError("Request not found", 404);
        }

        serviceRequest.status = status;

        await RequestsRepository.save(serviceRequest);

        return serviceRequest;
    }
}

export default UpdateRequestStatusService;
