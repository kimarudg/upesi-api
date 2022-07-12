import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { TYPES } from '@app/types';
import { UserService } from '@core/modules/user/services/user/service';

@Injectable()
export class UserPingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let request = context.switchToHttp().getRequest();
    if (!request) {
      request = GqlExecutionContext.create(context).getContext().req;
    }

    const user = request.user; // : ctx.getContext().req;
    if (user) {
      this.userService.repository.update(user.id, { lastSeen: new Date() });
    }

    return next.handle();
  }

  constructor(
    @Inject(TYPES.UserService) private readonly userService: UserService,
  ) {}
}
