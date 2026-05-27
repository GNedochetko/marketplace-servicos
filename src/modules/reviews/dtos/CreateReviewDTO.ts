export default interface CreateReviewDTO {
    request_id: string;
    client_id: string;
    provider_id: string;
    rating: number;
    comment?: string;
}
