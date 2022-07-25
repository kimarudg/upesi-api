import { BankAccountOwnerModel } from '@app/bank-account/models/bank-account-owner.model';
import { BankAccountStatementModel } from '@app/bank-account/models/bank-account-transaction.model';
import { BankAccountModel } from '@app/bank-account/models/bank-account.model';
import { DefaultFields } from '@core/constants/entitites/default.fields';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';
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
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Profile } from './profile.model';

@ObjectType()
@Entity({ name: 'users' })
@Unique(['email'])
export class UserModel extends DefaultFields {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty(AsInput)
  @Index({ unique: true })
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @Field((type) => String, { nullable: false })
  @Column({ name: 'email', nullable: false })
  @IsNotEmpty(AsEither)
  @IsEmail()
  @Index({ unique: true })
  @ApiResponseProperty()
  email: string;

  @Field((type) => String, { nullable: false })
  @Column({ name: 'phone', nullable: false })
  @IsNotEmpty(AsEither)
  @IsString()
  @MaxLength(14)
  @IsNumberString()
  @Index({ unique: true })
  @ApiResponseProperty()
  phone: string;

  @Column({ name: 'password_hash', nullable: false, select: false })
  @IsNotEmpty(AsInput)
  @IsString(AsEither)
  passwordHash?: string;

  @Field()
  @Column({ name: 'need_password_change', default: true })
  @IsDefined(AsOutput)
  @ApiResponseProperty()
  needPasswordChange?: boolean;

  @Field({ nullable: true })
  @Column({
    name: 'last_login',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp with time zone',
  })
  @IsDefined(AsOutput)
  @IsDate(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  lastLogin?: Date;

  @Field({ nullable: true })
  @Column({ name: 'login_count', default: 0 })
  @IsDefined(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  loginCount?: number;

  @Field()
  @Column({ name: 'failed_logins', default: 0 })
  @IsDefined(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  failedLogins?: number;

  @Field((type) => [SystemRoleModel], { nullable: true })
  @ManyToMany((type) => SystemRoleModel, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }],
  })
  systemRoles?: SystemRoleModel[];

  @Field()
  @Column({ name: 'confirmed', default: false })
  @IsDefined(AsOutput)
  @IsNotEmpty(AsInput)
  @ApiResponseProperty()
  confirmed?: boolean;

  @Field()
  @Column({ name: 'active', default: false })
  @IsDefined(AsOutput)
  @ApiResponseProperty()
  active?: boolean;

  @Column({ name: 'blocked', default: false })
  @IsDefined(AsOutput)
  @ApiResponseProperty()
  blocked?: boolean;

  @Field((type) => Date, { nullable: true })
  @Column({
    name: 'last_seen',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp with time zone',
  })
  @IsDefined(AsOutput)
  @IsDate(AsOutput)
  @IsEmpty(AsInput)
  @ApiResponseProperty()
  lastSeen?: Date;

  @Field((type) => String, { nullable: true })
  @Column({ name: 'avatar_hash', nullable: true })
  @IsOptional()
  @ApiResponseProperty()
  avatarHash?: string;

  @Field((type) => String, { nullable: true })
  @Column({ name: 'identity_provider', nullable: true })
  @IsOptional()
  @ApiResponseProperty()
  identityProvider?: string;

  @Field((type) => Profile, { nullable: false })
  @Column({ name: 'profile', type: 'jsonb', nullable: true })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  profile?: Profile;

  @Field((type) => [BankAccountOwnerModel], { nullable: true })
  @OneToMany((type) => BankAccountOwnerModel, (owner) => owner.user)
  @IsNotEmpty(AsInput)
  @JoinTable()
  accounts?: BankAccountOwnerModel[];

  @Field((type) => [BankAccountStatementModel], { nullable: true })
  @OneToMany((type) => BankAccountStatementModel, (editor) => editor.createdBy)
  @IsNotEmpty(AsInput)
  @JoinTable()
  trxCreator?: BankAccountStatementModel[];

  @Field((type) => [BankAccountStatementModel], { nullable: true })
  @OneToMany(
    (type) => BankAccountStatementModel,
    (editor) => editor.lastUpdatedBy,
  )
  @IsNotEmpty(AsInput)
  @JoinTable()
  trxEditor?: BankAccountStatementModel[];

  @Field((type) => [BankAccountModel], { nullable: true })
  @OneToMany((type) => BankAccountModel, (editor) => editor.lastUpdatedBy)
  @IsNotEmpty(AsInput)
  @JoinTable()
  bankAccountCreator?: BankAccountModel[];

  @Field((type) => [BankAccountModel], { nullable: true })
  @OneToMany((type) => BankAccountModel, (editor) => editor.lastUpdatedBy)
  @IsNotEmpty(AsInput)
  @JoinTable()
  bankAccountEditor?: BankAccountModel[];

  @Field((type) => [BankAccountModel], { nullable: true })
  @OneToMany((type) => BankAccountModel, (editor) => editor.approvedBy)
  @IsNotEmpty(AsInput)
  @JoinTable()
  bankAccountApproved?: BankAccountModel[];

  @Field((type) => [BankAccountOwnerModel], { nullable: true })
  @OneToMany((type) => BankAccountOwnerModel, (editor) => editor.createdBy)
  @IsNotEmpty(AsInput)
  @JoinTable()
  accountOwnerCreator?: BankAccountOwnerModel[];

  @Field((type) => [BankAccountOwnerModel], { nullable: true })
  @OneToMany((type) => BankAccountOwnerModel, (editor) => editor.lastUpdatedBy)
  @IsNotEmpty(AsInput)
  @JoinTable()
  accountOwnerEditor?: BankAccountOwnerModel[];
}
