import { PermissionModel } from '@core/modules/user/models/permissions.model';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
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
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AsEither, AsInput, AsOutput } from '@core/validators';

@ObjectType()
@Entity({ name: 'system_resources' })
export class SystemResourceModel {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty(AsInput)
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @Field((type) => String, { nullable: false })
  @Column({ name: 'name', nullable: false })
  @IsNotEmpty(AsEither)
  @IsString(AsEither)
  @ApiResponseProperty()
  name: string;

  @Field((type) => GraphQLJSON, { nullable: false })
  @Column({ name: 'attributes', type: 'jsonb', nullable: false })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  attributes: string[];

  @Field((type) => [PermissionModel], { nullable: true })
  @OneToMany((type) => PermissionModel, (permissions) => permissions.role)
  @IsNotEmpty(AsInput)
  @JoinTable()
  permissions?: PermissionModel[];

  constructor(resource: Partial<SystemResourceModel>) {
    Object.assign(this, resource);
  }
}
