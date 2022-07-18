import { BankAccountStatementModel } from '@app/bank-account/models/bank-account-transaction.model';
import { UserModel } from '@core/modules/user/models/user.model';
import { BankAccountModel } from '@app/bank-account/models/bank-account.model';
import { BankAccountResponse } from '@app/bank-account/responses/bank-account.response';
import { BankAccountService } from '@app/bank-account/services/bank-account/bank-account.service';
import { BankAccountInput } from '@app/bank-account/validators/bank-account.validators';
import { TYPES } from '@app/types';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BankAccountStatementService } from '@app/bank-account/services/bank-account-statement/bank-account-statement.service';
import { BankAccountStatementResponse } from '@app/bank-account/responses/bank-account-statement.response';

@Resolver((of) => BankAccountModel)
export class BankAccountResolver {
  @Query(() => BankAccountResponse)
  async getUserBankAccounts(
    @Args('id') id: string,
    @Args('skip') skip: number,
    @Args('take') take: number,
    @Args('search') search: string,
  ): Promise<BankAccountResponse> {
    const [records, count] = await this.service.getUserAccounts(
      id,
      skip,
      take,
      search,
    );
    return new BankAccountResponse(records, count);
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

  constructor(
    @Inject(TYPES.BankAccountService)
    private readonly service: BankAccountService,
    @Inject(TYPES.BankAccountStatementService)
    private readonly statementService: BankAccountStatementService,
  ) {}
}
