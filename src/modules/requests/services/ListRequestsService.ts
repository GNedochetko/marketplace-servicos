import Request from "../typeorm/entities/Request";
import RequestsRepository from "../typeorm/repositories/RequestsRepository";

class ListRequestsService {
    public async execute(): Promise<Request[]> {
        return RequestsRepository.find({
            relations: {
                client: true,
                provider: true,
                service_offer: true,
            },
            order: {
                created_at: "DESC",
            },
        });
    }
}

export default ListRequestsService;
