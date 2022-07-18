import { DefaultFields } from '@core/constants/entitites/default.fields';
import { AsEither, AsInput, AsOutput } from '@core/validators';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
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
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './../../core/modules/user/models/user.model';
import { BankAccountModel } from './bank-account.model';

export enum AccountMandateRoles {
  Optional = 'Optional',
  Mandatory = 'Mandatory',
  Only = 'Only',
}

registerEnumType(AccountMandateRoles, {
  name: 'AccountMandateRoles',
});

@ObjectType()
@Entity({ name: 'bank_account_owners' })
export class BankAccountOwnerModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty(AsInput)
  @Index({ unique: true })
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @ManyToOne(() => BankAccountModel, (acc) => acc.owners, {
    nullable: false,
  })
  @JoinColumn({ name: 'bank_account_id' })
  account: BankAccountModel;

  @ManyToOne(() => UserModel, (user) => user.accounts, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Field((type) => AccountMandateRoles, { nullable: true })
  @Column({
    type: 'text',
    name: 'authorization_type',
    nullable: true,
  })
  @ApiResponseProperty()
  authorizationType?: AccountMandateRoles;

  @Field(() => UserModel, { nullable: false })
  @ManyToOne(() => UserModel, (user) => user.accountOwnerCreator, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by' })
  @IsOptional(AsEither)
  @IsString(AsOutput)
  @ApiResponseProperty()
  createdBy?: UserModel;

  @Field(() => UserModel, { nullable: false })
  @ManyToOne(() => UserModel, (user) => user.accountOwnerEditor, {
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
