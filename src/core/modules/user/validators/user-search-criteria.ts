import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { DateRange } from './date-range.validators';

@InputType()
export class UserSearchCriteria {
  @Field(type => [String], { nullable: true })
  @IsOptional()
  name?: string[];

  @Field(type => [String], { nullable: true })
  @IsOptional()
  type?: string[];

  @Field(type => [String], { nullable: true })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  clientId?: string[];

  @IsArray()
  @IsOptional()
  @ArrayUnique({ each: true })
  @Field(type => [String], { nullable: true })
  ids?: string[];

  @Field(type => [String], { nullable: true })
  @IsOptional()
  batch?: string[];

  @Field(type => String, { nullable: true })
  @IsOptional()
  fileName?: string;

  @Field(type => [String], { nullable: true })
  @IsUUID('4', { each: true })
  @IsOptional()
  audioRatingId?: string[];

  @Field(type => DateRange, { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  dateReceived?: DateRange;

  @Field(type => DateRange, { nullable: true })
  @ValidateNested({ each: true })
  @IsOptional()
  deliveryDate?: DateRange;

  @Field(type => DateRange, { nullable: true })
  @ValidateNested({ each: true })
  @IsOptional()
  dueDate?: DateRange;

  @Field(type => [String], { nullable: true })
  @IsUUID('4', { each: true })
  @IsOptional()
  internalStatusId?: string[];

  @Field(type => [String], { nullable: true })
  @IsUUID('4', { each: true })
  @IsOptional()
  externalStatusId?: string[];

  @Field(type => [String], { nullable: true })
  @IsUUID('4', { each: true })
  @IsOptional()
  userId?: string[];

  @Field(type => DateRange, { nullable: true })
  @ValidateNested({ each: true })
  @IsOptional()
  transcriptionDate?: DateRange;
}
