import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BankAccountOwnerInput } from './bank-account-owner.validators';

@InputType()
export class BankAccountInput {
  @Field((type) => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field((type) => String)
  @IsNotEmpty()
  @IsString()
  reference: string;

  @Field((type) => [BankAccountOwnerInput])
  @IsNotEmpty()
  owners: BankAccountOwnerInput[];
}
