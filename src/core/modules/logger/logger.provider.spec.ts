import { createPrefixesProvider, getLoggerToken } from './logger.provider';

describe('createPrefixesProvider', () => {
  it('should create logger providers with prefixes', () => {
    const providers = createPrefixesProvider(['Prefix']);
    expect(providers).toEqual([
      {
        provide: 'LoggerServicePrefix',
        useFactory: expect.any(Function),
        inject: expect.anything(),
      },
    ]);
  });
});

describe('getLoggerToken', () => {
  it('should return "LoggerService" if no prefix is given', () => {
    expect(getLoggerToken()).toBe('LoggerService');
  });

  it('should return "LoggerServicePrefix" if "Prefix" is given', () => {
    expect(getLoggerToken('Prefix')).toBe('LoggerServicePrefix');
  });
});
