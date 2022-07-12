import { ApiResponseProperty } from '@nestjs/swagger';
import { IsDate, IsEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AsEither, AsInput, AsOutput } from '@core/validators';

@ObjectType()
export class DefaultFields {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  @IsOptional(AsEither)
  @IsUUID('4', AsOutput)
  @ApiResponseProperty()
  id?: string;

  @Field(type => Boolean, { nullable: false })
  @Column({ name: 'archived', default: false })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  archived?: boolean;

  @Field({ nullable: false })
  @Column({ name: 'deleted', default: false })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  deleted?: boolean;

  @Field({ nullable: false })
  @CreateDateColumn({ name: 'date_created', type: 'timestamptz' })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  dateCreated?: Date;

  @Field({ nullable: false })
  @UpdateDateColumn({ name: 'last_updated', type: 'timestamptz' })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  lastUpdated?: Date;

  @Field({ nullable: true })
  @Column({ name: 'date_deleted', nullable: true, type: 'timestamptz' })
  @IsOptional(AsEither)
  @IsDate(AsOutput)
  @ApiResponseProperty()
  dateDeleted?: Date;

  @Field({ nullable: true })
  @Column({ name: 'last_updated_by', nullable: true })
  @IsOptional(AsEither)
  @IsEmpty(AsInput)
  @IsString(AsOutput)
  @ApiResponseProperty()
  lastUpdatedBy?: string;

  @Field({ nullable: true })
  @Column({ name: 'created_by', nullable: true })
  @IsOptional(AsEither)
  @IsString(AsOutput)
  @ApiResponseProperty()
  createdBy?: string;

  @Field(type => GraphQLJSONObject, { nullable: true })
  @Column({ name: 'meta_data', type: 'jsonb', nullable: true, default: {} })
  @IsOptional(AsEither)
  @ApiResponseProperty()
  metaData?: {};
}
