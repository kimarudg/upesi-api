import { TerminalModel } from '@app/bank-account/models/terminal.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TerminalResponse {
  constructor(accounts: TerminalModel[], totalCount: number) {
    this.list = accounts;
    this.totalCount = totalCount;
  }

  @Field(() => Int)
  totalCount: number;

  @Field(() => [TerminalModel])
  list: TerminalModel[];
}
