import { IS_PUBLIC_KEY } from './../../../constants/system-admin';
import { Reflector } from '@nestjs/core';
import { UserModel } from './../models/user.model';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getTokenFromHeader } from '@core/modules/user/utils/get-token';
import { UserService } from '@core/modules/user/services/user/service';

@Injectable()
export abstract class BaseAuthGuard implements CanActivate {
  constructor(public userService: UserService, public reflector: Reflector) {}
  async canActivate(requestContext: ExecutionContext): Promise<boolean> {
    const gqlExe = GqlExecutionContext.create(requestContext);
    const context = gqlExe.getContext();
    const request =
      typeof context === 'function'
        ? requestContext.switchToHttp().getRequest()
        : context.req;
    // if public, we allow
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      requestContext.getHandler(),
      requestContext.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    try {
      request.authorizationChecked = true;
      if (this.securityOpenReason !== undefined) {
        Reflect.defineMetadata(
          'securityOpen',
          this.securityOpenReason,
          requestContext.getHandler(),
        );
        return this.isPermitted(undefined, requestContext);
      }

      const token = getTokenFromHeader(request);
      if (token === undefined) {
        return false;
      }
      const decoded = await this.userService.decode(token);
      return (
        decoded !== undefined &&
        this.isValidUserType(decoded) &&
        this.isPermitted(decoded, requestContext)
      );
    } catch {}
  }
  abstract isValidUserType(context: any): Promise<boolean>;

  /**
   * By default, we require a token of some sort to provide authorization.
   * For some controllers (e.g. Google Cloud Tasks) this isn't appropriate,
   * so we define a reason for marking security open instead
   */
  protected get securityOpenReason(): string {
    return undefined;
  }

  /**
   * Decodes token (if required) and determines whether the user has
   * permission to access the request handler
   */
  protected abstract isPermitted(
    user: UserModel,
    requestContext?: ExecutionContext,
  ): Promise<boolean>;
}
