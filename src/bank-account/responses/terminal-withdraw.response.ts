import { BankAccountModel } from './../models/bank-account.model';
import { TerminalModel } from '@app/bank-account/models/terminal.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TerminalWithdawResponse {
  constructor(terminal: TerminalModel, account: BankAccountModel) {
    this.terminal = terminal;
    this.account = account;
  }

  @Field(() => BankAccountModel)
  account: BankAccountModel;

  @Field(() => TerminalModel)
  terminal: TerminalModel;
}
