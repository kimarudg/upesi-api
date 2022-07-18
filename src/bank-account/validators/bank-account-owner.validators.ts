import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AccountMandateRoles } from '../models/bank-account-owner.model';

@InputType()
export class BankAccountOwnerInput {
  @Field((type) => String)
  @IsNotEmpty()
  @IsUUID('4')
  userId: string;

  @Field((type) => AccountMandateRoles)
  @IsNotEmpty()
  @IsString()
  authorizationType: AccountMandateRoles;
}
