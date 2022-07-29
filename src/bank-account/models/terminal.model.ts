import { UserModel } from '@app/core/modules/user/models';
import { DefaultFields } from '@core/constants/entitites/default.fields';
import { AsEither, AsInput, AsOutput } from '@core/validators';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiResponseProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'terminals' })
export class TerminalModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty(AsInput)
  @Index({ unique: true })
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @Field((type) => String, { nullable: false })
  @Column({ name: 'terminal_name', nullable: false })
  @IsDefined(AsEither)
  @IsNotEmpty(AsEither)
  @ApiResponseProperty()
  name: string;

  @Field((type) => Number, { nullable: false })
  @Column({
    name: 'current_balance',
    nullable: false,
    default: 0,
    type: 'double precision',
  })
  @ApiResponseProperty()
  currentBalance: number;

  @Field(() => UserModel, { nullable: false })
  @ManyToOne(() => UserModel, (user) => user.bankAccountCreator, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by' })
  @IsOptional(AsEither)
  @IsString(AsOutput)
  @ApiResponseProperty()
  createdBy?: UserModel;
}
