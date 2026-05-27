import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ensureAuthenticated from "@shared/http/middlewares/ensureAuthenticated";
import ProvidersController from "./controllers/ProvidersController";

const providersRouter = Router();
const providersController = new ProvidersController();

providersRouter.get("/", providersController.index);
providersRouter.get(
    "/:id",
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    providersController.show
);
providersRouter.post(
    "/",
    ensureAuthenticated,
    celebrate({
        [Segments.BODY]: {
            user_id: Joi.string().uuid().required(),
            bio: Joi.string().allow("").optional(),
            phone: Joi.string().allow("").optional(),
            availability: Joi.string().allow("").optional(),
        },
    }),
    providersController.create
);
providersRouter.put<{ id: string }>(
    "/:id",
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            user_id: Joi.string().uuid().optional(),
            bio: Joi.string().allow("").allow(null).optional(),
            phone: Joi.string().allow("").allow(null).optional(),
            availability: Joi.string().allow("").allow(null).optional(),
        },
    }),
    providersController.update
);

export default providersRouter;
