import { Router } from "express";
import serviceOffersRouter from "@modules/service-offers/routes/service-offers.routes";

const routes = Router();

routes.get('/', (request, response) => {
    response.json({ message: 'Hello Dev!' });
    return;
});

routes.use('/service-offers', serviceOffersRouter);

export default routes;
