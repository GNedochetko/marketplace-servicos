import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ensureAuthenticated from "@shared/http/middlewares/ensureAuthenticated";
import ReviewsController from "./controllers/ReviewsController";

const reviewsRouter = Router();
const reviewsController = new ReviewsController();

reviewsRouter.post(
    "/",
    ensureAuthenticated,
    celebrate({
        [Segments.BODY]: {
            request_id: Joi.string().uuid().required(),
            client_id: Joi.string().uuid().required(),
            provider_id: Joi.string().uuid().required(),
            rating: Joi.number().integer().min(1).max(5).required(),
            comment: Joi.string().allow("").optional(),
        },
    }),
    reviewsController.create
);
reviewsRouter.get(
    "/provider/:provider_id",
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    reviewsController.listByProvider
);

export default reviewsRouter;
