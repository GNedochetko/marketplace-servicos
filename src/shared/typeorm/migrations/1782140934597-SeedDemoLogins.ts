import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDemoLogins1782140934597 implements MigrationInterface {
    name = "SeedDemoLogins1782140934597";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const passwordHash = "$2b$08$nUb7Dwl0cDziKk3ORxHZPeUv5q/6gb2pq.taIrYT572AFNb54.29i";

        await queryRunner.query(`
            INSERT INTO "users" ("name", "email", "password", "role")
            VALUES
                ('Ana Souza', 'ana@demo.com', $1, 'client'),
                ('Carlos Lima', 'carlos@demo.com', $1, 'client'),
                ('Joao Eletrica', 'joao@demo.com', $1, 'provider'),
                ('Lucas Reparos', 'lucas@demo.com', $1, 'provider'),
                ('Marina Design', 'marina@demo.com', $1, 'provider')
            ON CONFLICT ("email") DO UPDATE SET
                "name" = EXCLUDED."name",
                "password" = EXCLUDED."password",
                "role" = EXCLUDED."role",
                "updated_at" = now()
        `, [passwordHash]);

        await queryRunner.query(`
            INSERT INTO "providers" ("user_id", "bio", "phone", "availability")
            SELECT
                "id",
                CASE "email"
                    WHEN 'joao@demo.com' THEN 'Eletricista residencial para reparos, instalacoes e manutencao.'
                    WHEN 'lucas@demo.com' THEN 'Tecnico de reparos gerais para pequenos consertos domesticos.'
                    WHEN 'marina@demo.com' THEN 'Designer para identidade visual, artes digitais e materiais graficos.'
                END,
                CASE "email"
                    WHEN 'joao@demo.com' THEN '(11) 90000-1001'
                    WHEN 'lucas@demo.com' THEN '(11) 90000-1002'
                    WHEN 'marina@demo.com' THEN '(11) 90000-1003'
                END,
                'Segunda a sexta, 8h as 18h'
            FROM "users"
            WHERE "email" IN ('joao@demo.com', 'lucas@demo.com', 'marina@demo.com')
            ON CONFLICT ("user_id") DO UPDATE SET
                "bio" = EXCLUDED."bio",
                "phone" = EXCLUDED."phone",
                "availability" = EXCLUDED."availability",
                "updated_at" = now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "providers"
            WHERE "user_id" IN (
                SELECT "id"
                FROM "users"
                WHERE "email" IN ('joao@demo.com', 'lucas@demo.com', 'marina@demo.com')
            )
        `);

        await queryRunner.query(`
            DELETE FROM "users"
            WHERE "email" IN (
                'ana@demo.com',
                'carlos@demo.com',
                'joao@demo.com',
                'lucas@demo.com',
                'marina@demo.com'
            )
        `);
    }
}
