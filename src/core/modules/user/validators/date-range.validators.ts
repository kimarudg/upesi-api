import { IsDate, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DateRange {
  @Field(type => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field()
  @IsDate()
  endDate: Date;
}
