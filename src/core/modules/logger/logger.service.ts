import { Inject, Injectable, Scope } from '@nestjs/common';
import winston from 'winston';
import { TYPES } from '@app/types';
import { LOGGER_LEVEL } from './logger.constants';
/**
 * Describes a logger instance
 */
interface ILogger {
  /**
   * Logs with an arbitrary level. Defaults to info
   */
  log(msg: string, level: LOGGER_LEVEL, ...meta: any[]): void;

  /**
   * Log detailed information
   */
  debug(msg: string, ...meta: any[]): void;

  /**
   * Runtime errors that do not require immediate action but should typically be logged and monitored
   */
  error(msg: string, ...meta: any[]): void;

  /**
   * Exceptional occurrences that are not errors
   */
  warn(msg: string, ...meta: any[]): void;

  /**
   * Interesting events
   */
  info(msg: string, ...meta: any[]): void;

  /**
   * A simple profiling mechanism, all profile messages are set 'info' level by default
   */
  profile(name: string): void;
}

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService implements ILogger {
  private prefix?: string;

  constructor(@Inject(TYPES.WinstonLogger) private logger: winston.Logger) {}

  public log(
    msg: string,
    level: LOGGER_LEVEL = LOGGER_LEVEL.INFO,
    ...meta: any[]
  ): void {
    // The unintentional issues is caused when REQUEST is used in constructor injection with NestJS dependency injection in this service
    // After consultations the suggested solution is to temporary deprecate the insignificant context user for logging
    const context = { ...meta, prefix: this.prefix };

    this.logger.log(
      level.toUpperCase() in LOGGER_LEVEL ? level : LOGGER_LEVEL.INFO,
      this.prefix ? `[${this.prefix}] ${msg}` : msg,
      context,
    );
  }

  private addSpan(msg, level) {}

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  public debug(msg: string, ...meta: any[]): void {
    this.log(msg, LOGGER_LEVEL.DEBUG, ...meta);
  }

  public error(msg: string, ...meta: (string | object)[]): void {
    this.log(msg, LOGGER_LEVEL.ERROR, ...meta);
  }

  public warn(msg: string, ...meta: any[]): void {
    this.log(msg, LOGGER_LEVEL.WARN, ...meta);
  }

  public info(msg: string, ...meta: any[]): void {
    this.log(msg, LOGGER_LEVEL.INFO, ...meta);
  }

  public profile(name: string): void {
    this.log(name, LOGGER_LEVEL.PROFILE);
  }
}
