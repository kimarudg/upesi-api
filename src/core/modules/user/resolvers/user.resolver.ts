import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
// import { GraphQLUpload } from 'apollo-server-core';\
import { FileUpload } from 'graphql-upload';
import { GraphQLUpload } from 'apollo-server-express';
import { Int } from '@nestjs/graphql';
import { GqlAuthGuard } from '@core/modules/user/guards/gql-auth.guard';
import { TYPES } from '@app/types';
import { UserModel } from '@core/modules/user/models';
import { UserResponse } from '@core/modules/user/responses';
import { UserService } from '@core/modules/user/services/user/service';
import {
  CreateUserInput,
  RegisterUserInput,
} from '@core/modules/user/validators';
import { UserSearchCriteria } from '../validators/user-search-criteria';

@Resolver((of) => UserModel)
export class UserResolver {
  constructor(
    @Inject(TYPES.UserService) private readonly service: UserService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query((returns) => UserModel)
  async user(@Args('id') id: string): Promise<UserModel> {
    const client = await this.service.repository.findById(id);
    if (!client) {
      throw new NotFoundException(`Could not find a client with Id: ${id}`);
    }
    return client;
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => UserResponse)
  async users(
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip = 0,
    @Args({ name: 'take', type: () => Int, nullable: true }) take = 50,
    @Args({
      name: 'searchCriteria',
      type: () => UserSearchCriteria,
      nullable: true,
    })
    searchCriteria?: UserSearchCriteria,
  ): Promise<UserResponse> {
    const [list, count] =
      await this.service.repository.getPaginatedSearchResults(
        skip,
        take,
        searchCriteria,
      );
    return new UserResponse(list, count);
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => UserResponse)
  async searchUsers(
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip = 0,
    @Args({ name: 'take', type: () => Int, nullable: true }) take = 50,
    @Args({
      name: 'searchCriteria',
      type: () => UserSearchCriteria,
      nullable: true,
    })
    searchCriteria?: UserSearchCriteria,
  ): Promise<UserResponse> {
    const [list, count] =
      await this.service.repository.getPaginatedSearchResults(
        skip,
        take,
        searchCriteria,
      );
    return new UserResponse(list, count);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserModel)
  createUser(
    @Args({
      name: 'user',
      type: () => CreateUserInput,
      nullable: false,
    })
    user: CreateUserInput,
  ) {
    return this.service.createUser(user);
  }

  @Mutation((returns) => UserModel)
  async registerUser(
    @Args({ name: 'user', type: () => RegisterUserInput, nullable: false })
    user: RegisterUserInput,
    @Args({ name: 'avatar', type: () => GraphQLUpload, nullable: true })
    avatar: FileUpload,
  ): Promise<UserModel> {
    return this.service.registerUser(user, avatar);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserModel)
  removeRoleFromUser(
    @Args({
      name: 'userId',
      type: () => String,
      nullable: false,
    })
    userId: string,
    @Args({
      name: 'roleId',
      type: () => String,
      nullable: false,
    })
    roleId: string,
  ) {
    return this.service.removeRole(userId, roleId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserModel)
  addRoleToUser(
    @Args({ name: 'userId', type: () => String, nullable: false })
    userId: string,
    @Args({ name: 'roleIds', type: () => String, nullable: false })
    roleIds: string[],
  ) {
    return this.service.addRole(userId, roleIds);
  }
}
