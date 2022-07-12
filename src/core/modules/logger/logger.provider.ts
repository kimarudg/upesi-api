import { Provider } from '@nestjs/common';
import { config } from '@app/config';
import { TYPES } from '@app/types';
import { LoggerService } from './logger.service';
import { WinstonLogger } from './winston';

export const getLoggerToken = (prefix: string = ''): string =>
  `LoggerService${prefix}`;

function loggerFactory(logger: LoggerService, prefix: string) {
  if (prefix && config.env !== 'test') {
    logger.setPrefix(prefix);
  }
  return logger;
}

function createPrefixProvider(prefix: string): Provider<LoggerService> {
  return {
    provide: getLoggerToken(prefix),
    useFactory: (logger) => loggerFactory(logger, prefix),
    inject: [LoggerService],
  };
}

export const loggerProvider = {
  provide: TYPES.WinstonLogger,
  useFactory: async () => {
    return WinstonLogger.init();
  },
};

export function createPrefixesProvider(
  prefixes: string[],
): Array<Provider<LoggerService>> {
  return prefixes.map((prefix) => createPrefixProvider(prefix));
}
