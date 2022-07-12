import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserModel } from '../models';

@ObjectType()
export class UserResponse {
  constructor(clients: UserModel[], totalCount: number) {
    this.list = clients;
    this.totalCount = totalCount;
  }

  @Field(type => Int)
  totalCount: number;

  @Field(type => [UserModel])
  list: UserModel[];
}
