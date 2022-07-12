import { LoggerModule } from './logger.module';
import { Logger } from './logger.decorator';

describe('Logger (Decorator)', () => {
  it('should add the prefix to an array', () => {
    Logger(class Test {});
    expect(LoggerModule.prefixesForLoggers).toEqual(['Test']);
  });

  it('should not add duplicate prefix to an array', () => {
    Logger(class Test {});
    Logger(class Test {});
    expect(LoggerModule.prefixesForLoggers).toEqual(['Test']);
  });
});
