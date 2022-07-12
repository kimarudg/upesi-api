import { FactoryProvider, Module, Global } from '@nestjs/common';
import { TYPES } from '@app/types';
import * as typeorm from 'typeorm';
import { config } from '@config/index';
import { onModuleDestroy } from '@core/validators';

const databaseProvider = {
  provide: TYPES.AsyncDatabaseConnection,
  useFactory: async () => {
    const conn = await typeorm.createConnection({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.name,
      entities: config.isDevelopment
        ? ['src/**/*.model.ts']
        : ['dist/**/*.model.js'],
      synchronize: false,
      logging: config.db.logging,
      // subscribers: [ConnectionSavingSubscriber, ProfileSavingSubscriber],
    });
    return onModuleDestroy(conn, c => c.close());
  },
};

const queryRunnerProvider: FactoryProvider = {
  provide: TYPES.QueryRunner,
  useFactory: async (cxn: typeorm.Connection) => {
    if (!cxn.isConnected) {
      await cxn.connect();
    }
    const runner = cxn.createQueryRunner();
    await runner.connect();
    return onModuleDestroy(runner, r => r.release());
  },
  inject: [TYPES.AsyncDatabaseConnection],
};
const entityManagerProvider: FactoryProvider = {
  provide: TYPES.EntityManager,
  useFactory: async (cxn: typeorm.Connection) => {
    if (!cxn.isConnected) {
      await cxn.connect();
    }
    const manager = cxn.createEntityManager();
    return onModuleDestroy(manager, m => m.release());
  },
  inject: [TYPES.AsyncDatabaseConnection],
};

@Global()
@Module({
  providers: [databaseProvider, queryRunnerProvider, entityManagerProvider],
  exports: [databaseProvider, queryRunnerProvider, entityManagerProvider],
})
export class DatabaseModule {
  static forTransaction(em: typeorm.EntityManager) {
    const emProvider = {
      provide: TYPES.EntityManager,
      useValue: em,
    };
    const cxnProvider = {
      provide: TYPES.AsyncDatabaseConnection,
      useValue: em.connection,
    };

    return {
      module: DatabaseModule,
      providers: [emProvider, cxnProvider],
      exports: [emProvider, cxnProvider],
    };
  }
}
