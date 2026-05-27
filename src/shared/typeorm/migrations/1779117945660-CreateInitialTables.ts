import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1779117945660 implements MigrationInterface {
    name = 'CreateInitialTables1779117945660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "request_id" uuid NOT NULL, "client_id" uuid NOT NULL, "provider_id" uuid NOT NULL, "rating" integer NOT NULL, "comment" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_6ea6d2328e7d32aa0b0970d8d9" UNIQUE ("request_id"), CONSTRAINT "CHK_e87bbcfbe3ea0dda3d626010ee" CHECK ("rating" >= 1 AND "rating" <= 5), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum" AS ENUM('pending', 'accepted', 'completed', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" uuid NOT NULL, "provider_id" uuid NOT NULL, "service_offer_id" uuid NOT NULL, "status" "public"."requests_status_enum" NOT NULL DEFAULT 'pending', "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_offers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider_id" uuid NOT NULL, "category_id" uuid NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "availability" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "bio" text, "phone" character varying, "availability" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_842a46f6b0079a69520561eeb6" UNIQUE ("user_id"), CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('client', 'provider')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'client', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_6ea6d2328e7d32aa0b0970d8d96" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_d4e7e923e6bb78a8f0add754493" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_ba7ceb19946b8b23bf5939c930f" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_e336e481a84734861089a92a233" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_66ccb12f47d17ee8d43ad1c015e" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requests" ADD CONSTRAINT "FK_140e12c5bdfdb1d58cbb59fdd9b" FOREIGN KEY ("service_offer_id") REFERENCES "service_offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_offers" ADD CONSTRAINT "FK_e7a40b21f8fd548be206fcc89b2" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_offers" ADD CONSTRAINT "FK_1f8d1173481678a035b4a81a4ec" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "providers" ADD CONSTRAINT "FK_842a46f6b0079a69520561eeb62" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "providers" DROP CONSTRAINT "FK_842a46f6b0079a69520561eeb62"`);
        await queryRunner.query(`ALTER TABLE "service_offers" DROP CONSTRAINT "FK_1f8d1173481678a035b4a81a4ec"`);
        await queryRunner.query(`ALTER TABLE "service_offers" DROP CONSTRAINT "FK_e7a40b21f8fd548be206fcc89b2"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_140e12c5bdfdb1d58cbb59fdd9b"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_66ccb12f47d17ee8d43ad1c015e"`);
        await queryRunner.query(`ALTER TABLE "requests" DROP CONSTRAINT "FK_e336e481a84734861089a92a233"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_ba7ceb19946b8b23bf5939c930f"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_d4e7e923e6bb78a8f0add754493"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_6ea6d2328e7d32aa0b0970d8d96"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "providers"`);
        await queryRunner.query(`DROP TABLE "service_offers"`);
        await queryRunner.query(`DROP TABLE "requests"`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
