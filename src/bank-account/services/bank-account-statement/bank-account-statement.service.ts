import { DateRange } from '@app/core/modules/user/validators/date-range.validators';
import { BankAccountStatementRepository } from './../../repositories/bank-account-statement.repository';
import { BankAccountStatementModel } from '@app/bank-account/models/bank-account-transaction.model';
import { BankAccountModel } from '@app/bank-account/models/bank-account.model';
import { inTransaction } from '@app/core/modules/database/';
import { TYPES } from '@app/types';
import { Chance } from 'chance';
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
  async debitAccount(
    accountId: string,
    amount: number,
    editor: UserModel,
    date?: Date,
  ) {
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
      if (date) {
        bankAccount.lastUpdated = date;
      }
      manager.save(BankAccountModel, bankAccount);

      // create statement
      const statement = Object.assign(new BankAccountStatementModel(), {
        account: bankAccount,
        debit: amount,
        createdBy: editor,
      });
      if (date) {
        statement.dateCreated = date;
      }
      return manager.save(BankAccountStatementModel, statement);
    });
  }

  async withdrawAccount(
    accountId: string,
    amount: number,
    editor: UserModel,
    date?: Date,
  ) {
    return inTransaction(this.manager, async (manager) => {
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
      if (date) {
        bankAccount.lastUpdated = date;
      }
      manager.save(BankAccountModel, bankAccount);

      // create statement
      const statement = Object.assign(new BankAccountStatementModel(), {
        account: bankAccount,
        credit: amount,
        createdBy: editor,
      });
      if (date) {
        statement.dateCreated = date;
      }
      return manager.save(BankAccountStatementModel, statement);
    });
  }

  async accountStatement(
    accountID: string,
    dateRange: DateRange,
    skip: number = 0,
    take: number = 50,
  ) {
    const account = await this.manager
      .findOneOrFail(BankAccountModel, accountID)
      .catch(() => {
        throw new NotFoundException(`Account with id:${accountID} not found!`);
      });

    const repository = this.manager.getCustomRepository(
      BankAccountStatementRepository,
    );
    return repository.findStatementByAccountId(
      accountID,
      skip,
      take,
      dateRange,
    );
  }

  async userMonthlyAccountBalance(
    dateRange: DateRange,
    skip: number = 0,
    take: number = 50,
    user: UserModel,
  ) {
    const repository = this.manager.getCustomRepository(
      BankAccountStatementRepository,
    );
    return repository.userMonthlyAccountBalance(user.id, skip, take, dateRange);
  }

  async generateDummyData(user) {
    // create data from Jan
    const chance = new Chance();
    for (let x = 0; x < 100; x++) {
      const accounts = await this.manager.find(BankAccountModel, {
        where: { deleted: false },
        relations: ['owners', 'owners.user'],
      });

      const operation = chance.pickone(['debit', 'withdraw']);
      const dateCreated = chance.date({ year: 2022 });
      const account: BankAccountModel = chance.pickone(accounts);
      if (operation === 'debit') {
        const amount =
          account.currentBalance + chance.natural({ min: 100, max: 2000 });
        await this.debitAccount(account.id, amount, user, dateCreated);
      } else {
        const amount = chance.natural({
          min: 0,
          max: account.currentBalance,
        });
        await this.withdrawAccount(account.id, amount, user, dateCreated);
      }
    }
  }

  constructor(
    @Inject(TYPES.EntityManager)
    private readonly manager: EntityManager,
  ) {}
}
