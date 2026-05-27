import 'reflect-metadata';
import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import routes from '@shared/routes';
import AppError from '@shared/errors/AppError';
import { AppDataSource } from '@shared/typeorm/data-source';
import { errors } from 'celebrate';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }
    console.error(error);
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

AppDataSource.initialize()
 .then(() => {
    const port = Number(process.env.PORT ?? 5000);

    console.log('✅ Data Source initialized');
    app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}!`);
    });
 })
 .catch((err) => {
    console.error('❌ Error during Data Source initialization:', err);
 });
