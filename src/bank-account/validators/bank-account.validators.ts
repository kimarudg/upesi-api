import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
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

  @Field((type) => GraphQLJSONObject, { nullable: false })
  currency: { [key: string]: any }[];

  @Field((type) => [BankAccountOwnerInput])
  @IsNotEmpty()
  owners: BankAccountOwnerInput[];
}
