import { SystemResourceModel } from './system-resource.model';
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
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SystemRoleModel } from './system-roles.model';

import { ApiResponseProperty } from '@nestjs/swagger';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AsEither, AsInput, AsOutput } from '@core/validators';

@ObjectType()
@Entity({ name: 'permissions' })
export class PermissionModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty(AsInput)
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @ManyToOne(() => SystemRoleModel, (role) => role.permissions, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role: SystemRoleModel;

  @ManyToOne(() => SystemResourceModel, (resource) => resource.permissions, {
    nullable: false,
  })
  @JoinColumn({ name: 'resource_id' })
  resource: SystemResourceModel;

  @Field((type) => String, { nullable: false })
  @Column({ name: 'action', nullable: false })
  @IsNotEmpty(AsEither)
  @IsString(AsEither)
  @ApiResponseProperty()
  action: string;

  @Field((type) => String, { nullable: false })
  @Column({ name: 'attributes', nullable: false })
  @IsNotEmpty(AsEither)
  @IsString(AsEither)
  @ApiResponseProperty()
  attributes: string;

  constructor(permission: Partial<PermissionModel>) {
    Object.assign(this, permission);
  }
}
