import { Inject } from '@nestjs/common';
import { LoggerModule } from './logger.module';
import { getLoggerToken } from './logger.provider';

export function Logger(target = { name: '' }) {
  const prefix = target.name || 'Logger';
  if (!LoggerModule.prefixesForLoggers.includes(prefix)) {
    LoggerModule.prefixesForLoggers.push(prefix);
  }
  return Inject(getLoggerToken(prefix));
}
