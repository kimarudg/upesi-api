import { BankAccountStatementModel } from '@app/bank-account/models/bank-account-transaction.model';
import { BankAccountModel } from '@app/bank-account/models/bank-account.model';
import { BankAccountService } from '@app/bank-account/services/bank-account/bank-account.service';
import { inTransaction } from '@app/core/modules/database/';
import { TYPES } from '@app/types';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserModel } from './../../../core/modules/user/models/user.model';
import { BankAccountRepository } from './../../repositories/bank-account.repository';

@Injectable()
export class BankAccountStatementService {
  async debitAccount(accountId: string, amount: number, editor: UserModel) {
    return inTransaction(this.manager, async (manager) => {
      const bankAccount = await manager
        .findOneOrFail(BankAccountModel, accountId)
        .catch(() => {
          throw new NotFoundException(
            `Account with id:${accountId} not found!`,
          );
        });
      bankAccount.currentBalance = (bankAccount.currentBalance || 0) + amount;
      bankAccount.lastUpdatedBy = editor;
      manager.save(BankAccountModel, bankAccount);

      // create statement
      const statement = Object.assign(new BankAccountStatementModel(), {
        account: bankAccount,
        debit: amount,
        createdBy: editor,
      });
      return manager.save(BankAccountStatementModel, statement);
    });
  }

  async withdrawAccount(accountId: string, amount: number, editor: UserModel) {
    return inTransaction(this.accountRepository.manager, async (manager) => {
      const bankAccount = await manager
        .findOneOrFail(BankAccountModel, accountId)
        .catch(() => {
          throw new NotFoundException(
            `Account with id:${accountId} not found!`,
          );
        });

      const resultingBalance = (bankAccount.currentBalance || 0) - amount;
      if (resultingBalance < 0) {
        throw new Error(
          `The account does not have enough balance to withdraw ${amount}`,
        );
      }
      bankAccount.currentBalance = resultingBalance;
      bankAccount.lastUpdatedBy = editor;
      manager.save(BankAccountModel, bankAccount);

      // create statement
      const statement = Object.assign(new BankAccountStatementModel(), {
        account: bankAccount,
        credit: amount,
        createdBy: editor,
      });
      return manager.save(BankAccountStatementModel, statement);
    });
  }

  constructor(
    @Inject(TYPES.BankAccountRepository)
    private accountRepository: BankAccountRepository,
    @Inject(TYPES.EntityManager)
    private readonly manager: EntityManager,
  ) {}
}
