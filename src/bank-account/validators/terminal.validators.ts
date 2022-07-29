import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class TerminalInput {
  @Field((type) => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field((type) => Number)
  @IsNotEmpty()
  @IsNumber()
  currentBalance: number;
}
