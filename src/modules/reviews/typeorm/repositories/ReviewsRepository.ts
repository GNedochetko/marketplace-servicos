import { AppDataSource } from "@shared/typeorm/data-source";
import Review from "../entities/Review";

const ReviewsRepository = AppDataSource.getRepository(Review);

export default ReviewsRepository;
