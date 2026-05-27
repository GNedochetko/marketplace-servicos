import { Request, Response } from "express";
import CreateRequestService from "../services/CreateRequestService";
import ListRequestsService from "../services/ListRequestsService";
import ShowRequestService from "../services/ShowRequestService";
import UpdateRequestStatusService from "../services/UpdateRequestStatusService";

interface RequestParams {
    id: string;
}

class RequestsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { client_id, provider_id, service_offer_id, notes } = request.body;

        const createRequest = new CreateRequestService();

        const serviceRequest = await createRequest.execute({
            client_id,
            provider_id,
            service_offer_id,
            notes,
        });

        return response.status(201).json(serviceRequest);
    }

    public async index(request: Request, response: Response): Promise<Response> {
        const listRequests = new ListRequestsService();

        const serviceRequests = await listRequests.execute();

        return response.status(200).json(serviceRequests);
    }

    public async show(request: Request<RequestParams>, response: Response): Promise<Response> {
        const { id } = request.params;

        const showRequest = new ShowRequestService();

        const serviceRequest = await showRequest.execute({ id });

        return response.status(200).json(serviceRequest);
    }

    public async updateStatus(request: Request<RequestParams>, response: Response): Promise<Response> {
        const { id } = request.params;
        const { status } = request.body;

        const updateRequestStatus = new UpdateRequestStatusService();

        const serviceRequest = await updateRequestStatus.execute({
            id,
            status,
        });

        return response.status(200).json(serviceRequest);
    }
}

export default RequestsController;
