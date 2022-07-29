import { TerminalModel } from '@app/bank-account/models/terminal.model';
import { TerminalInput } from './../../validators/terminal.validators';
import { inTransaction } from '@app/core/modules/database/';
import { EntityManager } from 'typeorm';
import { BankAccountOwnerModel } from '@app/bank-account/models/bank-account-owner.model';
import { UserService } from '@core/modules/user/services/user/service';
import { BankAccountInput } from '@app/bank-account/validators/bank-account.validators';
import { TYPES } from '@app/types';
import { UserModel } from '@core/modules/user/models/user.model';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BankAccountRepository } from './../../repositories/bank-account.repository';
import { BankAccountModel } from '@app/bank-account/models/bank-account.model';
import { BankAccountApprovalInput } from '@app/bank-account/validators/bank-account-approval.validators';

@Injectable()
export class BankAccountService {
  repository: BankAccountRepository;

  async createBankAccount(params: BankAccountInput, editor: UserModel) {
    const { name, reference, owners: accountOwners, currency } = params;

    const accountDetails = {
      name,
      reference,
      createdBy: editor,
      currency,
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
    return this.repository.findById(bankAccount.id);
  }

  async createTerminal(terminal: TerminalInput, editor: UserModel) {
    return this.manager.save(TerminalModel, {
      name: terminal.name,
      currentBalance: terminal.currentBalance,
    });
  }

  async listTerminals(skip: number = 0, take: number = 20) {
    return this.manager
      .getRepository(TerminalModel)
      .createQueryBuilder('terminal')
      .leftJoinAndSelect('terminal.createdBy', 'createdBy')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async applyBankAccount(params: BankAccountInput, editor: UserModel) {
    const { id } = editor;
    const { name, reference, owners: accountOwners, currency } = params;
    const ownerId = accountOwners.find((o) => o.userId === id);
    if (!ownerId) {
      throw new UnauthorizedException(
        'User can only apply for their own accounts',
      );
    }
    return inTransaction(this.manager, async (manager) => {
      const accountDetails = {
        name,
        reference,
        currency,
        createdBy: editor,
      };
      const bankAccount = await manager.save(BankAccountModel, accountDetails);
      const owners = await Promise.all(
        accountOwners.map(async (owner) => {
          const { authorizationType, userId: id } = owner;
          // const user = await this.userService.findById(userId)
          const user = await manager
            .findOneOrFail(UserModel, { where: { id } })
            .catch((e) => {
              throw new NotFoundException(
                `Account owner with id ${id} not found`,
              );
            });
          const ownerModel: BankAccountOwnerModel = {
            user,
            authorizationType,
            account: bankAccount,
            createdBy: editor,
          };
          return ownerModel;
        }),
      );
      await manager.save(BankAccountOwnerModel, owners);
      return manager.findOne(BankAccountModel, {
        where: { id: bankAccount.id },
        relations: ['owners'],
      });
    });
  }

  async approveBankAccount(
    approval: BankAccountApprovalInput,
    editor: UserModel,
  ) {
    const { accountId, approval: approve } = approval;
    const account = await this.repository.findById(accountId);
    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    account.approved = approve;
    account.approvedBy = editor;
    account.dateApproved = new Date();
    return this.repository.save(account);
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
