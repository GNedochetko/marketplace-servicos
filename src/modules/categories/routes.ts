import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ensureAuthenticated from "@shared/http/middlewares/ensureAuthenticated";
import CategoriesController from "./controllers/CategoriesController";

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

categoriesRouter.get("/", categoriesController.index);
categoriesRouter.get(
    "/:id",
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    categoriesController.show
);
categoriesRouter.post(
    "/",
    ensureAuthenticated,
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().min(2).required(),
            description: Joi.string().allow("").optional(),
        },
    }),
    categoriesController.create
);
categoriesRouter.put<{ id: string }>(
    "/:id",
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            name: Joi.string().min(2).optional(),
            description: Joi.string().allow("").allow(null).optional(),
        },
    }),
    categoriesController.update
);

export default categoriesRouter;
