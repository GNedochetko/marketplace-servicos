import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ensureAuthenticated from "@shared/http/middlewares/ensureAuthenticated";
import UsersController from "./controllers/UsersController";
import { UserRole } from "./typeorm/entities/User";

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get("/", usersController.index);
usersRouter.get(
    "/:id",
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    usersController.show
);
usersRouter.post(
    "/",
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().min(2).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid(UserRole.CLIENT, UserRole.PROVIDER).optional(),
        },
    }),
    usersController.create
);
usersRouter.put<{ id: string }>(
    "/:id",
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            name: Joi.string().min(2).optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional(),
            role: Joi.string().valid(UserRole.CLIENT, UserRole.PROVIDER).optional(),
        },
    }),
    usersController.update
);

export default usersRouter;
