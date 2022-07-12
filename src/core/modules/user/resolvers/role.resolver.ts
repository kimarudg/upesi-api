import { GraphQLJSON } from 'graphql-type-json';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { RoleResponse, ResourceResponse } from '@core/modules/user/responses';
import { SystemRoleService } from '@core/modules/user/services/system-roles/system-roles.service';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Permissions } from '@app/core/decorators/permission.decorators';
import { Action } from '@app/core/constants';
import { IsPublic } from '@app/core/decorators';

// @UseGuards(GqlAuthGuard)
@Resolver((of) => SystemRoleModel)
export class RoleResolver {
  constructor(private service: SystemRoleService) {}

  // @UseGuards(GqlAuthGuard, AuthorizationGuard)
  // @Permissions({ resource: 'SystemRoleModel', action: Action.CreateAny })

  @Query((returns) => RoleResponse)
  async roles(
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip = 0,
    @Args({ name: 'take', type: () => Int, nullable: true }) take = 50,
  ): Promise<RoleResponse> {
    const [list, count] = await this.service.getRoles(skip, take);
    return new RoleResponse(list, count);
  }

  @Query((returns) => SystemRoleModel)
  async role(
    @Args({ name: 'id', type: () => String, nullable: false }) id,
  ): Promise<SystemRoleModel> {
    return await this.service.getRole(id);
  }

  @Query((returns) => ResourceResponse)
  async listResources(
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip = 0,
    @Args({ name: 'take', type: () => Int, nullable: true }) take = 50,
  ) {
    const [resources, count] = await this.service.showResources(skip, take);
    return new ResourceResponse(resources, count);
  }

  // @Mutation((returns) => SystemRoleModel)
  // async createRole() {}

  // @Mutation((returns) => SystemRoleModel)
  // async createR() {}
}
