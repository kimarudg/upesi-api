import { LoggerService } from './logger.service';
import { WinstonLogger } from './winston';

export const Logger: LoggerService = new LoggerService(WinstonLogger.init());
