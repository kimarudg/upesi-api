import { BankAccountModel } from '@app/bank-account/models/bank-account.model';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(BankAccountModel)
export class BankAccountRepository extends Repository<BankAccountModel> {
  findById(id: string) {
    return this.createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.createdBy', 'bankAccountCreator')
      .leftJoinAndSelect('bankAccount.owners', 'owners')
      .where(
        'bankAccount.deleted = :deleted and bankAccount.archived = :archived',
        {
          deleted: false,
          archived: false,
        },
      )
      .andWhere('bankAccount.id = :id', { id })
      .getOne();
  }

  async getPaginatedUserAccounts(
    userId: string,
    skip: number,
    take: number,
    search?,
  ) {
    return this.createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.owners', 'owners')
      .where(
        'bankAccount.deleted = :deleted and bankAccount.archived = :archived',
        {
          deleted: false,
          archived: false,
        },
      )
      .andWhere('owners.id = :userId', { userId })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }
}
