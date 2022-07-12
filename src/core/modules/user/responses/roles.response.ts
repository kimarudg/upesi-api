import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';

@ObjectType()
export class RoleResponse {
  constructor(roles: SystemRoleModel[], totalCount: number) {
    this.list = roles;
    this.totalCount = totalCount;
  }

  @Field(type => Int)
  totalCount: number;

  @Field(type => [SystemRoleModel])
  list: SystemRoleModel[];
}
