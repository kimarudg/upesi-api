import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAccountManagementTables1658640925946 implements MigrationInterface {
    name = 'AddAccountManagementTables1658640925946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_name" character varying, "account_reference" character varying, "current_balance" double precision NOT NULL DEFAULT '0', "archived" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "currency" jsonb NOT NULL, "approved" boolean, "date_approved" TIMESTAMP WITH TIME ZONE, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "date_deleted" TIMESTAMP WITH TIME ZONE, "created_by" uuid NOT NULL, "last_updated_by" uuid, "approved_by" uuid, CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c872de764f2038224a013ff25e" ON "bank_accounts" ("id") `);
        await queryRunner.query(`CREATE TABLE "bank_account_statement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "debit" double precision, "credit" double precision, "archived" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_deleted" TIMESTAMP WITH TIME ZONE, "bank_account_id" uuid NOT NULL, "created_by" uuid NOT NULL, "last_updated_by" uuid, CONSTRAINT "PK_086531b3c4b986595835c296635" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_086531b3c4b986595835c29663" ON "bank_account_statement" ("id") `);
        await queryRunner.query(`CREATE TABLE "bank_account_owners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authorization_type" text, "archived" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_deleted" TIMESTAMP WITH TIME ZONE, "bank_account_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_by" uuid NOT NULL, "last_updated_by" uuid, CONSTRAINT "PK_5e7316e8787cd13918aa24df553" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5e7316e8787cd13918aa24df55" ON "bank_account_owners" ("id") `);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_7046dc30802b1ed936f5d1c8f3b" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_be9a26772d8b1b203561d66eb4e" FOREIGN KEY ("last_updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_ace0d95b3334aeed7ff6ac726f5" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account_statement" ADD CONSTRAINT "FK_186993d138aec061d8a64054ddc" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account_statement" ADD CONSTRAINT "FK_3dece5fff7c96d4a90bc88332f6" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account_statement" ADD CONSTRAINT "FK_bf378d41d2790e7de886a697308" FOREIGN KEY ("last_updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account_owners" ADD CONSTRAINT "FK_93554b82d2c2b094c1c3ee40992" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account_owners" ADD CONSTRAINT "FK_01bc3d8fea2df73453e5a9081c9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account_owners" ADD CONSTRAINT "FK_366ba38491e04d51417439a7fcc" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_account_owners" ADD CONSTRAINT "FK_f690c6911d975b9641799411ac3" FOREIGN KEY ("last_updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_account_owners" DROP CONSTRAINT "FK_f690c6911d975b9641799411ac3"`);
        await queryRunner.query(`ALTER TABLE "bank_account_owners" DROP CONSTRAINT "FK_366ba38491e04d51417439a7fcc"`);
        await queryRunner.query(`ALTER TABLE "bank_account_owners" DROP CONSTRAINT "FK_01bc3d8fea2df73453e5a9081c9"`);
        await queryRunner.query(`ALTER TABLE "bank_account_owners" DROP CONSTRAINT "FK_93554b82d2c2b094c1c3ee40992"`);
        await queryRunner.query(`ALTER TABLE "bank_account_statement" DROP CONSTRAINT "FK_bf378d41d2790e7de886a697308"`);
        await queryRunner.query(`ALTER TABLE "bank_account_statement" DROP CONSTRAINT "FK_3dece5fff7c96d4a90bc88332f6"`);
        await queryRunner.query(`ALTER TABLE "bank_account_statement" DROP CONSTRAINT "FK_186993d138aec061d8a64054ddc"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_ace0d95b3334aeed7ff6ac726f5"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_be9a26772d8b1b203561d66eb4e"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_7046dc30802b1ed936f5d1c8f3b"`);
        await queryRunner.query(`DROP INDEX "IDX_5e7316e8787cd13918aa24df55"`);
        await queryRunner.query(`DROP TABLE "bank_account_owners"`);
        await queryRunner.query(`DROP INDEX "IDX_086531b3c4b986595835c29663"`);
        await queryRunner.query(`DROP TABLE "bank_account_statement"`);
        await queryRunner.query(`DROP INDEX "IDX_c872de764f2038224a013ff25e"`);
        await queryRunner.query(`DROP TABLE "bank_accounts"`);
    }

}
