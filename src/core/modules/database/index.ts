import { EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

/**
 * TypeORM doesn't support nested transactions so this will execute `runInTransaction` using
 * `manager` if a transaction has already started.
 */
export async function inTransaction<T>(
  manager: EntityManager,
  runInTransaction: (entityManager: EntityManager) => Promise<T>,
  isolationLevel: IsolationLevel = 'READ COMMITTED',
): Promise<T> {
  if (
    manager.queryRunner === undefined ||
    !manager.queryRunner.isTransactionActive
  ) {
    return manager.transaction(isolationLevel, runInTransaction);
  } else {
    return runInTransaction(manager);
  }
}
