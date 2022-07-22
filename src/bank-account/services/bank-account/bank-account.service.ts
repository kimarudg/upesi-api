import { EntityManager } from 'typeorm';
import { BankAccountOwnerModel } from '@app/bank-account/models/bank-account-owner.model';
import { UserService } from '@core/modules/user/services/user/service';
import { BankAccountInput } from '@app/bank-account/validators/bank-account.validators';
import { TYPES } from '@app/types';
import { UserModel } from '@core/modules/user/models/user.model';
import { Inject, Injectable } from '@nestjs/common';
import { BankAccountRepository } from './../../repositories/bank-account.repository';

@Injectable()
export class BankAccountService {
  repository: BankAccountRepository;

  async createBankAccount(params: BankAccountInput, editor: UserModel) {
    const { name, reference, owners: accountOwners } = params;

    const accountDetails = {
      name,
      reference,
      createdBy: editor,
    };

    const bankAccount = await this.repository.save(accountDetails);
    const owners = await Promise.all(
      accountOwners.map(async (owner) => {
        const { authorizationType, userId } = owner;
        const user = await this.userService.findById(userId);
        const ownerModel: BankAccountOwnerModel = {
          user,
          authorizationType,
          account: bankAccount,
          createdBy: editor,
        };
        return ownerModel;
      }),
    );
    await this.manager.save(BankAccountOwnerModel, owners);
    console.log({ bankAccount });
    return this.repository.findById(bankAccount.id);
  }

  async getBankAccount(id: string) {
    return this.repository.findById(id);
  }

  async getUserAccounts(
    userId: string,
    skip: number,
    take: number,
    searchParams?,
  ) {
    return this.repository.getPaginatedUserAccounts(
      userId,
      skip,
      take,
      searchParams,
    );
  }

  constructor(
    @Inject(TYPES.UserService)
    private readonly userService: UserService,
    @Inject(TYPES.EntityManager)
    private readonly manager: EntityManager,
  ) {
    this.repository = manager.getCustomRepository(BankAccountRepository);
  }
}
