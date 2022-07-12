import { IsEnum, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Gender } from '@app/core/constants';

@InputType()
export class ProfileInput {
  @Field((type) => String)
  @IsString()
  firstName: string;

  @Field((type) => String)
  @IsString()
  lastName: string;

  @Field((type) => String)
  @IsString()
  gender: string;
}
