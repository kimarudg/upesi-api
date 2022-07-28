import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class BankAccountApprovalInput {
  @Field((type) => String)
  @IsNotEmpty()
  @IsUUID('4')
  accountId: string;

  @Field((type) => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  approval: boolean;
}
