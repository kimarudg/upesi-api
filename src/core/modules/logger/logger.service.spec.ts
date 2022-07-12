import { LoggerService } from './logger.service';
import { Test } from '@nestjs/testing';
import { LoggerModule } from './logger.module';
import { LOGGER_LEVEL } from './logger.constants';

describe('LoggerService', () => {
  let loggerSvc: LoggerService;

  const logger = {
    error: jest.fn(),
    log: jest.fn(),
  };

  const tracer = {
    inject: jest.fn(),
    scope: jest.fn().mockReturnValue({
      active: jest.fn().mockReturnValue({
        context: jest.fn().mockReturnValue('context'),
      }),
    }),
  };

  beforeAll(async () => {
    const loggerModuleFixture = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
    })
      .overrideProvider(LoggerService)
      // @ts-ignore
      .useValue(new LoggerService(logger, tracer))
      .compile();

    loggerSvc = loggerModuleFixture.get(LoggerService);
  });

  it('info() should call log() function with info severity', () => {
    loggerSvc.info('test');
    expect(logger.log).toHaveBeenCalledWith('info', 'test', {});
  });

  it('error() should call log() function with error severity', () => {
    loggerSvc.error('test');
    expect(logger.log).toHaveBeenCalledWith('error', 'test', {});
  });

  it('warn() should call log() function with warn severity', () => {
    loggerSvc.warn('test');
    expect(logger.log).toHaveBeenCalledWith('warn', 'test', {});
  });

  it('debug() should call log() function with debug severity', () => {
    loggerSvc.debug('test');
    expect(logger.log).toHaveBeenCalledWith('debug', 'test', {});
  });

  it('profile() should call log() function with profile severity', () => {
    loggerSvc.profile('test');
    expect(logger.log).toHaveBeenCalledWith('profile', 'test', {});
  });

  it('log() should inject spans', () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('time');
    loggerSvc.log('test', LOGGER_LEVEL.INFO);
    expect(logger.log).toHaveBeenCalledWith('info', 'test', {});
    expect(tracer.inject).toHaveBeenCalledWith('context', 'log', {
      level: 'info',
      message: 'test',
      time: 'time',
    });
  });
});
