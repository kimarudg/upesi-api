import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

@InputType()
export class BankTransferInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID('4')
  sourceAccount: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsUUID('4')
  destinationAccount: string;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
