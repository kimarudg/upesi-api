import { ApiResponseProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from '@core/modules/user/models/user.model';

import { GraphQLJSON } from 'graphql-type-json';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AsEither, AsInput, AsOutput } from '@core/validators';
import { PermissionModel } from './permissions.model';

@ObjectType()
@Entity({ name: 'system_roles' })
export class SystemRoleModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty(AsInput)
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @Field((type) => String, { nullable: false })
  @Column({ name: 'role_name', nullable: false })
  @IsNotEmpty(AsEither)
  @IsString(AsEither)
  @ApiResponseProperty()
  name: string;

  @Field((type) => Boolean, { nullable: false })
  @Column({ name: 'readonly', nullable: false, default: false })
  @IsOptional(AsInput)
  @IsNotEmpty(AsEither)
  @ApiResponseProperty()
  readonly: boolean;

  @Field((type) => [PermissionModel], { nullable: true })
  @OneToMany((type) => PermissionModel, (permissions) => permissions.role)
  @IsNotEmpty(AsInput)
  permissions?: PermissionModel[];

  @Field((type) => [UserModel], { nullable: true })
  @ApiResponseProperty()
  @ManyToMany((type) => UserModel, (user) => user.systemRoles)
  users?: UserModel[];
}
