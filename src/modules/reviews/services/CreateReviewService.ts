import AppError from "@shared/errors/AppError";
import { RequestStatus } from "@modules/requests/typeorm/entities/Request";
import RequestsRepository from "@modules/requests/typeorm/repositories/RequestsRepository";
import CreateReviewDTO from "../dtos/CreateReviewDTO";
import Review from "../typeorm/entities/Review";
import ReviewsRepository from "../typeorm/repositories/ReviewsRepository";

class CreateReviewService {
    public async execute({
        request_id,
        client_id,
        provider_id,
        rating,
        comment,
    }: CreateReviewDTO): Promise<Review> {
        if (rating < 1 || rating > 5) {
            throw new AppError("Rating must be between 1 and 5");
        }

        const serviceRequest = await RequestsRepository.findOne({
            where: { id: request_id },
        });

        if (!serviceRequest) {
            throw new AppError("Request not found", 404);
        }

        if (serviceRequest.status !== RequestStatus.COMPLETED) {
            throw new AppError("Only completed requests can be reviewed");
        }

        if (serviceRequest.client_id !== client_id) {
            throw new AppError("Client does not match request");
        }

        if (serviceRequest.provider_id !== provider_id) {
            throw new AppError("Provider does not match request");
        }

        const reviewExists = await ReviewsRepository.findOne({
            where: { request_id },
        });

        if (reviewExists) {
            throw new AppError("Request already has a review");
        }

        const review = ReviewsRepository.create({
            request_id,
            client_id,
            provider_id,
            rating,
            comment: comment ?? null,
        });

        await ReviewsRepository.save(review);

        return review;
    }
}

export default CreateReviewService;
