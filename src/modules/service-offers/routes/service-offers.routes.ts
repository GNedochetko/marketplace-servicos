import { Request, Router } from "express";
import ServiceOfferController from "../controllers/ServiceOfferController";
import { celebrate, Joi, Segments } from 'celebrate';

const serviceOffersRouter = Router();
const serviceOfferController = new ServiceOfferController();

serviceOffersRouter.get('/', async (request, response, next) => {
    try {
        await serviceOfferController.index(request, response, next);
    } catch (error) {
        next(error);
    }
});

serviceOffersRouter.get('/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required()
    })
}), async (request, response, next) => {
    try {
        await serviceOfferController.show(request, response, next);
    } catch (error) {
        next(error);
    }
});

serviceOffersRouter.post('/', celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        price: Joi.number().precision(2).positive().required(),
        provider_name: Joi.string().required(),
        availability: Joi.string().required()
    })
}), async (request, response, next) => {
    try {
        await serviceOfferController.create(request, response, next);
    } catch (error) {
        next(error);
    }
});

serviceOffersRouter.put('/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
        category: Joi.string(),
        price: Joi.number().precision(2).positive(),
        provider_name: Joi.string(),
        availability: Joi.string()
    })
}), async (request: Request<{ id: string }>, response, next) => {
    try {
        await serviceOfferController.update(request, response, next);
    } catch (error) {
        next(error);
    }
});

serviceOffersRouter.delete('/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().uuid().required()
    })
}), async (request: Request<{ id: string }>, response, next) => {
    try {
        await serviceOfferController.delete(request, response, next);
    } catch (error) {
        next(error);
    }
});

export default serviceOffersRouter;
