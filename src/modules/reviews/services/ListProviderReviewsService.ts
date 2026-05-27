import AppError from "@shared/errors/AppError";
import ProvidersRepository from "@modules/providers/typeorm/repositories/ProvidersRepository";
import Review from "../typeorm/entities/Review";
import ReviewsRepository from "../typeorm/repositories/ReviewsRepository";

interface IRequest {
    provider_id: string;
}

class ListProviderReviewsService {
    public async execute({ provider_id }: IRequest): Promise<Review[]> {
        const provider = await ProvidersRepository.findOne({
            where: { id: provider_id },
        });

        if (!provider) {
            throw new AppError("Provider not found", 404);
        }

        return ReviewsRepository.find({
            where: { provider_id },
            relations: {
                client: true,
                request: true,
            },
            order: {
                created_at: "DESC",
            },
        });
    }
}

export default ListProviderReviewsService;
