import { bgMagenta, green, yellow } from 'colors/safe';
import * as winston from 'winston';
import { transports } from 'winston';
import { config } from '@app/config';

export abstract class WinstonLogger {
  private constructor() {}

  static init(): winston.Logger {
    return winston.createLogger({
      level: config.logLevel,
      transports: config.isDevelopment
        ? [
            new transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf((log) => {
                  return (
                    `${green('[Server]')} ` +
                    `${
                      log.level.charAt(0).toUpperCase() + log.level.slice(1)
                    }\t` +
                    (log.timestamp
                      ? `${new Date(log.timestamp).toLocaleString()} `
                      : '') +
                    (log.prefix ? `${yellow('[' + log.prefix + ']')} ` : '') +
                    (log.context
                      ? `${bgMagenta('[' + log.context + ']')} `
                      : '') +
                    `${green(log.message)}`
                  );
                }),
              ),
            }),
          ]
        : [
            new transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
            }),
          ],
    });
  }
}
