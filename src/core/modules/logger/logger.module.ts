import { DynamicModule, Global } from '@nestjs/common';
import { config } from '@app/config';
import { createPrefixesProvider, loggerProvider } from './logger.provider';
import { LoggerService } from './logger.service';
import { WinstonLogger } from './winston';

@Global()
export class LoggerModule {
  static prefixesForLoggers: string[] = new Array<string>();
  static forRoot(canAddRequestScope = true): DynamicModule {
    const prefixedLoggerProviders = createPrefixesProvider(
      this.prefixesForLoggers,
    );

    if (config.env === 'test') canAddRequestScope = false;

    const defaultProviders = [loggerProvider, ...prefixedLoggerProviders];
    if (canAddRequestScope) {
      return {
        module: LoggerModule,
        providers: [LoggerService, ...defaultProviders],
        exports: [LoggerService, ...defaultProviders],
      };
    } else {
      return {
        module: LoggerModule,
        providers: [
          {
            provide: LoggerService,
            useFactory: async () => {
              return new LoggerService(WinstonLogger.init());
            },
          },
          ...defaultProviders,
        ],
        exports: [LoggerService, ...defaultProviders],
      };
    }
  }
}
