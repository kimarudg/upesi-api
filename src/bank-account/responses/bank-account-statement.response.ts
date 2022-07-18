import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BankAccountStatementModel } from '../models/bank-account-transaction.model';

@ObjectType()
export class BankAccountStatementResponse {
  constructor(statement: BankAccountStatementModel[], totalCount: number) {
    this.list = statement;
    this.totalCount = totalCount;
  }

  @Field(() => Int)
  totalCount: number;

  @Field(() => [BankAccountStatementModel])
  list: BankAccountStatementModel[];
}
