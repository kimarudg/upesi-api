import {
  Inject,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { AuthResponse } from '@core/modules/user/responses/auth.response';
import { TYPES } from '@app/types';
import { UserModel } from '@core/modules/user/models';
import { UserResponse } from '@core/modules/user/responses';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { AuthService } from '@core/modules/user/services/auth/auth.service';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { IsPublic } from '@app/core/decorators';

@Resolver(AuthResponse)
export class AuthResolver {
  constructor(
    @Inject(TYPES.AuthService) private readonly service: AuthService,
  ) {}

  @IsPublic()
  @Query((returns) => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<UserModel> {
    const user = await this.service.loginUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return new AuthResponse(user);
  }

  // @UseGuards(GqlAuthGuard)
  @Query((returns) => AuthResponse)
  async changePassword(
    @Context('req') request: any,
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
    @Args('confirmPassword') confirmPassword: string,
  ) {
    const user = request.user;
    return this.service.changePassword(user, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  }

  @UseGuards(GqlAuthGuard, AuthorizationGuard)
  @Query((returns) => AuthResponse)
  async verifyAccount(
    @Context('req') request: any,
    @Args('email') email: string,
    @Args('key') key: string,
  ) {
    const user = request.user;
    const verifiedUser = await this.service.verifyAccount({ user, email, key });
    return new AuthResponse(verifiedUser);
  }

  sendCreationEmail() {
    return;
  }
}
