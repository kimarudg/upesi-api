import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialDatabaseMigration1634616044753 implements MigrationInterface {
    name = 'InitialDatabaseMigration1634616044753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "system_resources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "attributes" jsonb NOT NULL, CONSTRAINT "PK_6d8ad7cefe7e622b8059c720d8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "archived" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_deleted" TIMESTAMP WITH TIME ZONE, "last_updated_by" character varying, "created_by" character varying, "meta_data" jsonb DEFAULT '{}', "email" character varying NOT NULL, "phone" character varying NOT NULL, "password_hash" character varying NOT NULL, "need_password_change" boolean NOT NULL DEFAULT true, "last_login" TIMESTAMP WITH TIME ZONE DEFAULT now(), "login_count" integer NOT NULL DEFAULT '0', "failed_logins" integer NOT NULL DEFAULT '0', "confirmed" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT false, "blocked" boolean NOT NULL DEFAULT false, "last_seen" TIMESTAMP WITH TIME ZONE DEFAULT now(), "avatar_hash" character varying, "identity_provider" character varying, "profile" jsonb, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a3ffb1c0c8416b9fc6f907b743" ON "users" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone") `);
        await queryRunner.query(`CREATE TABLE "system_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_name" character varying NOT NULL, "readonly" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_468b99ca2261e84113b6ec40814" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "attributes" character varying NOT NULL, "role_id" uuid NOT NULL, "resource_id" uuid NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "system_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_a5b7bf2f14f8df49fc610e9a8be" FOREIGN KEY ("resource_id") REFERENCES "system_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "system_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_a5b7bf2f14f8df49fc610e9a8be"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_f10931e7bb05a3b434642ed2797"`);
        await queryRunner.query(`DROP INDEX "IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "system_roles"`);
        await queryRunner.query(`DROP INDEX "IDX_a000cca60bcf04454e72769949"`);
        await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "IDX_a3ffb1c0c8416b9fc6f907b743"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "system_resources"`);
    }

}
