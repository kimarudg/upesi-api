import { BankAccountStatementModel } from '@app/bank-account/models/bank-account-transaction.model';
import { BankAccountModel } from '@app/bank-account/models/bank-account.model';
import { BankAccountStatementResponse } from '@app/bank-account/responses/bank-account-statement.response';
import { BankAccountResponse } from '@app/bank-account/responses/bank-account.response';
import { BankAccountStatementService } from '@app/bank-account/services/bank-account-statement/bank-account-statement.service';
import { BankAccountService } from '@app/bank-account/services/bank-account/bank-account.service';
import { BankAccountApprovalInput } from '@app/bank-account/validators/bank-account-approval.validators';
import { BankAccountInput } from '@app/bank-account/validators/bank-account.validators';
import { Action } from '@app/core/constants';
import { Permissions } from '@app/core/decorators/permission.decorators';
import { DateRange } from '@app/core/modules/user/validators/date-range.validators';
import { TYPES } from '@app/types';
import { UserModel } from '@core/modules/user/models/user.model';

import { Inject, UnauthorizedException } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver((of) => BankAccountModel)
export class BankAccountResolver {
  @Query(() => BankAccountResponse)
  async getUserBankAccounts(
    @Context('req') request: any,
    @Args({ name: 'userId', type: () => String, nullable: false }) id: string,
    @Args({ name: 'skip', type: () => Int, nullable: false }) skip: number,
    @Args({ name: 'take', type: () => Int, nullable: false }) take: number,
    @Args({ name: 'search', type: () => String, nullable: true })
    search?: string,
  ): Promise<BankAccountResponse> {
    if (id !== request.user.id) {
      throw new UnauthorizedException('Unauthorized access to other accounts');
    }
    const [records, count] = await this.service.getUserAccounts(
      id,
      skip,
      take,
      search,
    );
    return new BankAccountResponse(records, count);
  }

  @Query(() => BankAccountStatementResponse)
  async getAccountStatement(
    @Context('req') request: any,
    @Args({
      name: 'bankAccount',
      type: () => String,
      nullable: false,
    })
    bankAccount: string,
    @Args({
      name: 'dateRange',
      type: () => DateRange,
      nullable: false,
    })
    dateRange: DateRange,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip = 0,
    @Args({ name: 'take', type: () => Int, nullable: true }) take = 50,
  ) {
    const [records, count] = await this.statementService.accountStatement(
      bankAccount,
      dateRange,
      skip,
      take,
    );
    return new BankAccountStatementResponse(records, count);
  }

  @Mutation(() => BankAccountStatementModel)
  async depositAccount(
    @Context('req') request: any,
    @Args({
      name: 'bankAccount',
      type: () => String,
      nullable: false,
    })
    bankAccount: string,

    @Args({
      name: 'amount',
      type: () => Number,
      nullable: false,
    })
    amount: number,
  ) {
    const user = request.user;
    return this.statementService.debitAccount(bankAccount, amount, user);
  }

  @Mutation(() => BankAccountStatementModel)
  async withdrawAccount(
    @Context('req') request: any,
    @Args({
      name: 'bankAccount',
      type: () => String,
      nullable: false,
    })
    bankAccount: string,

    @Args({
      name: 'amount',
      type: () => Number,
      nullable: false,
    })
    amount: number,
  ) {
    const user = request.user;
    return this.statementService.withdrawAccount(bankAccount, amount, user);
  }

  @Mutation(() => BankAccountModel)
  async createBankAccount(
    @Context('req') request: any,
    @Args({
      name: 'bankAccountDetails',
      type: () => BankAccountInput,
      nullable: false,
    })
    bankAccountDetails: BankAccountInput,
  ) {
    const user: UserModel = request.user;
    return this.service.createBankAccount(bankAccountDetails, user);
  }

  @Mutation(() => BankAccountModel)
  async applyForBankAccount(
    @Context('req') request: any,
    @Args({
      name: 'bankAccountDetails',
      type: () => BankAccountInput,
      nullable: false,
    })
    bankAccountDetails: BankAccountInput,
  ) {
    const user: UserModel = request.user;
    return this.service.createBankAccount(bankAccountDetails, user);
  }

  @Permissions({ resource: 'BankAccountModel', action: Action.UpdateAny })
  @Mutation(() => BankAccountModel)
  async approveBankAccount(
    @Context('req') request: any,
    @Args({
      name: 'approval',
      type: () => BankAccountApprovalInput,
      nullable: false,
    })
    approval: BankAccountApprovalInput,
  ) {
    const user: UserModel = request.user;
    return this.service.approveBankAccount(approval, user);
  }

  constructor(
    @Inject(TYPES.BankAccountService)
    private readonly service: BankAccountService,
    @Inject(TYPES.BankAccountStatementService)
    private readonly statementService: BankAccountStatementService,
  ) {}
}
