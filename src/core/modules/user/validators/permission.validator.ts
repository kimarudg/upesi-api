import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PermissionInput {
  @Field(type => String)
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string;

  @Field(type => String)
  @IsString()
  name: string;
}
