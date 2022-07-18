import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BankAccountModel } from '../models/bank-account.model';

@ObjectType()
export class BankAccountResponse {
  constructor(accounts: BankAccountModel[], totalCount: number) {
    this.list = accounts;
    this.totalCount = totalCount;
  }

  @Field(() => Int)
  totalCount: number;

  @Field(() => [BankAccountModel])
  list: BankAccountModel[];
}
