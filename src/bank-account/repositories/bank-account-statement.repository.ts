import { BankAccountStatementModel } from '@app/bank-account/models/bank-account-transaction.model';
import { DateRange } from '@app/core/modules/user/validators/date-range.validators';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(BankAccountStatementModel)
export class BankAccountStatementRepository extends Repository<BankAccountStatementModel> {
  async findStatementByAccountId(
    accountId: string,
    skip = 0,
    take = 50,
    dateRange: DateRange,
  ) {
    const query = this.createQueryBuilder('statement')
      .leftJoinAndSelect('statement.account', 'account') //
      .leftJoinAndSelect('statement.createdBy', 'createdBy') //createdBy
      .where('account.id = :accountId', { accountId })
      .skip(skip)
      .take(take);
    if (dateRange?.startDate && dateRange?.endDate) {
      query.andWhere(
        'date(statement.date_created) >= :startDate and date(statement.date_created) <= :endDate',
        {
          ...dateRange,
        },
      );
    }
    return query.getManyAndCount();
  }

  async userMonthlyAccountBalance(
    userId: string,
    skip = 0,
    take = 50,
    dateRange: DateRange,
  ) {
    const query = this.createQueryBuilder('statement')
      .leftJoinAndSelect('statement.account', 'account') //
      .leftJoinAndSelect('statement.createdBy', 'createdBy') //createdBy
      .leftJoinAndSelect('account.owners', 'owner') //createdBy
      .where('owner.user_id = :userId', { userId })
      .skip(skip)
      .take(take);
    if (dateRange?.startDate && dateRange?.endDate) {
      query.andWhere(
        'date(statement.date_created) >= :startDate and date(statement.date_created) <= :endDate',
        {
          ...dateRange,
        },
      );
    }
    // console.log(query.getSql());
    // console.log('+++++++++++++++++++++++++++++++++++++++++==');
    // console.log('+++++++++++++++++++++++++++++++++++++++++==');
    // console.log('+++++++++++++++++++++++++++++++++++++++++==');
    // console.log(query.getQueryAndParameters());

    return query.getManyAndCount();
  }
}
