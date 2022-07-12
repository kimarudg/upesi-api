import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { PermissionInput } from './permission.validator';

@InputType()
export class SystemRoleInput {
  @Field(type => String)
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string;

  @Field(type => String)
  @IsString()
  name: string;

  @Field(type => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly?: boolean;

  @Field(type => [PermissionInput], { nullable: true })
  @IsOptional()
  permissions?: PermissionInput[];
}
