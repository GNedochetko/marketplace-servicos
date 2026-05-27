import { Request, Response } from "express";
import CreateReviewService from "../services/CreateReviewService";
import ListProviderReviewsService from "../services/ListProviderReviewsService";

interface ProviderReviewsParams {
    provider_id: string;
}

class ReviewsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { request_id, client_id, provider_id, rating, comment } = request.body;

        const createReview = new CreateReviewService();

        const review = await createReview.execute({
            request_id,
            client_id,
            provider_id,
            rating,
            comment,
        });

        return response.status(201).json(review);
    }

    public async listByProvider(
        request: Request<ProviderReviewsParams>,
        response: Response
    ): Promise<Response> {
        const { provider_id } = request.params;

        const listProviderReviews = new ListProviderReviewsService();

        const reviews = await listProviderReviews.execute({ provider_id });

        return response.status(200).json(reviews);
    }
}

export default ReviewsController;
