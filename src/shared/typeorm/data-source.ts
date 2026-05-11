import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import ServiceOffer from "@modules/service-offers/typeorm/entities/ServiceOffer";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "docker",
    database: process.env.DB_NAME ?? "api-terminal",
    synchronize: false, // sempre false em produção/migrations
    logging: true,
    entities: [ServiceOffer],
    migrations: [path.join("src", "shared", "typeorm", "migrations", "*.ts")], subscribers: [],
}); 
