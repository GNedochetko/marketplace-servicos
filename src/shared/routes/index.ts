import { Router } from "express";
import authRouter from "@modules/auth/routes";
import categoriesRouter from "@modules/categories/routes";
import providersRouter from "@modules/providers/routes";
import requestsRouter from "@modules/requests/routes";
import reviewsRouter from "@modules/reviews/routes";
import serviceOffersRouter from "@modules/service-offers/routes";
import usersRouter from "@modules/users/routes";

const routes = Router();

routes.get('/', (request, response) => {
    response.json({ message: 'Hello Dev!' });
    return;
});

routes.use("/sessions", authRouter);
routes.use("/users", usersRouter);
routes.use("/categories", categoriesRouter);
routes.use("/providers", providersRouter);
routes.use("/service-offers", serviceOffersRouter);
routes.use("/requests", requestsRouter);
routes.use("/reviews", reviewsRouter);

export default routes;
