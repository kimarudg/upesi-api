import { Reflector } from '@nestjs/core';
import { IPermission } from './../../../constants/system-admin';
import { AuthorizationService } from './../services/authorization/authorization.service';
import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IdentityProviders } from '@core/modules/user/utils/identity-providers';
import { UserModel } from '@core/modules/user/models/user.model';
import { UserService } from '@core/modules/user/services/user/service';
import { BaseAuthGuard } from './base-auth.guard';

@Injectable()
export class AuthorizationGuard extends BaseAuthGuard {
  constructor(
    @Inject(UserService) userService: UserService,
    @Inject(AuthorizationService) private authService: AuthorizationService, // @Inject(EntityManager) private readonly manager: EntityManager,
    public reflector: Reflector,
  ) {
    super(userService, reflector);
  }
  async isValidUserType(context: any): Promise<boolean> {
    const result = await this.userService.repository
      .createQueryBuilder('user')
      .where('blocked = :blocked', { blocked: false })
      .andWhere('email = :email', { email: context.email })
      .andWhere('active = :active', { active: true })
      .andWhere('confirmed = :confirmed', { confirmed: true })
      .getOne();
    return result !== undefined;
  }

  async isPermitted(user: UserModel, requestContext: ExecutionContext) {
    const permissions = Reflect.getMetadata(
      'permissions',
      requestContext.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    return this.authService.can(user, permissions);
  }

  can(user: UserModel, permissions: IPermission[]): boolean {
    if (this.authService.can(user, permissions)) {
      return true;
    }
    this.raiseUnauthorizedException();
  }

  canAnd(user: UserModel, permissions: IPermission[]) {
    if (this.authService.canAnd(user, permissions)) {
      return true;
    }
    this.raiseUnauthorizedException();
  }

  private raiseUnauthorizedException() {
    throw new UnauthorizedException(
      'User does not have the required permissions',
    );
  }
}
