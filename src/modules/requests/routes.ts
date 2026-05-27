import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ensureAuthenticated from "@shared/http/middlewares/ensureAuthenticated";
import RequestsController from "./controllers/RequestsController";
import { RequestStatus } from "./typeorm/entities/Request";

const requestsRouter = Router();
const requestsController = new RequestsController();

requestsRouter.get("/", requestsController.index);
requestsRouter.get(
    "/:id",
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    requestsController.show
);
requestsRouter.post(
    "/",
    ensureAuthenticated,
    celebrate({
        [Segments.BODY]: {
            client_id: Joi.string().uuid().required(),
            provider_id: Joi.string().uuid().required(),
            service_offer_id: Joi.string().uuid().required(),
            notes: Joi.string().allow("").optional(),
        },
    }),
    requestsController.create
);
requestsRouter.put<{ id: string }>(
    "/:id/status",
    ensureAuthenticated,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            status: Joi.string()
                .valid(
                    RequestStatus.PENDING,
                    RequestStatus.ACCEPTED,
                    RequestStatus.COMPLETED,
                    RequestStatus.CANCELED
                )
                .required(),
        },
    }),
    requestsController.updateStatus
);

export default requestsRouter;
