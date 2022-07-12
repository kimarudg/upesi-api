import { Gender } from '@app/core/constants';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field((type) => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;
}
