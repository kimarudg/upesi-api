import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAtmTerminalsTables1659068153696 implements MigrationInterface {
    name = 'AddAtmTerminalsTables1659068153696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "terminals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "terminal_name" character varying NOT NULL, "current_balance" double precision NOT NULL DEFAULT '0', "created_by" uuid NOT NULL, CONSTRAINT "PK_cd9f1bbe36836bffd5217d3fe60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cd9f1bbe36836bffd5217d3fe6" ON "terminals" ("id") `);
        await queryRunner.query(`ALTER TABLE "terminals" ADD CONSTRAINT "FK_58d6e88dd529882c6e1de2f885c" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "terminals" DROP CONSTRAINT "FK_58d6e88dd529882c6e1de2f885c"`);
        await queryRunner.query(`DROP INDEX "IDX_cd9f1bbe36836bffd5217d3fe6"`);
        await queryRunner.query(`DROP TABLE "terminals"`);
    }

}
