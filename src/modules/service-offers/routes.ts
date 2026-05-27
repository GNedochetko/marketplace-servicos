import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ensureAuthenticated from "@shared/http/middlewares/ensureAuthenticated";
import ServiceOffersController from "./controllers/ServiceOffersController";

const serviceOffersRouter = Router();
const serviceOffersController = new ServiceOffersController();

serviceOffersRouter.get("/", serviceOffersController.index);
serviceOffersRouter.get(
    "/:id",
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    serviceOffersController.show
);
serviceOffersRouter.post(
    "/",
    ensureAuthenticated,
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            category_id: Joi.string().uuid().required(),
            title: Joi.string().min(2).required(),
            description: Joi.string().required(),
            price: Joi.number().positive().required(),
            availability: Joi.string().allow("").optional(),
        },
    }),
    serviceOffersController.create
);
serviceOffersRouter.put<{ id: string }>(
    "/:id",
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().optional(),
            category_id: Joi.string().uuid().optional(),
            title: Joi.string().min(2).optional(),
            description: Joi.string().optional(),
            price: Joi.number().positive().optional(),
            availability: Joi.string().allow("").allow(null).optional(),
        },
    }),
    serviceOffersController.update
);

export default serviceOffersRouter;
