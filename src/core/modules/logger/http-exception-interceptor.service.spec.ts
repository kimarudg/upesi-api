import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionInterceptor } from './http-exception-interceptor.service';
import { LoggerService } from './logger.service';
describe('HttpExceptionInterceptor', () => {
  const loggerMock = {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  let interceptor: HttpExceptionInterceptor;
  let getNextMock: (error: Partial<HttpException>) => any;
  let getContextStab: (originalUrl: string) => any;

  beforeEach(() => {
    jest.clearAllMocks();
    interceptor = new HttpExceptionInterceptor(
      (loggerMock as any) as LoggerService,
    );
    getNextMock = (error: Partial<HttpException>) => ({
      handle: () => ({
        do: (empty: null, fn: Function) => {
          fn(error);
        },
      }),
    });
    getContextStab = (originalUrl: string) => ({
      switchToHttp: () => ({
        getRequest: () => ({ originalUrl }),
      }),
    });
  });

  function getError(options: {
    stack: string;
    status: HttpStatus;
    details?: string;
  }) {
    const { stack, status, details } = options;
    const exception = new HttpException({ message: details }, status);
    exception.stack = stack;
    return exception;
  }

  function verifyLoggerCalls(
    mockedFunction: jest.Mock<any, any>,
    errorUrl: string,
    status: HttpStatus,
    stack: string,
  ) {
    expect(mockedFunction).toBeCalledWith(`Request Path: ${errorUrl}`);
    expect(mockedFunction).toBeCalledWith(`HttpException status: ${status}`);
    expect(mockedFunction).toBeCalledWith(`Exception Stack: ${stack}`);
  }

  describe('intercept', () => {
    it('logs exception to error', async () => {
      const errorOptions = {
        stack: 'error stack',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      const errorUrl = 'route/to/controller';
      const next = getNextMock(getError(errorOptions));
      interceptor.intercept(getContextStab(errorUrl), next);

      verifyLoggerCalls(
        loggerMock.error,
        errorUrl,
        errorOptions.status,
        errorOptions.stack,
      );
    });

    it('logs exception with optional details', async () => {
      const errorOptions = {
        stack: 'poor error stack',
        status: HttpStatus.BAD_GATEWAY,
        details: 'multiple errors',
      };
      const errorUrl = 'another/route/to/controller';
      const next = getNextMock(getError(errorOptions));
      interceptor.intercept(getContextStab(errorUrl), next);

      verifyLoggerCalls(
        loggerMock.error,
        errorUrl,
        errorOptions.status,
        errorOptions.stack,
      );
      expect(loggerMock.error).toBeCalledWith(
        `Exception Response: ${errorOptions.details}`,
      );
    });

    it('logs exception to warn if it is not Server errors', async () => {
      const errorOptions = {
        stack: 'poor error stack',
        status: HttpStatus.UNAUTHORIZED,
        responseDetails: 'detailed info',
      };
      const errorUrl = 'another/route/to/controller';
      const next = getNextMock(getError(errorOptions));
      interceptor.intercept(getContextStab(errorUrl), next);

      verifyLoggerCalls(
        loggerMock.warn,
        errorUrl,
        errorOptions.status,
        errorOptions.stack,
      );
    });

    it('logs exception to debug if it is not HttpException', async () => {
      const customError = { stack: 'custom error stack' };
      const errorUrl = 'route/to/controller';
      const next = getNextMock(customError);
      interceptor.intercept(getContextStab(errorUrl), next);

      expect(loggerMock.debug).toBeCalledWith(customError.stack);
    });
  });
});
