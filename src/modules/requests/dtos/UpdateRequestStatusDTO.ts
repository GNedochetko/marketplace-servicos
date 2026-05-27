import { RequestStatus } from "../typeorm/entities/Request";

export default interface UpdateRequestStatusDTO {
    status: RequestStatus;
}
