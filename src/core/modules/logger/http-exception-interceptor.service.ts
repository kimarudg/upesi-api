import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
// import { Observable } from 'rxjs/Observable';
import { LoggerService } from './logger.service';
import { Observable } from 'rxjs';

@Injectable()
export class HttpExceptionInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // return next.handle().pipe(null, (exception) => {
    //   if (!(exception instanceof HttpException)) {
    //     this.logger.debug(exception.stack);
    //     return;
    //   }
    //   const log = this.getLogFunction(exception);
    //   log(`HttpException status: ${exception?.getStatus()}`);
    //   log(`Request Path: ${request?.originalUrl}`);
    //   log(`Exception Stack: ${exception?.stack}`);
    //   const details = this.getResponseDetails(exception);
    //   if (details) {
    //     log(`Exception Response: ${details}`);
    //   }
    // });

    return next.handle();
  }

  private getResponseDetails(exception: HttpException) {
    if (!exception?.getResponse) {
      return;
    }
    const response = exception?.getResponse() as { message: string };
    return response?.message;
  }

  private getLogFunction(exception: HttpException) {
    return exception.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR
      ? (mgs: string) => this.logger.error(mgs)
      : (msg: string) => this.logger.warn(msg);
  }
}
