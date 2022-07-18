import { BankAccountStatementModel } from '@app/bank-account/models/bank-account-transaction.model';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(BankAccountStatementModel)
export class BankAccountStatementRepository extends Repository<BankAccountStatementModel> {
  findStatementByAccountId(accountId: string, skip = 0, take = 50) {
    return this.createQueryBuilder('statement')
      .leftJoinAndSelect('statement.account', 'account')
      .where('account.id = :accountId', { accountId })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }
}
