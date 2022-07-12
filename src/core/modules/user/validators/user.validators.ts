import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Profile } from './../models/profile.model';
import { ProfileInput } from './profile.validator';
import { SystemRoleInput } from './system-role.validator';

@InputType()
export class BaseUserInput {
  @Field((type) => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @IsString()
  phone: string;

  @Field((type) => ProfileInput)
  profile: ProfileInput;
}

@InputType()
export class CreateUserInput extends BaseUserInput {
  @Field((type) => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  needPasswordChange?: boolean;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  passwordHash?: string;

  @Field((type) => SystemRoleInput, { nullable: true })
  @IsOptional()
  systemRoles: SystemRoleInput[];
}

@InputType()
export class RegisterUserInput extends BaseUserInput {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  passwordHash: string;
}
