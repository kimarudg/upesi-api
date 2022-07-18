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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccountOwnerModel } from './bank-account-owner.model';

@ObjectType()
@Entity({ name: 'bank_accounts' })
export class BankAccountModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty(AsInput)
  @Index({ unique: true })
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @Field((type) => String, { nullable: true })
  @Column({ name: 'account_name', nullable: true })
  @IsOptional()
  @ApiResponseProperty()
  name?: string;

  @Field((type) => String, { nullable: true })
  @Column({ name: 'account_reference', nullable: true })
  @IsOptional()
  @ApiResponseProperty()
  reference?: string;

  @Field((type) => Number, { nullable: false })
  @Column({
    name: 'current_balance',
    nullable: false,
    default: 0,
    type: 'double precision',
  })
  @ApiResponseProperty()
  currentBalance: number;

  @Field((type) => [BankAccountOwnerModel], { nullable: true })
  @OneToMany((type) => BankAccountOwnerModel, (owner) => owner.account)
  @IsNotEmpty(AsInput)
  @JoinTable()
  owners?: BankAccountOwnerModel[];

  @Field(() => UserModel, { nullable: false })
  @ManyToOne(() => UserModel, (user) => user.bankAccountCreator, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by' })
  @IsOptional(AsEither)
  @IsString(AsOutput)
  @ApiResponseProperty()
  createdBy?: UserModel;

  @Field(() => UserModel, { nullable: false })
  @ManyToOne(() => UserModel, (user) => user.bankAccountEditor, {
    nullable: true,
  })
  @JoinColumn({ name: 'last_updated_by' })
  @IsOptional(AsEither)
  @IsString(AsOutput)
  @ApiResponseProperty()
  lastUpdatedBy?: UserModel;

  @Field((type) => Boolean, { nullable: false })
  @Column({ name: 'archived', default: false })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  archived?: boolean;

  @Field(() => Boolean, { nullable: false })
  @Column({ name: 'deleted', default: false })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  deleted?: boolean;

  @Field(() => Date, { nullable: false })
  @CreateDateColumn({ name: 'date_created', type: 'timestamptz' })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  dateCreated?: Date;

  @Field(() => Date, { nullable: false })
  @UpdateDateColumn({ name: 'last_updated', type: 'timestamptz' })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  lastUpdated?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'date_deleted', nullable: true, type: 'timestamptz' })
  @IsOptional(AsEither)
  @IsDate(AsOutput)
  @ApiResponseProperty()
  dateDeleted?: Date;
}
